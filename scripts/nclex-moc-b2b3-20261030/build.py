#!/usr/bin/env python3
"""Build the held NCLEX Management of Care batch 2 + batch 3 insert package.

Does not connect to Neon. Source files live in the review package (bot store),
not in this repo. The SQL this writes is the artifact that gets reviewed.

Inserts 140 new rows with active=false. Activation is a separate script.
There are no rewrites and no hides in this package.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path("/cursor/stores/bot/nclex-next")
OUT = Path(__file__).resolve().parent
TAG = "nclexmocb2b3"
FIELD = "nursing"
SUBJECT = "management-of-care"
EXPECTED = 140

INSERT_BACKUP = "qbi_nclex_moc_b2b3_insert_20261030"
ACTIVATE_BACKUP = "qbi_nclex_moc_b2b3_activate_20261030"

LABEL = "Management of Care"
DOMAIN = "nclex-safe-care"

# 2026 Client Needs catalog slugs (src/lib/exam-prep/nclex/blueprint-topics-2026.ts).
TOPIC_BY_SUBTOPIC = {
    "Confidentiality and information security": "legal-aspects",
    "Reporting required by law": "legal-aspects",
    "Interdisciplinary collaboration and referrals": "continuity-case-management",
    "Conflict management": "leadership-conflict-resolution",
    "Receiving, verifying and implementing orders": "legal-aspects",
    "Scope of practice and limitations of self and others": "delegation-assignment",
    "Quality improvement, evidence and cost-effective care": "quality-improvement",
    "Documentation and approved terminology": "legal-aspects",
    "Organizing workload and time": "prioritization",
    "Plan of care": "continuity-case-management",
    "Admission, transfer and discharge": "continuity-case-management",
    "Unbiased treatment and equal access": "ethical-principles",
    "Client rights education and ethical dilemmas": "client-advocacy-education",
    "Delegation and assignment": "delegation-assignment",
    "Prioritization and acuity": "prioritization",
    "Handoff and continuity of care": "continuity-case-management",
    "Informed consent": "informed-consent-advance-directives",
    "Advance directives and surrogate decisions": "informed-consent-advance-directives",
    "Client rights and advocacy": "client-advocacy-education",
    "Ethical dilemmas, code of ethics and legal scope": "ethical-principles",
    "Resources: evidence, information technology and policies": "quality-improvement",
    "Quality improvement and cost-effective care": "quality-improvement",
}

# Sources used by these batches that are not in item6/whitelist.md.
EXTRA_SOURCES = {
    "HIPAA-164": {
        "label": "45 CFR Part 164 Subpart E (HIPAA Privacy Rule)",
        "url": "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-E",
    },
    "CFR-482-21": {
        "label": "42 CFR 482.21 Condition of participation: Quality assessment and performance improvement program",
        "url": "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.21",
    },
    "CFR-482-23": {
        "label": "42 CFR 482.23 Condition of participation: Nursing services",
        "url": "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.23",
    },
    "CFR-482-24": {
        "label": "42 CFR 482.24 Condition of participation: Medical record services",
        "url": "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-C/section-482.24",
    },
    "CFR-482-51": {
        "label": "42 CFR 482.51 Condition of participation: Surgical services",
        "url": "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-482/subpart-D/section-482.51",
    },
    "CFR-489-24": {
        "label": "42 CFR 489.24 Special responsibilities of Medicare hospitals in emergency cases (EMTALA)",
        "url": "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-B/section-489.24",
    },
    "NCSBN-MODEL": {
        "label": "NCSBN Model Act (Revised August 2026)",
        "url": "https://www.ncsbn.org/public-files/2026_ncsbn_model_act.pdf",
    },
    "ISMP-ABBR": {
        "label": "ISMP List of Error-Prone Abbreviations, Symbols, and Dose Designations (2024)",
        "url": "https://www.ismp.org/system/files/resources/2024-04/ISMP_ErrorProneAbbreviation_List.pdf",
    },
    "IHI-MFI": {
        "label": "IHI Model for Improvement",
        "url": "https://www.ihi.org/library/model-for-improvement",
    },
    "CLAS": {
        "label": "HHS OMH National CLAS Standards",
        "url": "https://thinkculturalhealth.hhs.gov/clas/standards",
    },
    "CDC-REPORT": {
        "label": "CDC COMEC Infectious Diseases page, Disease reporting",
        "url": "https://www.cdc.gov/comec/resources/infectious-diseases.html",
    },
    "ANA-DOC": {
        "label": "ANA Principles for Nursing Documentation (2010)",
        "url": "https://www.nursingworld.org/globalassets/docs/ana/ethics/principles-of-nursing-documentation.pdf",
    },
    "AHRQ-PSNET": {
        "label": "AHRQ PSNet primer: Reporting Patient Safety Events",
        "url": "https://psnet.ahrq.gov/primer/reporting-patient-safety-events",
    },
    "AHRQ-IPASS": {
        "label": "AHRQ TeamSTEPPS I-PASS handoff tool",
        "url": "https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/ipass.html",
    },
    "AHRQ-TS-MS": {
        "label": "AHRQ TeamSTEPPS Mutual Support tools (CUS, Two-Challenge Rule, DESC)",
        "url": "https://www.ahrq.gov/teamstepps-program/curriculum/mutual/tools/desc.html",
    },
    "HHS-LEP": {
        "label": "HHS OCR language access for persons with limited English proficiency",
        "url": "https://www.hhs.gov/civil-rights/for-individuals/special-topics/limited-english-proficiency/index.html",
    },
    "CWIG": {
        "label": "Child Welfare Information Gateway, Mandatory Reporting of Child Abuse and Neglect",
        "url": "https://www.childwelfare.gov/resources/mandatory-reporting-child-abuse-and-neglect/",
    },
    "TJC-DNU": {
        "label": "Joint Commission Do Not Use list of abbreviations",
        "url": "https://www.jointcommission.org/en-us/knowledge-library/support-center/standards-interpretation/do-not-use-list-of-abbreviations",
    },
}

KEY_LINE = re.compile(
    r"^## Q(\d+) \[([^;\]]+); (mc|sata|ord); difficulty (\d+)\] key: ([A-F](?:\s*[,>]\s*[A-F])*)"
)


def qident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def dollar(text: str) -> str:
    if text is None:
        return "NULL"
    if f"${TAG}$" in text:
        raise SystemExit(f"dollar-quote tag collision in text: {text[:80]!r}")
    return f"${TAG}${text}${TAG}$"


def jdump(value) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def content_hash(scenario: str, question: str) -> str:
    raw = f"{FIELD}|{SUBJECT}|{(scenario or '').strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def stem_md5(scenario: str, question: str) -> str:
    return hashlib.md5(f"{scenario or ''}|{question}".encode("utf-8")).hexdigest()


def make_id(batch: str, n: int) -> str:
    digest = hashlib.sha256(f"nclex-moc-{batch}-20261030-item-{n:02d}".encode()).hexdigest()
    return "c" + digest[:24]


def load_whitelist() -> dict:
    found = {}
    for line in (ROOT / "item6" / "whitelist.md").read_text().splitlines():
        if not line.startswith("|"):
            continue
        parts = [part.strip() for part in line.strip().strip("|").split("|")]
        if len(parts) < 5:
            continue
        src_id = parts[0]
        if not src_id or src_id.lower() == "id" or src_id.startswith("-"):
            continue
        url = parts[4] if parts[4].startswith("http") else ""
        found[src_id] = {"label": parts[1], "url": url}
    for src_id, entry in EXTRA_SOURCES.items():
        found.setdefault(src_id, entry)
    if "NCSBN-TP-2026" not in found:
        raise SystemExit("whitelist did not parse")
    return found


def parse_answer_key(path: Path) -> dict:
    keys = {}
    for line in path.read_text().splitlines():
        match = KEY_LINE.match(line)
        if not match:
            continue
        n = int(match.group(1))
        letters = re.findall(r"[A-F]", match.group(5))
        keys[n] = {
            "subtopic": match.group(2).strip(),
            "type": match.group(3),
            "difficulty": int(match.group(4)),
            "key": [ord(letter) - ord("A") for letter in letters],
        }
    return keys


def load_batch(batch: str, items_name: str, key_name: str, version: str) -> list:
    folder = ROOT / ("moc-batch2" if batch == "b2" else "moc-batch3")
    items = json.loads((folder / items_name).read_text())
    keyed = parse_answer_key(folder / key_name)
    if len(items) != 70:
        raise SystemExit(f"{batch} expected 70 items, found {len(items)}")
    if set(keyed) != {item["n"] for item in items}:
        raise SystemExit(f"{batch} answer key does not cover the same item numbers as the JSON")
    counts = {"mc": 0, "sata": 0, "ord": 0}
    for item in items:
        counts[item["type"]] = counts.get(item["type"], 0) + 1
        key_row = keyed[item["n"]]
        if key_row["subtopic"] != item["subtopic"]:
            raise SystemExit(f"{batch} Q{item['n']} subtopic mismatch with the answer key")
        if key_row["type"] != item["type"] or key_row["difficulty"] != item["difficulty"]:
            raise SystemExit(f"{batch} Q{item['n']} type or difficulty mismatch with the answer key")
        if key_row["key"] != item["key"]:
            raise SystemExit(
                f"{batch} Q{item['n']} key mismatch: json {item['key']} answer key {key_row['key']}"
            )
        if item["subtopic"] not in TOPIC_BY_SUBTOPIC:
            raise SystemExit(f"{batch} Q{item['n']} unmapped subtopic {item['subtopic']}")
        if not item.get("scenario") or not item.get("question") or not item.get("rationale"):
            raise SystemExit(f"{batch} Q{item['n']} is missing scenario, question, or rationale")
        if not isinstance(item["difficulty"], int) or not 1 <= item["difficulty"] <= 5:
            raise SystemExit(f"{batch} Q{item['n']} difficulty")
        if item["type"] == "mc" and item["key"] != [item["key"][0]]:
            raise SystemExit(f"{batch} Q{item['n']} mc key")
        if item["type"] == "mc" and len(item["key"]) != 1:
            raise SystemExit(f"{batch} Q{item['n']} mc key length")
        if item["type"] == "sata" and (len(item["key"]) < 2 or item["key"] != sorted(set(item["key"]))):
            raise SystemExit(f"{batch} Q{item['n']} sata key")
        if item["type"] == "ord" and sorted(item["key"]) != list(range(len(item["options"]))):
            raise SystemExit(f"{batch} Q{item['n']} ordered key is not a permutation")
        if any(index < 0 or index >= len(item["options"]) for index in item["key"]):
            raise SystemExit(f"{batch} Q{item['n']} key index out of range")
        if any(not isinstance(option, str) or not option.strip() for option in item["options"]):
            raise SystemExit(f"{batch} Q{item['n']} has an empty option")
        item["batch"] = batch
        item["version"] = version
    if counts != {"mc": 58, "sata": 9, "ord": 3}:
        raise SystemExit(f"{batch} type counts {counts}, expected 58 mc / 9 sata / 3 ord")
    return items


def reference_objects(refs, whitelist: dict) -> list:
    objects = []
    for ref in refs:
        src = ref["src"]
        locator = ref.get("locator") or ""
        listed = whitelist.get(src)
        if not listed:
            raise SystemExit(f"missing source label for {src}")
        obj = {"src": src, "label": listed["label"]}
        if locator:
            obj["locator"] = locator
        if listed.get("url"):
            obj["url"] = listed["url"]
        objects.append(obj)
    return objects


def correct_answer(item_type: str, options: list, key: list) -> str:
    chosen = [options[index] for index in key]
    if item_type == "mc":
        return chosen[0]
    return "|||".join(chosen)


def item_type_name(kind: str) -> str:
    return {"mc": "vignette", "sata": "select_all", "ord": "ordered_response"}[kind]


def options_kind(kind: str) -> str:
    return {"mc": "mcq", "sata": "select_all", "ord": "ordered_response"}[kind]


def pilot_row(item: dict, whitelist: dict) -> dict:
    topic = TOPIC_BY_SUBTOPIC[item["subtopic"]]
    scenario = item["scenario"]
    question = item["question"]
    answer = correct_answer(item["type"], item["options"], item["key"])
    options = {
        "kind": options_kind(item["type"]),
        "options": item["options"],
        "clientNeedsCategory": LABEL,
        "blueprintTopic": topic,
    }
    batch = item["batch"]
    tags = [
        "nclex-moc-b2b3",
        f"nclex-moc-{batch}",
        SUBJECT,
        topic,
        "held-for-rn-review",
    ]
    meta = {
        "batchId": "nclex-moc-b2b3-20261030",
        "pipelineVersion": "nclex-moc-b2b3",
        "sourceBatch": "batch2" if batch == "b2" else "batch3",
        "sourceVersion": item["version"],
        "sourceItem": item["n"],
        "subtopic": item["subtopic"],
        "itemType": item["type"],
        "heldForRnReview": True,
        "manualCorrection": True,
    }
    curation = {
        "metadataBy": "nclex-moc-b2b3",
        "heldForRnReview": True,
        "sourceBatch": meta["sourceBatch"],
        "sourceVersion": item["version"],
        "sourceItem": item["n"],
        "subtopic": item["subtopic"],
    }
    return {
        "batch": batch,
        "n": item["n"],
        "id": make_id(batch, item["n"]),
        "topic": topic,
        "scenario": scenario,
        "question": question,
        "answer": answer,
        "options_json": jdump(options),
        "explanation": item["rationale"],
        "references_json": jdump(reference_objects(item["refs"], whitelist)),
        "tags_json": jdump(tags),
        "meta_json": jdump(meta),
        "curation_json": jdump(curation),
        "difficulty": int(item["difficulty"]),
        "item_type": item_type_name(item["type"]),
        "content_hash": content_hash(scenario, question),
        "stem_md5": stem_md5(scenario, question),
        "subtopic": item["subtopic"],
        "kind": item["type"],
        "version": item["version"],
    }


def sql_header(title: str, applies: bool) -> str:
    hold = (
        "This file COMMITs when nclex.moc_b2b3_apply is set to 1.\n"
        "-- Do not set that until a licensed RN has reviewed the package."
        if applies
        else "This file is a dry run. It ends in ROLLBACK and leaves the database unchanged."
    )
    return f"""-- {title}
