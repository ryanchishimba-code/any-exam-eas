#!/usr/bin/env python3
"""Check drafted USMLE items against Ryan's board-pass rule before packaging."""

import json
import re
import sys
from pathlib import Path

DOMAINS = {
    "human-development",
    "blood-lymph-immune",
    "behavioral-nervous",
    "msk-skin",
    "cardiovascular",
    "respiratory-renal",
    "gastrointestinal",
    "reproductive-endocrine",
    "multisystem",
    "biostats-epi",
    "social-sciences",
}

ROOT = Path(__file__).resolve().parent


def mentions(explanation, option):
    text = explanation.lower()
    words = [w for w in re.findall(r"[a-z0-9]{5,}", option.lower())]
    if not words:
        return option.lower() in text
    hits = sum(1 for w in words[:6] if w in text)
    return hits >= 1 and (len(words) == 1 or hits >= min(2, len(words)))


def check(path):
    rows = json.loads(Path(path).read_text())
    problems = []
    for i, row in enumerate(rows, 1):
        opts = row.get("options") or []
        expl = row.get("explanation") or ""
        key = row.get("correctAnswer")
        if row.get("blueprintDomain") not in DOMAINS:
            problems.append(f"{i} bad domain")
        if row.get("difficulty") not in (4, 5):
            problems.append(f"{i} difficulty {row.get('difficulty')}")
        if not isinstance(opts, list) or len(opts) != 5 or len(set(opts)) != 5:
            problems.append(f"{i} options")
        if key not in opts:
            problems.append(f"{i} key not in options")
        if len(row.get("scenario") or "") < 280:
            problems.append(f"{i} thin vignette")
        if len(expl) < 350:
            problems.append(f"{i} thin rationale")
        for opt in opts:
            if opt == key:
                continue
            if not mentions(expl, opt):
                problems.append(f"{i} rationale skips a wrong option: {opt[:60]}")
                break
    return len(rows), problems


if __name__ == "__main__":
    paths = sys.argv[1:] or sorted(str(p) for p in Path("/tmp/usmle900").glob("*.json"))
    for path in paths:
        n, problems = check(path)
        print(f"{path}: {n} items, {len(problems)} problems")
        for line in problems[:12]:
            print(" ", line)
