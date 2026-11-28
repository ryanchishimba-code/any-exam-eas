#!/usr/bin/env python3
"""Insert the hidden USMLE Step 1 gap batch, or write the dry-run CSV only.

Reads the JSON emitted by scripts/insert-usmle-s1-gap-20261114.mjs.
Uses DATABASE_URL. Never prints the connection string.

  python3 scripts/apply-usmle-s1-gap-20261114.py --dry-run /tmp/usmle-s1-gap-rows.json
  python3 scripts/apply-usmle-s1-gap-20261114.py --apply /tmp/usmle-s1-gap-rows.json
"""
import csv
import json
import os
import sys
from pathlib import Path

import psycopg2
from psycopg2.extras import Json

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "reports" / "usmle-s1-gap-20261114-dryrun.csv"
UNDO_PATH = ROOT / "scripts" / "undo-usmle-s1-gap-20261114.sql"
BACKUP = "qbi_usmle_s1_gap_20261114_backup"
SOURCE = "gap-batch-20261114"


def quote_id(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def write_undo(ids):
    id_list = ",\n    ".join(quote_id(i) for i in ids)
    sql = f"""-- Undo the hidden USMLE Step 1 gap batch inserted 2026-11-14.
-- Deletes exactly these {len(ids)} ids, and only while they are still inactive
-- and still tagged source = {SOURCE}. Does not activate anything.
-- Backup table {BACKUP} is left in place.
-- Target: Neon project lively-silence-56893462, database anyexameasy.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  SELECT COUNT(*) INTO n
  FROM "QuestionBankItem"
  WHERE id IN (
    {id_list}
  )
    AND active = false
    AND source = '{SOURCE}';
  IF n <> {len(ids)} THEN
    RAISE EXCEPTION 'abort: expected {len(ids)} inactive gap-batch rows, found %', n;
  END IF;
END $$;
DELETE FROM "QuestionBankItem"
WHERE id IN (
    {id_list}
)
  AND active = false
  AND source = '{SOURCE}';
COMMIT;
"""
    UNDO_PATH.write_text(sql)


def write_csv(rows):
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    with CSV_PATH.open("w", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "id",
                "domain",
                "band",
                "difficulty",
                "subjectId",
                "blueprintTopic",
                "correctAnswer",
                "citationUrl",
                "citationStatus",
                "contentHash",
                "active",
                "qaPassed",
                "action",
            ],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(
                {
                    "id": row["id"],
                    "domain": row["blueprintDomain"],
                    "band": row["band"],
                    "difficulty": row["difficulty"],
                    "subjectId": row["subjectId"],
                    "blueprintTopic": row["blueprintTopic"],
                    "correctAnswer": row["correctAnswer"],
                    "citationUrl": row["references"][0]["url"],
                    "citationStatus": row["citationStatus"],
                    "contentHash": row["contentHash"],
                    "active": "false",
                    "qaPassed": "false",
                    "action": "insert-hidden",
                }
            )


def apply(rows):
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise SystemExit("DATABASE_URL is not set")
    conn = psycopg2.connect(url)
    conn.autocommit = False
    cur = conn.cursor()
    cur.execute("SELECT to_regclass(%s)", (BACKUP,))
    if cur.fetchone()[0] is not None:
        raise SystemExit(f"abort: backup table {BACKUP} already exists")
    ids = [row["id"] for row in rows]
    cur.execute('SELECT id FROM "QuestionBankItem" WHERE id = ANY(%s)', (ids,))
    existing = [r[0] for r in cur.fetchall()]
    if existing:
        raise SystemExit(f"abort: ids already present: {existing[:5]}")
    hashes = [row["contentHash"] for row in rows]
    cur.execute(
        'SELECT "contentHash" FROM "QuestionBankItem" WHERE "contentHash" = ANY(%s)',
        (hashes,),
    )
    hash_hits = [r[0] for r in cur.fetchall()]
    if hash_hits:
        raise SystemExit(f"abort: contentHash collision: {hash_hits[:3]}")
    for row in rows:
        cur.execute(
            """
            INSERT INTO "QuestionBankItem" (
              id, "fieldId", "subjectId", difficulty, "topicCategory",
              "blueprintDomain", "blueprintTopic", "itemType", "stepLevel",
              scenario, question, options, "correctAnswer", explanation,
              tags, "references", source, "contentHash", active, "qaPassed",
              manual_correction, "reviewStatus", "generationVersion", "generationMeta",
              "createdAt", "updatedAt"
            ) VALUES (
              %s, %s, %s, %s, %s,
              %s, %s, %s, %s,
              %s, %s, %s, %s, %s,
              %s, %s, %s, %s, false, false,
              true, 'pending', %s, %s,
              NOW(), NOW()
            )
            """,
            (
                row["id"],
                row["fieldId"],
                row["subjectId"],
                row["difficulty"],
                row["topicCategory"],
                row["blueprintDomain"],
                row["blueprintTopic"],
                row["itemType"],
                row["stepLevel"],
                row["scenario"],
                row["question"],
                row["options"],
                row["correctAnswer"],
                row["explanation"],
                row["tags"],
                Json(row["references"]),
                row["source"],
                row["contentHash"],
                "usmle-step1-gap-20261114",
                Json(
                    {
                        "batchId": row["batchId"],
                        "hidden": True,
                        "blindReadAgreement": 1,
                        "active": False,
                    }
                ),
            ),
        )
    cur.execute(
        f'CREATE TABLE {BACKUP} AS SELECT * FROM "QuestionBankItem" WHERE id = ANY(%s)',
        (ids,),
    )
    cur.execute(
        f"""
        SELECT COUNT(*) FROM {BACKUP}
        WHERE active = false AND source = %s
        """,
        (SOURCE,),
    )
    count = cur.fetchone()[0]
    if count != len(rows):
        conn.rollback()
        raise SystemExit(f"abort: backup count {count} != {len(rows)}")
    cur.execute(
        """
        SELECT COUNT(*) FROM "QuestionBankItem"
        WHERE id = ANY(%s) AND active = true
        """,
        (ids,),
    )
    if cur.fetchone()[0] != 0:
        conn.rollback()
        raise SystemExit("abort: a new row is active")
    conn.commit()
    cur.close()
    conn.close()
    print(f"inserted {len(rows)} hidden rows; backup {BACKUP}")


def main():
    mode, path = sys.argv[1], sys.argv[2]
    rows = json.loads(Path(path).read_text())
    if len(rows) != 100:
        raise SystemExit(f"expected 100 rows, got {len(rows)}")
    ids = [row["id"] for row in rows]
    if len(set(ids)) != 100:
        raise SystemExit("duplicate ids")
    write_csv(rows)
    write_undo(ids)
    print(f"csv {CSV_PATH}")
    print(f"undo {UNDO_PATH}")
    if mode == "--apply":
        apply(rows)
    elif mode != "--dry-run":
        raise SystemExit("use --dry-run or --apply")


if __name__ == "__main__":
    main()
