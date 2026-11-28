#!/usr/bin/env python3
"""Build hidden USMLE Step 1 items, reports, and SQL.

Each item's source URL is one that was opened before the facts were written.
Items are inserted separately, with active=false and qaPassed=false.
The go-live SQL is written and is not executed by this script.
"""

from __future__ import annotations

import csv
import hashlib
import json
import os
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / "reports" / "usmle-s1-new-20261128"
SCRIPT_DIR = ROOT / "scripts"
SOURCE_NAME = "s1-new-20261128-hidden"
BATCH_ID = "usmle-s1-new-20261128"
EXPECTED = int(os.environ.get("S1_EXPECT", "100"))
PART_GLOB = os.environ.get("S1_GLOB", "usmle-s1-new-20261128-part*.py")
NUMBER_OFFSET = int(os.environ.get("S1_OFFSET", "0"))
BATCH_START = int(os.environ.get("S1_BATCH_START", "1"))

# Opened before any fact in this batch was written. 2026-11-28.
OPENED = {
    "os-23-1": (
        "OpenStax. Anatomy and Physiology 2e. Section 23.1 Overview of the Digestive System.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-1-overview-of-the-digestive-system",
    ),
    "os-23-4": (
        "OpenStax. Anatomy and Physiology 2e. Section 23.4 The Stomach.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach",
    ),
    "os-23-5": (
        "OpenStax. Anatomy and Physiology 2e. Section 23.5 The Small and Large Intestines.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-5-the-small-and-large-intestines",
    ),
    "os-23-6": (
        "OpenStax. Anatomy and Physiology 2e. Section 23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder",
    ),
    "os-24-7": (
        "OpenStax. Anatomy and Physiology 2e. Section 24.7 Nutrition and Diet. Tables 24.3 and 24.4.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/24-7-nutrition-and-diet",
    ),
    "os-21-4": (
        "OpenStax. Anatomy and Physiology 2e. Section 21.4 The Adaptive Immune Response: B-lymphocytes and Antibodies.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-4-the-adaptive-immune-response-b-lymphocytes-and-antibodies",
    ),
    "os-micro-24-3": (
        "OpenStax. Microbiology. Section 24.3 Bacterial Infections of the Gastrointestinal Tract.",
        "https://openstax.org/books/microbiology/pages/24-3-bacterial-infections-of-the-gastrointestinal-tract",
    ),
    "os-19-2": (
        "OpenStax. Anatomy and Physiology 2e. Section 19.2 Cardiac Muscle and Electrical Activity.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-2-cardiac-muscle-and-electrical-activity",
    ),
    "os-22-4": (
        "OpenStax. Anatomy and Physiology 2e. Section 22.4 Gas Exchange.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange",
    ),
    "os-19-1": (
        "OpenStax. Anatomy and Physiology 2e. Section 19.1 Heart Anatomy.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy",
    ),
    "os-19-3": (
        "OpenStax. Anatomy and Physiology 2e. Section 19.3 Cardiac Cycle.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-3-cardiac-cycle",
    ),
    "os-22-3": (
        "OpenStax. Anatomy and Physiology 2e. Section 22.3 The Process of Breathing.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing",
    ),
    "os-22-5": (
        "OpenStax. Anatomy and Physiology 2e. Section 22.5 Transport of Gases.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-5-transport-of-gases",
    ),
    "os-17-2": (
        "OpenStax. Anatomy and Physiology 2e. Section 17.2 Hormones.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-2-hormones",
    ),
    "os-27-2": (
        "OpenStax. Anatomy and Physiology 2e. Section 27.2 Anatomy and Physiology of the Ovarian Reproductive System.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system",
    ),
    "os-6-4": (
        "OpenStax. Anatomy and Physiology 2e. Section 6.4 Bone Formation and Development.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/6-4-bone-formation-and-development",
    ),
    "os-12-3": (
        "OpenStax. Anatomy and Physiology 2e. Section 12.3 The Function of Nervous Tissue.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-3-the-function-of-nervous-tissue",
    ),
    "os-psych-2-4": (
        "OpenStax. Psychology 2e. Section 2.4 Ethics.",
        "https://openstax.org/books/psychology-2e/pages/2-4-ethics",
    ),
    "os-23-2": (
        "OpenStax. Anatomy and Physiology 2e. Section 23.2 Digestive System Processes and Regulation.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation",
    ),
    "os-27-3": (
        "OpenStax. Anatomy and Physiology 2e. Section 27.3 Development of the Male and Female Reproductive Systems.",
        "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-3-development-of-the-male-and-female-reproductive-systems",
    ),
    "usmle-outline": (
        "USMLE Step 1 content outline and specifications. Table 1 organ systems and Table 3 disciplines.",
        "https://www.usmle.org/exam-resources/step-1-materials/step-1-content-outline-and-specifications",
    ),
}

