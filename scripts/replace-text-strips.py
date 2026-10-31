#!/usr/bin/env python3
"""Replace answer-strip SVGs with card-specific diagrams, or remove the image.

A strip is the plain heading-plus-lines layout. The new graphic uses the clue,
the action, and the trap. It does not paste the answer sentence as a title.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"
NAVY = "#0f2e42"
TEAL = "#0d7f8c"
INK = "#1a3d4a"
PAPER = "#f4f8f8"
LINE = "#d5e2e4"

AGE_RULES = [
    (r"\bnewborns?\b|\bneonat", "Newborn"),
    (r"\binfants?\b", "Infant"),
    (r"\btoddlers?\b", "Toddler"),
    (r"\badolescents?\b|\bteenagers?\b|\bteens?\b", "Adolescent"),
    (r"\b(child|children|school-age)\b", "Child"),
    (r"\bolder adults?\b|\bgeriatric\b|\bage\s*65\b|\b65\s*(?:years|or older|\+)", "Older adult"),
    (r"\byoung adults?\b", "Young adult"),
    (r"\bmiddle adults?\b", "Middle adult"),
    (r"\bpregnan|\bprenatal\b|\bpostpartum\b", "Young adult"),
]


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip(" .;")


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def too_close(phrase: str, bottom: str) -> bool:
    left, right = norm(phrase), norm(bottom)
    if not left or not right:
        return True
    if left == right or left in right or right in left:
        return True
    lt, rt = set(left.split()), set(right.split())
    if not lt:
        return True
    return len(lt & rt) / len(lt) > 0.7


def cap(text: str) -> str:
    text = clean(text)
    if not text:
        return text
    return text[0].upper() + text[1:]


def wrap(text: str, width: int, limit: int) -> list[str]:
    words = clean(text).split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if len(trial) <= width:
            cur = trial
            continue
        if cur:
            lines.append(cur)
        cur = word
        if len(lines) >= limit:
            return lines
    if cur and len(lines) < limit:
        lines.append(cur)
    return lines


def phrases(card: dict) -> list[str]:
    bottom = card["bottom"]
    raw = []
    for key in ("clue", "treat", "trap"):
        for part in re.split(r";|\.\s+|,\s+(?=[A-Z])", card["bullets"][key]):
            part = cap(part)
            if 10 <= len(part) <= 78 and not too_close(part, bottom):
                raw.append(part)
    seen = []
    for item in raw:
        if norm(item) not in {norm(s) for s in seen}:
            seen.append(item)
    return seen[:4]


def chips_of(card: dict) -> list[str]:
    bottom = card["bottom"]
    found = []
    for key in ("clue", "treat"):
        if "," not in card["bullets"][key]:
            continue
        for part in card["bullets"][key].split(","):
            part = cap(part)
            if 3 <= len(part) <= 28 and not too_close(part, bottom):
                found.append(part)
    seen = []
    for item in found:
        if norm(item) not in {norm(s) for s in seen}:
            seen.append(item)
    return seen[:6]


def numbers_of(card: dict) -> list[str]:
    blob = f"{card['bullets']['clue']} {card['bullets']['treat']}"
    hits = re.findall(
        r"(?<!\d)(\d+(?:\.\d+)?(?:\s*[–\-]\s*\d+(?:\.\d+)?)?)\s*(%|mm\s?Hg|mg|mcg|g|mL|years|days|hours|units|th)?",
        blob,
    )
    labels = []
    for number, unit in hits:
        if re.fullmatch(r"(?:19|20)\d{2}", number):
            continue
        if not unit and "–" not in number and "-" not in number:
            continue
        label = f"{number} {unit}".strip() if unit else number
        if label not in labels:
            labels.append(label)
    return labels[:4]


def is_generated(svg: str) -> bool:
    return any(title in svg for title in ("Decision path", "Finding table", "Cutoff axis", "Named pieces"))


def is_answer_strip(svg: str) -> bool:
    if 'width="420"' not in svg:
        return False
    if "Not this" in svg or "<circle" in svg or 'width="188"' in svg:
        return False
    if 'height="8"' in svg and 'width="388"' in svg and "#f4f7f8" not in svg and 'width="8" height=' not in svg:
        return False
    return "#f4f7f8" in svg or 'width="8" height=' in svg or ('#0f2e42' in svg and "<circle" not in svg)


def text_el(x, y, value, size, fill, weight=500, anchor="start") -> str:
    return (
        f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
        f'fill="{fill}" text-anchor="{anchor}">{esc(value)}</text>'
    )


def document(title: str, body: str, height: int) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 {height}" width="420" height="{height}" role="img">'
        f"<title>{esc(title)}</title><rect width=\"420\" height=\"{height}\" fill=\"#ffffff\"/>{body}</svg>\n"
    )


def draw_flow(items: list[str]) -> str:
    parts = [f'<rect x="0" y="0" width="420" height="36" fill="{NAVY}"/>', text_el(20, 24, "Decision path", 16, "#ffffff", 700)]
    y = 52
    shown = items[:3]
    for index, item in enumerate(shown):
        lines = wrap(item, 30, 2)
        box_h = 28 + 22 * len(lines)
        parts.append(f'<rect x="48" y="{y}" width="340" height="{box_h}" rx="10" fill="{PAPER}" stroke="{LINE}"/>')
        parts.append(f'<circle cx="28" cy="{y + box_h/2}" r="12" fill="{TEAL}"/>')
        parts.append(text_el(28, y + box_h/2 + 5, str(index + 1), 15, "#ffffff", 700, "middle"))
        ly = y + 24
        for line in lines:
            parts.append(text_el(64, ly, line, 16, INK))
            ly += 22
        y += box_h + 16
        if index < len(shown) - 1:
            parts.append(f'<line x1="210" y1="{y - 16}" x2="210" y2="{y - 2}" stroke="{TEAL}" stroke-width="2"/>')
    return document("Decision path", "".join(parts), int(y + 8))


def draw_table(rows: list[tuple[str, str]]) -> str:
    parts = [f'<rect x="16" y="16" width="388" height="36" rx="8" fill="{NAVY}"/>']
    parts.append(text_el(32, 40, "Finding", 16, "#ffffff", 700))
    parts.append(text_el(168, 40, "Use it this way", 16, "#ffffff", 700))
    y = 52
    for index, (label, detail) in enumerate(rows[:3]):
        lines = wrap(detail, 24, 2)
        row_h = 20 + 22 * len(lines)
        fill = "#ffffff" if index % 2 == 0 else PAPER
        parts.append(f'<rect x="16" y="{y}" width="388" height="{row_h}" fill="{fill}" stroke="{LINE}"/>')
        parts.append(text_el(28, y + 24, wrap(label, 14, 1)[0], 15, TEAL, 700))
        ly = y + 24
        for line in lines:
            parts.append(text_el(168, ly, line, 16, INK))
            ly += 22
        y += row_h
    return document("Finding table", "".join(parts), int(y + 16))


def draw_axis(labels: list[str], caption: str) -> str:
    parts = [text_el(20, 32, "Where the cutoffs sit", 16, NAVY, 700)]
    parts.append(f'<line x1="36" y1="92" x2="384" y2="92" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>')
    count = len(labels[:4])
    for index, label in enumerate(labels[:4]):
        x = 70 + index * (280 / max(count - 1, 1))
        parts.append(f'<line x1="{x:.0f}" y1="82" x2="{x:.0f}" y2="102" stroke="{TEAL}" stroke-width="3"/>')
        parts.append(text_el(x, 126, wrap(label, 8, 1)[0], 15, INK, 700, "middle"))
    cap_lines = wrap(caption, 40, 2)
    y = 156
    for line in cap_lines:
        parts.append(text_el(20, y, line, 16, INK))
        y += 22
    return document("Cutoff axis", "".join(parts), int(y + 12))


def draw_chips(items: list[str]) -> str:
    parts = [text_el(20, 32, "Name the pieces", 16, NAVY, 700)]
    x, y = 20, 52
    row_h = 40
    for item in items[:6]:
        label = wrap(item, 16, 1)[0]
        width = max(96, 24 + int(len(label) * 16 * 0.62))
        if x + width > 400:
            x = 20
            y += row_h + 10
        parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{row_h}" rx="20" fill="{PAPER}" stroke="{TEAL}"/>')
        parts.append(text_el(x + width / 2, y + 26, label, 15, NAVY, 700, "middle"))
        x += width + 10
    return document("Named pieces", "".join(parts), int(y + row_h + 20))


def choose_drawing(card: dict) -> tuple[str, str] | None:
    items = phrases(card)
    chips = chips_of(card)
    nums = numbers_of(card)
    caption = next((item for item in items if not re.search(r"\d", item)), items[0] if items else "")
    if len(nums) >= 2 and caption:
        return "axis", draw_axis(nums, caption)
    if len(chips) >= 3:
        return "chips", draw_chips(chips)
    if len(items) >= 2:
        # Alternate table and flow so neighboring cards do not share one chrome.
        if int(card["id"].rsplit("-", 1)[-1]) % 2 == 0:
            rows = [("Clue", items[0]), ("Action", items[1])]
            if len(items) > 2:
                rows.append(("Avoid", items[2]))
            return "table", draw_table(rows)
        return "flow", draw_flow(items[:3])
    return None


def load_files(exam: str) -> list[tuple[Path, list]]:
    folder = ROOT / "content" / f"{exam}-feed" / "cards"
    found = []
    for path in sorted(folder.glob("*.json")):
        data = json.loads(path.read_text())
        if isinstance(data, list):
            found.append((path, data))
    return found


def write_json(path: Path, data: list) -> None:
    raw = path.read_text() if path.exists() else ""
    indent = 1 if raw.startswith("[\n {") else 2
    path.write_text(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")


def explicit_age(card: dict) -> str | None:
    front = card.get("front") or ""
    years = re.findall(r"\b(\d{1,3})-year-old\b", front, flags=re.I)
    if years:
        age = int(years[0])
        if age <= 2:
            return "Toddler" if age >= 1 else "Infant"
        if age <= 11:
            return "Child"
        if age <= 17:
            return "Adolescent"
        if age <= 39:
            return "Young adult"
        if age <= 64:
            return "Middle adult"
        return "Older adult"
    blob = " ".join([front, card.get("bottom") or "", card["bullets"]["clue"], card["bullets"]["treat"]])
    for pattern, label in AGE_RULES:
        if re.search(pattern, blob, re.I):
            return label
    return None


def replace_exam(exam: str) -> dict[str, int]:
    counts = {"diagram": 0, "removed": 0, "kept": 0}
    layout_counts: dict[str, int] = {}
    for path, cards in load_files(exam):
        for card in cards:
            svg_path = ROOT / "content" / f"{exam}-feed" / "svg" / f"{card['id']}.svg"
            if not svg_path.exists():
                card["diagram"] = None
                counts["removed"] += 1
                continue
            existing = svg_path.read_text()
            if not is_answer_strip(existing) and not is_generated(existing):
                counts["kept"] += 1
                continue
            drawn = choose_drawing(card)
            if drawn is None:
                svg_path.unlink(missing_ok=True)
                card["diagram"] = None
                counts["removed"] += 1
                continue
            kind, svg = drawn
            svg_path.write_text(svg)
            card["diagram"] = {"file": f"svg/{card['id']}.svg", "alt": f"{kind} diagram for {card['id']}"}
            counts["diagram"] += 1
            layout_counts[kind] = layout_counts.get(kind, 0) + 1
        if exam == "fnp":
            for card in cards:
                age = explicit_age(card)
                if age:
                    card["age_band"] = age
                else:
                    card.pop("age_band", None)
        write_json(path, cards)
    counts["layouts"] = layout_counts  # type: ignore
    return counts


def fix_known_defects() -> None:
    for path in (ROOT / "content" / "pance-feed" / "svg").glob("*.svg"):
        text = path.read_text()
        if '<g class="q">' in text:
            path.write_text(text.replace('<g class="q">', '<g class="q" display="none">'))
    serotonin = ROOT / "content" / "nclex-feed" / "svg" / "nclex-140.svg"
    original = serotonin.read_text()
    serotonin.write_text(original.replace(">teach early warning signs", ">Teach early warning signs"))


def main() -> None:
    for exam in ("fnp", "nclex", "naplex"):
        result = replace_exam(exam)
        print(exam, {k: v for k, v in result.items() if k != "layouts"}, result["layouts"])
    fix_known_defects()
    print("defects patched")


if __name__ == "__main__":
    main()
