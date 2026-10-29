---
tags:
  - materials
---

# Build an Automated Image Verification Pipeline in Python
> [[Articles/index|Статті]]

*A step-by-step tutorial for building a local script that takes an image of unknown provenance and returns a structured verification report — metadata audit, edit-detection score, reverse image search hits, chronolocation estimate, and AI verdict.*

---

An image appears online. It is claimed to show a specific event at a specific place and time. Before that image is used as evidence in an investigation, a report, or a legal filing, it needs to pass through a verification stack — not a single tool, but a sequence of independent checks whose results triangulate toward a conclusion.

This tutorial builds that stack as a single Python script. You give it an image path or URL. It runs ExifTool, Error Level Analysis, perceptual hashing, C2PA provenance check, sun-position chronolocation, reverse image search, and a local vision LLM. It outputs a structured JSON report and a human-readable verdict.

**What you will have built:**

A command-line tool that takes `verify.py image.jpg` and produces a report covering every technical verification layer — in a format that slots directly into OIDSF (the OSINT Investigation Data Share Format) so findings are portable to any investigation workspace.

---

## Why a Pipeline, Not a Checklist

The instinct is to run tools one at a time, manually, and note the results. That works for a single image. It does not work when you are processing 50 images from a document dump or running nightly monitoring on a target account. More importantly, it produces results you cannot reproduce: if a colleague asks how you arrived at your conclusion, "I ran ExifTool and looked at it" is not an answer.

A pipeline produces a JSON artifact. The artifact is the evidence. Another analyst with the same script and the same image should get the same output. That reproducibility is what the Berkeley Protocol on Digital Open Source Investigations requires for evidence used in accountability proceedings.

---

## The Verification Stack

```
Input: image path or URL
        │
        ▼
Stage 1: Fetch + hash (SHA-256, chain of custody)
        │
        ▼
Stage 2: Metadata extraction (ExifTool)
        │
        ▼
Stage 3: Error Level Analysis (edit detection)
        │
        ▼
Stage 4: Perceptual hashing (phash, corpus comparison)
        │
        ▼
Stage 5: C2PA provenance check
        │
        ▼
Stage 6: Sun position chronolocation (if GPS + timestamp)
        │
        ▼
Stage 7: Reverse image search (TinEye API)
        │
        ▼
Stage 8: AI verdict (local vision LLM via Ollama)
        │
        ▼
Output: OIDSF-compatible JSON report
```

Each stage is independent. If Stage 6 cannot run (no GPS in EXIF), it records `null` and moves on. The pipeline does not break on missing data — it notes the absence as a finding.

---

## Prerequisites

```bash
pip install pillow imagehash requests python-dotenv ollama
```

Install ExifTool system-wide:

```bash
# Ubuntu/Debian
sudo apt install exiftool

# macOS
brew install exiftool

# Arch/Manjaro
sudo pacman -S perl-image-exiftool
```

Install Ollama and pull a vision-capable model:

```bash
# Install Ollama (Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Pull a vision model
ollama pull llava
# or, if you have the resources:
ollama pull llava:13b
```

Optional (for reverse image search):

```bash
# TinEye API key — free tier gives 150 searches/month
# Set TINEYE_API_KEY in a .env file
pip install tineye
```

---

## The Script

Create `verify.py`. The full script follows in sections — each section maps to one stage.

### Boilerplate and imports

```python
#!/usr/bin/env python3
"""
OSINT Image Verification Pipeline
Outputs an OIDSF-compatible artifact + statement bundle.
"""

import hashlib
import json
import os
import subprocess
import sys
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import urlretrieve

import imagehash
import requests
from PIL import Image, ImageChops, ImageEnhance
from dotenv import load_dotenv

load_dotenv()

TINEYE_KEY = os.getenv("TINEYE_API_KEY")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llava")
```

### Stage 1: Fetch and hash

```python
def fetch_image(source: str) -> tuple[Path, str]:
    """Download URL or use local path. Return (path, sha256)."""
    if source.startswith("http://") or source.startswith("https://"):
        tmp = tempfile.mktemp(suffix=Path(urlparse(source).path).suffix or ".jpg")
        urlretrieve(source, tmp)
        path = Path(tmp)
    else:
        path = Path(source)

    sha256 = hashlib.sha256(path.read_bytes()).hexdigest()
    return path, sha256
```

The SHA-256 hash is recorded in the output as the image's fingerprint. If the same hash appears in two reports, they refer to the same file — even if the filename changed.

### Stage 2: Metadata extraction

