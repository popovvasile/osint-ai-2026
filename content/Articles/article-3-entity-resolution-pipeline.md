# Build an Entity Resolution Pipeline: Linking Identities Across Multiple Sources with AI

*A step-by-step tutorial for building a Python pipeline that takes fragmented identity records from multiple OSINT data sources and resolves them into a unified, confidence-scored entity graph.*

---

You have collected data from eight different sources about someone you are investigating. LinkedIn shows "Ivan Petrenko, CEO TechUA." A company registry has "I. Petrenko, head of TechUA Ltd." GitHub has `ivanp_kyiv`. A breach dataset contains `ivan.petrenko90@gmail.com`. Telegram has `@ivan_tech_ua`. A court record has "Іван П., директор." A crypto forum has "IvanUA."

Are these all the same person? Probably. Can you prove it programmatically, with confidence scores, in a format that holds up to scrutiny? That is the entity resolution problem.

This tutorial builds a pipeline that takes raw records from multiple sources, runs them through three resolution layers — deterministic, probabilistic, and LLM-based — and outputs a unified entity graph in OIDSF format. The same pipeline that resolves one person resolves ten thousand, which is where it becomes useful.

**What you will have built:**

A Python script that ingests raw records in a normalized format, computes merge confidence scores at three levels, uses a local LLM (via Ollama) only for the genuinely ambiguous middle band, and writes resolved entities as OIDSF `Person` and `OnlineAccount` objects with full provenance.

---

## Why Three Layers

Most tutorials about entity resolution show you one technique. Practitioners use three, in sequence, because each one handles a different part of the distribution:

**Deterministic matching** handles cases where a shared identifier proves identity: the same email address, the same phone number in E.164 format, the same government ID. These are binary — match or no match. Confidence: 1.0. No AI needed.

**Probabilistic matching** handles cases where no single identifier matches exactly, but multiple partial signals point toward the same entity. "Ivan Petrenko" and "I. Petrenko" at the same company could be the same person (7/10 confidence) or different people with similar names (3/10 chance). Weighted scoring across multiple attributes gives a numeric confidence.

**LLM disambiguation** handles the genuinely ambiguous cases that probabilistic matching cannot resolve. When two records score between 0.55 and 0.80 — plausible but not conclusive — a language model reads both records in full context and decides. This is the slowest and most expensive layer, but it handles the hard cases. In practice, only 10–20% of candidate pairs reach this stage.

---

## The Pipeline

```
Input: records from multiple sources (CSV / JSON / JSONL)
        │
        ▼
Stage 1: Normalize — map all sources to common schema
        │
        ▼
Stage 2: Block — group candidates to avoid O(n²) comparisons
        │
        ▼
Stage 3: Deterministic pass — exact match on identifiers
        │
        ▼
Stage 4: Probabilistic pass — weighted fuzzy match
        │
        ▼
Stage 5: LLM disambiguation — ambiguous pairs only
        │
        ▼
Stage 6: Graph assembly — connected components = resolved entities
        │
        ▼
Output: OIDSF entities.jsonl + statements.jsonl
```

---

## Prerequisites

```bash
pip install recordlinkage sentence-transformers networkx ollama numpy pandas
```

For the local LLM:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a text model (no vision needed for this pipeline)
ollama pull gemma3
# or: ollama pull mistral
```

---

## Stage 1: Record Normalization

Every source has a different schema. The first job is to flatten everything into a common internal format so the matching logic can operate on a consistent structure.

```python
# normalize.py

from dataclasses import dataclass, field
from typing import Optional
import re
import json
import csv


@dataclass
class RawRecord:
    """Normalized representation of one identity fragment."""
    source_id: str          # unique ID within the source
    source_name: str        # e.g. "linkedin_scrape", "breach_2024"
    
    # Identity fields — all optional; None = not present in this source
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None
    url: Optional[str] = None
    country: Optional[str] = None
    notes: Optional[str] = None
    
    raw: dict = field(default_factory=dict)  # original record


def normalize_email(email: Optional[str]) -> Optional[str]:
    if not email:
        return None
    return email.strip().lower()


def normalize_phone(phone: Optional[str]) -> Optional[str]:
    """Strip all non-digit characters, keep leading +."""
    if not phone:
        return None
    digits = re.sub(r"[^\d+]", "", phone.strip())
    if not digits.startswith("+"):
        # Assume the caller has already done country prefix logic
        pass
    return digits if len(digits) >= 7 else None


