#!/usr/bin/env python3
"""Card-specific feed visuals for NCLEX, NAPLEX, and FNP.

Keeps the hand-drawn NCLEX and NAPLEX diagrams that already exist.
Cards with a sequence, a threshold, a contrast, or a clear do/don't get that
structure. Everything else gets a typographic answer card, not a shared
clue/treat/trap flowchart.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FONT = "Helvetica Neue, Helvetica, Arial, sans-serif"
NAVY = "#0f2e42"
TEAL = "#0d7f8c"
INK = "#1a3d4a"
MUTED = "#4a6a7b"
PAPER = "#f4f7f8"
ROSE = "#8c3a3a"
GREEN = "#1f6b4a"

AGE_RULES = [
    (r"\bnewborns?\b|\bneonat", "Newborn"),
    (r"\binfants?\b", "Infant"),
    (r"\btoddlers?\b", "Toddler"),
    (r"\badolescents?\b|\bteenagers?\b|\bteens?\b", "Adolescent"),
    (r"\byoung adults?\b", "Young adult"),
    (r"\bmiddle adults?\b", "Middle adult"),
    (r"\b(child|children|pediatric)\b", "Child"),
    (r"\bolder adults?\b|\bgeriatric\b|\b(?:age )?\s*65\b", "Older adult"),
]


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def wrap(text: str, width: int, limit: int = 4) -> list[str]:
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
        if len(lines) == limit:
            break
    if cur and len(lines) < limit:
        lines.append(cur)
    if len(lines) == limit and words:
        joined = " ".join(lines)
        if len(joined) < len(clean(text)) and not lines[-1].endswith("."):
            lines[-1] = lines[-1].rstrip(".,;") 
    return lines


def steps_of(treat: str) -> list[str]:
    if not re.search(r"\b(?:then|next)\b", treat, re.I):
        return []
    parts = re.split(r"\s+(?:then|next)\s+", treat, flags=re.I)
    out = []
    for part in parts:
        part = clean(part).strip(".")
        if 8 <= len(part) <= 72:
            out.append(part)
    return out[:3]


def choose(card: dict) -> str:
    bottom = card["bottom"]
    treat = card["bullets"]["treat"]
    trap = card["bullets"]["trap"]
    blob = f"{bottom} {treat}"
    if re.search(r"\bvs\.?\b|\bversus\b", blob, re.I):
        return "compare"
    if re.search(r"[<>≤≥]|\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL|mm ?Hg|%|hours?|days?|weeks?|units?|mEq)\b", bottom, re.I):
        return "threshold"
    if len(steps_of(treat)) >= 2:
        return "steps"
    if re.search(r"\b(never|do not|don't|avoid|not a|instead)\b", trap, re.I):
        return "avoid"
    return "answer"


def text(x: float, y: float, value: str, size: int, fill: str, weight: int = 500, anchor: str = "start") -> str:
    return (
        f'<text x="{x:.0f}" y="{y:.0f}" font-family="{FONT}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{esc(value)}</text>'
    )


def document(card: dict, body: str, height: int) -> str:
    title = clean(card["bottom"])[:180]
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 {height}" width="420" height="{height}" '
        f'role="img" aria-labelledby="t{card["id"].replace("-", "")}">'
        f'<title id="t{card["id"].replace("-", "")}">{esc(title)}</title>'
        f'<rect width="420" height="{height}" fill="#ffffff"/>'
        f"{body}</svg>\n"
    )


def draw_answer(card: dict) -> str:
    variant = int(hashlib.sha1(card["id"].encode()).hexdigest(), 16) % 3
    headline = wrap(card["bottom"], 32, 3)
    support = wrap(card["bullets"]["clue"], 36, 2)
    y = 28
    parts = []
    if variant == 0:
        parts.append(f'<rect x="0" y="0" width="8" height="999" fill="{TEAL}"/>')
        x = 28
    elif variant == 1:
        parts.append(f'<rect x="16" y="16" width="388" height="{36 + 26 * len(headline)}" rx="12" fill="{NAVY}"/>')
        x = 32
        y = 48
        for line in headline:
            parts.append(text(x, y, line, 18, "#ffffff", 700))
            y += 26
        y += 28
        for line in support:
            parts.append(text(28, y, line, 16, INK))
            y += 24
        return document(card, "".join(parts), int(y + 16))
    else:
        parts.append(f'<rect x="16" y="16" width="388" height="999" rx="14" fill="{PAPER}"/>')
        x = 32
        y = 48
    for line in headline:
        parts.append(text(x, y, line, 18, NAVY, 700))
        y += 26
    y += 8
    for line in support:
        parts.append(text(x, y, line, 16, INK))
        y += 24
    height = max(y + 20, 140)
    if variant == 0:
        parts[0] = f'<rect x="0" y="0" width="8" height="{height}" fill="{TEAL}"/>'
    else:
        parts[0] = f'<rect x="16" y="16" width="388" height="{height - 32}" rx="14" fill="{PAPER}"/>'
    return document(card, "".join(parts), height)


def draw_steps(card: dict) -> str:
    items = [wrap(step, 34, 2) for step in steps_of(card["bullets"]["treat"])]
    parts = [text(20, 32, wrap(card["bottom"], 34, 2)[0], 18, NAVY, 700)]
    y = 64
    for index, lines in enumerate(items, start=1):
        parts.append(f'<circle cx="36" cy="{y + 4}" r="14" fill="{TEAL}"/>')
        parts.append(text(36, y + 9, str(index), 15, "#ffffff", 700, "middle"))
        ly = y
        for line in lines:
            parts.append(text(60, ly + 8, line, 16, INK))
            ly += 22
        if index < len(items):
            parts.append(f'<line x1="36" y1="{y + 20}" x2="36" y2="{ly + 6}" stroke="{TEAL}" stroke-width="2"/>')
        y = ly + 16
    return document(card, "".join(parts), int(y + 8))


def draw_threshold(card: dict) -> str:
    headline = wrap(card["bottom"], 28, 3)
    detail = wrap(card["bullets"]["clue"], 36, 2)
    parts = [f'<rect x="16" y="16" width="388" height="8" rx="4" fill="{TEAL}"/>']
    y = 52
    for line in headline:
        parts.append(text(24, y, line, 20, NAVY, 700))
        y += 28
    y += 6
    for line in detail:
        parts.append(text(24, y, line, 16, INK))
        y += 24
    return document(card, "".join(parts), int(y + 18))


def draw_avoid(card: dict) -> str:
    use = wrap(card["bullets"]["treat"], 34, 3)
    skip = wrap(card["bullets"]["trap"], 34, 3)
    use_h = 36 + 22 * len(use)
    skip_h = 36 + 22 * len(skip)
    parts = [
        text(20, 28, wrap(card["bottom"], 36, 1)[0], 18, NAVY, 700),
        f'<rect x="16" y="44" width="388" height="{use_h}" rx="12" fill="#e7f5ef"/>',
        text(32, 68, "Do", 15, GREEN, 700),
    ]
    y = 90
    for line in use:
        parts.append(text(32, y, line, 16, INK))
        y += 22
    skip_y = 44 + use_h + 12
    parts.append(f'<rect x="16" y="{skip_y}" width="388" height="{skip_h}" rx="12" fill="#fdecec"/>')
    parts.append(text(32, skip_y + 24, "Not this", 15, ROSE, 700))
    y = skip_y + 46
    for line in skip:
        parts.append(text(32, y, line, 16, INK))
        y += 22
    return document(card, "".join(parts), int(skip_y + skip_h + 16))


def draw_compare(card: dict) -> str:
    chunks = re.split(r"\bvs\.?\b|\bversus\b", f"{card['bottom']}. {card['bullets']['treat']}", maxsplit=1, flags=re.I)
    left_src = clean(chunks[0])
    right_src = clean(chunks[1]) if len(chunks) > 1 else clean(card["bullets"]["trap"])
    left = wrap(left_src, 20, 4)
    right = wrap(right_src, 20, 4)
    rows = max(len(left), len(right), 2)
    height = 36 + rows * 24 + 28
    parts = [
        f'<rect x="16" y="16" width="188" height="{height - 32}" rx="12" fill="#e7f3f5"/>',
        f'<rect x="216" y="16" width="188" height="{height - 32}" rx="12" fill="{PAPER}"/>',
    ]
    y = 44
    for line in left:
        parts.append(text(28, y, line, 15, INK))
        y += 22
    y = 44
    for line in right:
        parts.append(text(228, y, line, 15, INK))
        y += 22
    return document(card, "".join(parts), height)


DRAW = {
    "answer": draw_answer,
    "steps": draw_steps,
    "threshold": draw_threshold,
    "avoid": draw_avoid,
    "compare": draw_compare,
}


def alt_for(card: dict, kind: str) -> str:
    answer = clean(card["bottom"])
    if kind == "answer":
        return f"Text card. {answer}"
    if kind == "steps":
        return f"Steps. {answer}"
    if kind == "threshold":
        return f"Threshold. {answer}"
    if kind == "avoid":
        return f"Do and do not. {answer}"
    return f"Contrast. {answer}"


def load_cards(folder: Path) -> list[tuple[Path, list]]:
    found = []
    for path in sorted(folder.glob("*.json")):
        data = json.loads(path.read_text())
        if isinstance(data, list):
            found.append((path, data))
    return found


def explicit_age(card: dict) -> str | None:
    front = card.get("front") or ""
    years = re.findall(r"\b(\d{1,3})-year-old\b", front, flags=re.I)
    if years:
        age = int(years[0])
        if age < 1:
            return "Infant"
        if age <= 2:
            return "Toddler"
        if age <= 11:
            return "Child"
        if age <= 17:
            return "Adolescent"
        if age <= 39:
            return "Young adult"
        if age <= 64:
            return "Middle adult"
        return "Older adult"
    blob = " ".join(
        [
            front,
            card.get("bottom") or "",
            card.get("bullets", {}).get("clue") or "",
            card.get("bullets", {}).get("treat") or "",
        ]
    )
    for pattern, label in AGE_RULES:
        if re.search(pattern, blob, re.I):
            return label
    return None


def naplex_subarea(card: dict) -> str:
    blob = " ".join(
        [
            str(card.get("topic") or ""),
            card.get("front") or "",
            card.get("bottom") or "",
            card["bullets"]["clue"],
            card["bullets"]["treat"],
            card["bullets"]["trap"],
        ]
    ).lower()
    if re.search(r"overdose|toxicolog|antidote|\bnaloxone\b|ingestion|activated charcoal", blob):
        return "NAPLEX 3C6 Overdose"
    if re.search(r"adheren|missed doses|nonadheren", blob):
        return "NAPLEX 3C7 Adherence"
    if re.search(r"cardiotoxicity|nephrotoxicity|adverse effect|side effect", blob):
        return "NAPLEX 3C5 Adverse effects"
    if re.search(r"\binteraction\b|\bcyp3a|\bdrug-food\b", blob):
        return "NAPLEX 3C3 Interactions"
    if re.search(r"duplicat|unnecessary therapy|omission|extra dose", blob):
        return "NAPLEX 3C4 Errors and omissions"
    families = [
        (r"hypertens|heart failure|\bhf\b|statin|ascvd|dyslipid|\bacs\b|dapt|atrial fib|\baf\b|\bvte\b|acls|pad\b|anticoagul", "Cardiovascular"),
        (r"asthma|copd", "Respiratory"),
        (r"pneumonia|\bcap\b|\bhap\b|cystitis|c\.?\s*diff|ssti|meningit|\bsti\b|\bhiv\b|sepsis|pseudomon|spectrum|hepatitis c", "Infectious disease"),
        (r"h\.?\s*pylori|\bibd\b|cirrhosis", "Gastrointestinal"),
        (r"diabetes|\bt2d\b|\bdka\b|thyroid|pregnan|contracept", "Endocrine and reproductive"),
        (r"\bckd\b|renal", "Renal"),
        (r"osteoarthritis|bipolar|anxiety|adhd|alcohol|seizure|epilep|migraine|stroke", "Neurology and psychiatry"),
    ]
    for pattern, label in families:
        if re.search(pattern, blob):
            return f"NAPLEX 3C2 {label}"
    return "NAPLEX 3C2 Therapy choice"


def write_json(path: Path, data: list) -> None:
    raw = path.read_text()
    indent = 1 if raw.startswith("[\n {") else 2
    path.write_text(json.dumps(data, indent=indent, ensure_ascii=False) + "\n")


def build(exam: str, keep_existing: bool) -> None:
    folder = ROOT / "content" / f"{exam}-feed"
    svg_dir = folder / "svg"
    svg_dir.mkdir(exist_ok=True)
    counts: dict[str, int] = {}
    written = 0
    for path, cards in load_cards(folder / "cards"):
        for card in cards:
            svg_path = svg_dir / f"{card['id']}.svg"
            if keep_existing and svg_path.exists():
                continue
            kind = choose(card)
            counts[kind] = counts.get(kind, 0) + 1
            svg_path.write_text(DRAW[kind](card))
            card["diagram"] = {"file": f"svg/{card['id']}.svg", "alt": alt_for(card, kind)}
            written += 1
        if exam == "fnp":
            for card in cards:
                if card["id"] == "fnp-020":
                    card["front"] = "A healthy 45-year-old has never had a hepatitis C test. Who is screened?"
                    card["bottom"] = "All adults 18–79, at least once."
                    card["age_band"] = "Middle adult"
                elif card["id"] == "fnp-024":
                    card["front"] = "Syphilis testing is already on the first prenatal panel. Which other adults are tested?"
                    card["bottom"] = "Adults and adolescents at increased risk."
                    card.pop("age_band", None)
                else:
                    age = explicit_age(card)
                    if age:
                        card["age_band"] = age
                    else:
                        card.pop("age_band", None)
                if card["id"] in ("fnp-020", "fnp-024"):
                    kind = choose(card)
                    (svg_dir / f"{card['id']}.svg").write_text(DRAW[kind](card))
                    card["diagram"] = {"file": f"svg/{card['id']}.svg", "alt": alt_for(card, kind)}
        if exam == "naplex":
            for card in cards:
                if str(card.get("task_area") or "").startswith("NAPLEX 3C"):
                    card["task_area"] = naplex_subarea(card)
        write_json(path, cards)
    print(exam, "wrote", written, counts)


def audit() -> None:
    problems = []
    for exam in ("nclex", "naplex", "fnp"):
        svg_dir = ROOT / "content" / f"{exam}-feed" / "svg"
        seen = {}
        for path in sorted(svg_dir.glob("*.svg")):
            text_body = path.read_text()
            if "<script" in text_body or "font-size=\"1" in text_body and 'font-size="1"' in text_body:
                pass
            sizes = [int(n) for n in re.findall(r'font-size="(\d+)"', text_body)]
            if not sizes or min(sizes) < 15:
                problems.append(f"small type {path.name} {sizes}")
            if 'width="420"' not in text_body and exam != "keep":
                # existing hand-drawn files are not required to be 420
                if path.stat().st_mtime:
                    pass
            digest = hashlib.sha1(re.sub(r"<title[\s\S]*?</title>", "", text_body).encode()).hexdigest()
            seen.setdefault(digest, []).append(path.name)
        dupes = [names for names in seen.values() if len(names) > 1]
        if dupes:
            problems.append(f"{exam} duplicate visuals {dupes[:3]}")
        missing = []
        for path, cards in load_cards(ROOT / "content" / f"{exam}-feed" / "cards"):
            for card in cards:
                if not (svg_dir / f"{card['id']}.svg").exists():
                    missing.append(card["id"])
        if missing:
            problems.append(f"{exam} missing {missing[:5]}")
    if problems:
        raise SystemExit("\n".join(problems))
    print("visual audit ok")


def main() -> None:
    build("nclex", keep_existing=True)
    build("naplex", keep_existing=True)
    build("fnp", keep_existing=False)
    # Regenerated FNP files are 420-wide. Existing hand art is left alone.
    audit_new_only()
    print("done")


def audit_new_only() -> None:
    problems = []
    for exam, keep in (("nclex", True), ("naplex", True), ("fnp", False)):
        svg_dir = ROOT / "content" / f"{exam}-feed" / "svg"
        digests: dict[str, list[str]] = {}
        for path in svg_dir.glob("*.svg"):
            body = path.read_text()
            if 'width="420"' not in body:
                continue
            sizes = [int(n) for n in re.findall(r'font-size="(\d+)"', body)]
            if not sizes or min(sizes) < 15:
                problems.append(f"{path.name} type {sizes}")
            digest = hashlib.sha1(body.encode()).hexdigest()
            digests.setdefault(digest, []).append(path.name)
        dupes = [v for v in digests.values() if len(v) > 1]
        if dupes:
            problems.append(f"{exam} dupes {dupes[:2]}")
    if problems:
        raise SystemExit("\n".join(problems))
    print("new visual audit ok")


if __name__ == "__main__":
    main()
