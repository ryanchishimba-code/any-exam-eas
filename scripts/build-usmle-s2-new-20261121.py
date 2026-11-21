#!/usr/bin/env python3
"""Build 400 hidden USMLE Step 2 CK items, reports, and SQL.

Sources were fetched before the numbers in this file were written.
Items are inserted separately, with active=false and qaPassed=false.
The go-live SQL is written and is not executed by this script.
"""

from __future__ import annotations

import csv
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / "reports" / "usmle-s2-new-20261121"
SCRIPT_DIR = ROOT / "scripts"
SOURCE_NAME = "s2-new-20261121-hidden"
BATCH_ID = "usmle-s2-new-20261121"

SOURCES = {
    "ada-dx": (
        "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.",
        "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes",
    ),
    "ada-tx": (
        "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.",
        "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment",
    ),
    "ada-goal": (
        "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.",
        "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia",
    ),
    "ada-preg": (
        "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.",
        "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy",
    ),
    "aha-htn": (
        "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.",
        "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356",
    ),
    "uspstf-lung": (
        "US Preventive Services Task Force. Screening for Lung Cancer.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening",
    ),
    "uspstf-crc": (
        "US Preventive Services Task Force. Screening for Colorectal Cancer.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
    ),
    "uspstf-breast": (
        "US Preventive Services Task Force. Screening for Breast Cancer.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening",
    ),
    "uspstf-osteo": (
        "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening",
    ),
    "uspstf-hiv": (
        "US Preventive Services Task Force. Screening for HIV Infection.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening",
    ),
    "uspstf-hcv": (
        "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening",
    ),
    "uspstf-cerv": (
        "US Preventive Services Task Force. Screening for Cervical Cancer.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening",
    ),
    "uspstf-dep": (
        "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.",
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults",
    ),
    "cdc-chlamydia": (
        "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.",
        "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm",
    ),
    "cdc-gonorrhea": (
        "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.",
        "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm",
    ),
    "cdc-syphilis": (
        "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.",
        "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm",
    ),
    "cdc-sti": (
        "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.",
        "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf",
    ),
    "cdc-ltbi": (
        "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.",
        "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm",
    ),
    "cdc-epi": (
        "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.",
        "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html",
    ),
    "usmle-outline": (
        "USMLE Step 2 CK content outline and specifications.",
        "https://www.usmle.org/exam-resources/step-2-ck-materials/step-2-ck-content-outline-specifications",
    ),
}

DOMAIN_TARGET = {
    "reproductive-endocrine": 128,
    "behavioral-nervous": 61,
    "msk-skin": 56,
    "social-sciences": 51,
    "blood-lymph-immune": 38,
    "gastrointestinal": 29,
    "cardiovascular": 23,
    "biostats-epi": 14,
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
    forbid: list[str] | None = None,
    nutrition: bool = False,
) -> None:
    if src not in SOURCES:
        raise SystemExit(f"unknown source {src}")
    if len(options) != 5 or len(whys) != 5:
        raise SystemExit(f"{topic} needs 5 options and 5 reasons")
    if not 0 <= key <= 4:
        raise SystemExit(f"{topic} bad key")
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
            "forbid": [f.lower() for f in (forbid or [])],
            "nutrition": nutrition,
        }
    )


def person(age: int, sex: str, job: str, setting: str, lead: str) -> str:
    article = "an" if job[:1].lower() in "aeiou" else "a"
    return f"A {age}-year-old {sex} who works as {article} {job} is seen in the {setting} {lead}."


def vitals(t: float, p: int, r: int, sbp: int, dbp: int) -> str:
    return (
        f"Temperature is {t:.1f}°C, pulse is {p}/min, respirations are {r}/min, "
        f"and blood pressure is {sbp}/{dbp} mm Hg."
    )


def load_parts() -> None:
    paths = sorted(SCRIPT_DIR.glob("usmle-s2-new-20261121-part*.py"))
    if not paths:
        raise SystemExit("no part files")
    scope = {"add": add, "person": person, "vitals": vitals}
    for path in paths:
        exec(compile(path.read_text(), str(path), "exec"), scope, scope)


