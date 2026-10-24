#!/usr/bin/env node
/**
 * Read-only audit: PANCE practice exam sessions whose stored selection text
 * is not an exact option on the submitted question snapshot (shift / corrupt save).
 *
 * Usage:
 *   node scripts/audit-pance-exam-answer-integrity.mjs
 *   node scripts/audit-pance-exam-answer-integrity.mjs --since 2026-10-01
 *
 * Re-scoring dry-run (no writes): lists completed sessions that would need
 * manual review if selections were wrong; cannot infer the student's intent.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const since = (() => {
  const i = process.argv.indexOf("--since");
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : "2026-06-01";
})();

const sql = neon(process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const rows = await sql`
  WITH sessions AS (
    SELECT id, status, answers, analysis, "updatedAt"
    FROM exam_sessions
    WHERE "fieldId" = 'pance'
      AND "updatedAt" >= ${since}::timestamptz
      AND jsonb_array_length(answers) > 0
  ),
  expanded AS (
    SELECT
      s.id AS session_id,
      s.status,
      s."updatedAt",
      (a.elem->>'questionIndex')::int AS q_index,
      trim(a.elem->>'selected') AS selected,
      a.elem->>'questionId' AS question_id,
      s.analysis->'questionSnapshots' AS snapshots
    FROM sessions s
    CROSS JOIN LATERAL jsonb_array_elements(s.answers) AS a(elem)
    WHERE coalesce(trim(a.elem->>'selected'), '') <> ''
      AND coalesce(a.elem->>'selected', '') NOT LIKE '%|||%'
      AND left(trim(a.elem->>'selected'), 1) <> '['
  )
  SELECT
    session_id,
    status,
    q_index,
    question_id,
    selected,
    snapshots->q_index->'options' AS options_at_index
  FROM expanded e
  WHERE snapshots IS NOT NULL
    AND jsonb_typeof(snapshots) = 'array'
    AND q_index IS NOT NULL
    AND q_index < jsonb_array_length(snapshots)
    AND NOT EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(snapshots->q_index->'options') opt(val)
      WHERE opt.val = e.selected
    )
  ORDER BY "updatedAt" DESC
`;

const sessionIds = new Set(rows.map((r) => r.session_id));
console.log(
  JSON.stringify(
    {
      since,
      sessionsScannedNote: "PANCE sessions with answers since date",
      mismatchRows: rows.length,
      affectedSessions: sessionIds.size,
      rows,
      rescoreDryRun:
        rows.length === 0
          ? "No snapshot/selection mismatches; re-scoring would not change stored selections."
          : "Manual review required — automated re-score cannot recover intended clicks.",
    },
    null,
    2
  )
);
