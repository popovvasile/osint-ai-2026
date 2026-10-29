---
tags:
  - materials
---

# Build a Local OSINT Research Workspace: Obsidian + OSINT Copilot + Claude Code
> [[Articles/index|Статті]]

*A step-by-step tutorial for investigators who want a local-first workspace where entities, relationships, timeline, and maps live as plain text — and Claude Code acts as the AI layer for extraction, vault Q&A, and investigation synthesis.*

---

Most OSINT investigations die of disorganization before they die of anything else. You have 40 browser tabs, a pile of screenshots, a spreadsheet of names, and a Telegram export. The connections between them exist in your head, not anywhere permanent. When you come back to the investigation three days later, you spend an hour rebuilding context you already built once.

The solution is a structured investigation workspace. Not a SaaS platform that owns your data and disappears when the company pivots. A local folder of plain text files, organized as a graph of entities and relationships, with an AI layer that can extract entities from raw text, answer questions grounded in your notes, and help you synthesize findings.

This tutorial builds that workspace using Obsidian, the OSINT Copilot plugin, and Claude Code. Everything runs locally. Your investigation data never leaves your machine.

**What you will have built:**

An Obsidian vault where every person, organization, location, and event is a Markdown note. Those notes are connected by typed relationship edges. The graph view renders the investigation visually. The timeline view shows events chronologically. Claude Code extracts entities from pasted documents, answers questions using only the facts in your vault, and helps you orchestrate multi-step investigation tasks.

---

## Architecture

```
Your Vault (plain Markdown files)
    │
    ├── OSINTCopilot/
    │   ├── Person/          ← one .md file per person entity
    │   ├── Organization/    ← one .md file per organization
    │   ├── Location/
    │   ├── OnlineAccount/
    │   ├── Event/
    │   ├── Connections/     ← relationship notes
    │   ├── conversations/   ← chat history
    │   └── custom/
    │       └── prompts/
    │           ├── rules/global.md    ← case context injected into every AI call
    │           └── skills/graph-extraction.md
    │
Claude Code CLI (on your PATH)
    │
    └── receives prompts from the plugin
        extracts entities, answers questions, orchestrates tasks
        writes graph data back via the plugin's confirmation UI
```

The vault is the database. Claude Code is the intelligence layer. The plugin is the bridge between them — it sends prompts to Claude and applies the structured responses (entity creation, relationship mapping, graph writes) back into the vault.

---

## Prerequisites

- **Obsidian** (download from obsidian.md) — version 1.5.0 or newer
- **Claude Code CLI** installed and authenticated:

  ```bash
  npm install -g @anthropic-ai/claude-code
  claude --version   # confirm it's on your PATH
  ```

- **BRAT plugin** for Obsidian (for installing beta plugins) — available in Obsidian's community plugin browser
- An Obsidian vault (create a new one; do not reuse an existing personal vault)

---

## Stage 1: Install the OSINT Copilot Plugin

BRAT is the easiest install path. In Obsidian:

1. Open **Settings → Community plugins**
2. Disable **Restricted mode** (this allows third-party plugins)
3. Browse community plugins and install **BRAT** (by TfTHacker)
4. Enable BRAT
5. Open **Settings → BRAT → Add Beta plugin**
6. Paste: `https://github.com/Probe-Point-Analytics-LLC/Obsidian-OSINT-Copilot-plugin`
7. Click **Add Plugin**, then go to **Settings → Community plugins** and enable **OSINT Copilot**

Alternatively, build from source:

```bash
git clone https://github.com/Probe-Point-Analytics-LLC/Obsidian-OSINT-Copilot-plugin.git
cd Obsidian-OSINT-Copilot-plugin
npm install
npm run build
```

Copy `main.js`, `manifest.json`, and `styles.css` into a new folder under your vault's `.obsidian/plugins/` directory (e.g. `.obsidian/plugins/osint-copilot/`). Reload plugins and enable OSINT Copilot.

**Verify the installation:** you should see ribbon icons for chat, graph, timeline, and map on the left sidebar. Open the command palette (`Ctrl/Cmd + P`) and search for "OSINT Copilot" — several commands should appear.

---