-- NCLEX Management of Care batches 2 and 3, built 2026-10-30. Prepared only. Not RN-reviewed.
-- {hold}
-- Target table: "QuestionBankItem". Field: nursing. Subject: management-of-care.
-- 140 new rows (batch 2 v7: 70, batch 3 v4: 70). Inserted inactive. No rewrites. No hides.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: {INSERT_BACKUP}, {ACTIVATE_BACKUP}.
"""


def apply_guard(name: str) -> str:
    return f"""DO $guard$
BEGIN
  IF current_setting('nclex.moc_b2b3_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '{name}: refusing to apply. Held until RN review. After that review, SET nclex.moc_b2b3_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;
"""


def refuse_existing(table: str) -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{table}') IS NOT NULL THEN
    RAISE EXCEPTION '{table} already exists; refusing to run again';
  END IF;
END
$guard$;
"""


def id_in(ids: list) -> str:
    return ", ".join(dollar(item_id) for item_id in ids)


def expect_count(sql: str, expected: int, message: str) -> str:
    return f"""DO $check$
DECLARE n integer;
BEGIN
  SELECT ({sql})::integer INTO n;
  IF n IS DISTINCT FROM {expected} THEN
    RAISE EXCEPTION '{message}: expected {expected}, found %', n;
  END IF;
END
$check$;
"""


def values_pairs(rows: list) -> str:
    return ",\n".join(f"({dollar(row['id'])}, {dollar(row['content_hash'])})" for row in rows)


def insert_body(rows: list) -> str:
    parts = [
        refuse_existing(INSERT_BACKUP),
        "-- Reject the insert when any new stem or content hash is already in the bank.",
    ]
    hashes = ",\n".join(dollar(row["content_hash"]) for row in rows)
    stems = ",\n".join(dollar(row["stem_md5"]) for row in rows)
    ids = [row["id"] for row in rows]
    parts.append(
        expect_count(
            f"""SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ({hashes})
   OR id IN ({id_in(ids)})
   OR md5(coalesce(scenario, '') || '|' || question) IN ({stems})""",
            0,
            "duplicate content hash, id, or stem",
        )
    )
    parts.append("-- Insert the 140 Management of Care items, held inactive until activation.")
    for row in rows:
        label = f"{row['batch']} Q{row['n']}"
        parts.append(
            f"""DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = {dollar(row['id'])}) THEN
    RAISE EXCEPTION '{label} id already exists: {row['id']}';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = {dollar(row['content_hash'])}) THEN
    RAISE EXCEPTION '{label} contentHash already exists';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE md5(coalesce(scenario, '') || '|' || question) = {dollar(row['stem_md5'])}
  ) THEN
    RAISE EXCEPTION '{label} stem already exists';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    {dollar(row['id'])}, {dollar(FIELD)}, {dollar(SUBJECT)},
    {dollar(row['scenario'])}, {dollar(row['question'])}, {dollar(row['options_json'])},
    {dollar(row['answer'])}, {dollar(row['explanation'])},
    {dollar(row['tags_json'])}, {dollar(row['references_json'])}::jsonb,
    {dollar('nclex-moc-b2b3')}, {dollar(row['content_hash'])},
    false, false, true,
    {row['difficulty']}, {dollar(LABEL)}, {dollar(DOMAIN)},
    {dollar(row['topic'])}, {dollar(LABEL)},
    {dollar(row['item_type'])}, {dollar('nclex-moc-b2b3')}, {dollar('pending')},
    {dollar(row['meta_json'])}::jsonb, {dollar(row['curation_json'])}::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION '{label} insert expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = {dollar(row['id'])})
       IS DISTINCT FROM {dollar(row['stem_md5'])} THEN
    RAISE EXCEPTION '{label} stem mismatch';
  END IF;
  IF (SELECT active OR "qaPassed" FROM "QuestionBankItem" WHERE id = {dollar(row['id'])}) THEN
    RAISE EXCEPTION '{label} was not inserted held';
  END IF;
END
$do$;"""
        )
    parts.append(
        f"""CREATE TABLE {INSERT_BACKUP} AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ({id_in(ids)});"""
    )
    parts.append(expect_count(f"SELECT count(*) FROM {INSERT_BACKUP}", EXPECTED, "insert backup"))
    parts.append(
        expect_count(
            f"""SELECT count(*) FROM {INSERT_BACKUP}
WHERE active = false AND "qaPassed" = false AND "fieldId" = 'nursing'
  AND "subjectId" = 'management-of-care' AND manual_correction = true
  AND "reviewStatus" = 'pending'""",
            EXPECTED,
            "insert backup held flags",
        )
    )
    parts.append(
        expect_count(
            f"""SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ({hashes})""",
            EXPECTED,
            "new hashes present once",
        )
    )
    return "\n".join(parts) + "\n"


def activate_body(rows: list) -> str:
    values = values_pairs(rows)
    return f"""{refuse_existing(ACTIVATE_BACKUP)}
-- Snapshot the held flags before publishing them.
CREATE TABLE {ACTIVATE_BACKUP} AS
SELECT id, active, "qaPassed", "reviewStatus", "lastReviewedAt", "qaAuditedAt", "updatedAt", "contentHash"
FROM "QuestionBankItem"
WHERE id IN ({id_in([row['id'] for row in rows])});
{expect_count(f"SELECT count(*) FROM {ACTIVATE_BACKUP}", EXPECTED, "activate backup")}
{expect_count(f'''SELECT count(*) FROM {ACTIVATE_BACKUP} b
JOIN (VALUES
{values}
) AS v(id, hash) ON v.id = b.id AND v.hash = b."contentHash"
WHERE b.active = false AND b."qaPassed" = false''', EXPECTED, "activate pre-image")}
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = true,
    "qaPassed" = true,
    "reviewStatus" = 'approved',
    "lastReviewedAt" = CURRENT_TIMESTAMP,
    "qaAuditedAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
  FROM (VALUES
{values}
  ) AS v(id, hash)
  WHERE q.id = v.id
    AND q."contentHash" = v.hash
    AND q.active = false
    AND q."qaPassed" = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> {EXPECTED} THEN
    RAISE EXCEPTION 'activation expected {EXPECTED} rows, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN (VALUES
{values}
) AS v(id, hash) ON v.id = q.id AND v.hash = q."contentHash"
WHERE q.active = true AND q."qaPassed" = true AND q."reviewStatus" = 'approved' ''', EXPECTED, "activated rows")}
"""


def undo_insert_body() -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{INSERT_BACKUP}') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires {INSERT_BACKUP}';
  END IF;
END
$guard$;
{expect_count(f"SELECT count(*) FROM {INSERT_BACKUP}", EXPECTED, "undo insert backup")}
DO $do$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem" q
  USING {INSERT_BACKUP} b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false
    AND q."qaPassed" = false
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed";
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> {EXPECTED} THEN
    RAISE EXCEPTION 'undo insert expected to delete {EXPECTED} held rows, found %. Undo activation first if the rows were published.', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM {INSERT_BACKUP})''', 0, "inserted rows removed")}
"""


def undo_activate_body() -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{ACTIVATE_BACKUP}') IS NULL THEN
    RAISE EXCEPTION 'activation undo requires {ACTIVATE_BACKUP}';
  END IF;
END
$guard$;
{expect_count(f"SELECT count(*) FROM {ACTIVATE_BACKUP}", EXPECTED, "undo activate backup")}
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = b.active,
    "qaPassed" = b."qaPassed",
    "reviewStatus" = b."reviewStatus",
    "lastReviewedAt" = b."lastReviewedAt",
    "qaAuditedAt" = b."qaAuditedAt",
    "updatedAt" = b."updatedAt"
  FROM {ACTIVATE_BACKUP} b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = true
    AND q."qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> {EXPECTED} THEN
    RAISE EXCEPTION 'undo activation expected {EXPECTED} rows, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN {ACTIVATE_BACKUP} b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."reviewStatus" IS NOT DISTINCT FROM b."reviewStatus"''', EXPECTED, "activation flags restored")}
