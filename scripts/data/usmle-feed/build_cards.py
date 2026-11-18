#!/usr/bin/env python3
"""Write USMLE feed JSON and the physician review file. No database access."""

from __future__ import annotations

import json
import re
from pathlib import Path

from step1 import CARDS as STEP1
from step1_more import CARDS as STEP1_MORE
from step2 import CARDS as STEP2
from step2_more import CARDS as STEP2_MORE
from step3 import CARDS as STEP3
from step3_more import CARDS as STEP3_MORE

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "content" / "usmle-feed"
REVIEW = OUT / "CLINICAL-REVIEW.md"

DECKS = [
    ("step-1", "usmle1", "Step 1", "USMLE Step 1", STEP1 + STEP1_MORE),
    ("step-2", "usmle2", "Step 2 CK", "USMLE Step 2 CK", STEP2 + STEP2_MORE),
    ("step-3", "usmle3", "Step 3", "USMLE Step 3", STEP3 + STEP3_MORE),
]

TARGET = 240

PROMISE = re.compile(
    r"guaranteed|you will pass|pass the (?:exam|step|usmle)|ensure you pass|pass rate",
    re.I,
)


def check(deck_name: str, cards: list[dict], seen_fronts: set[str]) -> None:
    if len(cards) != TARGET:
        raise SystemExit(f"{deck_name} has {len(cards)} cards, expected {TARGET}")
    if any(card.get("guideline") == "USMLE Content Outline" for card in cards):
        raise SystemExit(f"{deck_name} still has a generic content-outline citation")
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


def wrap_words(text: str, width: int) -> list[str]:
    words = re.sub(r"\s+", " ", text).strip().split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if len(trial) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [""]


def xml_escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def layout_kind(card: dict) -> str:
    bottom = card["bottom"]
    treat = card["bullets"]["treat"]
    trap = card["bullets"]["trap"]
    blob = f"{bottom} {treat}"
    if re.search(r"\bvs\.?\b|\bversus\b", blob, re.I):
        return "compare"
    if re.search(r"\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|mm ?Hg|%|hours?|days?|weeks?|mEq|mm)\b", bottom, re.I):
        return "threshold"
    if re.search(r"\b(?:then|next)\b", treat, re.I):
        return "steps"
    if re.search(r"\b(?:do not|never|avoid)\b", trap, re.I):
        return "avoid"
    return "answer"


def text_node(x: int, y: int, value: str, size: int, fill: str, weight: int = 500) -> str:
    font = "Helvetica Neue, Helvetica, Arial, sans-serif"
    return (
        f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" fill="{fill}">'
        f"{xml_escape(value)}</text>"
    )