## Stage 2: Configure Claude Code Integration

Open **Settings → OSINT Copilot**.

In the **Unified chat agent** section:

- **Agent runtime:** Claude Code (default)
- **Claude Code CLI path:** leave as `claude` if it is on your PATH; otherwise provide the full path (find it with `which claude`)
- **Model:** `sonnet` is the recommended default

Click **Test agent runtime**. The plugin sends a health check to the Claude Code CLI. You should see a success response within a few seconds.

If the test fails:

```bash
# In your terminal, verify Claude Code works independently
claude --version
claude -p "Say 'health check ok'" --no-conversation
```

If the terminal works but the plugin fails, the issue is the CLI path. Find the full path with `which claude` and paste it into the plugin settings.

---

## Stage 3: Initialize the Vault Structure

On first load, the plugin creates a skeleton under `OSINTCopilot/` in your vault. Verify the structure exists:

```
OSINTCopilot/
├── custom/
│   └── prompts/
│       ├── rules/
│       │   └── global.md
│       └── skills/
│           └── graph-extraction.md
└── conversations/
```

If it did not create automatically, run the command **OSINT Copilot: Install missing vault prompt files** from the command palette.

### Configure `rules/global.md`

This is the most important configuration step, and most people skip it.

`global.md` is injected into every orchestration planner call. It is where you give Claude Code the context it needs to make good decisions: what the investigation is about, who the key entities already are, what naming conventions to use, what sources are trusted.

Open `OSINTCopilot/custom/prompts/rules/global.md` and write your case context:

```markdown
# Investigation Rules — Case: [YOUR CASE NAME]

## Case Context
This investigation concerns [brief description]. The jurisdiction is [country/region].
The investigation period is [date range].

## Naming Conventions
- Person names: use the most complete form first seen (e.g. "Ivan Petrenko" not "I. Petrenko")
- Organizations: use official registered name; aliases in the `aliases` property
- Phone numbers: E.164 format (+380XXXXXXXXX)
- Dates: ISO 8601 (2024-03-15)

## Source Trust Levels
- Official registries: high confidence (note the registry name)
- Social media: medium confidence (note the platform and date retrieved)
- Anonymous tips: low confidence (always flag)

## Key Entities Already in Vault
[list any entities you have already established, so Claude doesn't duplicate them]

## Notes for the AI
- When uncertain about entity type, prefer Person over Organization
- Always note the source of each extracted entity in the entity file
- Do not merge entities unless a hard identifier (email, phone, ID number) confirms identity
```

Every session you open the vault, Claude Code reads this file before doing anything. The case context means you do not need to re-explain the investigation in every chat message.

---

## Stage 4: Entity Extraction from Raw Text

This is the primary daily workflow. You paste a document — a scraped webpage, a Telegram message export, a PDF extract — and Claude reads it and creates structured entity notes from it.

Open the OSINT Copilot chat panel (click the chat icon in the ribbon). Paste your source text directly into the chat:

```
Extract all entities from this text and add them to my investigation graph:

---
Investigative report excerpt:
TechUA Ltd, a Kyiv-based software company registered in 2019, was found to have 
transferred $2.3 million to a Cyprus-registered shell company, Meridian Holdings Ltd, 
in Q3 2024. The director of TechUA is listed as Ivan Petrenko (born 1990), who also 
appears as a beneficial owner of Meridian Holdings according to the Cyprus Companies Registry.

The registered address of TechUA is 14 Khreshchatyk Street, Kyiv, Ukraine. 
Ivan Petrenko's LinkedIn profile (linkedin.com/in/ivanpetrenko-techUA) lists him 
as CEO since 2019. His email address ivan.petrenko@techUA.com is listed in the 
company's official filings.
---
```

Claude Code extracts:

- **Person:** Ivan Petrenko (born 1990, CEO, email: ivan.petrenko@techUA.com, LinkedIn: linkedin.com/in/ivanpetrenko-techUA)
- **Organization:** TechUA Ltd (Kyiv, registered 2019, director: Ivan Petrenko)
- **Organization:** Meridian Holdings Ltd (Cyprus, shell company)
- **Location:** 14 Khreshchatyk Street, Kyiv, Ukraine
- **Event:** Financial transfer $2.3M TechUA → Meridian Holdings, Q3 2024