"""


def dry_run(rows: list) -> str:
    ids = id_in([row["id"] for row in rows])
    return f"""{sql_header("00-dry-run.sql", applies=False)}
BEGIN;
SET LOCAL lock_timeout = '15s';
SET LOCAL statement_timeout = '180s';

CREATE TEMP TABLE moc_b2b3_dry_baseline AS
SELECT
  (SELECT count(*)::int FROM "QuestionBankItem") AS all_rows,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active) AS active_n,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed") AS served,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed") AS moc_served;

CREATE TEMP TABLE moc_b2b3_dry_log (
  step text,
  all_rows int,
  active_n int,
  served int,
  moc_served int
);
INSERT INTO moc_b2b3_dry_log SELECT 'baseline', * FROM moc_b2b3_dry_baseline;

{insert_body(rows)}
{activate_body(rows)}

DO $check$
DECLARE b moc_b2b3_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_b2b3_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows + {EXPECTED} THEN
    RAISE EXCEPTION 'forward all_rows % expected %', all_rows, b.all_rows + {EXPECTED};
  END IF;
  IF active_n <> b.active_n + {EXPECTED} THEN
    RAISE EXCEPTION 'forward active % expected %', active_n, b.active_n + {EXPECTED};
  END IF;
  IF served <> b.served + {EXPECTED} THEN
    RAISE EXCEPTION 'forward served % expected %', served, b.served + {EXPECTED};
  END IF;
  IF moc_served <> b.moc_served + {EXPECTED} THEN
    RAISE EXCEPTION 'forward moc_served % expected %', moc_served, b.moc_served + {EXPECTED};
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ({ids}) AND active AND "qaPassed" AND "subjectId" = 'management-of-care') <> {EXPECTED} THEN
    RAISE EXCEPTION 'new rows were not all published into Management of Care';
  END IF;
  INSERT INTO moc_b2b3_dry_log VALUES ('after_insert_activate', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'forward all_rows % -> % (+{EXPECTED})', b.all_rows, all_rows;
  RAISE NOTICE 'forward nursing active % -> % (+{EXPECTED})', b.active_n, active_n;
  RAISE NOTICE 'forward nursing served % -> % (+{EXPECTED})', b.served, served;
  RAISE NOTICE 'forward management-of-care served % -> % (+{EXPECTED})', b.moc_served, moc_served;
END
$check$;

{undo_activate_body()}
{undo_insert_body()}

DO $check$
DECLARE b moc_b2b3_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_b2b3_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows OR active_n <> b.active_n OR served <> b.served OR moc_served <> b.moc_served THEN
    RAISE EXCEPTION 'undo did not restore baseline all=% active=% served=% moc=%', all_rows, active_n, served, moc_served;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ({ids})) <> 0 THEN
    RAISE EXCEPTION 'undo left inserted rows behind';
  END IF;
  INSERT INTO moc_b2b3_dry_log VALUES ('after_undo', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'undo restored all_rows % active % served % moc_served %', all_rows, active_n, served, moc_served;
END
$check$;

SELECT step, all_rows, active_n, served, moc_served FROM moc_b2b3_dry_log ORDER BY step;

ROLLBACK;
"""


def write_apply(name: str, title: str, body: str) -> None:
    text = sql_header(title, applies=True) + "\nBEGIN;\n" + apply_guard(title) + "\n" + body + "\nCOMMIT;\n"
    (OUT / name).write_text(text)


def assert_sql_shapes() -> None:
    dry = (OUT / "00-dry-run.sql").read_text()
    if "COMMIT" in dry:
        raise SystemExit("dry run contains COMMIT")
    if not dry.rstrip().endswith("ROLLBACK;"):
        raise SystemExit("dry run does not end in ROLLBACK")
    if dry.count("\nBEGIN;") != 1:
        raise SystemExit("dry run BEGIN count")
    for name in (
        "01-insert.sql",
        "02-activate-after-rn-review.sql",
        "03-undo-insert.sql",
        "04-undo-activate.sql",
    ):
        text = (OUT / name).read_text()
        if "nclex.moc_b2b3_apply" not in text or not text.rstrip().endswith("COMMIT;"):
            raise SystemExit(f"{name} is missing the apply guard or COMMIT")
        if "06-rollback-DO-NOT-RUN" not in text:
            raise SystemExit(f"{name} is missing the rollback warning")
    if (OUT / "06-rollback-DO-NOT-RUN.sql").exists():
        raise SystemExit("refusing to leave a rollback file in this package")


def main() -> None:
    whitelist = load_whitelist()
    items = load_batch("b2", "items-v7.json", "answer-key-v7.md", "v7")
    items += load_batch("b3", "items-v4.json", "answer-key-v4.md", "v4")
    rows = [pilot_row(item, whitelist) for item in items]
    if len(rows) != EXPECTED:
        raise SystemExit(f"expected {EXPECTED} rows")
    if len({row["id"] for row in rows}) != EXPECTED:
        raise SystemExit("ids are not unique")
    if len({row["content_hash"] for row in rows}) != EXPECTED:
        raise SystemExit("content hashes are not unique")
    if len({row["stem_md5"] for row in rows}) != EXPECTED:
        raise SystemExit("stems are not unique")
    pilot = json.loads((ROOT / "items-v6.json").read_text())["item1"]
    pilot_hashes = {content_hash(item["scenario"], item["question"]) for item in pilot}
    pilot_stems = {stem_md5(item["scenario"], item["question"]) for item in pilot}
    hash_hits = [row for row in rows if row["content_hash"] in pilot_hashes]
    stem_hits = [row for row in rows if row["stem_md5"] in pilot_stems]
    if hash_hits or stem_hits:
        raise SystemExit(
            "collision with the v6 pilot: "
            + ", ".join(f"{row['batch']} Q{row['n']}" for row in hash_hits + stem_hits)
        )

    write_apply("01-insert.sql", "01-insert.sql", insert_body(rows))
    write_apply("02-activate-after-rn-review.sql", "02-activate-after-rn-review.sql", activate_body(rows))
    write_apply("03-undo-insert.sql", "03-undo-insert.sql", undo_insert_body())
    write_apply("04-undo-activate.sql", "04-undo-activate.sql", undo_activate_body())
    (OUT / "00-dry-run.sql").write_text(dry_run(rows))
    assert_sql_shapes()

    manifest = {
        "batches": [
            {
                "batch": row["batch"],
                "version": row["version"],
                "n": row["n"],
                "id": row["id"],
                "type": row["kind"],
                "subtopic": row["subtopic"],
                "blueprintTopic": row["topic"],
                "contentHash": row["content_hash"],
                "stemMd5": row["stem_md5"],
            }
            for row in rows
        ],
        "counts": {
            "items": EXPECTED,
            "batch2": 70,
            "batch3": 70,
            "mc": 116,
            "sata": 18,
            "ord": 6,
        },
        "backupTables": [INSERT_BACKUP, ACTIVATE_BACKUP],
        "applySetting": "nclex.moc_b2b3_apply",
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    check = {
        "rows": [
            {
                "batch": row["batch"],
                "n": row["n"],
                "id": row["id"],
                "contentHash": row["content_hash"],
                "stemMd5": row["stem_md5"],
                "question": row["question"],
                "scenario": row["scenario"],
            }
            for row in rows
        ]
    }
    Path("/tmp/moc-b2b3-dup-check.json").write_text(json.dumps(check))
    print(f"wrote {len(rows)} rows")
    topics: dict[str, int] = {}
    for row in rows:
        topics[row["topic"]] = topics.get(row["topic"], 0) + 1
    for topic, count in sorted(topics.items()):
        print(f"  {topic}: {count}")


if __name__ == "__main__":
    main()
