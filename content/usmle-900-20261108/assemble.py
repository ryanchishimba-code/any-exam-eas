#!/usr/bin/env python3
"""Build the hidden Step 1 pack. Does not touch the database."""

import hashlib
import importlib.util
import json
import re
from collections import Counter
from pathlib import Path

from citations import CATALOG

ROOT = Path(__file__).resolve().parent
FILES = [
    "step1_neuro.py",
    "step1_neuro_b.py",
    "step1_neuro_c.py",
    "step1_ethics_dev.py",
    "step1_repro_mine.py",
    "step1_multi_mine.py",
    "step1_msk_mine.py",
    "step1_gap.py",
    "step1_gap2.py",
    "step1_gap3.py",
    "step1_gap4.py",
]
VERSION = "usmle-step1-300-20261108-v1"
FIELD = "usmle-step-1"
STEP = "step1"


def load_items():
    rows = []
    for name in FILES:
        path = ROOT / name
        spec = importlib.util.spec_from_file_location(name, path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for it in mod.ITEMS:
            row = dict(it)
            row["question"] = (row.get("question") or row.get("stem") or "").strip()
            row["blueprintTopic"] = (
                row.get("blueprintTopic") or row.get("id") or row["question"][:80]
            )
            row.pop("stem", None)
            row.pop("id", None)
            rows.append(row)
    return rows


def norm(text):
    return re.sub(r"\s+", " ", (text or "").lower()).strip()


def content_hash(row):
    blob = "|".join(
        [
            FIELD,
            row["scenario"],
            row["question"],
            row["correctAnswer"],
        ]
    )
    return hashlib.sha256(blob.encode()).hexdigest()


def main():
    served = set()
    prefix_path = Path("/tmp/usmle900/served-prefixes.txt")
    if prefix_path.exists():
        for line in prefix_path.read_text().splitlines():
            if "\t" in line:
                field, text = line.split("\t", 1)
                if field == FIELD:
                    served.add(text[:140])
    rows = load_items()
    problems = []
    kept = []
    seen = set()
    for i, row in enumerate(rows):
        if row["ref"] not in CATALOG:
            problems.append(f"{i} bad ref {row['ref']}")
            continue
        if row["correctAnswer"] not in row["options"] or len(row["options"]) != 5:
            problems.append(f"{i} options/key {row['blueprintTopic']}")
            continue
        if row["difficulty"] not in (4, 5):
            problems.append(f"{i} difficulty")
            continue
        opening = norm(row["scenario"])[:140]
        if opening in seen:
            problems.append(f"dup {row['blueprintTopic']}")
            continue
        if any(opening[:100] and opening[:100] in s for s in ()):
            pass
        # near-duplicate of a served stem
        if opening[:100] in " ".join(list(served)[:1]):
            pass
        collision = False
        for s in served:
            if opening[:90] and opening[:90] in s:
                collision = True
                break
        if collision:
            problems.append(f"served-collision {row['blueprintTopic']}")
            continue
        seen.add(opening)
        label, url = CATALOG[row["ref"]]
        row["references"] = [{"label": label, "url": url}]
        row["fieldId"] = FIELD
        row["stepLevel"] = STEP
        row["itemType"] = "vignette"
        row["generationVersion"] = VERSION
        row["contentHash"] = content_hash(row)
        kept.append(row)
    print("loaded", len(rows), "kept", len(kept), "problems", len(problems))
    for line in problems[:30]:
        print(" ", line)
    print("domains", dict(Counter(r["blueprintDomain"] for r in kept)))
    print("difficulty", dict(Counter(r["difficulty"] for r in kept)))
    (ROOT / "items.json").write_text(json.dumps(kept, indent=2))
    print("wrote", ROOT / "items.json")


if __name__ == "__main__":
    main()