The plugin presents these for your review before writing them to disk. **Review every extraction before confirming.** LLMs occasionally merge two people with similar names, invent a detail that was implied but not stated, or misclassify an entity type. The review step is not optional friction — it is the chain-of-custody checkpoint.

After confirmation, the plugin creates Markdown notes under the appropriate entity folders:

```
OSINTCopilot/Person/Ivan Petrenko.md
OSINTCopilot/Organization/TechUA Ltd.md
OSINTCopilot/Organization/Meridian Holdings Ltd.md
OSINTCopilot/Location/14 Khreshchatyk Street Kyiv.md
OSINTCopilot/Connections/TechUA Ltd → Meridian Holdings Ltd.md
```

Each note contains a YAML frontmatter block (FollowTheMoney-style schema) and a body section for analyst notes:

```yaml
---
schema: Person
id: ivan_petrenko_01
aliases: ["I. Petrenko", "IvanUA"]
email: ivan.petrenko@techUA.com
employer: TechUA Ltd
role: CEO
date_of_birth: "1990"
url: "https://linkedin.com/in/ivanpetrenko-techUA"
source: "[Investigative report excerpt, 2024-11-15]"
confidence: 0.85
---

## Notes

Ivan Petrenko appears as both director of TechUA Ltd and beneficial owner of Meridian Holdings Ltd 
(Cyprus). The financial transfer warrants further investigation.

## Source Documents

- Excerpt from [report name], retrieved [date]
```

The YAML block is machine-readable — the plugin's graph view reads it to draw edges. The body section is human-readable — your own analysis notes.

---

## Stage 5: Vault Q&A

Once you have built up entity notes over several sessions, you can query across the entire vault. The plugin sends your question to Claude Code along with an index of your vault contents.

In the chat panel:

```
What do we know about Ivan Petrenko? Summarize everything in the vault 
and note the confidence level of each fact.
```

Claude reads all vault files containing "Ivan Petrenko" — the person note, any connection notes, any conversation history where he was mentioned — and returns a grounded summary:

```
From vault notes (as of current session):

HIGH CONFIDENCE (multiple sources):
- Full name: Ivan Petrenko, born 1990
- Role: CEO of TechUA Ltd since 2019 (LinkedIn, company filing)
- Email: ivan.petrenko@techUA.com (company filing)

MEDIUM CONFIDENCE (single source):
- Beneficial owner of Meridian Holdings Ltd, Cyprus (Cyprus Companies Registry, 
  single document)
- Transfer of $2.3M TechUA → Meridian Holdings, Q3 2024 (same document)

NOT IN VAULT:
- Current address, personal phone number, social media other than LinkedIn
```

This grounded summary is the value of a structured workspace over a pile of notes: the AI cannot fabricate facts because it is constrained to what the vault contains. When a fact is not in the vault, it says so rather than inferring.

Use vault Q&A to:

- Summarize what is known about a specific entity before a briefing
- Check whether two entities in the vault are already linked (before creating a duplicate connection)
- Get a list of all entities of a given type: "list all OnlineAccounts in the vault"
- Identify gaps: "what do we not know about TechUA Ltd that would be important to establish?"

---

## Stage 6: Graph View

The Obsidian built-in graph view renders your entity notes as a node-link diagram — nodes are notes, edges are Obsidian links (`[[Entity Name]]`). The OSINT Copilot plugin writes these links automatically when it creates entities.

Open the graph view (**Graph view** icon in the ribbon or `Ctrl/Cmd + G`). You should see your entity nodes connected by edges. Use the filter panel on the right to:

- Show only nodes in the `OSINTCopilot/` folder (filter out unrelated vault notes)
- Color nodes by folder: Person nodes one color, Organization nodes another
- Increase link distance to spread out the layout

For large investigations, the built-in graph view becomes cluttered. This is where the output from this pipeline connects to Article 1 of this series: export your entities to OIDSF format and import into Neo4j → Gephi for a publication-quality network visualization.

---

## Stage 7: Timeline View

