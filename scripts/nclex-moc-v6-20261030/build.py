#!/usr/bin/env python3
"""Build the held NCLEX MoC v6 insert package. Does not connect to Neon.

Source files live in the review package (bot store), not in this repo.
The SQL this writes is the artifact that gets reviewed.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path("/cursor/stores/bot/nclex-next")
OUT = Path(__file__).resolve().parent
TAG = "nclexmocv6"
FIELD = "nursing"

INSERT_BACKUP = "qbi_nclex_moc_v6_insert_20261030"
REWRITE_BACKUP = "qbi_nclex_item5_v6_rewrite_20261030"
HIDE_BACKUP = "qbi_nclex_item5_ibu_hide_20261030"
ACTIVATE_BACKUP = "qbi_nclex_moc_v6_activate_20261030"

IBUPROFEN = {
    "id": "cmr8p5czr00a11y5nwf6lu2yu",
    "content_hash": "50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba",
    "subject_id": "pharmacology-nursing",
    "correct_answer": "Assess for signs of gastrointestinal bleeding.",
}

# Pre-image captured 2026-10-30 from QuestionBankItem. The UPDATE is guarded on these.
REWRITE_PRIOR = {
    "cmr10qu8s004b1y8a0dec0jwg": {
        "n": 1,
        "content_hash": "13ccd40ece9c834149cf5c6d70675d90c34e143722b4bbf6986add4125df20f8",
        "subject_id": "safety-infection",
    },
    "cmr7h3beq00281yx37jhuz8o1": {
        "n": 2,
        "content_hash": "bba366f15bdd325c010ff2a2f05e591c09c0f1e065cda260e507e1570bc07430",
        "subject_id": "health-promotion",
    },
    "cmr77iubz010y1ywud6yfj667": {
        "n": 3,
        "content_hash": "497358b93fa2f3078b43f20ed9390884ed04866ededc59b0230b179644548de4",
        "subject_id": "pharmacology-nursing",
    },
    "cmr8oj5p000221y5n2ejafia4": {
        "n": 4,
        "content_hash": "a3e6cd1e00b77191d9b677b90d0e99a52b2a0a2ddc43402f94bbfa6a5abe2853",
        "subject_id": "management-of-care",
    },
    "cmr8qk18300b51yvfpi42yu14": {
        "n": 5,
        "content_hash": "f281a8acbbb8d4ef832139ff1147332bbcbb4d7279dd6ff8ec43a611aedc5f17",
        "subject_id": "psychosocial",
    },
    "cmsex2vtw00c61y56oysbpti1": {
        "n": 6,
        "content_hash": "ec09cd8bf9466dccad95842d96c6116d94fb19040cbf0106a58c41fd3e5fae6a",
        "subject_id": "fundamentals",
    },
}

LABELS = {
    "management-of-care": "Management of Care",
    "pharmacology-nursing": "Pharmacological and Parenteral Therapies",
    "health-promotion": "Health Promotion and Maintenance",
    "psychosocial": "Psychosocial Integrity",
}
DOMAINS = {
    "management-of-care": "nclex-safe-care",
    "safety-infection": "nclex-safe-care",
    "psychosocial": "nclex-health-promotion",
    "health-promotion": "nclex-health-promotion",
    "pharmacology-nursing": "nclex-physiological",
}
REF_ALIASES = {
    "NCSBN2026": "NCSBN-TP-2026",
    "ADA2026-S16": "ADA-2026-S16",
    "IDSA-CAP2019": "ATS-IDSA-CAP-2019",
    "CDC-ISO": "CDC-ISO-APPA",
    "CFR482.43": "CFR-482-43",
    "GOLD2026": "GOLD-2026",
    "VADOD-SUI2024": "VADOD-SUICIDE-2024",
}

RESTORE_COLUMNS = [
    "fieldId",
    "subjectId",
    "stateCode",
    "difficulty",
    "topicCategory",
    "blueprintDomain",
    "taskCategory",
    "blueprintTopic",
    "clientNeeds",
    "cjmmFunction",
    "generationVersion",
    "reviewStatus",
    "lastReviewedAt",
    "generationMeta",
    "itemType",
    "stepLevel",
    "patientAgeGroup",
    "scenario",
    "question",
    "options",
    "correctAnswer",
    "explanation",
    "solutionSteps",
    "tags",
    "references",
    "source",
    "contentHash",
    "active",
    "manual_correction",
    "qaPassed",
    "qaAuditedAt",
    "embedding",
    "quality_score",
    "cluster_id",
    "keep_recommendation",
    "review_flag",
    "curation_meta",
    "createdAt",
    "updatedAt",
]


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


def content_hash(subject_id: str, scenario: str, question: str) -> str:
    raw = f"{FIELD}|{subject_id}|{(scenario or '').strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def stem_md5(scenario: str, question: str) -> str:
    return hashlib.md5(f"{scenario or ''}|{question}".encode("utf-8")).hexdigest()


def make_id(n: int) -> str:
    digest = hashlib.sha256(f"nclex-moc-pilot-v6-20261030-item-{n:02d}".encode()).hexdigest()
    return "c" + digest[:24]


def add_proposal_sources(found: dict) -> None:
    proposals = json.loads((ROOT / "item5" / "proposals.json").read_text())
    for src, text in proposals["sources"].items():
        label = text
        url = ""
        if "https://" in text:
            before, after = text.split("https://", 1)
            label = before.strip(" .")
            url = "https://" + after.split()[0].rstrip(").,")
        entry = {"label": label, "url": url}
        found.setdefault(src, entry)
        found.setdefault(REF_ALIASES.get(src, src), entry)


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
        found[src_id] = {"label": parts[1], "url": parts[4]}
    return found


def blueprint_topic(item: dict) -> str:
    n = item["n"]
    sub = item["subtopic"]
    if sub == "Delegation":
        return "delegation-assignment"
    if sub in ("Informed consent", "Advance directives"):
        return "informed-consent-advance-directives"
    if sub == "Client rights and advocacy":
        return "client-advocacy-education"
    if sub == "Handoff and continuity" or sub == "Case management and referrals":
        return "continuity-case-management"
    if sub == "Ethics and legal":
        if n in (37, 38):
            return "quality-improvement"
        if n in (40, 41):
            return "ethical-principles"
        return "legal-aspects"
    if sub == "Prioritization and performance improvement":
        if n in (59, 60):
            return "quality-improvement"
        return "prioritization"
    raise SystemExit(f"unmapped subtopic {sub} on Q{n}")


def load_pilot_items() -> list:
    root = json.loads((ROOT / "items-v6.json").read_text())
    folder = json.loads((ROOT / "item1" / "items-v6.json").read_text())
    if root["item1"] != folder:
        raise SystemExit("items-v6.json item1 does not match item1/items-v6.json")
    items = folder
    if len(items) != 60:
        raise SystemExit(f"expected 60 pilot items, found {len(items)}")
    counts = {"mc": 0, "sata": 0, "ord": 0}
    for item in items:
        counts[item["type"]] = counts.get(item["type"], 0) + 1
        if not item.get("scenario") or not item.get("question"):
            raise SystemExit(f"Q{item['n']} is missing scenario or question")
        if item["key"] != sorted(set(item["key"])):
            if item["type"] != "ord":
                raise SystemExit(f"Q{item['n']} key is not a unique ascending index list")
        if item["type"] == "mc" and item["key"] != [item["key"][0]]:
            raise SystemExit(f"Q{item['n']} mc key")
        if item["type"] == "mc" and len(item["key"]) != 1:
            raise SystemExit(f"Q{item['n']} mc key length")
        if item["type"] == "sata" and len(item["key"]) < 2:
            raise SystemExit(f"Q{item['n']} sata key")
        if item["type"] == "ord" and sorted(item["key"]) != list(range(len(item["options"]))):
            raise SystemExit(f"Q{item['n']} ordered key is not a permutation")
        if any(not isinstance(option, str) or not option.strip() for option in item["options"]):
            raise SystemExit(f"Q{item['n']} has an empty option")
    if counts != {"mc": 46, "sata": 11, "ord": 3}:
        raise SystemExit(f"type counts {counts}, expected 46 mc / 11 sata / 3 ord")
    return items


def load_rewrites() -> list:
    root = json.loads((ROOT / "items-v6.json").read_text())
    v2 = {row["n"]: row["i"] for row in json.loads((ROOT / "item5" / "v2-items.json").read_text())}
    v5 = {row["n"]: row["i"] for row in json.loads((ROOT / "item5" / "v5-items.json").read_text())}
    final = {row["n"]: row["i"] for row in root["item5"]}
    for n in (3, 4, 5):
        if v5[n] != final[n]:
            raise SystemExit(f"item5 #{n} in v5-items.json does not match items-v6.json")
    proposals = json.loads((ROOT / "item5" / "proposals.json").read_text())
    by_id = {row["id"]: row for row in proposals["items"]}
    chosen = [
        v2[1],
        by_id["cmr7h3beq00281yx37jhuz8o1"],
        final[3],
        final[4],
        final[5],
        v2[6],
    ]
    if [row["id"] for row in chosen] != list(REWRITE_PRIOR):
        raise SystemExit(f"rewrite id order { [row['id'] for row in chosen] }")
    if any(row.get("action") == "HIDE" for row in chosen):
        raise SystemExit("a rewrite row is marked HIDE")
    if "cmr8p5czr00a11y5nwf6lu2yu" in {row["id"] for row in chosen}:
        raise SystemExit("ibuprofen row was included in the rewrites")
    return chosen


def reference_objects(refs, whitelist: dict) -> list:
    objects = []
    for ref in refs:
        if isinstance(ref, str):
            src, locator = ref, ""
        else:
            src, locator = ref["src"], ref.get("locator") or ""
        listed = whitelist.get(REF_ALIASES.get(src, src))
        obj = {"src": src, "label": listed["label"] if listed else (locator or src)}
        if locator:
            obj["locator"] = locator
        if listed and listed.get("url"):
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
    topic = blueprint_topic(item)
    subject = "management-of-care"
    scenario = item["scenario"]
    question = item["question"]
    answer = correct_answer(item["type"], item["options"], item["key"])
    options = {
        "kind": options_kind(item["type"]),
        "options": item["options"],
        "clientNeedsCategory": LABELS[subject],
        "blueprintTopic": topic,
    }
    tags = [
        "nclex-moc-pilot-v6",
        "management-of-care",
        topic,
        "held-for-rn-review",
    ]
    meta = {
        "batchId": "nclex-moc-pilot-v6-20261030",
        "pipelineVersion": "nclex-moc-pilot-v6",
        "sourceItem": item["n"],
        "subtopic": item["subtopic"],
        "itemType": item["type"],
        "heldForRnReview": True,
        "manualCorrection": True,
    }
    curation = {
        "metadataBy": "nclex-moc-pilot-v6",
        "heldForRnReview": True,
        "sourceItem": item["n"],
        "subtopic": item["subtopic"],
    }
    return {
        "n": item["n"],
        "id": make_id(item["n"]),
        "subject_id": subject,
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
        "content_hash": content_hash(subject, scenario, question),
        "stem_md5": stem_md5(scenario, question),
        "subtopic": item["subtopic"],
        "kind": item["type"],
    }


def rewrite_row(item: dict, whitelist: dict) -> dict:
    prior = REWRITE_PRIOR[item["id"]]
    subject = item["tags"]["subjectId"]
    topic = item["tags"]["blueprintTopic"]
    if item["tags"]["clientNeeds"] != subject:
        raise SystemExit(f"{item['id']} clientNeeds does not match subjectId")
    if subject not in LABELS:
        raise SystemExit(f"{item['id']} subject {subject}")
    scenario = item["scen"]
    question = item["q"]
    if len(item["key"]) != 1:
        raise SystemExit(f"{item['id']} is not a single-best rewrite")
    answer = item["opts"][item["key"][0]]
    distractors = {}
    for option, reason in zip(item["opts"], item["dr"]):
        if reason.strip() == "(key)":
            continue
        distractors[option] = reason
    options = {
        "kind": "mcq",
        "options": item["opts"],
        "clientNeedsCategory": LABELS[subject],
        "blueprintTopic": topic,
        "distractorRationale": distractors,
    }
    new_hash = content_hash(subject, scenario, question)
    if new_hash == prior["content_hash"]:
        raise SystemExit(f"{item['id']} rewrite did not change the content hash")
    return {
        "n": prior["n"],
        "id": item["id"],
        "subject_id": subject,
        "topic": topic,
        "label": LABELS[subject],
        "domain": DOMAINS[subject],
        "scenario": scenario,
        "question": question,
        "answer": answer,
        "options_json": jdump(options),
        "explanation": item["expl"],
        "references_json": jdump(reference_objects(item["refs"], whitelist)),
        "content_hash": new_hash,
        "stem_md5": stem_md5(scenario, question),
        "old_hash": prior["content_hash"],
        "old_subject": prior["subject_id"],
    }


def sql_header(title: str, applies: bool) -> str:
    hold = (
        "This file COMMITs when nclex.moc_v6_apply is set to 1.\n-- Do not set that until a licensed RN has reviewed the package."
        if applies
        else "This file is a dry run. It ends in ROLLBACK and leaves the database unchanged."
    )
    return f"""-- {title}