```python
def extract_metadata(path: Path) -> dict:
    """Run ExifTool and return parsed JSON."""
    result = subprocess.run(
        ["exiftool", "-json", "-n", str(path)],
        capture_output=True, text=True, check=True
    )
    data = json.loads(result.stdout)
    return data[0] if data else {}
```

The `-n` flag returns numeric values (GPS coordinates as decimals, not degrees/minutes/seconds). The output contains everything ExifTool can read: camera make and model, lens, exposure settings, GPS, timestamps, and — critically — `Software` and `HistoryAction` fields. When a `Software` tag contains "Adobe Photoshop", "GIMP", or "Canva", that is a flag. It does not prove manipulation; it proves the image passed through editing software.

### Stage 3: Error Level Analysis

```python
def ela_analysis(path: Path, quality: int = 95, scale: int = 15) -> dict:
    """
    Recompress the image at the given quality and compute the difference.
    Returns the mean ELA value and a boolean flag.
    """
    original = Image.open(path).convert("RGB")

    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = tmp.name

    original.save(tmp_path, "JPEG", quality=quality)
    recompressed = Image.open(tmp_path)

    diff = ImageChops.difference(original, recompressed)
    amplified = ImageEnhance.Brightness(diff).enhance(scale)

    pixels = list(amplified.getdata())
    mean_ela = sum(max(p) for p in pixels) / len(pixels)

    os.unlink(tmp_path)

    return {
        "quality": quality,
        "scale": scale,
        "mean_ela_value": round(mean_ela, 2),
        "is_potentially_edited": mean_ela > 8.0,
        "note": "ELA detects re-compression artifacts. False positives occur on images saved multiple times."
    }
```

**What ELA actually measures:** when a JPEG is saved, it introduces compression artifacts distributed evenly across the image. If part of the image was edited and re-saved on top of an older JPEG, that region has a different compression history. ELA makes this visible by recompressing the entire image at a known quality level and measuring where the difference is highest.

A mean ELA value above 8.0 is a flag, not a verdict. Flat-color regions (skies, walls) normally have low ELA values — if they have high values, that is suspicious. Textured regions (fabric, foliage) normally have high ELA values — high values there are expected and mean nothing.

### Stage 4: Perceptual hashing

```python
def compute_phash(path: Path) -> str:
    """Return the perceptual hash (phash) as a hex string."""
    img = Image.open(path)
    return str(imagehash.phash(img))
```

A perceptual hash (phash) is a fingerprint that is robust to minor image changes — resizing, slight color adjustment, JPEG re-encoding. Two images with a Hamming distance below 10 are near-duplicates. Distance 0 means identical perceptual content.

Store this hash in your investigation database. When you process the next image, compare its phash against all stored hashes. Hamming distance < 10 means you have probably seen this image before — under a different filename, from a different source.

```python
def compare_phash(hash1: str, hash2: str) -> int:
    """Return Hamming distance between two phash strings."""
    h1 = imagehash.hex_to_hash(hash1)
    h2 = imagehash.hex_to_hash(hash2)
    return h1 - h2
```

### Stage 5: C2PA provenance check

C2PA (Coalition for Content Provenance and Authenticity) is a cryptographic standard that embeds a signed provenance manifest directly into the image file. If the manifest is present and the signature is valid, you have cryptographic proof of where the image came from and what happened to it. If it is absent, you know nothing — absence of C2PA is not evidence of manipulation, just evidence of no provenance chain.

```python
def check_c2pa(path: Path) -> dict:
    """
    Attempt to read a C2PA manifest using the c2pa-python library if available,
    otherwise fall back to ExifTool XMP fields.
    """
    try:
        import c2pa
        reader = c2pa.Reader.from_file(str(path))
        manifest = reader.get_active_manifest()
        return {
            "c2pa_present": True,
            "issuer": manifest.get("claim_generator", "unknown"),
            "signature_valid": True,
            "note": "C2PA manifest found and verified."
        }
    except ImportError:
        # Fall back: look for XMP C2PA markers via ExifTool
        result = subprocess.run(
            ["exiftool", "-XMP:all", "-json", str(path)],
            capture_output=True, text=True
        )
        xmp = json.loads(result.stdout)[0] if result.stdout else {}
        has_c2pa_xmp = any("c2pa" in k.lower() for k in xmp.keys())
        return {
            "c2pa_present": has_c2pa_xmp,
            "signature_valid": None,
            "note": "c2pa-python not installed; checked XMP fields only. Install c2pa-python for full verification."
        }
    except Exception as e:
        return {"c2pa_present": False, "signature_valid": False, "note": str(e)}
```

Install the official C2PA Python library:

```bash
pip install c2pa-python
```

### Stage 6: Sun position chronolocation

If the image has GPS coordinates and a timestamp in the EXIF data, you can compute where the sun should have been in the sky at that location and time. Compare this against visible shadows in the image. If the shadows go the wrong direction for the stated sun position, the timestamp or location is inconsistent with the image content.

```python
def sun_position_check(metadata: dict) -> dict:
    """
    Compute expected sun position from EXIF GPS + timestamp.
    Requires: GPSLatitude, GPSLongitude, DateTimeOriginal in metadata.
    """
    try:
        from suncalc import get_position
    except ImportError:
        return {"available": False, "note": "Install suncalc: pip install suncalc"}

    lat = metadata.get("GPSLatitude")
    lon = metadata.get("GPSLongitude")
    dt_str = metadata.get("DateTimeOriginal") or metadata.get("CreateDate")

    if not all([lat, lon, dt_str]):
        return {
            "available": False,
            "note": "Missing GPS or timestamp in EXIF. Cannot perform chronolocation."
        }

    # ExifTool DateTimeOriginal format: "2024:03:15 14:22:01"
    dt = datetime.strptime(dt_str, "%Y:%m:%d %H:%M:%S").replace(tzinfo=timezone.utc)

    position = get_position(dt, float(lon), float(lat))

    altitude_deg = round(position["altitude"] * 57.2958, 1)
    azimuth_deg = round(position["azimuth"] * 57.2958 + 180, 1) % 360

    return {
        "available": True,
        "latitude": float(lat),
        "longitude": float(lon),
        "datetime_utc": dt.isoformat(),
        "sun_altitude_degrees": altitude_deg,
        "sun_azimuth_degrees": azimuth_deg,
        "interpretation": (
            f"At the stated coordinates and time, the sun was {altitude_deg}° above the horizon "
            f"at azimuth {azimuth_deg}° (0=N, 90=E, 180=S, 270=W). "
            "Compare against visible shadows in the image to check consistency."
        )
    }
```

```bash
pip install suncalc
```

### Stage 7: Reverse image search

```python
def reverse_image_search(path: Path) -> dict:
    """Query TinEye for reverse image matches. Requires TINEYE_API_KEY."""
    if not TINEYE_KEY:
        return {
            "available": False,
            "note": "Set TINEYE_API_KEY in .env to enable reverse image search."
        }

    try:
        from tineye_api import TinEyeAPIRequest

        api = TinEyeAPIRequest(
            api_url="https://api.tineye.com/rest/",
            public_key=TINEYE_KEY,
            private_key=""
        )
        with open(path, "rb") as f:
            response = api.search_data(f.read())

        matches = response.get("matches", [])
        if not matches:
            return {"available": True, "match_count": 0, "earliest_seen": None}

        earliest = min(
            m.get("backlinks", [{}])[0].get("crawl_date", "9999") for m in matches
        )
        return {
            "available": True,
            "match_count": len(matches),
            "earliest_seen": earliest,
            "note": f"Earliest known appearance: {earliest}. If this predates the claimed event, the image may have been reused."
        }
    except Exception as e:
        return {"available": True, "error": str(e)}
```

TinEye's strength is finding the **earliest known appearance** of an image. If an image claimed to show a 2025 event first appeared in TinEye's index in 2019, you have strong evidence of image reuse. The free tier (150 searches/month) is sufficient for targeted investigation work.

### Stage 8: AI verdict

```python
def ai_verdict(path: Path, findings: dict) -> str:
    """
    Send the image and structured findings to a local vision LLM.
    The model is asked to assess consistency, not to make a final determination.
    """
    import ollama

    findings_text = json.dumps(findings, indent=2)

    prompt = f"""You are a media forensics analyst reviewing an image for an OSINT investigation.

The following automated checks have been run on this image:

{findings_text}

Based on these findings and your visual inspection of the image:
1. Are there any visible inconsistencies (lighting direction, shadow angles, perspective errors, obvious compositing)?
2. Does the visual content appear consistent with the metadata (camera model, settings, location if present)?
3. What is your overall assessment: consistent, inconsistent, or inconclusive?

Respond in 2-3 sentences. Cite only the evidence present in the findings above. Do not speculate beyond what the data supports. Use phrases like "the data suggests" rather than definitive claims.
"""

    try:
        with open(path, "rb") as f:
            image_data = f.read()

        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{
                "role": "user",
                "content": prompt,
                "images": [image_data]
            }]
        )
        return response["message"]["content"]
    except Exception as e:
        return f"AI verdict unavailable: {e}"
```

