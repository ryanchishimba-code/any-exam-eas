#!/usr/bin/env python3
"""Insert 100 hidden USMLE Step 3 gap items, or write the dry-run CSV only.

  python3 scripts/insert-usmle-step3-gap-20261114.py --dry-run
  DATABASE_URL=... python3 scripts/insert-usmle-step3-gap-20261114.py --apply

Rows are inserted with active=false. --apply also creates
qbi_usmle_step3_gap_20261114_backup and writes
scripts/undo-usmle-step3-gap-20261114.sql, which deletes exactly those ids.
"""
from __future__ import annotations

import csv
import hashlib
import json
import os
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "usmle-step3-gap-20261114"))
from export_items import BLOOD, MSK, BEHAVIORAL, MULTI, REST  # noqa: E402

BATCH = "usmle-step3-gap-20261114"
FIELD = "usmle-step-3"
BACKUP = "qbi_usmle_step3_gap_20261114_backup"
ITEMS = BLOOD + MSK + BEHAVIORAL + MULTI + REST


def content_hash(subject_id: str, scenario: str, question: str) -> str:
    payload = f"{FIELD}|{subject_id}|{scenario.strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(payload.encode()).hexdigest()


def options_json(item: dict) -> str:
    return json.dumps(
        {
            "options": item["options"],
            "distractorRationale": item["wrongs"],
            "clinicalReasoning": item["principle"],
            "keyTakeaways": [item["principle"]],
        }
    )


def write_csv() -> None:
    path = ROOT / "reports" / f"{BATCH}-dryrun.csv"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "slug",
                "domain",
                "difficulty",
                "band",
                "subjectId",
                "blueprintTopic",
                "taskCategory",
                "correctAnswer",
                "citationUrl",
            ]
        )
        for item in ITEMS:
            writer.writerow(
                [
                    item["slug"],
                    item["domain"],
                    item["difficulty"],
                    item["band"],
                    item["subjectId"],
                    item["blueprintTopic"],
                    item["taskCategory"],
                    item["correctAnswer"],
                    item["reference"]["url"],
                ]
            )
    print(f"Dry-run CSV: {path.relative_to(ROOT)} ({len(ITEMS)} rows)")


def write_undo(ids: list[str]) -> None:
    listed = ",\n".join(f"    '{item_id}'" for item_id in ids)
    sql = f"""-- Undo the hidden USMLE Step 3 gap batch {BATCH}.
-- Deletes exactly these {len(ids)} ids. They were inserted with active=false.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-{BATCH}.sql
BEGIN;
DO $check$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem"
  WHERE id IN (
{listed}
  )
    AND active = false
    AND "generationMeta"->>'batchId' = '{BATCH}';
  IF n <> {len(ids)} THEN
    RAISE EXCEPTION 'expected {len(ids)} hidden batch rows, found %', n;
  END IF;
END
$check$;
DO $delete$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem"
  WHERE id IN (
{listed}
  )
    AND active = false
    AND "generationMeta"->>'batchId' = '{BATCH}';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> {len(ids)} THEN
    RAISE EXCEPTION 'deleted % rows, expected {len(ids)}', n;
  END IF;
END
$delete$;
COMMIT;
"""
    path = ROOT / "scripts" / f"undo-{BATCH}.sql"
    path.write_text(sql)
    print(f"Undo SQL: {path.relative_to(ROOT)}")


def apply() -> None:
    import psycopg

    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        raise SystemExit("DATABASE_URL is required for --apply")
    if len(ITEMS) != 100:
        raise SystemExit(f"expected 100 items, got {len(ITEMS)}")
    now = datetime.now(timezone.utc)
    with psycopg.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT count(*) FROM "QuestionBankItem"
                WHERE "generationMeta"->>'batchId' = %s
                """,
                (BATCH,),
            )
            already = cur.fetchone()[0]
            if already:
                raise SystemExit(f"batch already has {already} rows; refusing to insert again")
            ids: list[str] = []
            for item in ITEMS:
                digest = content_hash(item["subjectId"], item["scenario"], item["question"])
                cur.execute(
                    'SELECT id FROM "QuestionBankItem" WHERE "contentHash" = %s',
                    (digest,),
                )
                clash = cur.fetchone()
                if clash:
                    raise SystemExit(f"content hash collision for {item['slug']} with {clash[0]}")
                item_id = str(uuid.uuid4())
                cur.execute(
                    """
                    INSERT INTO "QuestionBankItem" (
                      id, "fieldId", "subjectId", difficulty, "topicCategory",
                      "blueprintDomain", "blueprintTopic", "taskCategory", "itemType",
                      "stepLevel", scenario, question, options, "correctAnswer",
                      explanation, tags, "references", source, "contentHash",
                      active, "qaPassed", manual_correction, "reviewStatus",
                      "generationVersion", "generationMeta", "createdAt", "updatedAt"
                    ) VALUES (
                      %s, %s, %s, %s, %s,
                      %s, %s, %s, 'vignette',
                      'step3', %s, %s, %s, %s,
                      %s, %s, %s::jsonb, 'editorial', %s,
                      false, false, true, 'pending',
                      %s, %s::jsonb, %s, %s
                    )
                    """,
                    (
                        item_id,
                        FIELD,
                        item["subjectId"],
                        item["difficulty"],
                        item["blueprintTopic"],
                        item["domain"],
                        item["blueprintTopic"],
                        item["taskCategory"],
                        item["scenario"],
                        item["question"],
                        options_json(item),
                        item["correctAnswer"],
                        item["explanation"],
                        json.dumps([BATCH, item["domain"], item["band"], item["slug"]]),
                        json.dumps([item["reference"]]),
                        digest,
                        BATCH,
                        json.dumps(
                            {
                                "batchId": BATCH,
                                "hidden": True,
                                "slug": item["slug"],
                                "band": item["band"],
                                "citationUrl": item["reference"]["url"],
                            }
                        ),
                        now,
                        now,
                    ),
                )
                ids.append(item_id)
            id_sql = ",".join(f"'{item_id}'" for item_id in ids)
            cur.execute(
                f'CREATE TABLE {BACKUP} AS SELECT * FROM "QuestionBankItem" WHERE id IN ({id_sql})'
            )
            cur.execute(f"SELECT count(*) FROM {BACKUP}")
            backed = cur.fetchone()[0]
            if backed != 100:
                raise SystemExit(f"backup count {backed}")
            cur.execute(
                """
                SELECT count(*) FROM "QuestionBankItem"
                WHERE "generationMeta"->>'batchId' = %s AND active = false
                """,
                (BATCH,),
            )
            hidden = cur.fetchone()[0]
            if hidden != 100:
                raise SystemExit(f"hidden count {hidden}")
        conn.commit()
    write_undo(ids)
    print(f"Inserted 100 hidden rows. Backup table: {BACKUP}")


def main() -> None:
    if "--apply" not in sys.argv and "--dry-run" not in sys.argv:
        raise SystemExit("Pass --dry-run or --apply")
    write_csv()
    if "--apply" in sys.argv:
        apply()
    else:
        print("Dry run only. No database writes.")


if __name__ == "__main__":
    main()