The OSINT Copilot plugin includes a timeline view that reads `startDate` and `endDate` properties from entity YAML frontmatter. Events (scheduled meetings, financial transactions, document dates) appear on a chronological axis.

To add an event to the timeline, create an Event entity note or ask Claude to create one:

```
Create an event entity for the TechUA to Meridian Holdings financial transfer. 
Date: Q3 2024 (approximate). Amount: $2.3M USD. Participants: TechUA Ltd, Meridian Holdings Ltd.
```

The resulting note includes:

```yaml
---
schema: Event
startDate: "2024-07-01"
endDate: "2024-09-30"
participants: ["TechUA Ltd", "Meridian Holdings Ltd"]
description: "Financial transfer of $2.3M USD"
---
```

The timeline view renders this as a bar spanning Q3 2024. When you have multiple events, the timeline shows their sequence — useful for identifying which events preceded which, and whether timelines are consistent across sources.

---

## Stage 8: Orchestrated Investigation Tasks

The most powerful feature is orchestration: giving Claude Code a high-level investigation goal and having it break the task into steps, execute them against your vault, and synthesize the findings.

In the chat panel:

```
I need to understand the full corporate structure linking Ivan Petrenko to 
Meridian Holdings. Based on what is in the vault, identify what we know, 
what is missing, and what investigative steps would fill the gaps.
```

