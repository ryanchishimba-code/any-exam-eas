#!/usr/bin/env python3
"""Replace template feed graphics with clinical diagrams.

NCLEX and FNP plain cards (tables, chips, and cut-off step lists) are redrawn.
NAPLEX plain cards that are the same templates are redrawn too. Hand-drawn
v3 art and illustrated curves stay. The answer sentence is not the title.
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
AMBER = "#9a3412"
CREAM = "#fff6f1"

TEMPLATES = {"Finding table", "Named pieces", "Decision path", "Cutoff axis"}


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip(" ;")


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def too_close(phrase: str, bottom: str) -> bool:
    left, right = norm(phrase), norm(bottom)
    if not left or not right:
        return True
    if left == right or left in right or right in left:
        return True
    lt, rt = set(left.split()), set(right.split())
    return bool(lt) and len(lt & rt) / len(lt) > 0.7


def cap(text: str) -> str:
    text = clean(text)
    if not text:
        return text
    return text[0].upper() + text[1:]


def finish(text: str) -> str:
    text = cap(text)
    if text and text[-1] not in ".!?":
        text += "."
    return text


def wrap(text: str, width: int) -> list[str]:
    words = clean(text).split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if len(trial) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines or [""]


def text_el(x: float, y: float, value: str, size: int, fill: str, weight: int = 500, anchor: str = "start") -> str:
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(value)}</text>'
    )


def multiline(x: float, y: float, lines: list[str], size: int, fill: str, weight: int = 500, anchor: str = "start") -> str:
    spans = []
    for index, line in enumerate(lines):
        dy = 0 if index == 0 else 22
        spans.append(f'<tspan x="{x:.1f}" dy="{dy}">{esc(line)}</tspan>')
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{"".join(spans)}</text>'
    )


def sentences(card: dict) -> list[str]:
    bottom = card.get("bottom") or ""
    found = []
    bullets = card.get("bullets") or {}
    for key in ("clue", "treat", "trap"):
        raw = bullets.get(key) or ""
        if not raw or too_close(raw, bottom):
            continue
        sentence = finish(raw)
        if norm(sentence) not in {norm(item) for item in found}:
            found.append(sentence)
    if len(found) < 2:
        for key in ("clue", "treat", "trap"):
            raw = bullets.get(key) or ""
            if raw and norm(raw) != norm(bottom):
                sentence = finish(raw)
                if norm(sentence) not in {norm(item) for item in found}:
                    found.append(sentence)
    return found[:3]


def blob(card: dict) -> str:
    bullets = card.get("bullets") or {}
    return " ".join(
        [
            card.get("front") or "",
            card.get("bottom") or "",
            bullets.get("clue") or "",
            bullets.get("treat") or "",
            bullets.get("trap") or "",
        ]
    )


def times_of(card: dict) -> list[str]:
    hits = re.findall(
        r"(\d+(?:\s*[–\-]\s*\d+)?)\s*(minutes?|hours?|days?|weeks?|months?|years?)",
        blob(card),
        flags=re.I,
    )
    labels = []
    for number, unit in hits:
        label = f"{number} {unit}"
        if label.lower() not in {item.lower() for item in labels}:
            labels.append(label)
    return labels[:4]


def numbers_of(card: dict) -> list[str]:
    hits = re.findall(
        r"(?<!\d)(\d+(?:\.\d+)?(?:\s*[–\-]\s*\d+(?:\.\d+)?)?)\s*(%|mm\s?Hg|mg(?:/dL)?|mcg|mL|g/dL|units|mmol|mEq)?",
        blob(card),
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


def anatomy_kind(card: dict) -> str | None:
    text = blob(card).lower()
    checks = [
        ("heart", r"heart|myocard|murmur|atrial|ejection fraction|chest pain|stemi|pericard"),
        ("lung", r"asthma|copd|pneumonia|pulmonary|wheez|oxygen|inhaler|lung"),
        ("kidney", r"kidney|ckd|egfr|creatinine|pyelonephritis|nephro"),
        ("eye", r"retina|glaucoma|conjunctiv|vision|cataract|eye exam|dilated"),
        ("ear", r"otitis|hearing|tympanic|ear pain"),
        ("thyroid", r"thyroid|tsh|levothyroxine"),
        ("bone", r"fracture|osteoporosis|dxa|bisphosphonate|bone"),
        ("brain", r"stroke|seizure|migraine|meningitis|headache|neuro"),
    ]
    for kind, pattern in checks:
        if re.search(pattern, text):
            return kind
    return None


def heading_for(card: dict, layout: str) -> str:
    system = clean(card.get("system") or "Clinical")
    names = {
        "branch": "decision flow",
        "timeline": "timeline",
        "threshold": "thresholds",
        "trend": "lab trend",
        "contrast": "two paths",
        "ladder": "ordered steps",
        "cycle": "repeat cycle",
        "anatomy": "schematic",
    }
    heading = f"{system} {names[layout]}"
    if len(heading) > 34:
        heading = names[layout].capitalize()
    return heading


def document(layout: str, heading: str, body: str, height: int) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 {height}" width="420" height="{height}" '
        f'role="img" data-layout="{layout}"><title>{esc(heading)}</title>'
        f'<rect width="420" height="{height}" fill="#ffffff"/>'
        f"{text_el(20, 28, heading, 16, NAVY, 700)}{body}</svg>\n"
    )


def boxed_lines(lines: list[str], x: float, y: float, width: float, fill: str, ink: str) -> tuple[str, float]:
    line_h = 22
    height = 30 + line_h * len(lines)
    parts = [
        f'<rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{height:.1f}" rx="10" fill="{fill}" stroke="{LINE}"/>',
        multiline(x + 12, y + 24, lines, 15, ink),
    ]
    return "".join(parts), height


def draw_branch(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "branch")
    parts = []
    y = 48
    shown = items[:3]
    for index, item in enumerate(shown):
        lines = wrap(item, 32)
        box, height = boxed_lines(lines, 48, y, 352, PAPER, INK)
        parts.append(box)
        parts.append(f'<circle cx="26" cy="{y + height / 2:.1f}" r="12" fill="{TEAL}"/>')
        parts.append(text_el(26, y + height / 2 + 5, str(index + 1), 14, "#ffffff", 700, "middle"))
        y += height + 18
        if index < len(shown) - 1:
            parts.append(f'<line x1="210" y1="{y - 18:.1f}" x2="210" y2="{y - 2:.1f}" stroke="{TEAL}" stroke-width="2"/>')
    return document("branch", heading, "".join(parts), int(y + 8))


def draw_contrast(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "contrast")
    left = items[0]
    right = items[1] if len(items) > 1 else items[0]
    left_lines = wrap(left, 16)
    right_lines = wrap(right, 16)
    rows = max(len(left_lines), len(right_lines))
    col_h = 40 + 22 * rows
    height = 48 + col_h + 16
    parts = [
        f'<rect x="16" y="48" width="188" height="{col_h}" rx="10" fill="#e7f5f3" stroke="{LINE}"/>',
        f'<rect x="216" y="48" width="188" height="{col_h}" rx="10" fill="{CREAM}" stroke="#f0d2c4"/>',
        text_el(28, 70, "Do this", 14, TEAL, 700),
        text_el(228, 70, "Do not", 14, AMBER, 700),
        multiline(28, 96, left_lines, 14, INK),
        multiline(228, 96, right_lines, 14, INK),
    ]
    if len(items) > 2:
        extra = wrap(items[2], 42)
        parts.append(multiline(20, height - 8, extra, 14, INK))
        height = int(height - 8 + 20 * len(extra) + 12)
    return document("contrast", heading, "".join(parts), int(height))


def draw_ladder(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "ladder")
    parts = []
    y = 52
    for index, item in enumerate(items[:3]):
        width = 250 + index * 40
        lines = wrap(f"{index + 1}. {item}", max(16, int((width - 40) / 10)))
        box_h = 32 + 22 * len(lines)
        x = 20
        parts.append(f'<rect x="{x}" y="{y}" width="{min(width, 380)}" height="{box_h}" rx="8" fill="{PAPER}" stroke="{TEAL}"/>')
        parts.append(multiline(x + 12, y + 22, lines, 15, NAVY, 700))
        y += box_h + 12
    return document("ladder", heading, "".join(parts), int(y + 10))


def draw_timeline(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "timeline")
    marks = times_of(card)[:4]
    parts = [f'<line x1="36" y1="78" x2="384" y2="78" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>']
    count = len(marks)
    for index, mark in enumerate(marks):
        x = 78 + index * (264 / max(count - 1, 1))
        parts.append(f'<circle cx="{x:.0f}" cy="78" r="7" fill="{TEAL}"/>')
        parts.append(multiline(x, 102, wrap(mark, 10)[:2], 12, NAVY, 700, "middle"))
    y = 156
    for item in items[:2]:
        lines = wrap(item, 46)
        parts.append(multiline(20, y, lines, 15, INK))
        y += 20 * len(lines) + 8
    return document("timeline", heading, "".join(parts), int(y + 10))


def draw_threshold(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "threshold")
    marks = numbers_of(card)[:4]
    parts = [f'<line x1="28" y1="92" x2="392" y2="92" stroke="{NAVY}" stroke-width="3" stroke-linecap="round"/>']
    count = len(marks)
    for index, mark in enumerate(marks):
        x = 78 + index * (264 / max(count - 1, 1))
        parts.append(f'<line x1="{x:.0f}" y1="82" x2="{x:.0f}" y2="102" stroke="{TEAL}" stroke-width="3"/>')
        parts.append(multiline(x, 122, wrap(mark, 10)[:2], 12, NAVY, 700, "middle"))
    caption = next((item for item in items if not re.search(r"\d", item)), items[0])
    lines = wrap(caption, 46)
    parts.append(multiline(20, 168, lines, 15, INK))
    return document("threshold", heading, "".join(parts), int(168 + 22 * len(lines) + 16))


def draw_trend(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "trend")
    marks = numbers_of(card)[:4]
    parts = [
        f'<line x1="48" y1="150" x2="360" y2="150" stroke="{LINE}" stroke-width="2"/>',
        f'<line x1="48" y1="56" x2="48" y2="150" stroke="{LINE}" stroke-width="2"/>',
    ]
    points = []
    count = len(marks)
    for index, mark in enumerate(marks):
        x = 86 + index * (240 / max(count - 1, 1))
        y = 130 - index * (60 / max(count - 1, 1))
        points.append((x, y))
        parts.append(text_el(x, y - 12, wrap(mark, 12)[0], 12, NAVY, 700, "middle"))
        parts.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="5" fill="{TEAL}"/>')
    if len(points) >= 2:
        path = " ".join(f"{'M' if i == 0 else 'L'} {x:.0f} {y:.0f}" for i, (x, y) in enumerate(points))
        parts.append(f'<path d="{path}" fill="none" stroke="{TEAL}" stroke-width="2.5"/>')
    lines = wrap(items[0], 46)
    parts.append(multiline(20, 176, lines, 15, INK))
    return document("trend", heading, "".join(parts), int(176 + 20 * len(lines) + 16))


def draw_cycle(card: dict, items: list[str]) -> str:
    heading = heading_for(card, "cycle")
    shown = items[:3]
    blocks = [wrap(item, 42) for item in shown]
    parts = [
        f'<circle cx="210" cy="86" r="26" fill="none" stroke="{TEAL}" stroke-width="3"/>',
        text_el(210, 90, "Repeat", 13, TEAL, 700, "middle"),
    ]
    y = 132
    for lines in blocks:
        parts.append(multiline(24, y, lines, 15, INK))
        y += 20 * len(lines) + 10
    return document("cycle", heading, "".join(parts), int(y + 12))


def organ_shape(kind: str) -> str:
    if kind == "heart":
        return (
            f'<path d="M70 78 C70 58 96 50 110 68 C124 50 150 58 150 78 C150 108 110 140 110 140 C110 140 70 108 70 78 Z" '
            f'fill="#f8e8e6" stroke="#9a3412" stroke-width="2"/>'
        )
    if kind == "lung":
        return (
            f'<ellipse cx="88" cy="110" rx="28" ry="48" fill="#e7f2fb" stroke="#1d4e89" stroke-width="2"/>'
            f'<ellipse cx="132" cy="110" rx="28" ry="48" fill="#e7f2fb" stroke="#1d4e89" stroke-width="2"/>'
        )
    if kind == "kidney":
        return (
            f'<path d="M80 70 C120 60 150 90 140 130 C130 160 90 160 80 130 C70 110 60 90 80 70 Z" '
            f'fill="#fde8d8" stroke="#9a3412" stroke-width="2"/>'
        )
    if kind == "eye":
        return (
            f'<ellipse cx="110" cy="110" rx="52" ry="28" fill="#f4f8f8" stroke="{NAVY}" stroke-width="2"/>'
            f'<circle cx="110" cy="110" r="14" fill="{TEAL}"/>'
            f'<circle cx="110" cy="110" r="6" fill="{NAVY}"/>'
        )
    if kind == "ear":
        return (
            f'<path d="M120 60 C90 60 70 90 78 120 C84 146 110 160 120 140 C128 124 112 120 112 100 C112 84 128 80 120 60 Z" '
            f'fill="#f4f8f8" stroke="{NAVY}" stroke-width="2"/>'
        )
    if kind == "thyroid":
        return (
            f'<ellipse cx="92" cy="110" rx="22" ry="36" fill="#fde8d8" stroke="#9a3412" stroke-width="2"/>'
            f'<ellipse cx="132" cy="110" rx="22" ry="36" fill="#fde8d8" stroke="#9a3412" stroke-width="2"/>'
        )
    if kind == "bone":
        return (
            f'<rect x="96" y="62" width="28" height="100" rx="14" fill="#f4f1ea" stroke="{NAVY}" stroke-width="2"/>'
            f'<circle cx="110" cy="62" r="16" fill="#f4f1ea" stroke="{NAVY}" stroke-width="2"/>'
            f'<circle cx="110" cy="162" r="16" fill="#f4f1ea" stroke="{NAVY}" stroke-width="2"/>'
        )
    return (
        f'<ellipse cx="110" cy="108" rx="46" ry="36" fill="#efe8f6" stroke="#5b3a78" stroke-width="2"/>'
    )


def draw_anatomy(card: dict, items: list[str], kind: str) -> str:
    heading = heading_for(card, "anatomy")
    parts = [organ_shape(kind)]
    y = 48
    for item in items[:3]:
        lines = wrap(item, 24)
        box, height = boxed_lines(lines, 176, y, 224, PAPER, INK)
        parts.append(box)
        y += height + 10
    return document("anatomy", heading, "".join(parts), int(max(y + 12, 220)))


def eligible(card: dict, items: list[str]) -> list[str]:
    options = ["branch", "ladder"]
    if len(items) >= 2:
        options.append("contrast")
    if len(times_of(card)) >= 2:
        options.append("timeline")
    if len(numbers_of(card)) >= 2:
        options.extend(["threshold", "trend"])
    if re.search(r"\b(every|annual|repeat|rescreen|follow[- ]up)\b", blob(card), re.I):
        options.append("cycle")
    if anatomy_kind(card):
        options.append("anatomy")
    return options


def draw(card: dict, layout: str) -> str:
    items = sentences(card)
    if not items:
        items = [finish(card.get("front") or "Review the finding before you act")]
    if layout == "contrast" and len(items) >= 2:
        return draw_contrast(card, items)
    if layout == "ladder":
        return draw_ladder(card, items)
    if layout == "timeline" and len(times_of(card)) >= 2:
        return draw_timeline(card, items)
    if layout == "threshold" and len(numbers_of(card)) >= 2:
        return draw_threshold(card, items)
    if layout == "trend" and len(numbers_of(card)) >= 2:
        return draw_trend(card, items)
    if layout == "cycle":
        return draw_cycle(card, items)
    kind = anatomy_kind(card)
    if layout == "anatomy" and kind:
        return draw_anatomy(card, items, kind)
    return draw_branch(card, items)


def choose(card: dict, counts: dict[str, int]) -> str:
    options = eligible(card, sentences(card))
    ranked = sorted(options, key=lambda name: (counts.get(name, 0), hash(card["id"] + name) % 1000))
    return ranked[0]


def load_cards() -> list[tuple[Path, list]]:
    found = []
    for exam in ("nclex", "naplex", "fnp", "pance"):
        folder = ROOT / "content" / f"{exam}-feed" / "cards"
        for path in sorted(folder.glob("*.json")):
            data = json.loads(path.read_text())
            if isinstance(data, list):
                found.append((path, data))
    return found


def write_json(path: Path, data: list) -> None:
    raw = path.read_text() if path.exists() else ""
    indent = 1 if raw.startswith("[\n {") else 2
    path.write_text(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")


def title_of(svg: str) -> str:
    match = re.search(r"<title[^>]*>([^<]*)</title>", svg)
    return match.group(1) if match else ""


def should_redraw(exam: str, svg: str) -> bool:
    if 'class="v3"' in svg:
        return False
    if exam in {"nclex", "fnp"}:
        return True
    if exam == "naplex":
        if "linearGradient" in svg:
            return False
        if "data-layout=" in svg:
            return True
        return title_of(svg) in TEMPLATES or svg.count("<text") < 14
    return False


def patch_kept(svg: str) -> str:
    if ">  Who</tspan>" in svg:
        replacement = ">  Who interprets</tspan>" if "interpreter" in svg.lower() or "English" in svg else ">  Who decides</tspan>"
        svg = svg.replace(">  Who</tspan>", replacement, 1)
    svg = svg.replace(">CT if<", ">Head CT<")
    replacements = {
        'x="171.0" y="268.0" font-size="12"': 'x="171.0" y="268.0" font-size="10"',
        'x="32.0" y="326.0" font-size="12"': 'x="32.0" y="326.0" font-size="10"',
        'x="171.0" y="326.0" font-size="12"': 'x="171.0" y="326.0" font-size="10"',
        'x="60.0" y="292.5" font-size="12"': 'x="60.0" y="292.5" font-size="10"',
        'x="159.0" y="292.5" font-size="12"': 'x="159.0" y="292.5" font-size="10"',
        'x="114.0" y="175.5" font-size="12"': 'x="114.0" y="175.5" font-size="11"',
    }
    for old, new in replacements.items():
        svg = svg.replace(old, new)
    svg = svg.replace(
        "IV labetalol, IV hydralazine or oral",
        "IV labetalol, hydralazine,",
    )
    return svg


def main() -> None:
    counts: dict[str, dict[str, int]] = {}
    redrawn = 0
    for path, cards in load_cards():
        exam = path.parts[-3].split("-feed")[0]
        dirty = False
        for card in cards:
            svg_path = ROOT / "content" / f"{exam}-feed" / "svg" / f"{card['id']}.svg"
            if not svg_path.exists():
                continue
            existing = svg_path.read_text()
            if not should_redraw(exam, existing):
                patched = patch_kept(existing)
                if patched != existing:
                    svg_path.write_text(patched)
                    dirty = True
                continue
            board_counts = counts.setdefault(exam, {})
            layout = choose(card, board_counts)
            svg = draw(card, layout)
            used = re.search(r'data-layout="([^"]+)"', svg)
            layout_name = used.group(1) if used else layout
            svg_path.write_text(svg)
            card["diagram"] = {"file": f"svg/{card['id']}.svg", "alt": f"{layout_name} diagram for {card['id']}"}
            board_counts[layout_name] = board_counts.get(layout_name, 0) + 1
            redrawn += 1
            dirty = True
        if dirty:
            write_json(path, cards)
    print("redrawn", redrawn)
    for exam, layout_counts in counts.items():
        print(exam, dict(sorted(layout_counts.items())))


if __name__ == "__main__":
    main()