-- NCLEX Management of Care pilot v6, built 2026-10-30. Prepared only. Not RN-reviewed.
-- {hold}
-- Target table: "QuestionBankItem". Field: nursing.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: {INSERT_BACKUP}, {REWRITE_BACKUP}, {HIDE_BACKUP}, {ACTIVATE_BACKUP}.
"""


def apply_guard(name: str) -> str:
    return f"""DO $guard$
BEGIN
  IF current_setting('nclex.moc_v6_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '{name}: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
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


def insert_body(rows: list) -> str:
    parts = [
        refuse_existing(INSERT_BACKUP),
        refuse_existing(REWRITE_BACKUP),
        "-- Snapshot the six rewrite targets before any content change.",
        f"""CREATE TABLE {REWRITE_BACKUP} AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ({id_in([row['id'] for row in []]) });""".replace(
            "WHERE id IN ();", "WHERE false;"
        ),
    ]
    # The placeholder above is replaced properly below. Build it cleanly.
    parts = [
        refuse_existing(INSERT_BACKUP),
        refuse_existing(REWRITE_BACKUP),
        "-- Snapshot the six item5 rows before the rewrites.",
        f"""CREATE TABLE {REWRITE_BACKUP} AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ({id_in([row['id'] for row in REWRITE_ROWS])});""",
        expect_count(f"SELECT count(*) FROM {REWRITE_BACKUP}", 6, "rewrite backup"),
    ]
    for row in REWRITE_ROWS:
        parts.append(
            expect_count(
                f"""SELECT count(*) FROM {REWRITE_BACKUP}
WHERE id = {dollar(row['id'])}
  AND "contentHash" = {dollar(row['old_hash'])}
  AND "subjectId" = {dollar(row['old_subject'])}
  AND active = true
  AND "qaPassed" = true""",
                1,
                f"rewrite pre-image {row['id']}",
            )
        )
        parts.append(
            f"""DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    "subjectId" = {dollar(row['subject_id'])},
    scenario = {dollar(row['scenario'])},
    question = {dollar(row['question'])},
    options = {dollar(row['options_json'])},
    "correctAnswer" = {dollar(row['answer'])},
    explanation = {dollar(row['explanation'])},
    "references" = {dollar(row['references_json'])}::jsonb,
    "contentHash" = {dollar(row['content_hash'])},
    "topicCategory" = {dollar(row['label'])},
    "blueprintDomain" = {dollar(row['domain'])},
    "blueprintTopic" = {dollar(row['topic'])},
    "clientNeeds" = {dollar(row['label'])},
    manual_correction = true,
    "qaAuditedAt" = NULL,
    embedding = NULL,
    quality_score = NULL,
    cluster_id = NULL,
    keep_recommendation = NULL,
    review_flag = NULL,
    curation_meta = {dollar(jdump({"metadataBy": "nclex-item5-v6-rewrite", "item5": row["n"], "heldUntilRnReview": True}))}::jsonb,
    "generationMeta" = (
      COALESCE("generationMeta", '{{}}'::jsonb)
      - 'expertRationale'
      - 'visualRationale'
      - 'rationaleQualityScore'
      - 'expertRationaleVersion'
      - 'rationaleEnrichedAt'
      - 'rationaleEnrichFailCount'
      - 'rationaleEnrichFailReason'
    ) || {dollar(jdump({"manualCorrection": True, "nclexItem5V6Rewrite": True, "rewriteBatch": "nclex-item5-v6-20261030", "item5": row["n"]}))}::jsonb,
    "updatedAt" = CURRENT_TIMESTAMP
  WHERE id = {dollar(row['id'])}
    AND "contentHash" = {dollar(row['old_hash'])}
    AND "subjectId" = {dollar(row['old_subject'])}
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'rewrite {row['id']} expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = {dollar(row['id'])})
       IS DISTINCT FROM {dollar(row['stem_md5'])} THEN
    RAISE EXCEPTION 'rewrite stem mismatch for {row['id']}';
  END IF;
  IF (SELECT "contentHash" FROM "QuestionBankItem" WHERE id = {dollar(row['id'])})
       IS DISTINCT FROM {dollar(row['content_hash'])} THEN
    RAISE EXCEPTION 'rewrite hash mismatch for {row['id']}';
  END IF;
END
$do$;"""
        )
    parts.append("-- Insert the 60 Management of Care pilot items, held inactive until activation.")
    for row in rows:
        parts.append(
            f"""DO $do$
DECLARE n integer;
BEGIN
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE id = {dollar(row['id'])}) THEN
    RAISE EXCEPTION 'pilot id already exists: {row['id']}';
  END IF;
  IF EXISTS (SELECT 1 FROM "QuestionBankItem" WHERE "contentHash" = {dollar(row['content_hash'])}) THEN
    RAISE EXCEPTION 'pilot contentHash already exists for Q{row['n']}';
  END IF;
  INSERT INTO "QuestionBankItem" (
    id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
    tags, "references", source, "contentHash", active, "qaPassed", manual_correction,
    difficulty, "topicCategory", "blueprintDomain", "blueprintTopic", "clientNeeds",
    "itemType", "generationVersion", "reviewStatus", "generationMeta", curation_meta,
    "createdAt", "updatedAt"
  ) VALUES (
    {dollar(row['id'])}, {dollar(FIELD)}, {dollar(row['subject_id'])},
    {dollar(row['scenario'])}, {dollar(row['question'])}, {dollar(row['options_json'])},
    {dollar(row['answer'])}, {dollar(row['explanation'])},
    {dollar(row['tags_json'])}, {dollar(row['references_json'])}::jsonb,
    {dollar('nclex-moc-pilot-v6')}, {dollar(row['content_hash'])},
    false, false, true,
    {row['difficulty']}, {dollar(LABELS['management-of-care'])}, {dollar(DOMAINS['management-of-care'])},
    {dollar(row['topic'])}, {dollar(LABELS['management-of-care'])},
    {dollar(row['item_type'])}, {dollar('nclex-moc-pilot-v6')}, {dollar('pending')},
    {dollar(row['meta_json'])}::jsonb, {dollar(row['curation_json'])}::jsonb,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
  );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'pilot insert Q{row['n']} expected 1 row, found %', n;
  END IF;
  IF (SELECT md5(coalesce(scenario, '') || '|' || question) FROM "QuestionBankItem" WHERE id = {dollar(row['id'])})
       IS DISTINCT FROM {dollar(row['stem_md5'])} THEN
    RAISE EXCEPTION 'pilot stem mismatch for Q{row['n']}';
  END IF;
END
$do$;"""
        )
    ids = [row["id"] for row in rows]
    parts.append(
        f"""CREATE TABLE {INSERT_BACKUP} AS
SELECT * FROM "QuestionBankItem"
WHERE id IN ({id_in(ids)});"""
    )
    parts.append(expect_count(f"SELECT count(*) FROM {INSERT_BACKUP}", 60, "insert backup"))
    parts.append(
        expect_count(
            f"""SELECT count(*) FROM {INSERT_BACKUP}
WHERE active = false AND "qaPassed" = false AND "fieldId" = 'nursing'
  AND "subjectId" = 'management-of-care' AND manual_correction = true""",
            60,
            "insert backup held flags",
        )
    )
    hashes = ", ".join(dollar(row["content_hash"]) for row in rows)
    parts.append(
        expect_count(
            f"""SELECT count(*) FROM "QuestionBankItem"
WHERE "contentHash" IN ({hashes})""",
            60,
            "pilot hashes present once",
        )
    )
    return "\n".join(parts) + "\n"


def hide_body() -> str:
    row = IBUPROFEN
    return f"""{refuse_existing(HIDE_BACKUP)}
-- Snapshot the ibuprofen row before hiding it.
CREATE TABLE {HIDE_BACKUP} AS
SELECT * FROM "QuestionBankItem"
WHERE id = {dollar(row['id'])};
{expect_count(f"SELECT count(*) FROM {HIDE_BACKUP}", 1, "ibuprofen backup")}
{expect_count(f'''SELECT count(*) FROM {HIDE_BACKUP}
WHERE "contentHash" = {dollar(row['content_hash'])}
  AND "subjectId" = {dollar(row['subject_id'])}
  AND "correctAnswer" = {dollar(row['correct_answer'])}
  AND active = true
  AND "qaPassed" = true''', 1, "ibuprofen pre-image")}
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    active = false,
    manual_correction = true,
    "updatedAt" = CURRENT_TIMESTAMP,
    "generationMeta" = COALESCE("generationMeta", '{{}}'::jsonb) || {dollar(jdump({"manualCorrection": True, "nclexItem5IbuprofenHide": True, "hideBatch": "nclex-item5-v6-20261030"}))}::jsonb,
    curation_meta = COALESCE(curation_meta, '{{}}'::jsonb) || {dollar(jdump({"metadataBy": "nclex-item5-ibuprofen-hide", "hidden": True}))}::jsonb
  WHERE id = {dollar(row['id'])}
    AND "contentHash" = {dollar(row['content_hash'])}
    AND "subjectId" = {dollar(row['subject_id'])}
    AND "correctAnswer" = {dollar(row['correct_answer'])}
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem"
WHERE id = {dollar(row['id'])} AND active = false AND "qaPassed" = true
  AND "contentHash" = {dollar(row['content_hash'])}''', 1, "ibuprofen hidden")}
"""


def activate_body(rows: list) -> str:
    values = ",\n".join(
        f"({dollar(row['id'])}, {dollar(row['content_hash'])})" for row in rows
    )
    return f"""{refuse_existing(ACTIVATE_BACKUP)}
-- Snapshot the held pilot flags before publishing them.
CREATE TABLE {ACTIVATE_BACKUP} AS
SELECT id, active, "qaPassed", "reviewStatus", "lastReviewedAt", "qaAuditedAt", "updatedAt", "contentHash"
FROM "QuestionBankItem"
WHERE id IN ({id_in([row['id'] for row in rows])});
{expect_count(f"SELECT count(*) FROM {ACTIVATE_BACKUP}", 60, "activate backup")}
{expect_count(f'''SELECT count(*) FROM {ACTIVATE_BACKUP} b
JOIN (VALUES
{values}
) AS v(id, hash) ON v.id = b.id AND v.hash = b."contentHash"
WHERE b.active = false AND b."qaPassed" = false''', 60, "activate pre-image")}
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
  IF n <> 60 THEN
    RAISE EXCEPTION 'activation expected 60 rows, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN (VALUES
{values}
) AS v(id, hash) ON v.id = q.id AND v.hash = q."contentHash"
WHERE q.active = true AND q."qaPassed" = true AND q."reviewStatus" = 'approved' ''', 60, "activated pilot rows")}
"""


def restore_set() -> str:
    return ",\n  ".join(f"{qident(name)} = b.{qident(name)}" for name in RESTORE_COLUMNS)


def undo_insert_body() -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{INSERT_BACKUP}') IS NULL OR to_regclass('public.{REWRITE_BACKUP}') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires {INSERT_BACKUP} and {REWRITE_BACKUP}';
  END IF;
END
$guard$;
{expect_count(f"SELECT count(*) FROM {INSERT_BACKUP}", 60, "undo insert backup")}
{expect_count(f"SELECT count(*) FROM {REWRITE_BACKUP}", 6, "undo rewrite backup")}
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
  {restore_set()}
  FROM {REWRITE_BACKUP} b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 6 THEN
    RAISE EXCEPTION 'undo rewrites expected 6 rows, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN {REWRITE_BACKUP} b ON b.id = q.id
WHERE q."contentHash" = b."contentHash"
  AND q."subjectId" = b."subjectId"
  AND q.question = b.question
  AND q.scenario IS NOT DISTINCT FROM b.scenario
  AND q."correctAnswer" = b."correctAnswer"
  AND q.active = b.active
  AND q."qaPassed" = b."qaPassed"''', 6, "rewrites restored")}
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
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo pilot insert expected to delete 60 held rows, found %. Undo activation first if the pilot was published.', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM {INSERT_BACKUP})''', 0, "pilot rows removed")}
"""


def undo_hide_body() -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{HIDE_BACKUP}') IS NULL THEN
    RAISE EXCEPTION 'hide undo requires {HIDE_BACKUP}';
  END IF;
END
$guard$;
{expect_count(f"SELECT count(*) FROM {HIDE_BACKUP}", 1, "undo hide backup")}
DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
  {restore_set()}
  FROM {HIDE_BACKUP} b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'undo ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN {HIDE_BACKUP} b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."contentHash" = b."contentHash"
  AND q."correctAnswer" = b."correctAnswer"
  AND q.manual_correction = b.manual_correction''', 1, "ibuprofen restored")}
"""