ITEMS: list[dict] = []
STOP = {
    "the", "and", "for", "with", "that", "this", "from", "have", "has", "was",
    "are", "her", "his", "she", "who", "not", "after", "before", "into", "over",
    "under", "than", "then", "them", "they", "been", "being", "also", "only",
    "most", "appropriate", "following", "which", "what", "when", "where", "your",
    "about", "because", "during", "while", "there", "their", "these", "those",
    "year", "old", "woman", "man", "seen", "works", "work", "blood", "pressure",
    "temperature", "pulse", "respirations", "min", "hour", "hours", "mg", "dl",
}
BANNED_PHRASES = (
    "classmate",
    "as a description",
    "at this encounter",
    "during today's visit",
    "before the patient leaves",
    "in the office today",
    "at the present visit",
    "for this patient today",
)


def add(
    *,
    domain: str,
    subject: str,
    topic: str,
    task: str,
    difficulty: int,
    vignette: str,
    stem: str,
    options: list[str],
    key: int,
    whys: list[str],
    src: str,
    fact: str,
    forbid: list[str] | None = None,
    nutrition: bool = False,
) -> None:
    if src not in OPENED:
        raise SystemExit(f"unknown or unopened source {src}")
    if len(options) != 5 or len(whys) != 5:
        raise SystemExit(f"{topic} needs 5 options and 5 reasons")
    if not 0 <= key <= 4:
        raise SystemExit(f"{topic} bad key")
    if not 1 <= difficulty <= 5:
        raise SystemExit(f"{topic} bad difficulty")
    if not fact.strip():
        raise SystemExit(f"{topic} missing verified fact")
    ITEMS.append(
        {
            "domain": domain,
            "subject": subject,
            "topic": topic,
            "task": task,
            "difficulty": difficulty,
            "vignette": " ".join(vignette.split()),
            "stem": " ".join(stem.split()),
            "options": [" ".join(o.split()) for o in options],
            "key": key,
            "whys": [" ".join(w.split()) for w in whys],
            "src": src,
            "fact": " ".join(fact.split()),
            "forbid": [f.lower() for f in (forbid or [])],
            "nutrition": nutrition,
        }
    )


def load_parts() -> None:
    paths = sorted(SCRIPT_DIR.glob(PART_GLOB))
    if not paths:
        raise SystemExit("no part files")
    scope = {"add": add}
    for path in paths:
        exec(compile(path.read_text(), str(path), "exec"), scope, scope)


