#!/usr/bin/env python3
"""Write USMLE feed JSON and the physician review file. No database access."""

from __future__ import annotations

import json
import re
from pathlib import Path

from step1 import CARDS as STEP1
from step2 import CARDS as STEP2
from step3 import CARDS as STEP3

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "content" / "usmle-feed"
REVIEW = OUT / "CLINICAL-REVIEW.md"

DECKS = [
    ("step-1", "usmle1", "Step 1", "USMLE Step 1", STEP1),
    ("step-2", "usmle2", "Step 2 CK", "USMLE Step 2 CK", STEP2),
    ("step-3", "usmle3", "Step 3", "USMLE Step 3", STEP3),
]

PROMISE = re.compile(
    r"guaranteed|you will pass|pass the (?:exam|step|usmle)|ensure you pass|pass rate",
    re.I,
)


def check(deck_name: str, cards: list[dict], seen_fronts: set[str]) -> None:
    if len(cards) != 80:
        raise SystemExit(f"{deck_name} has {len(cards)} cards, expected 80")
    bottoms: set[str] = set()
    for index, card in enumerate(cards, start=1):
        for key in ("system", "task", "front", "bottom", "clue", "treat", "trap", "guideline", "year", "url", "note"):
            value = str(card.get(key, "")).strip()
            if not value:
                raise SystemExit(f"{deck_name} card {index} missing {key}")
            card[key] = value
        blob = " ".join(card[key] for key in ("front", "bottom", "clue", "treat", "trap", "note"))
        if PROMISE.search(blob):
            raise SystemExit(f"{deck_name} card {index} promises a pass")
        front_key = re.sub(r"\s+", " ", card["front"].lower())
        if front_key in seen_fronts:
            raise SystemExit(f"duplicate front in {deck_name} card {index}")
        seen_fronts.add(front_key)
        bottom_key = re.sub(r"\s+", " ", card["bottom"].lower())
        if bottom_key in bottoms:
            raise SystemExit(f"duplicate bottom in {deck_name} card {index}: {card['bottom']}")
        bottoms.add(bottom_key)
        if not card["front"].endswith((".", "?")):
            raise SystemExit(f"{deck_name} card {index} front is not a finished sentence")
        for key in ("bottom", "clue", "treat", "trap"):
            if not card[key].endswith((".", "?", "!")):
                raise SystemExit(f"{deck_name} card {index} {key} is not a finished sentence")


def row(prefix: str, index: int, card: dict) -> dict:
    return {
        "id": f"{prefix}-{index:03d}",
        "system": card["system"],
        "task_area": card["task"],
        "front": card["front"],
        "bottom": card["bottom"],
        "bullets": {"clue": card["clue"], "treat": card["treat"], "trap": card["trap"]},
        "source": {
            "guideline": card["guideline"],
            "year": card["year"],
            "url": card["url"],
            "recommendation": card["note"],
        },
    }


def review_section(title: str, cards: list[dict]) -> list[str]:
    lines = [f"## {title}", ""]
    for card in cards:
        lines.extend(
            [
                f"### {card['id']} · {card['system']}",
                "",
                f"- Outline: {card['task_area']}",
                f"- Front: {card['front']}",
                f"- Answer: {card['bottom']}",
                f"- Clue: {card['bullets']['clue']}",
                f"- First-line: {card['bullets']['treat']}",
                f"- Trap: {card['bullets']['trap']}",
                f"- Source: {card['source']['guideline']} ({card['source']['year']})",
                f"- URL: {card['source']['url']}",
                f"- Why this source: {card['source']['recommendation']}",
                "",
            ]
        )
    return lines


def main() -> None:
    seen: set[str] = set()
    written: list[tuple[str, list[dict]]] = []
    for folder, prefix, _label, _long, cards in DECKS:
        check(folder, cards, seen)
        payload = [row(prefix, index, card) for index, card in enumerate(cards, start=1)]
        dest = OUT / folder / "cards"
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "cards.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
        written.append((_long, payload))
        print(folder, len(payload))

    lines = [
        "# USMLE feed clinical review",
        "",
        "For physician review before anyone turns the feed on for students.",
        "This file is not student-facing copy. AnyExamEasy is independent of the USMLE program, the NBME, and the FSMB.",
        "Nothing here promises a result on an exam.",
        "",
        "Each card is tagged to the official USMLE content outline for that Step.",
        "Fronts that teach a diagnosis give the findings and leave the name for the answer.",
        "Cards do not reuse question-bank stems. A physician should confirm the fact, the guideline year, and that the answer is still the one they would teach.",
        "",
        "Counts: Step 1 80, Step 2 CK 80, Step 3 80.",
        "",
    ]
    for title, payload in written:
        lines.extend(review_section(title, payload))
    REVIEW.write_text("\n".join(lines))
    print("review", REVIEW)


if __name__ == "__main__":
    main()