def undo_activate_body() -> str:
    return f"""DO $guard$
BEGIN
  IF to_regclass('public.{ACTIVATE_BACKUP}') IS NULL THEN
    RAISE EXCEPTION 'activation undo requires {ACTIVATE_BACKUP}';
  END IF;
END
$guard$;
{expect_count(f"SELECT count(*) FROM {ACTIVATE_BACKUP}", 60, "undo activate backup")}
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
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo activation expected 60 rows, found %', n;
  END IF;
END
$do$;
{expect_count(f'''SELECT count(*) FROM "QuestionBankItem" q
JOIN {ACTIVATE_BACKUP} b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."reviewStatus" IS NOT DISTINCT FROM b."reviewStatus"''', 60, "activation flags restored")}
"""


def dry_run(rows: list, rewrites: list) -> str:
    pilot_ids = id_in([row["id"] for row in rows])
    rewrite_moved = dollar("cmr10qu8s004b1y8a0dec0jwg")
    return f"""{sql_header("00-dry-run.sql", applies=False)}
BEGIN;

CREATE TEMP TABLE moc_v6_dry_baseline AS
SELECT
  (SELECT count(*)::int FROM "QuestionBankItem") AS all_rows,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active) AS active_n,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed") AS served,
  (SELECT count(*)::int FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed") AS moc_served;

CREATE TEMP TABLE moc_v6_dry_log (
  step text,
  all_rows int,
  active_n int,
  served int,
  moc_served int
);
INSERT INTO moc_v6_dry_log SELECT 'baseline', * FROM moc_v6_dry_baseline;

{insert_body(rows)}
{hide_body()}
{activate_body(rows)}

DO $check$
DECLARE b moc_v6_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_v6_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows + 60 THEN
    RAISE EXCEPTION 'forward all_rows % expected %', all_rows, b.all_rows + 60;
  END IF;
  IF active_n <> b.active_n - 1 + 60 THEN
    RAISE EXCEPTION 'forward active % expected %', active_n, b.active_n + 59;
  END IF;
  IF served <> b.served - 1 + 60 THEN
    RAISE EXCEPTION 'forward served % expected %', served, b.served + 59;
  END IF;
  IF moc_served <> b.moc_served + 61 THEN
    RAISE EXCEPTION 'forward moc_served % expected % (60 new + item5 #1 retag)', moc_served, b.moc_served + 61;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id = {rewrite_moved} AND "subjectId" = 'management-of-care' AND active AND "qaPassed") <> 1 THEN
    RAISE EXCEPTION 'item5 #1 was not retagged into Management of Care';
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id IN ({pilot_ids}) AND active AND "qaPassed") <> 60 THEN
    RAISE EXCEPTION 'pilot rows were not all published by activation';
  END IF;
  INSERT INTO moc_v6_dry_log VALUES ('after_insert_hide_activate', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'forward all_rows % -> % (+60)', b.all_rows, all_rows;
  RAISE NOTICE 'forward nursing active % -> % (+59)', b.active_n, active_n;
  RAISE NOTICE 'forward nursing served % -> % (+59)', b.served, served;
  RAISE NOTICE 'forward management-of-care served % -> % (+61)', b.moc_served, moc_served;
END
$check$;

{undo_activate_body()}
{undo_hide_body()}
{undo_insert_body()}

DO $check$
DECLARE b moc_v6_dry_baseline%ROWTYPE;
DECLARE all_rows int; active_n int; served int; moc_served int;
BEGIN
  SELECT * INTO b FROM moc_v6_dry_baseline;
  SELECT count(*)::int INTO all_rows FROM "QuestionBankItem";
  SELECT count(*)::int INTO active_n FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active;
  SELECT count(*)::int INTO served FROM "QuestionBankItem" WHERE "fieldId" = 'nursing' AND active AND "qaPassed";
  SELECT count(*)::int INTO moc_served FROM "QuestionBankItem" WHERE "subjectId" = 'management-of-care' AND active AND "qaPassed";
  IF all_rows <> b.all_rows OR active_n <> b.active_n OR served <> b.served OR moc_served <> b.moc_served THEN
    RAISE EXCEPTION 'undo did not restore baseline all=% active=% served=% moc=%', all_rows, active_n, served, moc_served;
  END IF;
  IF (SELECT count(*)::int FROM "QuestionBankItem" WHERE id = {dollar(IBUPROFEN['id'])} AND active = true AND "contentHash" = {dollar(IBUPROFEN['content_hash'])}) <> 1 THEN
    RAISE EXCEPTION 'ibuprofen row was not restored';
  END IF;
  INSERT INTO moc_v6_dry_log VALUES ('after_undo', all_rows, active_n, served, moc_served);
  RAISE NOTICE 'undo restored all_rows % active % served % moc_served %', all_rows, active_n, served, moc_served;
END
$check$;

SELECT step, all_rows, active_n, served, moc_served FROM moc_v6_dry_log ORDER BY step;

ROLLBACK;
"""