The prompt structure is deliberate. The model is grounded in the structured findings — it is not free to hallucinate provenance. The phrase "cite only the evidence present in the findings above" reduces the model's tendency to generate plausible-sounding but fabricated observations. This is not a truth machine; it is a synthesis layer over evidence you have already gathered.

### Stage 9: Assemble the OIDSF output

```python
def build_report(source: str, path: Path, sha256: str, metadata: dict,
                 ela: dict, phash: str, c2pa: dict, sun: dict,
                 reverse: dict, verdict: str) -> dict:
    """Assemble an OIDSF-compatible artifact + statement bundle."""

    artifact_id = f"art_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    artifact = {
        "oidsf_version": "1.0.0",
        "id": artifact_id,
        "title": Path(source).name if not source.startswith("http") else source,
        "url": source if source.startswith("http") else None,
        "retrieved_at": now,
        "mime_type": "image/jpeg",
        "capture_method": "http_get" if source.startswith("http") else "manual_upload",
        "hashes": {"sha256": sha256},
        "sensitivity": "investigation",
        "distribution": "restricted"
    }

    statements = [
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "metadata"}},
            "value": json.dumps({
                "camera": metadata.get("Make", "unknown") + " " + metadata.get("Model", ""),
                "software": metadata.get("Software"),
                "gps_present": bool(metadata.get("GPSLatitude")),
                "datetime_original": metadata.get("DateTimeOriginal"),
            }),
            "artifact_ids": [artifact_id],
            "extraction_method": "exiftool",
            "extracted_at": now,
            "confidence": 1.0
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "ela_result"}},
            "value": json.dumps(ela),
            "artifact_ids": [artifact_id],
            "extraction_method": "ela",
            "extracted_at": now,
            "confidence": 0.7 if ela["is_potentially_edited"] else 0.9
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "phash"}},
            "value": phash,
            "artifact_ids": [artifact_id],
            "extraction_method": "imagehash",
            "extracted_at": now,
            "confidence": 1.0
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "c2pa"}},
            "value": json.dumps(c2pa),
            "artifact_ids": [artifact_id],
            "extraction_method": "c2pa",
            "extracted_at": now,
            "confidence": 1.0 if c2pa.get("signature_valid") else 0.5
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "sun_position"}},
            "value": json.dumps(sun),
            "artifact_ids": [artifact_id],
            "extraction_method": "suncalc",
            "extracted_at": now,
            "confidence": 0.8 if sun.get("available") else 0.0
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "reverse_image_search"}},
            "value": json.dumps(reverse),
            "artifact_ids": [artifact_id],
            "extraction_method": "tineye",
            "extracted_at": now,
            "confidence": 0.9 if reverse.get("available") else 0.0
        },
        {
            "oidsf_version": "1.0.0",
            "id": f"stmt_{uuid.uuid4().hex[:8]}",
            "subject": {"entity_property": {"entity_id": artifact_id, "property": "ai_verdict"}},
            "value": verdict,
            "artifact_ids": [artifact_id],
            "extraction_method": "llm",
            "extracted_at": now,
            "confidence": 0.6
        }
    ]

    return {"artifact": artifact, "statements": statements}
```

### Main entry point

```python
def main():
    if len(sys.argv) < 2:
        print("Usage: verify.py <image_path_or_url>")
        sys.exit(1)

    source = sys.argv[1]
    print(f"[*] Fetching: {source}")
    path, sha256 = fetch_image(source)
    print(f"[*] SHA-256: {sha256}")

    print("[*] Extracting metadata...")
    metadata = extract_metadata(path)

    print("[*] Running ELA...")
    ela = ela_analysis(path)

    print("[*] Computing phash...")
    phash = compute_phash(path)

    print("[*] Checking C2PA...")
    c2pa = check_c2pa(path)

    print("[*] Computing sun position...")
    sun = sun_position_check(metadata)

    print("[*] Reverse image search...")
    reverse = reverse_image_search(path)

    intermediate = {
        "sha256": sha256,
        "metadata_flags": {
            "software": metadata.get("Software"),
            "gps_present": bool(metadata.get("GPSLatitude")),
            "datetime_original": metadata.get("DateTimeOriginal")
        },
        "ela": ela,
        "phash": phash,
        "c2pa": c2pa,
        "sun_position": sun,
        "reverse_image_search": reverse
    }

    print("[*] Requesting AI verdict...")
    verdict = ai_verdict(path, intermediate)

    print("[*] Building report...")
    report = build_report(source, path, sha256, metadata, ela,
                          phash, c2pa, sun, reverse, verdict)

    out_path = Path(source).stem + "_verification.json" \
               if not source.startswith("http") \
               else "verification_report.json"

    with open(out_path, "w") as f:
        json.dump(report, f, indent=2)

    print(f"\n[+] Report saved to: {out_path}")
    print(f"\n--- AI VERDICT ---\n{verdict}\n")


if __name__ == "__main__":
    main()
```