def normalize_name(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    # Lowercase, collapse whitespace, strip punctuation
    name = re.sub(r"[^\w\s]", "", name.lower())
    return " ".join(name.split())


def normalize_username(username: Optional[str]) -> Optional[str]:
    if not username:
        return None
    # Strip @ prefix if present (Telegram), lowercase
    return username.lstrip("@").lower().strip()
```

Now write a loader for each source. The loaders are thin adapters — they pull fields from the source schema and hand off normalized values:

```python
def load_linkedin_csv(path: str) -> list[RawRecord]:
    records = []
    with open(path) as f:
        for row in csv.DictReader(f):
            records.append(RawRecord(
                source_id=row.get("profile_url", row.get("id", "")),
                source_name="linkedin",
                full_name=normalize_name(row.get("full_name")),
                organization=row.get("company"),
                role=row.get("title"),
                url=row.get("profile_url"),
                email=normalize_email(row.get("email")),
                raw=dict(row)
            ))
    return records


def load_breach_jsonl(path: str) -> list[RawRecord]:
    records = []
    with open(path) as f:
        for line in f:
            row = json.loads(line)
            records.append(RawRecord(
                source_id=row.get("id", row.get("email", "")),
                source_name="breach",
                email=normalize_email(row.get("email")),
                phone=normalize_phone(row.get("phone")),
                username=normalize_username(row.get("username")),
                full_name=normalize_name(row.get("name")),
                raw=row
            ))
    return records


def load_telegram_jsonl(path: str) -> list[RawRecord]:
    records = []
    with open(path) as f:
        for line in f:
            row = json.loads(line)
            records.append(RawRecord(
                source_id=str(row.get("user_id", "")),
                source_name="telegram",
                username=normalize_username(row.get("username")),
                full_name=normalize_name(row.get("first_name", "") + " " + row.get("last_name", "")),
                phone=normalize_phone(row.get("phone")),
                url=f"https://t.me/{row.get('username', '')}" if row.get("username") else None,
                raw=row
            ))
    return records
```

Add a loader for each source you have. The pattern is always the same: read the source, map to `RawRecord`, normalize the fields.

---

## Stage 2: Blocking

Comparing every record against every other record is O(n²) — 10,000 records means 50 million pairs. You need to block: group records so that only plausible pairs are compared.

```python
# block.py

from collections import defaultdict
from normalize import RawRecord


def build_blocks(records: list[RawRecord]) -> list[tuple[RawRecord, RawRecord]]:
    """
    Return candidate pairs that share at least one blocking key.
    This is a union of multiple blocking strategies.
    """
    blocks: dict[str, list[RawRecord]] = defaultdict(list)
    
    for record in records:
        # Block 1: normalized email (strongest)
        if record.email:
            blocks[f"email:{record.email}"].append(record)
        
        # Block 2: normalized phone
        if record.phone and len(record.phone) >= 10:
            blocks[f"phone:{record.phone}"].append(record)
        
        # Block 3: last name token (handle transliteration via multiple keys)
        if record.full_name:
            parts = record.full_name.split()
            if parts:
                last = parts[-1]
                blocks[f"lastname:{last}"].append(record)
                # Also index first token in case name order varies
                blocks[f"name_token:{parts[0]}"].append(record)
        
        # Block 4: username
        if record.username:
            blocks[f"username:{record.username}"].append(record)
            # Also block on username without digits (ivanp_kyiv → ivanp_kyiv)
            blocks[f"username_base:{record.username.rstrip('0123456789_')}"].append(record)
    
    # Collect all candidate pairs (within each block, all combinations)
    pairs = set()
    for block_members in blocks.values():
        if len(block_members) < 2:
            continue
        for i, a in enumerate(block_members):
            for b in block_members[i+1:]:
                # Use frozenset so (a,b) == (b,a)
                key = frozenset([a.source_id + a.source_name, b.source_id + b.source_name])
                if key not in pairs:
                    pairs.add(key)
                    yield (a, b)
```

Blocking reduces the comparison space from O(n²) to roughly O(n log n) in practice.

---

## Stage 3: Deterministic Pass

Check for exact matches on hard identifiers first. These resolve with certainty.

```python
# deterministic.py

from normalize import RawRecord


def deterministic_match(a: RawRecord, b: RawRecord) -> float | None:
    """
    Return 1.0 if a hard identifier matches exactly.
    Return None if no hard match — proceed to probabilistic.
    """
    # Email match (normalized)
    if a.email and b.email and a.email == b.email:
        return 1.0
    
    # Phone match (normalized E.164)
    if (a.phone and b.phone
            and len(a.phone) >= 10 and len(b.phone) >= 10
            and a.phone == b.phone):
        return 1.0
    
    # Username exact match across same service is strong, but not certain
    # (usernames are recycled on some platforms)
    if (a.username and b.username
            and a.username == b.username
            and a.source_name == b.source_name):
        return 0.95
    
    return None
```

Records that hit a deterministic match are merged immediately. No further processing needed for that pair.

---

## Stage 4: Probabilistic Pass

For pairs that did not resolve deterministically, compute a weighted score across multiple attributes. Use fuzzy string matching (Jaro-Winkler) for names and organization names, which handles transliteration variations between Cyrillic and Latin scripts.

```python
# probabilistic.py

from normalize import RawRecord


def jaro_winkler(s1: str, s2: str) -> float:
    """Jaro-Winkler similarity. Returns 0.0–1.0."""
    # Use the recordlinkage library's implementation
    import recordlinkage
    import pandas as pd
    
    df1 = pd.DataFrame({"val": [s1]})
    df2 = pd.DataFrame({"val": [s2]})
    
    indexer = recordlinkage.Index()
    indexer.full()
    candidates = indexer.index(df1, df2)
    
    compare = recordlinkage.Compare()
    compare.string("val", "val", method="jarowinkler", label="score")
    
    features = compare.compute(candidates, df1, df2)
    return float(features["score"].iloc[0]) if not features.empty else 0.0


def probabilistic_score(a: RawRecord, b: RawRecord) -> float:
    """
    Weighted fuzzy match across available fields.
    Returns 0.0–1.0.
    """
    scores = []
    weights = []
    
    # Name similarity (weight: 3)
    if a.full_name and b.full_name:
        sim = jaro_winkler(a.full_name, b.full_name)
        scores.append(sim)
        weights.append(3)
    
    # Organization similarity (weight: 2)
    if a.organization and b.organization:
        sim = jaro_winkler(a.organization, b.organization)
        scores.append(sim)
        weights.append(2)
    
    # Username partial match (weight: 2)
    if a.username and b.username:
        # Check if one username contains the other
        u1, u2 = a.username, b.username
        if u1 in u2 or u2 in u1:
            scores.append(0.8)
        else:
            scores.append(jaro_winkler(u1, u2))
        weights.append(2)
    
    # Role / title similarity (weight: 1)
    if a.role and b.role:
        sim = jaro_winkler(a.role, b.role)
        scores.append(sim)
        weights.append(1)
    
    if not scores:
        return 0.0
    
    # Weighted average
    total_weight = sum(weights)
    weighted_sum = sum(s * w for s, w in zip(scores, weights))
    return weighted_sum / total_weight
```

The thresholds:
- Score **≥ 0.85** → merge (same entity, high confidence)
- Score **0.55–0.85** → send to LLM for disambiguation
- Score **< 0.55** → different entities

These thresholds are starting points. Tune them for your data: if your sources use consistent transliteration, you can raise the merge threshold. If your sources are noisy (OCR'd documents, machine translation), lower it.

---

## Stage 5: LLM Disambiguation

The middle band — pairs scoring 0.55 to 0.85 — goes to the local LLM. The model reads both records in full and makes a binary decision.

```python
# llm_disambiguate.py

import json
import ollama
from normalize import RawRecord

OLLAMA_MODEL = "gemma3"


def llm_disambiguate(a: RawRecord, b: RawRecord) -> tuple[bool, float, str]:
    """
    Ask the LLM whether records a and b refer to the same entity.
    Returns: (is_same_entity, confidence, reasoning)
    """
    
    def record_summary(r: RawRecord) -> str:
        fields = {k: v for k, v in {
            "name": r.full_name,
            "email": r.email,
            "phone": r.phone,
            "username": r.username,
            "organization": r.organization,
            "role": r.role,
            "url": r.url,
            "source": r.source_name
        }.items() if v}
        return json.dumps(fields, ensure_ascii=False)
    
    prompt = f"""You are an OSINT analyst performing entity resolution.

Two records have been flagged as possible matches. Determine whether they refer to the same real-world person.

Record A:
{record_summary(a)}

Record B:
{record_summary(b)}

Respond with a JSON object only, no other text:
{{
  "same_entity": true or false,
  "confidence": 0.0 to 1.0,
  "reasoning": "one sentence explaining the key deciding factor"
}}

Rules:
- If a hard identifier (email, phone) matches exactly → same_entity: true, confidence: 0.98
- If names are similar but organization differs significantly → same_entity: false unless another identifier matches
- If username on one platform matches another platform → treat as moderate evidence, not conclusive
- When genuinely uncertain → confidence below 0.65 and same_entity: false (err toward splitting)
"""

    response = ollama.chat(
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )
    
    try:
        result = json.loads(response["message"]["content"])
        return (
            bool(result["same_entity"]),
            float(result["confidence"]),
            str(result.get("reasoning", ""))
        )
    except (json.JSONDecodeError, KeyError):
        # If the model fails to return valid JSON, default to not merging
        return (False, 0.0, "LLM returned invalid JSON — defaulting to no merge")
```

The prompt enforces specific rules so the model applies consistent logic. The "err toward splitting" instruction is important: false positives in entity resolution (incorrectly merging two different people) are more harmful than false negatives (failing to merge the same person). An investigation that attributes Person B's activities to Person A is a serious error. An investigation that treats them as two separate people is just incomplete.

---

## Stage 6: Graph Assembly

Collect all merge decisions — deterministic, probabilistic, and LLM — as edges in a graph. Each connected component is a resolved entity.

```python
# resolve.py

import networkx as nx
from normalize import RawRecord
from deterministic import deterministic_match
from probabilistic import probabilistic_score
from llm_disambiguate import llm_disambiguate
from block import build_blocks


PROB_MERGE_THRESHOLD = 0.85
PROB_DISAMBIGUATE_MIN = 0.55


def resolve(records: list[RawRecord]) -> list[list[RawRecord]]:
    """
    Run the full three-layer resolution pipeline.
    Returns a list of entity clusters (each cluster = one resolved entity).
    """
    G = nx.Graph()
    
    # Every record is a node
    for r in records:
        node_id = f"{r.source_name}::{r.source_id}"
        G.add_node(node_id, record=r)
    
    merge_log = []
    
    for a, b in build_blocks(records):
        id_a = f"{a.source_name}::{a.source_id}"
        id_b = f"{b.source_name}::{b.source_id}"
        
        # Layer 1: Deterministic
        det_score = deterministic_match(a, b)
        if det_score is not None:
            G.add_edge(id_a, id_b, confidence=det_score, method="deterministic")
            merge_log.append({"pair": (id_a, id_b), "method": "deterministic", "confidence": det_score})
            continue
        
        # Layer 2: Probabilistic
        prob_score = probabilistic_score(a, b)
        
        if prob_score >= PROB_MERGE_THRESHOLD:
            G.add_edge(id_a, id_b, confidence=prob_score, method="probabilistic")
            merge_log.append({"pair": (id_a, id_b), "method": "probabilistic", "confidence": prob_score})
        
        elif prob_score >= PROB_DISAMBIGUATE_MIN:
            # Layer 3: LLM
            is_same, llm_conf, reasoning = llm_disambiguate(a, b)
            if is_same and llm_conf >= 0.65:
                G.add_edge(id_a, id_b, confidence=llm_conf, method="llm",
                           reasoning=reasoning)
                merge_log.append({"pair": (id_a, id_b), "method": "llm",
                                  "confidence": llm_conf, "reasoning": reasoning})
        
        # else: prob_score < PROB_DISAMBIGUATE_MIN — different entities, no edge
    
    # Connected components = resolved entities
    clusters = []
    for component in nx.connected_components(G):
        cluster = [G.nodes[node_id]["record"] for node_id in component]
        clusters.append(cluster)
    
    return clusters, merge_log
```

A connected component in the merge graph is every record that has been linked — directly or transitively — to at least one other record. If record A merges with B, and B merges with C independently, then A+B+C form one entity cluster even if A and C were never directly compared. This is how the pipeline handles fragmentary data: you do not need a direct link between every pair.

---

## Stage 7: OIDSF Export

Write each resolved entity cluster as OIDSF objects.

```python
# export_oidsf.py

import json
import uuid
from datetime import datetime, timezone
from normalize import RawRecord


def cluster_to_oidsf(cluster: list[RawRecord], cluster_id: str) -> list[dict]:
    """
    Convert a resolved entity cluster to OIDSF entities and statements.
    The cluster becomes one Person entity with multiple OnlineAccount entities.
    """
    
    now = datetime.now(timezone.utc).isoformat()
    objects = []
    
    # Pick the best available name from the cluster
    names = [r.full_name for r in cluster if r.full_name]
    canonical_name = max(names, key=len) if names else "Unknown"
    
    # Create the Person entity
    person_id = f"ent_person_{cluster_id}"
    person = {
        "oidsf_version": "1.0.0",
        "id": person_id,
        "schema": "Person",
        "properties": {
            "name": [canonical_name],
            "topics": ["entity_resolution"]
        }
    }
    
    # Collect all unique emails, phones, organizations
    emails = list({r.email for r in cluster if r.email})
    phones = list({r.phone for r in cluster if r.phone})
    orgs = list({r.organization for r in cluster if r.organization})
    
    if emails:
        person["properties"]["email"] = emails
    if phones:
        person["properties"]["phone"] = phones
    if orgs:
        person["properties"]["employer"] = orgs
    
    objects.append(person)
    
    # Create an OnlineAccount entity for each source record that has a username or URL
    for record in cluster:
        if not (record.username or record.url):
            continue
        
        account_id = f"ent_account_{record.source_name}_{record.source_id}"
        account = {
            "oidsf_version": "1.0.0",
            "id": account_id,
            "schema": "OnlineAccount",
            "properties": {
                "name": [record.username or record.source_id],
                "service": [record.source_name],
                "owner": [person_id]
            }
        }
        if record.username:
            account["properties"]["username"] = [record.username]
        if record.url:
            account["properties"]["url"] = [record.url]
        
        objects.append(account)
        
        # Statement: this account was resolved to this person
        statement = {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {
                "entity_property": {
                    "entity_id": account_id,
                    "property": "owner"
                }
            },
            "value": person_id,
            "asserted_by": "entity_resolution_pipeline",
            "extraction_method": "automated",
            "extracted_at": now,
            "confidence": 0.85
        }
        objects.append(statement)
    
    return objects


def export_all(clusters: list[list[RawRecord]], output_dir: str = "."):
    from pathlib import Path
    
    Path(output_dir).mkdir(exist_ok=True)
    
    all_objects = []
    for i, cluster in enumerate(clusters):
        cluster_id = uuid.uuid4().hex[:10]
        objects = cluster_to_oidsf(cluster, cluster_id)
        all_objects.extend(objects)
    
    # Write entities and statements to separate JSONL files
    entities_path = Path(output_dir) / "entities.jsonl"
    statements_path = Path(output_dir) / "statements.jsonl"
    
    with open(entities_path, "w") as ef, open(statements_path, "w") as sf:
        for obj in all_objects:
            if obj.get("schema"):  # entity
                ef.write(json.dumps(obj, ensure_ascii=False) + "\n")
            elif "subject" in obj:  # statement
                sf.write(json.dumps(obj, ensure_ascii=False) + "\n")
    
    print(f"[+] Wrote {entities_path} and {statements_path}")
    print(f"[+] Total entities: {sum(1 for o in all_objects if o.get('schema'))}")
    print(f"[+] Total statements: {sum(1 for o in all_objects if 'subject' in o)}")
```

---

## Putting It Together

```python
# main.py

from normalize import load_linkedin_csv, load_breach_jsonl, load_telegram_jsonl
from resolve import resolve
from export_oidsf import export_all


def main():
    # Load records from all sources
    records = []
    records += load_linkedin_csv("data/linkedin.csv")
    records += load_breach_jsonl("data/breach.jsonl")
    records += load_telegram_jsonl("data/telegram_members.jsonl")
    # Add more loaders for other sources here
    
    print(f"[*] Loaded {len(records)} raw records from {len(set(r.source_name for r in records))} sources")
    
    # Run resolution
    clusters, merge_log = resolve(records)
    
    print(f"[*] Resolved into {len(clusters)} entities")
    print(f"[*] Merge decisions: {len(merge_log)}")
    
    by_method = {}
    for entry in merge_log:
        m = entry["method"]
        by_method[m] = by_method.get(m, 0) + 1
    print(f"[*] Breakdown: {by_method}")
    
    # Export
    export_all(clusters, output_dir="output/")


if __name__ == "__main__":
    main()
```

---

## The Ivan Petrenko Example Walked Through

Starting with 8 records from 8 sources:

**Blocking groups them into candidate pairs** — the last-name token "petrenko" / "петренко" puts 6 of them in one block. The Telegram record (`@ivan_tech_ua`) and GitHub record (`ivanp_kyiv`) only share a username prefix, so they form a separate candidate pair via the username block.

**Deterministic pass:** the email `ivan.petrenko90@gmail.com` from the breach data appears nowhere else — no deterministic match fires. No shared phone numbers either.

**Probabilistic pass:** "Іван Петренко" vs "I. Petrenko" + shared organization "TechUA" → score 0.76 → goes to LLM. "Іван Петренко" vs "IvanUA" → score 0.48 → dropped (different entities by score).

**LLM pass:** the model reads both records in context, sees the overlapping organization and role, and returns `{"same_entity": true, "confidence": 0.87, "reasoning": "Shared organization and role with consistent transliteration of name; no conflicting identifiers"}`.

**Graph assembly:** the LinkedIn, registry, court record, GitHub, and Telegram records all end up in the same connected component via different edge paths. "IvanUA" from the crypto forum stays isolated — the pipeline does not merge it because the evidence is insufficient.

**Output:** one `Person` entity with five linked `OnlineAccount` entities, each with a statement documenting the resolution method and confidence score.

---

## Common Failure Points

**Jaro-Winkler on Cyrillic names.** The `recordlinkage` library handles Unicode, but Cyrillic-to-Latin transliteration (Іван → Ivan) produces zero similarity if compared directly. Add a transliteration normalization step using the `transliterate` library before probabilistic scoring:

```bash
pip install transliterate
```

```python
from transliterate import translit
normalized = translit(name, 'uk', reversed=True)  # Ukrainian → Latin
```

**LLM returns non-JSON.** Local models sometimes prepend their response with "Sure, here is the JSON:" or similar. Wrap the JSON parse in a regex extraction:

```python
import re
match = re.search(r'\{.*\}', response, re.DOTALL)
if match:
    result = json.loads(match.group())
```

**Transitive merges collapsing too many records.** If blocking is too permissive, a common last name creates a massive block. Every record with "Petrenko" gets compared to every other, and a chain of weak similarities can transitively merge distinct people. Add a maximum cluster size sanity check — if a connected component exceeds 20 records, flag it for manual review instead of auto-merging.

**LLM confidence calibration.** The model's stated confidence (0.87) is not a calibrated probability. It is a number the model thinks sounds right. Use it as a ranking signal, not a probability estimate. For final decisions on high-stakes merges, have a human review every LLM-decided merge where confidence is below 0.80.

---

## What You Have at the End

An `entities.jsonl` and `statements.jsonl` in the OIDSF format. These files can be:

- Imported into the Obsidian OSINT Copilot (the subject of the next article in this series)
- Loaded into Neo4j using the OIDSF validator's import tooling
- Visualized in Gephi after converting to GraphML
- Used as the input to an ACH (Analysis of Competing Hypotheses) matrix

The pipeline scales. 100 records takes seconds. 10,000 records takes minutes. The LLM stage is the bottleneck — if you have large volumes, batch the Ollama calls and run them overnight.

---

## Resources

| Tool | Link |
|---|---|
| recordlinkage | pypi.org/project/recordlinkage |
| sentence-transformers | sbert.net |
| networkx | networkx.org |
| Ollama | ollama.com |
| transliterate (Python) | pypi.org/project/transliterate |
| OIDSF | github.com/OSINT-for-Ukraine/oidsf |
| Flowsint | github.com/reconurge/flowsint |
| OpenPlanter | github.com/ShinMegamiBoson/OpenPlanter |

---

*Part 3 of 4 in the AI OSINT Pipeline series.*