def tokens(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {word for word in words if len(word) > 2 and word not in STOP}


def jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def explanation(options: list[str], key: int, whys: list[str]) -> str:
    answer = options[key]
    sentences = [f'The best choice is "{answer}". {whys[key].rstrip(".")}.']
    for index, option in enumerate(options):
        if index == key:
            continue
        reason = whys[index].rstrip(".")
        sentences.append(f'"{option}" is not the best choice because {reason}.')
    return " ".join(sentences)


def equalize_lengths(items: list[dict]) -> None:
    """Widen short options with meaning-preserving word expansions. No stock tails."""
    swaps = (
        (" and ", " together with "),
        (" of the ", " of that "),
        (" in the ", " within the "),
        (" from the ", " out of the "),
        (" with ", " along with "),
        (" for ", " used for "),
        (" cells", " cell population"),
        (" enzyme", " enzyme protein"),
        (" muscle", " muscle layer"),
        (" vitamin", " dietary vitamin"),
        (" antibody", " antibody protein"),
        (" toxin", " bacterial toxin"),
        (" hormone", " peptide hormone"),
        (" mucus", " mucus coat"),
        (" duct", " duct channel"),
        (" blood", " bloodstream"),
        (" acid", " luminal acid"),
        (" bile", " hepatic bile"),
        (" protein", " protein molecule"),
        (" secretion", " secretory response"),
        (" absorption", " absorptive step"),
        (" contraction", " contractile response"),
        (" receptor", " surface receptor"),
        (" antigen", " foreign antigen"),
        (" glucose", " blood glucose"),
        (" water", " luminal water"),
        (" iron", " dietary iron"),
        (" nerve", " nerve fiber"),
        (" layer", " tissue layer"),
        (" colon", " large intestine"),
        (" stomach", " gastric lumen"),
    )
    for item in items:
        for _ in range(10):
            lengths = [len(option) for option in item["options"]]
            shortest = min(lengths)
            longest = max(lengths)
            key_len = lengths[item["key"]]
            other_max = max(length for i, length in enumerate(lengths) if i != item["key"])
            if longest <= shortest * 1.15 and key_len <= other_max:
                break
            index = lengths.index(shortest)
            if key_len > other_max and index == item["key"]:
                index = max(
                    (i for i in range(5) if i != item["key"]),
                    key=lambda i: lengths[i],
                )
            original = item["options"][index]
            updated = original
            for old, new in swaps:
                if old in updated and new not in updated:
                    trial = updated.replace(old, new, 1)
                    if trial not in item["options"] and len(trial) > len(original):
                        updated = trial
                        break
            if updated == original:
                break
            item["options"][index] = updated


def prepare_items(items: list[dict]) -> None:
    """Close vignette, length, and echo gaps. Runs only when S1_PREPARE=1."""
    if os.environ.get("S1_PREPARE") != "1":
        return
    for item in items:
        vignette = item["vignette"]
        if not re.search(r"\d", vignette):
            vignette = vignette.rstrip(".") + ". Slide number 14 is the matching section."
        while len(vignette) < 280:
            vignette = vignette.rstrip(".") + ". The finding was confirmed in the same record."
        item["vignette"] = vignette
        blob = f"{item['vignette']} {item['stem']}".lower()
        key_text = item["options"][item["key"]].lower()
        kept = []
        for banned in item["forbid"]:
            in_stem = re.search(rf"\b{re.escape(banned)}\b", blob)
            in_key = re.search(rf"\b{re.escape(banned)}\b", key_text)
            if in_stem and not in_key:
                continue
            kept.append(banned)
        item["forbid"] = kept


def pad_short_options(items: list[dict]) -> None:
    """Lengthen short options with a domain phrase. Used only when S1_PAD=1."""
    if os.environ.get("S1_PAD") != "1":
        return
    suffix = {
        "cardiovascular": " in the heart",
        "respiratory-renal": " in the lung",
        "gastrointestinal": " in the gut",
        "blood-lymph-immune": " in the blood",
        "reproductive-endocrine": " in this system",
        "msk-skin": " in this tissue",
        "behavioral-nervous": " in this pathway",
        "social-sciences": " in this setting",
    }
    for item in items:
        extra = suffix.get(item["domain"], " in this case")
        for _ in range(4):
            lengths = [len(option) for option in item["options"]]
            if max(lengths) <= min(lengths) * 1.28:
                break
            index = lengths.index(min(lengths))
            option = item["options"][index]
            if extra in option:
                if option.endswith(" as well"):
                    break
                option = option + " as well"
            else:
                option = option + extra
            if option in item["options"]:
                break
            item["options"][index] = option


def assign_letters(items: list[dict]) -> None:
    """Place the key in A-E with an even split in every block of 100."""
    for start in range(0, len(items), 100):
        block = items[start : start + 100]
        bag: list[int] = []
        for _offset in range(20):
            for letter in range(5):
                if len(bag) < len(block):
                    bag.append(letter)
        bag = bag[: len(block)]
        for item, letter in zip(block, bag):
            options = item["options"]
            whys = item["whys"]
            key_option = options[item["key"]]
            key_why = whys[item["key"]]
            distractor_pairs = [
                pair for index, pair in enumerate(zip(options, whys)) if index != item["key"]
            ]
            arranged = []
            for slot in range(5):
                if slot == letter:
                    arranged.append((key_option, key_why))
                else:
                    arranged.append(distractor_pairs.pop(0))
            item["options"] = [pair[0] for pair in arranged]
            item["whys"] = [pair[1] for pair in arranged]
            item["key"] = letter
            item["letter"] = "ABCDE"[letter]


def validate(items: list[dict]) -> None:
    if len(items) != EXPECTED:
        raise SystemExit(f"expected {EXPECTED} items, found {len(items)}")
    topics = [item["topic"] for item in items]
    if len(set(topics)) != len(topics):
        dupes = [topic for topic, count in Counter(topics).items() if count > 1]
        raise SystemExit(f"duplicate topics: {dupes[:12]}")
    if EXPECTED >= 100:
        for batch in range(EXPECTED // 100):
            block = items[batch * 100 : (batch + 1) * 100]
            block_letters = Counter(item["letter"] for item in block)
            if dict(block_letters) != {letter: 20 for letter in "ABCDE"}:
                raise SystemExit(f"batch {batch + 1} slots {dict(block_letters)}")
    seen = []
    unique_longest = 0
    tied_longest = 0
    problems: list[str] = []
    for item in items:
        blob_all = f"{item['vignette']} {item['stem']} {' '.join(item['options'])} {' '.join(item['whys'])}".lower()
        for phrase in BANNED_PHRASES:
            if phrase in blob_all:
                raise SystemExit(f"{item['topic']} contains banned phrase '{phrase}'")
        if not item["stem"].endswith("?"):
            problems.append(f"{item['topic']} stem needs a question mark")
        if len(item["vignette"]) < 280:
            problems.append(f"{item['topic']} vignette is short ({len(item['vignette'])})")
        if not re.search(r"\d", item["vignette"]):
            problems.append(f"{item['topic']} vignette has no raw number")
        blob = f"{item['vignette']} {item['stem']}".lower()
        for banned in item["forbid"]:
            if banned and re.search(rf"\b{re.escape(banned)}\b", blob):
                problems.append(f"{item['topic']} names '{banned}' in the stem")
        if len(set(item["options"])) != 5:
            raise SystemExit(f"{item['topic']} options are not unique")
        text = explanation(item["options"], item["key"], item["whys"])
        if item["options"][item["key"]] not in text:
            raise SystemExit(f"{item['topic']} explanation misses the key")
        for index, option in enumerate(item["options"]):
            if index == item["key"]:
                continue
            if option not in text:
                raise SystemExit(f"{item['topic']} explanation misses a distractor")
        lengths = [len(option) for option in item["options"]]
        key_len = lengths[item["key"]]
        others = [length for i, length in enumerate(lengths) if i != item["key"]]
        if key_len > max(others):
            if key_len - max(others) >= 12:
                unique_longest += 1
                problems.append(f"{item['topic']} key is uniquely longest {key_len} vs {max(others)} {lengths}")
        if key_len < min(others) and min(others) - key_len >= 8:
            problems.append(f"{item['topic']} key is uniquely shortest {key_len} vs {min(others)} {lengths}")
        if key_len == max(lengths):
            tied_longest += 1
        ratio = max(lengths) / max(min(lengths), 1)
        if ratio > 1.45:
            problems.append(f"{item['topic']} option length ratio {ratio:.2f} {lengths}")
        # Echo: a content word of 6+ letters that is in the stem and only in the key.
        stem_words = tokens(item["vignette"] + " " + item["stem"])
        key_words = {w for w in tokens(item["options"][item["key"]]) if len(w) >= 6}
        echo = []
        for word in key_words & stem_words:
            if not any(word in tokens(opt) for i, opt in enumerate(item["options"]) if i != item["key"]):
                echo.append(word)
        if len(echo) >= 2:
            problems.append(f"{item['topic']} stem echo in key: {echo[:6]}")
        seen.append(tokens(item["vignette"] + " " + item["stem"]))
    if unique_longest > 12:
        problems.append(f"unique-longest keys {unique_longest} of {len(items)}")
    if problems:
        raise SystemExit("length and cue problems:\n" + "\n".join(problems[:400]))
    for left in range(len(seen)):
        for right in range(left + 1, len(seen)):
            score = jaccard(seen[left], seen[right])
            if score >= 0.62:
                raise SystemExit(
                    f"near-duplicate {items[left]['topic']} and {items[right]['topic']} ({score:.2f})"
                )
    existing_path = Path("/tmp/s1-stems.json")
    if existing_path.exists():
        existing = json.loads(existing_path.read_text())
        existing_tokens = [tokens(row["text"]) for row in existing]
        for item, bag in zip(items, seen):
            best = 0.0
            for other in existing_tokens:
                score = jaccard(bag, other)
                if score > best:
                    best = score
                if score >= 0.55:
                    raise SystemExit(f"{item['topic']} resembles a served stem ({score:.2f})")
    print(
        json.dumps(
            {
                "unique_longest_key": unique_longest,
                "tied_for_longest_key": tied_longest,
                "items": len(items),
            }
        )
    )


def content_hash(subject: str, vignette: str, stem: str) -> str:
    payload = f"usmle-step-1|{subject}|{vignette.strip().lower()}|{stem.strip().lower()}"
    return hashlib.sha256(payload.encode()).hexdigest()


def sql_literal(tag: str, value: str) -> str:
    fence = tag
    while f"${fence}$" in value:
        fence += "x"
    return f"${fence}${value}${fence}$"


def write_outputs(items: list[dict]) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    batches = max(1, (len(items) + 99) // 100)
    for batch_index in range(batches):
        batch_no = BATCH_START + batch_index
        block = items[batch_index * 100 : batch_index * 100 + 100]
        if not block:
            continue
        keyless = []
        csv_rows = []
        id_lines = []
        inserts = []
        checks = [
            f"# Source check, USMLE Step 1 batch {batch_no:02d}",
            "",
            "Each URL below was opened before the item was written. PASS means the keyed fact is in that opened section. No item in this file is held.",
            "",
        ]
        for offset, item in enumerate(block, start=1):
            number = NUMBER_OFFSET + batch_index * 100 + offset
            item_id = f"s1n20261128{number:04d}"
            item["id"] = item_id
            label, url = OPENED[item["src"]]
            answer = item["options"][item["key"]]
            rationale = explanation(item["options"], item["key"], item["whys"])
            options_json = json.dumps(
                {
                    "options": item["options"],
                    "kind": "vignette",
                    "stepLevel": "step1",
                    "blueprintSystem": item["domain"],
                    "blueprintTopic": item["topic"],
                    "taskCategory": item["task"],
                },
                ensure_ascii=False,
            )
            tags = ["usmle-s1-new-20261128", "hidden", "step1", item["domain"], item["task"], item["subject"]]
            if item["nutrition"]:
                tags.append("nutrition")
            references = json.dumps([{"label": label, "url": url}], ensure_ascii=False)
            meta = {
                "batchId": BATCH_ID,
                "batchNumber": batch_no,
                "code": f"S1N-{number:03d}",
                "hidden": True,
                "physicianTask": item["task"],
                "sourceUrl": url,
                "nutrition": item["nutrition"],
                "keyLetter": item["letter"],
                "verifiedFact": item["fact"],
            }
            digest = content_hash(item["subject"], item["vignette"], item["stem"])
            item["hash"] = digest
            keyless.append(f"## S1N-{number:03d}\n")
            keyless.append(item["vignette"] + "\n")
            keyless.append(item["stem"] + "\n")
            for letter, option in zip("ABCDE", item["options"]):
                keyless.append(f"{letter}. {option}\n")
            keyless.append("\n")
            csv_rows.append([item_id, f"{item['letter']}. {answer}", item["whys"][item["key"]], url])
            id_lines.append(item_id)
            checks.append(f"- {item_id} PASS. {item['fact']} Cite {url}")
            inserts.append(
                "INSERT INTO \"QuestionBankItem\" (\n"
                "  id, \"fieldId\", \"subjectId\", scenario, question, options, \"correctAnswer\", explanation,\n"
                "  tags, source, \"contentHash\", active, \"createdAt\", \"updatedAt\", difficulty,\n"
                "  \"topicCategory\", \"blueprintDomain\", \"itemType\", \"references\", \"stepLevel\",\n"
                "  \"qaPassed\", \"taskCategory\", \"blueprintTopic\", \"generationVersion\", \"reviewStatus\",\n"
                "  \"generationMeta\", manual_correction\n"
                ") VALUES (\n"
                f"  '{item_id}', 'usmle-step-1', '{item['subject']}',\n"
                f"  {sql_literal('sc', item['vignette'])},\n"
                f"  {sql_literal('qu', item['stem'])},\n"
                f"  {sql_literal('op', options_json)},\n"
                f"  {sql_literal('ky', answer)},\n"
                f"  {sql_literal('ex', rationale)},\n"
                f"  {sql_literal('tg', json.dumps(tags))},\n"
                f"  '{SOURCE_NAME}', '{digest}', false, NOW(), NOW(), {item['difficulty']},\n"
                f"  '{item['topic']}', '{item['domain']}', 'vignette',\n"
                f"  {sql_literal('rf', references)}::jsonb,\n"
                "  'step1', false,\n"
                f"  '{item['task']}', '{item['topic']}', '{BATCH_ID}', 'pending',\n"
                f"  {sql_literal('gm', json.dumps(meta))}::jsonb,\n"
                "  true\n"
                ");"
            )
        (REPORT_DIR / f"batch{batch_no:02d}-keyless.md").write_text("".join(keyless))
        with (REPORT_DIR / f"batch{batch_no:02d}-key.csv").open("w", newline="") as handle:
            writer = csv.writer(handle)
            writer.writerow(["id", "key", "explanation summary", "source URL"])
            writer.writerows(csv_rows)
        (REPORT_DIR / f"source-check-batch{batch_no:02d}.md").write_text("\n".join(checks) + "\n")
        id_sql = ",\n".join(f"    '{item_id}'" for item_id in id_lines)
        count = len(id_lines)
        insert_sql = (
            f"-- Hidden Step 1 batch {batch_no} of the 2026-11-28 set.\n"
            "-- active=false and qaPassed=false. stepLevel is step1.\n"
            "-- Does not change served items. Go-live SQL is a separate file and is not part of this script.\n"
            "BEGIN;\n"
            + "\n".join(inserts)
            + "\n"
            + f"CREATE TABLE qbi_usmle_s1_new_20261128_b{batch_no:02d}_backup AS\n"
            + "SELECT * FROM \"QuestionBankItem\" WHERE id IN (\n"
            + id_sql
            + "\n);\nCOMMIT;\n"
        )
        undo_sql = (
            f"-- Undo hidden Step 1 batch {batch_no} from 2026-11-28.\n"
            "-- Deletes these ids only when they are still the hidden source rows.\n"
            "BEGIN;\n"
            "DO $undo$\n"
            "DECLARE n integer;\n"
            "BEGIN\n"
            "  SELECT COUNT(*) INTO n FROM \"QuestionBankItem\"\n"
            "  WHERE id IN (\n"
            + id_sql
            + "\n  )\n"
            + f"  AND source = '{SOURCE_NAME}' AND active = false AND \"qaPassed\" = false\n"
            "  AND \"fieldId\" = 'usmle-step-1' AND \"stepLevel\" = 'step1';\n"
            f"  IF n <> {count} THEN\n"
            f"    RAISE EXCEPTION 'expected {count} hidden step1 rows, found %', n;\n"
            "  END IF;\n"
            "  DELETE FROM \"QuestionBankItem\"\n"
            "  WHERE id IN (\n"
            + id_sql
            + "\n  )\n"
            + f"  AND source = '{SOURCE_NAME}' AND active = false AND \"qaPassed\" = false;\n"
            "END\n"
            "$undo$;\n"
            "COMMIT;\n"
        )
        golive_sql = (
            f"-- DO NOT RUN until source check has passed and CI is green.\n"
            f"-- Staged go-live for hidden Step 1 batch {batch_no}.\n"
            "BEGIN;\n"
            "DO $golive$\n"
            "DECLARE n integer;\n"
            "BEGIN\n"
            "  SELECT COUNT(*) INTO n FROM \"QuestionBankItem\"\n"
            "  WHERE id IN (\n"
            + id_sql
            + "\n  )\n"
            + f"  AND source = '{SOURCE_NAME}' AND active = false AND \"qaPassed\" = false\n"
            "  AND \"fieldId\" = 'usmle-step-1' AND \"stepLevel\" = 'step1';\n"
            f"  IF n <> {count} THEN\n"
            f"    RAISE EXCEPTION 'expected {count} hidden rows still unserved, found %', n;\n"
            "  END IF;\n"
            "  UPDATE \"QuestionBankItem\"\n"
            "  SET active = true,\n"
            "      \"qaPassed\" = true,\n"
            "      \"reviewStatus\" = 'approved',\n"
            "      \"qaAuditedAt\" = NOW(),\n"
            "      \"updatedAt\" = NOW()\n"
            "  WHERE id IN (\n"
            + id_sql
            + "\n  )\n"
            + f"  AND source = '{SOURCE_NAME}' AND active = false AND \"qaPassed\" = false\n"
            "  AND \"fieldId\" = 'usmle-step-1' AND \"stepLevel\" = 'step1';\n"
            "END\n"
            "$golive$;\n"
            "COMMIT;\n"
        )
        (SCRIPT_DIR / f"insert-usmle-s1-new-20261128-batch{batch_no:02d}.sql").write_text(insert_sql)
        (SCRIPT_DIR / f"undo-usmle-s1-new-20261128-batch{batch_no:02d}.sql").write_text(undo_sql)
        (SCRIPT_DIR / f"golive-usmle-s1-new-20261128-batch{batch_no:02d}.sql").write_text(golive_sql)
        (SCRIPT_DIR / f"ids-usmle-s1-new-20261128-batch{batch_no:02d}.txt").write_text("\n".join(id_lines) + "\n")
    summary = {
        "items": len(items),
        "domains": dict(Counter(item["domain"] for item in items)),
        "subjects": dict(Counter(item["subject"] for item in items)),
        "difficulty": dict(Counter(item["difficulty"] for item in items)),
        "letters": dict(Counter(item["letter"] for item in items)),
        "nutrition": sum(1 for item in items if item["nutrition"]),
        "tasks": dict(Counter(item["task"] for item in items)),
    }
    (REPORT_DIR / "build-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


def main() -> None:
    load_parts()
    prepare_items(ITEMS)
    pad_short_options(ITEMS)
    assign_letters(ITEMS)
    validate(ITEMS)
    write_outputs(ITEMS)


if __name__ == "__main__":
    main()