def draw_card(card: dict) -> tuple[str, str]:
    kind = layout_kind(card)
    bottom = card["bottom"]
    clue = card["bullets"]["clue"]
    treat = card["bullets"]["treat"]
    trap = card["bullets"]["trap"]
    parts: list[str] = []
    if kind == "compare":
        chunks = re.split(r"\bvs\.?\b|\bversus\b", bottom, maxsplit=1, flags=re.I)
        left = wrap_words(chunks[0].strip(" ."), 16)
        right = wrap_words((chunks[1] if len(chunks) > 1 else treat).strip(" ."), 16)
        rows = max(len(left), len(right), 2)
        height = 28 + rows * 24 + 24
        parts = [
            f'<rect x="16" y="16" width="188" height="{height - 32}" rx="12" fill="#e7f3f5"/>',
            f'<rect x="216" y="16" width="188" height="{height - 32}" rx="12" fill="#f4f7f8"/>',
        ]
        y = 44
        for line in left:
            parts.append(text_node(28, y, line, 16, "#1a3d4a", 650))
            y += 24
        y = 44
        for line in right:
            parts.append(text_node(228, y, line, 16, "#1a3d4a", 650))
            y += 24
        alt = f"Two-column comparison. {bottom}"
    elif kind == "steps":
        steps = [piece.strip(" .") for piece in re.split(r"\s+(?:then|next)\s+", treat, flags=re.I) if piece.strip()]
        wrapped = [wrap_words(step, 32) for step in steps[:4]]
        title = wrap_words(bottom, 36)[:2]
        parts = [text_node(20, 32, title[0], 18, "#0f2e42", 700)]
        if len(title) > 1:
            parts.append(text_node(20, 54, title[1], 18, "#0f2e42", 700))
            y = 84
        else:
            y = 64
        for index, lines in enumerate(wrapped, start=1):
            parts.append(f'<circle cx="36" cy="{y + 4}" r="14" fill="#0d7f8c"/>')
            parts.append(text_node(31, y + 9, str(index), 15, "#ffffff", 700))
            ly = y
            for line in lines:
                parts.append(text_node(60, ly + 8, line, 16, "#1a3d4a"))
                ly += 22
            if index < len(wrapped):
                parts.append(f'<line x1="36" y1="{y + 20}" x2="36" y2="{ly + 6}" stroke="#0d7f8c" stroke-width="2"/>')
            y = ly + 16
        height = y + 8
        alt = f"Numbered steps. {bottom}"
    elif kind == "threshold":
        title = wrap_words(bottom, 28)
        detail = wrap_words(clue, 40)
        parts = ['<rect x="16" y="16" width="388" height="8" rx="4" fill="#0d7f8c"/>']
        y = 52
        for line in title:
            parts.append(text_node(24, y, line, 20, "#0f2e42", 700))
            y += 28
        y += 6
        for line in detail:
            parts.append(text_node(24, y, line, 16, "#1a3d4a"))
            y += 24
        height = y + 18
        alt = f"Threshold. {bottom}"
    elif kind == "avoid":
        use = wrap_words(treat, 36)
        skip = wrap_words(trap, 36)
        title = wrap_words(bottom, 36)[:2]
        use_h = 36 + 22 * len(use)
        skip_h = 36 + 22 * len(skip)
        parts = [text_node(20, 28, title[0], 18, "#0f2e42", 700)]
        top = 44 if len(title) == 1 else 64
        if len(title) > 1:
            parts.append(text_node(20, 50, title[1], 18, "#0f2e42", 700))
        parts += [
            f'<rect x="16" y="{top}" width="388" height="{use_h}" rx="12" fill="#e7f5ef"/>',
            text_node(32, top + 24, "Do", 15, "#1f6b4a", 700),
        ]
        y = top + 46
        for line in use:
            parts.append(text_node(32, y, line, 16, "#1a3d4a"))
            y += 22
        skip_y = top + use_h + 12
        parts += [
            f'<rect x="16" y="{skip_y}" width="388" height="{skip_h}" rx="12" fill="#fdecec"/>',
            text_node(32, skip_y + 24, "Not this", 15, "#8c3a3a", 700),
        ]
        y = skip_y + 46
        for line in skip:
            parts.append(text_node(32, y, line, 16, "#1a3d4a"))
            y += 22
        height = skip_y + skip_h + 16
        alt = f"Do and do not. {bottom}"
    else:
        title = wrap_words(bottom, 32)
        detail = wrap_words(clue, 40)
        box_h = 20 + 26 * len(title)
        parts = [f'<rect x="16" y="16" width="388" height="{box_h}" rx="12" fill="#0f2e42"/>']
        y = 46
        for line in title:
            parts.append(text_node(32, y, line, 18, "#ffffff", 700))
            y += 26
        y = 16 + box_h + 32
        for line in detail:
            parts.append(text_node(24, y, line, 16, "#1a3d4a"))
            y += 24
        height = y + 16
        parts.insert(0, f'<rect x="0" y="0" width="8" height="{height}" fill="#0d7f8c"/>')
        alt = f"Takeaway. {bottom}"
    ident = card["id"].replace("-", "")
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 {height}" width="420" height="{height}" role="img" aria-labelledby="t{ident}">'
        f'<title id="t{ident}">{xml_escape(bottom)}</title>'
        f'<rect width="420" height="{height}" fill="#ffffff"/>'
        + "".join(parts)
        + "</svg>\n"
    )
    if "<script" in svg.lower():
        raise SystemExit(f"unsafe svg {card['id']}")
    return svg, alt


def write_svgs(folder: Path, cards: list[dict]) -> None:
    svg_dir = folder / "svg"
    svg_dir.mkdir(parents=True, exist_ok=True)
    counts: dict[str, int] = {}
    for card in cards:
        kind = layout_kind(card)
        counts[kind] = counts.get(kind, 0) + 1
        svg, alt = draw_card(card)
        (svg_dir / f"{card['id']}.svg").write_text(svg)
        card["diagram"] = {"file": f"svg/{card['id']}.svg", "alt": alt}
    print(" ", counts)


def main() -> None:
    seen: set[str] = set()
    written: list[tuple[str, list[dict]]] = []
    for folder, prefix, _label, _long, cards in DECKS:
        check(folder, cards, seen)
        payload = [row(prefix, index, card) for index, card in enumerate(cards, start=1)]
        dest = OUT / folder / "cards"
        dest.mkdir(parents=True, exist_ok=True)
        write_svgs(OUT / folder, payload)
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
        "Counts: Step 1 240, Step 2 CK 240, Step 3 240.",
        "Step 1 mechanism cards are cited as First Aid-level consensus for that pathway.",
        "Step 2 CK and Step 3 cards cite the named guideline used for the decision, threshold, or first-line step.",
        "",
    ]
    for title, payload in written:
        lines.extend(review_section(title, payload))
    REVIEW.write_text("\n".join(lines))
    print("review", REVIEW)


if __name__ == "__main__":
    main()