---

## Running It

```bash
# Against a local file
python verify.py /path/to/image.jpg

# Against a URL
python verify.py "https://example.com/photo.jpg"
```

Sample output (truncated):

```json
{
  "artifact": {
    "oidsf_version": "1.0.0",
    "id": "art_3f8a21cc04b1",
    "hashes": { "sha256": "a3c8f2..." },
    "capture_method": "http_get"
  },
  "statements": [
    {
      "subject": { "entity_property": { "property": "ela_result" } },
      "value": "{\"mean_ela_value\": 11.4, \"is_potentially_edited\": true}",
      "confidence": 0.7
    },
    {
      "subject": { "entity_property": { "property": "ai_verdict" } },
      "value": "The ELA value of 11.4 exceeds the threshold and the Software tag indicates Adobe Photoshop CC 2024, suggesting the image passed through editing software. The sun position is consistent with the stated timestamp, but the absence of a C2PA manifest means no cryptographic provenance can be established. Assessment: inconclusive — edit detection flags are present but not individually conclusive.",
      "confidence": 0.6
    }
  ]
}
```

---

## What the Findings Mean (and Don't Mean)

**ELA flag:** the image was saved multiple times or a region was edited. Not proof of manipulation — a photo shared on WhatsApp three times will accumulate JPEG artifacts and trigger ELA. Treat it as a reason to look more carefully, not as a verdict.

**Software tag:** the image passed through Photoshop or GIMP. Could be legitimate post-processing (color correction, cropping) or could be manipulation. Note it. Do not conclude from it alone.

**No GPS in EXIF:** many people strip GPS from photos before sharing for privacy reasons. Absence is normal. Presence is useful.

**C2PA absent:** the camera or platform does not support C2PA (most cameras as of 2026 do not, unless they are recent Leica or Sony models with C2PA support built in). Absence is the norm, not a red flag.

**TinEye match predates the event:** this is the strongest mechanical finding the pipeline can produce. An image that first appeared in 2019 cannot be documenting a 2025 event. This finding alone can invalidate a source claim.

**AI verdict:** the LLM synthesizes the structured findings and looks for visual inconsistencies. It is grounded in the data the pipeline collected. Do not treat it as an independent source of truth — it is a summary tool, not an investigative tool.

---

## Common Failure Points

**ExifTool not found.** The script shells out to `exiftool` as a subprocess. If it is not on your system PATH, the subprocess call will fail. Install it system-wide, not via pip (there is no reliable Python-native ExifTool implementation).

**Ollama connection refused.** Ollama must be running as a service (`ollama serve` in the background) before the script runs. If you installed Ollama but have not started it, the AI verdict stage will fail gracefully and return an error string — the rest of the report will still complete.

**ELA false positives on PNG files.** ELA works on the principle of JPEG re-compression. PNG files are lossless and will produce meaningless ELA output. The script as written converts to RGB before ELA — but results on PNGs should be ignored. Add a MIME type check and skip ELA for non-JPEG inputs.

**TinEye rate limit.** The free tier is 150 searches/month. If you are processing many images, add a counter and a sleep to stay within the limit, or upgrade to a paid plan.

---

## What You Have at the End

A JSON report per image that is reproducible, shareable, and machine-readable. Feed it to a second script that compares phashes across a corpus and you have a duplicate-detection pipeline. Feed it to a database and you have a searchable image inventory with verification status per image.

The OIDSF structure means the artifact and statements can be merged with entity graphs from other tools — if the image shows a person you have already identified in Neo4j, the statement linking the image artifact to that entity uses the same ID scheme.

---

## Resources

| Tool | Link |
|---|---|
| ExifTool | exiftool.org |
| imagehash (Python) | github.com/JohannesBuchner/imagehash |
| suncalc (Python) | pypi.org/project/suncalc |
| c2pa-python | pypi.org/project/c2pa-python |
| C2PA Standard | c2pa.org |
| TinEye API | tineye.com/api |
| Ollama | ollama.com |
| OIDSF | github.com/OSINT-for-Ukraine/oidsf |
| Berkeley Protocol | ohchr.org/en/publications/policy-and-methodological-publications/berkeley-protocol |

---

*Part 2 of 4 in the AI OSINT Pipeline series.*