def tokens(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    return {word for word in words if len(word) > 2 and word not in STOP}


def jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def pad_lengths(options: list[str], key: int) -> list[str]:
    pads = [
        " at this encounter",
        " during today's visit",
        " before the patient leaves",
        " in the office today",
        " at the present visit",
    ]
    options = list(options)
    for guard in range(12):
        lengths = [len(option) for option in options]
        key_len = lengths[key]
        other_max = max(length for i, length in enumerate(lengths) if i != key)
        if key_len <= other_max:
            return options
        if (key_len - other_max) < 20 and key_len < other_max * 1.25 and guard > 0:
            # Still uniquely longest, but inside the allowed margin. One more pad removes the cue.
            pass
        order = sorted((i for i in range(5) if i != key), key=lambda i: lengths[i], reverse=True)
        idx = order[0]
        pad = pads[(guard + idx) % len(pads)]
        if options[idx].endswith(pad):
            pad = pads[(guard + idx + 1) % len(pads)]
        trial = options[idx] + pad
        if trial in options:
            continue
        options[idx] = trial
    return options


def explanation(options: list[str], key: int, whys: list[str]) -> str:
    sentences = [whys[key].rstrip(".") + "."]
    for index, option in enumerate(options):
        if index == key:
            continue
        reason = whys[index].rstrip(".")
        sentences.append(f'"{option}" is not the best choice because {reason}.')
    return " ".join(sentences)


def assign_letters(items: list[dict]) -> None:
    """Place the key in A-E with 20 of each letter in every block of 100."""
    for start in range(0, len(items), 100):
        block = items[start : start + 100]
        letters = [index % 5 for index in range(len(block))]
        # Spread letters rather than running AAAAA...
        letters.sort(key=lambda letter: (letter, ))
        mixed = []
        columns = [letters[i::5] for i in range(5)] if False else None
        bag = []
        for offset in range(20):
            for letter in range(5):
                if len(bag) < len(block):
                    bag.append(letter)
        bag = bag[: len(block)]
        for item, letter in zip(block, bag):
            options = pad_lengths(item["options"], item["key"])
            whys = item["whys"]
            key_option = options[item["key"]]
            key_why = whys[item["key"]]
            pairs = list(zip(options, whys))
            key_pair = pairs.pop(item["key"])
            # Rotate so the key lands on `letter` while preserving distractor order.
            distractors = pairs
            arranged = distractors[:letter] + [key_pair] + distractors[letter:]
            # The slice above is wrong if we popped the key. Rebuild explicitly.
            arranged = []
            distractor_pairs = [pair for index, pair in enumerate(zip(options, whys)) if index != item["key"]]
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
    if len(items) != 400:
        raise SystemExit(f"expected 400 items, found {len(items)}")
    domains = Counter(item["domain"] for item in items)
    if dict(domains) != DOMAIN_TARGET:
        raise SystemExit(f"domain mix {dict(domains)} != {DOMAIN_TARGET}")
    topics = [item["topic"] for item in items]
    if len(set(topics)) != len(topics):
        dupes = [topic for topic, count in Counter(topics).items() if count > 1]
        raise SystemExit(f"duplicate topics: {dupes[:12]}")
    difficulties = Counter(item["difficulty"] for item in items)
    for level in range(1, 6):
        if difficulties[level] < 20:
            raise SystemExit(f"difficulty {level} has only {difficulties[level]}")
    if difficulties[3] > 200:
        raise SystemExit(f"too many difficulty-3 items: {difficulties[3]}")
    letters = Counter(item["letter"] for item in items)
    if dict(letters) != {letter: 80 for letter in "ABCDE"}:
        raise SystemExit(f"key slots {dict(letters)}")
    for batch in range(4):
        block = items[batch * 100 : (batch + 1) * 100]
        block_letters = Counter(item["letter"] for item in block)
        if dict(block_letters) != {letter: 20 for letter in "ABCDE"}:
            raise SystemExit(f"batch {batch + 1} slots {dict(block_letters)}")
    seen = []
    for item in items:
        if not item["stem"].endswith("?"):
            raise SystemExit(f"{item['topic']} stem needs a question mark")
        if len(item["vignette"]) < 280:
            raise SystemExit(f"{item['topic']} vignette is short ({len(item['vignette'])})")
        if not re.search(r"\d", item["vignette"]):
            raise SystemExit(f"{item['topic']} vignette has no raw number")
        blob = f"{item['vignette']} {item['stem']}".lower()
        for banned in item["forbid"]:
            if banned and banned in blob:
                raise SystemExit(f"{item['topic']} names '{banned}' in the stem")
        if len(set(item["options"])) != 5:
            raise SystemExit(f"{item['topic']} options are not unique")
        text = explanation(item["options"], item["key"], item["whys"])
        for index, option in enumerate(item["options"]):
            if index == item["key"]:
                continue
            if option not in text:
                raise SystemExit(f"{item['topic']} explanation misses a distractor")
        lengths = [len(option) for option in item["options"]]
        key_len = lengths[item["key"]]
        other_max = max(length for i, length in enumerate(lengths) if i != item["key"])
        if key_len > other_max and ((key_len - other_max) >= 20 or key_len >= other_max * 1.25):
            raise SystemExit(f"{item['topic']} length cue {key_len} vs {other_max}")
        seen.append(tokens(item["vignette"] + " " + item["stem"]))
    for left in range(len(seen)):
        for right in range(left + 1, len(seen)):
            score = jaccard(seen[left], seen[right])
            if score >= 0.62:
                raise SystemExit(
                    f"near-duplicate {items[left]['topic']} and {items[right]['topic']} ({score:.2f})"
                )
    existing_path = Path("/tmp/s2-existing.json")
    if existing_path.exists():
        existing = json.loads(existing_path.read_text())
        existing_tokens = [tokens(row["text"]) for row in existing]
        for item, bag in zip(items, seen):
            for other in existing_tokens:
                score = jaccard(bag, other)
                if score >= 0.55:
                    raise SystemExit(f"{item['topic']} resembles a served stem ({score:.2f})")


def content_hash(subject: str, vignette: str, stem: str) -> str:
    payload = f"usmle-step-2|{subject}|{vignette.strip().lower()}|{stem.strip().lower()}"
    return hashlib.sha256(payload.encode()).hexdigest()


def sql_literal(tag: str, value: str) -> str:
    fence = tag
    while f"${fence}$" in value:
        fence += "x"
    return f"${fence}${value}${fence}$"


def write_outputs(items: list[dict]) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    for batch_index in range(4):
        batch_no = batch_index + 1
        block = items[batch_index * 100 : batch_index * 100 + 100]
        keyless = []
        csv_rows = []
        id_lines = []
        inserts = []
        for offset, item in enumerate(block, start=1):
            number = batch_index * 100 + offset
            item_id = f"s2n20261121{number:04d}"
            item["id"] = item_id
            label, url = SOURCES[item["src"]]
            answer = item["options"][item["key"]]
            rationale = explanation(item["options"], item["key"], item["whys"])
            options_json = json.dumps(
                {
                    "options": item["options"],
                    "kind": "vignette",
                    "stepLevel": "step2",
                    "blueprintSystem": item["domain"],
                    "blueprintTopic": item["topic"],
                    "taskCategory": item["task"],
                },
                ensure_ascii=False,
            )
            tags = ["usmle-s2-new-20261121", "hidden", "step2", item["domain"], item["task"]]
            if item["nutrition"]:
                tags.append("nutrition")
            references = json.dumps([{"label": label, "url": url}], ensure_ascii=False)
            meta = {
                "batchId": BATCH_ID,
                "batchNumber": batch_no,
                "code": f"S2N-{number:03d}",
                "hidden": True,
                "physicianTask": item["task"],
                "sourceUrl": url,
                "nutrition": item["nutrition"],
                "keyLetter": item["letter"],
            }
            digest = content_hash(item["subject"], item["vignette"], item["stem"])
            item["hash"] = digest
            keyless.append(f"## S2N-{number:03d}\n")
            keyless.append(item["vignette"] + "\n")
            keyless.append(item["stem"] + "\n")
            for letter, option in zip("ABCDE", item["options"]):
                keyless.append(f"{letter}. {option}\n")
            keyless.append("\n")
            csv_rows.append(
                [
                    item_id,
                    f"{item['letter']}. {answer}",
                    item["whys"][item["key"]],
                    url,
                ]
            )
            id_lines.append(item_id)
            inserts.append(
                "INSERT INTO \"QuestionBankItem\" (\n"
                "  id, \"fieldId\", \"subjectId\", scenario, question, options, \"correctAnswer\", explanation,\n"
                "  tags, source, \"contentHash\", active, \"createdAt\", \"updatedAt\", difficulty,\n"
                "  \"topicCategory\", \"blueprintDomain\", \"itemType\", \"references\", \"stepLevel\",\n"
                "  \"qaPassed\", \"taskCategory\", \"blueprintTopic\", \"generationVersion\", \"reviewStatus\",\n"
                "  \"generationMeta\", manual_correction\n"
                ") VALUES (\n"
                f"  '{item_id}', 'usmle-step-2', '{item['subject']}',\n"
                f"  {sql_literal('sc', item['vignette'])},\n"
                f"  {sql_literal('qu', item['stem'])},\n"
                f"  {sql_literal('op', options_json)},\n"
                f"  {sql_literal('ky', answer)},\n"
                f"  {sql_literal('ex', rationale)},\n"
                f"  {sql_literal('tg', json.dumps(tags))},\n"
                f"  '{SOURCE_NAME}', '{digest}', false, NOW(), NOW(), {item['difficulty']},\n"
                f"  '{item['topic']}', '{item['domain']}', 'vignette',\n"
                f"  {sql_literal('rf', references)}::jsonb,\n"
                "  'step2', false,\n"
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
        id_sql = ",\n".join(f"    '{item_id}'" for item_id in id_lines)
        insert_sql = (
            f"-- Hidden Step 2 CK batch {batch_no} of the 2026-11-21 set.\n"
            "-- active=false and qaPassed=false. stepLevel is step2.\n"
            "-- Does not change served items. Go-live SQL is a separate file and is not part of this script.\n"
            "BEGIN;\n"
            + "\n".join(inserts)
            + "\n"
            + f"CREATE TABLE qbi_usmle_s2_new_20261121_b{batch_no:02d}_backup AS\n"
            + "SELECT * FROM \"QuestionBankItem\" WHERE id IN (\n"
            + id_sql
            + "\n);\nCOMMIT;\n"
        )
        undo_sql = (
            f"-- Undo hidden Step 2 CK batch {batch_no} from 2026-11-21.\n"
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
            "  AND \"fieldId\" = 'usmle-step-2' AND \"stepLevel\" = 'step2';\n"
            f"  IF n <> 100 THEN\n"
            f"    RAISE EXCEPTION 'expected 100 hidden step2 rows, found %', n;\n"
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
            f"-- DO NOT RUN. Staged go-live for hidden Step 2 CK batch {batch_no}.\n"
            "-- Sets served flags only after external review. Not executed by the build.\n"
            "BEGIN;\n"
            "DO $golive$\n"
            "DECLARE n integer;\n"
            "BEGIN\n"
            "  SELECT COUNT(*) INTO n FROM \"QuestionBankItem\"\n"
            "  WHERE id IN (\n"
            + id_sql
            + "\n  )\n"
            + f"  AND source = '{SOURCE_NAME}' AND active = false AND \"qaPassed\" = false\n"
            "  AND \"fieldId\" = 'usmle-step-2' AND \"stepLevel\" = 'step2';\n"
            "  IF n <> 100 THEN\n"
            "    RAISE EXCEPTION 'expected 100 hidden rows still unserved, found %', n;\n"
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
            "  AND \"fieldId\" = 'usmle-step-2' AND \"stepLevel\" = 'step2';\n"
            "END\n"
            "$golive$;\n"
            "COMMIT;\n"
        )
        (SCRIPT_DIR / f"insert-usmle-s2-new-20261121-batch{batch_no:02d}.sql").write_text(insert_sql)
        (SCRIPT_DIR / f"undo-usmle-s2-new-20261121-batch{batch_no:02d}.sql").write_text(undo_sql)
        (SCRIPT_DIR / f"golive-usmle-s2-new-20261121-batch{batch_no:02d}.sql").write_text(golive_sql)
        (SCRIPT_DIR / f"ids-usmle-s2-new-20261121-batch{batch_no:02d}.txt").write_text(
            "\n".join(id_lines) + "\n"
        )
    summary = {
        "items": 400,
        "domains": dict(Counter(item["domain"] for item in items)),
        "difficulty": dict(Counter(item["difficulty"] for item in items)),
        "letters": dict(Counter(item["letter"] for item in items)),
        "nutrition": sum(1 for item in items if item["nutrition"]),
        "tasks": dict(Counter(item["task"] for item in items)),
    }
    (REPORT_DIR / "build-summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary, indent=2))


def main() -> None:
    load_parts()
    assign_letters(ITEMS)
    validate(ITEMS)
    write_outputs(ITEMS)


if __name__ == "__main__":
    main()

