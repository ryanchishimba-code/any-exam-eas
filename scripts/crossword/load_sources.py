
"""Load tab-separated clue sources into bank JSON."""
from __future__ import annotations
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "sources"
OUT = ROOT / "banks"
ANSWER = re.compile(r"^[A-Z]{3,11}$")
PROMISE = re.compile(r"you will pass|you'll pass|guaranteed to pass", re.I)

def word_in(answer: str, text: str) -> bool:
    return re.search(rf"\b{re.escape(answer)}\b", text, re.I) is not None

def load_tsv(path: Path) -> dict:
    bank = {}
    problems = []
    for i, line in enumerate(path.read_text().splitlines(), 1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) != 4:
            problems.append(f"{path.name}:{i} fields {len(parts)}")
            continue
        answer, clue, rationale, topic = [p.strip() for p in parts]
        answer = answer.upper()
        if not ANSWER.match(answer):
            problems.append(f"{path.name}:{i} answer {answer}")
            continue
        if answer in bank:
            problems.append(f"{path.name}:{i} dup {answer}")
            continue
        if len(clue) < 20 or len(rationale) < 20:
            problems.append(f"{path.name}:{i} short {answer}")
            continue
        if word_in(answer, clue):
            problems.append(f"{path.name}:{i} spoils {answer}")
            continue
        if PROMISE.search(clue + rationale):
            problems.append(f"{path.name}:{i} promise {answer}")
            continue
        bank[answer] = {"clue": clue, "rationale": rationale, "topic": topic}
    return bank, problems

def main():
    OUT.mkdir(exist_ok=True)
    for path in sorted(SRC.glob("*.tsv")):
        bank, problems = load_tsv(path)
        dest_name = path.stem + ".json"
        # nclex.tsv would overwrite the curated base; sources use nclex-extra
        dest = OUT / dest_name
        dest.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n")
        print(f"{path.name}: {len(bank)} ok, {len(problems)} problems -> {dest.name}")
        for item in problems[:30]:
            print(" ", item)
if __name__ == "__main__":
    main()