Claude Code reads the vault, constructs a summary of known connections, identifies the missing links (Who are the other directors of Meridian Holdings? Are there other companies connecting Petrenko to Cyprus?), and suggests concrete next steps (search Cyprus company registry, check Ukrainian beneficial ownership register, look for Petrenko's name in Pandora Papers data).

These are suggestions, not actions. The orchestration mode does not automatically go fetch data from the internet. It synthesizes what is in the vault and recommends investigative steps that you then execute. This is the appropriate boundary: the AI handles synthesis; the analyst handles investigation.

---

## Stage 9: Importing OIDSF Output

If you ran the entity resolution pipeline from Article 3 and have an `entities.jsonl` output file, you can import it into your Obsidian vault to pre-populate entities from bulk data processing.

Write a small conversion script:

```python
# import_to_obsidian.py
"""
Convert OIDSF entities.jsonl to Obsidian Markdown notes
compatible with OSINT Copilot's entity format.
"""

import json
from pathlib import Path

VAULT_PATH = Path("/path/to/your/vault/OSINTCopilot")
SCHEMA_TO_FOLDER = {
    "Person": "Person",
    "OnlineAccount": "OnlineAccount",
    "Organization": "Organization",
    "Address": "Location",
    "Event": "Event",
}


def entity_to_markdown(entity: dict) -> tuple[str, str]:
    """Return (folder_name, markdown_content)."""
    schema = entity.get("schema", "Unknown")
    props = entity.get("properties", {})
    
    # Pick the display name
    name_candidates = props.get("name", []) or props.get("title", [])
    name = name_candidates[0] if name_candidates else entity["id"]
    
    # Build YAML frontmatter
    frontmatter_lines = [f"schema: {schema}", f"id: {entity['id']}"]
    
    for key, values in props.items():
        if key == "name":
            continue
        if len(values) == 1:
            frontmatter_lines.append(f"{key}: \"{values[0]}\"")
        elif len(values) > 1:
            items = "\n".join(f"  - \"{v}\"" for v in values)
            frontmatter_lines.append(f"{key}:\n{items}")
    
    frontmatter_lines.append("source: \"oidsf_import\"")
    frontmatter_lines.append("confidence: 0.85")
    
    frontmatter = "\n".join(frontmatter_lines)
    content = f"---\n{frontmatter}\n---\n\n## Notes\n\n*Imported from OIDSF entity resolution pipeline.*\n"
    
    folder = SCHEMA_TO_FOLDER.get(schema, "Unknown")
    return folder, name, content


def main():
    with open("output/entities.jsonl") as f:
        for line in f:
            entity = json.loads(line)
            if not entity.get("schema"):
                continue  # skip statements and links
            
            folder, name, content = entity_to_markdown(entity)
            
            target_dir = VAULT_PATH / folder
            target_dir.mkdir(parents=True, exist_ok=True)
            
            # Sanitize filename
            safe_name = "".join(c if c.isalnum() or c in " .-_()" else "_" for c in name)
            target_path = target_dir / f"{safe_name}.md"
            
            if not target_path.exists():
                target_path.write_text(content, encoding="utf-8")
                print(f"[+] Created: {target_path.name}")
            else:
                print(f"[~] Skipped (exists): {target_path.name}")


if __name__ == "__main__":
    main()
```

Run it against your entity resolution output:

```bash
python import_to_obsidian.py
```

After import, open Obsidian. The new entity notes appear in the graph view immediately. Claude Code can now answer questions about entities that were resolved programmatically from multiple sources.

---

## Day-to-Day Workflow

After the initial setup, a typical investigation session looks like this:

1. **Open the vault.** `global.md` is loaded automatically — Claude has the case context.

2. **Paste new source material into chat.** Claude extracts entities, you confirm the extraction. Each new document takes 30–60 seconds.

3. **Query the vault.** After each extraction round, ask "what new connections appeared?" or "does this new entity link to anyone already in the vault?"

4. **Check the graph view.** Look for unexpected structural patterns — new clusters, isolated nodes, entities that bridge two previously separate components.

5. **Add analyst notes.** Open any entity note and write your own observations in the body section below the frontmatter. These notes are included when Claude searches the vault.

6. **Synthesize before closing.** Ask Claude: "based on everything in the vault, what is the strongest single lead to pursue next?" The answer is grounded in what you actually have, not what the AI imagines.

---

## Common Failure Points

**"Claude Code CLI path" is wrong.** The plugin needs to find the `claude` binary. If you installed Claude Code in a virtual environment or a non-standard location, you must provide the full path. Use `which claude` in your terminal to find it.

**Entities are created but not appearing in the graph.** The graph view needs Obsidian wiki-links (`[[Entity Name]]`) to draw edges. The plugin creates these links in Connection notes and in entity YAML `properties`. If your entity notes lack outbound links, they will appear as isolated nodes. Check the Connection note for the relationship you expect.

**Claude gives answers that are not grounded in the vault.** When the agent runtime is in general chat mode rather than local search mode, Claude may draw on its training knowledge rather than your vault. Be explicit in your prompts: "based only on what is in this vault, tell me..." — or use the explicit Local search chat mode if your plugin version offers it.

**Vault grows too large for the context window.** When your vault has hundreds of notes, Claude cannot read all of them in a single context window. The plugin handles this with semantic search (finding the most relevant notes), but you may get incomplete answers on questions requiring a full vault scan. Solution: periodically synthesize your findings into a `case-summary.md` note that Claude reads first, using it as a compressed index of the investigation state.

**`global.md` edits not taking effect.** Run the command **OSINT Copilot: Reload vault prompts** after editing any file under `OSINTCopilot/custom/prompts/`. Changes are not picked up automatically mid-session.

---

## What You Have at the End

A self-contained investigation workspace where:

- Every entity is a file you can read, edit, version-control with git, and share with colleagues
- Every relationship is explicit and typed
- AI extraction speeds up the data-entry phase without removing your oversight of what enters the investigation record
- Vault Q&A gives you grounded answers that cite only established facts
- The timeline shows event sequence at a glance
- The graph shows structural relationships visually

The whole thing is a folder. Back it up with `rsync`. Version-control it with git. Share a specific entity note with a colleague by email. Export to OIDSF and load into Neo4j for network analysis. The data format is portable because it is plain text.

That portability is the design principle worth keeping: no investigation should be locked inside a tool that might disappear, raise its prices, or change its terms of service.

---

## Resources

| Tool | Link |
|---|---|
| Obsidian | obsidian.md |
| OSINT Copilot Plugin | github.com/Probe-Point-Analytics-LLC/Obsidian-OSINT-Copilot-plugin |
| BRAT (plugin installer) | github.com/TfTHacker/obsidian42-brat |
| Claude Code | claude.ai/code |
| OIDSF (entity format) | github.com/OSINT-for-Ukraine/oidsf |
| FollowTheMoney (entity schema) | followthemoney.tech |

---

*Part 4 of 4 in the AI OSINT Pipeline series.*
