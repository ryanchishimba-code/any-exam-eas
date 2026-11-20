#!/usr/bin/env python3
"""Write the hidden insert, the rollback-only dry run, backup, and undo. No database connection."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VERSION = "usmle-step1-300-20261108-v1"
FIELD = "usmle-step-1"


def q(value):
    return "'" + str(value).replace("'", "''") + "'"


def main():
    items = json.loads((ROOT / "items.json").read_text())
    if len(items) != 300:
        raise SystemExit(f"expected 300 items, got {len(items)}")
    chunks = []
    for item in items:
        options = {
            "options": item["options"],
            "blueprintSystem": item["blueprintDomain"],
            "taskCategory": item["taskCategory"],
            "blueprintTopic": item["blueprintTopic"],
            "kind": "vignette",
        }
        tags = ["usmle", "step1", item["blueprintDomain"], VERSION]
        chunks.append(
            f"""INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "taskCategory", "blueprintTopic", "itemType", "stepLevel", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash",
  "generationVersion", "reviewStatus", "active", "qaPassed", "manual_correction",
  "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  {q(FIELD)},
  {q(item["subjectId"])},
  {int(item["difficulty"])},
  {q(item["blueprintDomain"])},
  {q(item["blueprintDomain"])},
  {q(item["taskCategory"])},
  {q(item["blueprintTopic"])},
  'vignette',
  'step1',
  {q(item["scenario"])},
  {q(item["question"])},
  {q(json.dumps(options, ensure_ascii=False))},
  {q(item["correctAnswer"])},
  {q(item["explanation"])},
  {q(json.dumps(tags, ensure_ascii=False))},
  {q(json.dumps(item["references"], ensure_ascii=False))}::jsonb,
  'generated',
  {q(item["contentHash"])},
  {q(VERSION)},
  'pending',
  false,
  false,
  true,
  NOW(),
  NOW()
);"""
        )
    body = "\n".join(chunks)
    header = f"""-- Hidden Step 1 insert. active=false and qaPassed=false.
-- generationVersion {VERSION}. Do not run until Ryan approves a live load.
-- This file is the insert. The dry run is insert.rollback-only.sql and always rolls back.
"""
    (ROOT / "insert.hidden.sql").write_text(header + "BEGIN;\n" + body + "\nCOMMIT;\n")
    rollback = f"""-- Rollback-only dry run for the hidden Step 1 pack.
-- Confirms {len(items)} rows would insert, then rolls back. Do not remove the ROLLBACK.
-- No rows remain. Do not run until Ryan asks for the dry run; it is a rolled-back transaction.
BEGIN;
{body}
SELECT COUNT(*) AS would_insert
FROM "QuestionBankItem"
WHERE "fieldId" = {q(FIELD)}
  AND "generationVersion" = {q(VERSION)}
  AND source = 'generated';
ROLLBACK;
"""
    (ROOT / "insert.rollback-only.sql").write_text(rollback)
    (ROOT / "undo.sql").write_text(
        f"""-- Scoped undo for the hidden or later-live Step 1 pack.
-- Deletes only generationVersion {VERSION} on {FIELD}.
-- Does not touch any other USMLE row.
-- Do not run unless Ryan asks to take the batch out.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = {q(FIELD)}
  AND "generationVersion" = {q(VERSION)}
  AND source = 'generated';
"""
    )
    (ROOT / "backup.sql").write_text(
        f"""-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "blueprintDomain", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = {q(FIELD)}
    AND "generationVersion" = {q(VERSION)}
) TO STDOUT WITH CSV HEADER;
"""
    )
    print("sql files", len(items))


if __name__ == "__main__":
    main()