def write_apply(name: str, title: str, body: str) -> None:
    text = sql_header(title, applies=True) + "\nBEGIN;\n" + apply_guard(title) + "\n" + body + "\nCOMMIT;\n"
    (OUT / name).write_text(text)


def main() -> None:
    global REWRITE_ROWS
    whitelist = load_whitelist()
    add_proposal_sources(whitelist)
    if "NCSBN-TP-2026" not in whitelist:
        raise SystemExit("whitelist did not parse")
    pilot = [pilot_row(item, whitelist) for item in load_pilot_items()]
    if len({row["id"] for row in pilot}) != 60:
        raise SystemExit("pilot ids are not unique")
    if len({row["content_hash"] for row in pilot}) != 60:
        raise SystemExit("pilot hashes are not unique")
    REWRITE_ROWS = [rewrite_row(item, whitelist) for item in load_rewrites()]
    rewrite_hashes = {row["content_hash"] for row in REWRITE_ROWS}
    if len(rewrite_hashes) != 6:
        raise SystemExit("rewrite hashes are not unique")
    if rewrite_hashes & {row["content_hash"] for row in pilot}:
        raise SystemExit("a rewrite hash collides with a pilot hash")

    write_apply("01-insert.sql", "01-insert.sql", insert_body(pilot))
    write_apply("02-hide-ibuprofen.sql", "02-hide-ibuprofen.sql", hide_body())
    write_apply("03-activate-after-rn-review.sql", "03-activate-after-rn-review.sql", activate_body(pilot))
    write_apply("04-undo-insert.sql", "04-undo-insert.sql", undo_insert_body())
    write_apply("05-undo-hide-ibuprofen.sql", "05-undo-hide-ibuprofen.sql", undo_hide_body())
    write_apply("06-undo-activate.sql", "06-undo-activate.sql", undo_activate_body())
    (OUT / "00-dry-run.sql").write_text(dry_run(pilot, REWRITE_ROWS))

    manifest = {
        "pilot": [
            {
                "n": row["n"],
                "id": row["id"],
                "type": row["kind"],
                "subtopic": row["subtopic"],
                "blueprintTopic": row["topic"],
                "contentHash": row["content_hash"],
            }
            for row in pilot
        ],
        "rewrites": [
            {
                "n": row["n"],
                "id": row["id"],
                "subjectId": row["subject_id"],
                "blueprintTopic": row["topic"],
                "oldSubjectId": row["old_subject"],
                "oldContentHash": row["old_hash"],
                "contentHash": row["content_hash"],
            }
            for row in REWRITE_ROWS
        ],
        "hide": IBUPROFEN,
        "backupTables": [INSERT_BACKUP, REWRITE_BACKUP, HIDE_BACKUP, ACTIVATE_BACKUP],
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"wrote {len(pilot)} pilot rows and {len(REWRITE_ROWS)} rewrites")
    for row in REWRITE_ROWS:
        print(f"  item5 #{row['n']} {row['old_subject']} -> {row['subject_id']} {row['topic']}")


REWRITE_ROWS: list = []


if __name__ == "__main__":
    main()
