#!/usr/bin/env python3
"""Write per-board clue banks. Clinical content still needs expert review."""
from __future__ import annotations

import json
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent / "banks"
ANSWER = re.compile(r"^[A-Z]{3,11}$")
DROP = {
    "OMPRAZOLE",
    "NOREPINEPHR",
    "NITROGLYC",
    "LEVOTHYROX",
    "EMPAGLIFLOZ",
    "CANAGLIFLOZ",
    "SPIRONOLACT",
    "CHLORTAL",
    "PROPYLTHIO",
    "FLUDROCORT",
    "CALCIUMAC",
    "CYANOCOBAL",
    "SODIUMBIC",
    "MYCOPHENOL",
    "METHOTREX",
    "KETOCONAZ",
    "ISOTRETIN",
    "DEFEROX",
    "ACETYLCYST",
    "NARROW",
    "STEADY",
    "SILVER",
}
# Incomplete spellings that would make the player guess a fragment.
DROP |= {
    "TRENDELEN", "CIRCUMDUCT", "SUPRASPIN", "INFRASPIN", "SUBSCAP", "MUSCULOCUT",
    "LONGTHOR", "DORSALSCAP", "SUPRASCAP", "SPINALACC", "DIADOCHOK", "GROUNDREAC",
    "CENTERMASS", "HYPONATREM", "SPONDYLOLYS", "OSTEOPOROS", "COMPLEXREG", "HYPERALGES",
    "KINESIOPHOB", "BRACHIALPL", "WEIGHTBEAR", "ASTOLER", "EXTENSORH", "FLEXORHALL",
    "ADDUCTORP", "DORSALINT", "BICEPSFEM", "SEMIMEMB", "SEMITEND", "GASTROCNEM",
    "TIBIALISANT", "PERONEUSL", "PERONEUSB", "GLUTEMED", "GLUTEMAX", "DEEPFIB",
    "SUPERFIB", "CHONDROMAL", "PESANS", "PLANTARF", "DIABETICFT", "MONOFIL",
    "SPINOTHAL", "DORSALCOL", "CORTICOSPIN", "BROWNSEQ", "RADICULOP", "RATEPRESS",
    "GLOSSOPHARY", "VESTIBULO", "GAZESTAB", "SEMICIRC", "PHONOPHOR", "IONTOPHOR",
    "CONTRASTB", "FLUIDOTHER", "REVERSIB", "HEATILL", "STRESSFX", "NONWEIGHT",
    "LEGGCALVE", "CLAUBICATION", "DEVELOPMENT", "FEMALE", "WAITER", "RETURN", "RED",
    "CEMENT", "GRADEONE",
}


def emit(name: str, rows: list[tuple[str, str, str, str]]) -> None:
    bank: dict[str, dict] = {}
    bad: list[str] = []
    for answer, clue, rationale, topic in rows:
        key = answer.strip().upper()
        clue, rationale, topic = clue.strip(), rationale.strip(), topic.strip()
        if not ANSWER.match(key):
            bad.append(f"answer {answer}")
            continue
        if key in DROP or key in bank:
            bad.append(f"dup {key}")
            continue
        if len(clue) < 20 or len(rationale) < 20:
            bad.append(f"short {key}")
            continue
        if re.search(rf"\b{re.escape(key)}\b", clue, re.I):
            bad.append(f"spoils {key}")
            continue
        bank[key] = {"clue": clue, "rationale": rationale, "topic": topic}
    path = OUT / f"{name}.json"
    path.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n")
    print(f"{name}: {len(bank)} kept, {len(bad)} dropped")
    for item in bad[:25]:
        print(" ", item)


def load(module_name: str) -> list[tuple[str, str, str, str]]:
    import importlib.util

    rows: list[tuple[str, str, str, str]] = []
    base = Path(__file__).resolve().parent / "sources"
    for path in (base / f"{module_name}.py", base / f"{module_name}_more.py"):
        if not path.exists():
            continue
        spec = importlib.util.spec_from_file_location(path.stem, path)
        mod = importlib.util.module_from_spec(spec)
        assert spec.loader
        spec.loader.exec_module(mod)
        rows.extend(list(mod.ROWS))
    return rows


def main() -> None:
    for board in ("naplex", "pance", "usmle", "aanp-fnp", "npte-pt"):
        emit(board, load(board.replace("-", "_")))


if __name__ == "__main__":
    main()
