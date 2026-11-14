#!/usr/bin/env python3
"""Turn the hidden Step 3 gap batch on after CI is green.

Takes a backup of the current rows, updates scenario/question/contentHash so
the items pass the serve gate, then sets active=true and qaPassed=true.
Writes scripts/undo-usmle-step3-gap-20261114-activate.sql, which turns the
same ids back off without deleting them.
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "usmle-step3-gap-20261114"))
from export_items import BLOOD, MSK, BEHAVIORAL, MULTI, REST  # noqa: E402

BATCH = "usmle-step3-gap-20261114"
FIELD = "usmle-step-3"
BACKUP = "qbi_usmle_step3_gap_20261114_activate_backup"
ITEMS = {item["slug"]: item for item in BLOOD + MSK + BEHAVIORAL + MULTI + REST}


def content_hash(subject_id: str, scenario: str, question: str) -> str:
    payload = f"{FIELD}|{subject_id}|{scenario.strip().lower()}|{question.strip().lower()}"
    return hashlib.sha256(payload.encode()).hexdigest()


def write_undo(ids: list[str]) -> None:
    listed = ",\n".join(f"    '{item_id}'" for item_id in ids)
    sql = f"""-- Turn the USMLE Step 3 gap batch {BATCH} back off.
-- Sets active=false and qaPassed=false on exactly these {len(ids)} ids.
-- Does not delete the rows.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-{BATCH}-activate.sql
BEGIN;
DO $check$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n
  FROM "QuestionBankItem"
  WHERE id IN (
{listed}
  )
    AND active = true
    AND "qaPassed" = true
    AND "generationMeta"->>'batchId' = '{BATCH}';
  IF n <> {len(ids)} THEN
    RAISE EXCEPTION 'expected {len(ids)} active batch rows, found %', n;
  END IF;
END
$check$;
DO $hide$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem"
  SET active = false,
      "qaPassed" = false,
      "updatedAt" = NOW()
  WHERE id IN (
{listed}
  )
    AND active = true
    AND "qaPassed" = true
    AND "generationMeta"->>'batchId' = '{BATCH}';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> {len(ids)} THEN
    RAISE EXCEPTION 'hid % rows, expected {len(ids)}', n;
  END IF;
END
$hide$;
COMMIT;
"""
    path = ROOT / "scripts" / f"undo-{BATCH}-activate.sql"
    path.write_text(sql)
    print(f"Activation undo: {path.relative_to(ROOT)}")


def main() -> None:
    import psycopg

    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        raise SystemExit("DATABASE_URL is required")
    if len(ITEMS) != 100:
        raise SystemExit(f"expected 100 items, got {len(ITEMS)}")
    now = datetime.now(timezone.utc)
    with psycopg.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, "subjectId", "generationMeta"->>'slug'
                FROM "QuestionBankItem"
                WHERE "generationMeta"->>'batchId' = %s
                ORDER BY id
                """,
                (BATCH,),
            )
            rows = cur.fetchall()
            if len(rows) != 100:
                raise SystemExit(f"found {len(rows)} batch rows, expected 100")
            updates = []
            for item_id, subject_id, slug in rows:
                item = ITEMS.get(slug or "")
                if item is None:
                    raise SystemExit(f"no source item for slug {slug}")
                if item["subjectId"] != subject_id:
                    raise SystemExit(f"subject mismatch for {slug}")
                digest = content_hash(subject_id, item["scenario"], item["question"])
                cur.execute(
                    """
                    SELECT id FROM "QuestionBankItem"
                    WHERE "contentHash" = %s AND id <> %s
                    """,
                    (digest, item_id),
                )
                clash = cur.fetchone()
                if clash:
                    raise SystemExit(f"hash collision for {slug} with {clash[0]}")
                updates.append((item, digest, item_id))

            cur.execute(f"DROP TABLE IF EXISTS {BACKUP}")
            id_sql = ",".join(f"'{item_id}'" for _, _, item_id in updates)
            cur.execute(
                f'CREATE TABLE {BACKUP} AS SELECT * FROM "QuestionBankItem" WHERE id IN ({id_sql})'
            )
            cur.execute(f"SELECT count(*) FROM {BACKUP}")
            if cur.fetchone()[0] != 100:
                raise SystemExit("backup count was not 100")

            for item, digest, item_id in updates:
                cur.execute(
                    """
                    UPDATE "QuestionBankItem"
                    SET scenario = %s,
                        question = %s,
                        "contentHash" = %s,
                        active = true,
                        "qaPassed" = true,
                        "updatedAt" = %s
                    WHERE id = %s
                      AND "generationMeta"->>'batchId' = %s
                    """,
                    (item["scenario"], item["question"], digest, now, item_id, BATCH),
                )
                if cur.rowcount != 1:
                    raise SystemExit(f"failed to activate {item['slug']}")

            cur.execute(
                """
                SELECT count(*) FROM "QuestionBankItem"
                WHERE "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true
                """
            )
            served = cur.fetchone()[0]
            cur.execute(
                """
                SELECT count(*) FROM "QuestionBankItem"
                WHERE "generationMeta"->>'batchId' = %s AND active = true AND "qaPassed" = true
                """,
                (BATCH,),
            )
            batch_on = cur.fetchone()[0]
            if batch_on != 100:
                raise SystemExit(f"activated {batch_on}, expected 100")
        conn.commit()
    write_undo([item_id for _, _, item_id in updates])
    print(f"Activated 100 rows. Served Step 3 count: {served}")
    print(f"Backup table: {BACKUP}")


if __name__ == "__main__":
    main()
