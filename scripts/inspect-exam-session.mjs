import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { examSessions } from "../src/db/schema.ts";

const id = process.argv[2];
if (!id) {
  console.error("Usage: node scripts/inspect-exam-session.mjs <sessionId>");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);
const [row] = await db.select().from(examSessions).where(eq(examSessions.id, id)).limit(1);

if (!row) {
  console.log("SESSION_NOT_FOUND");
  process.exit(0);
}

const analysis = row.analysis;
console.log(
  JSON.stringify(
    {
      id: row.id,
      userId: row.userId,
      status: row.status,
      examType: row.examType,
      fieldId: row.fieldId,
      questionCount: row.questionCount,
      sessionConfig: analysis?.sessionConfig ?? null,
      answerCount: Array.isArray(row.answers) ? row.answers.length : 0,
      snapshotCount: analysis?.questionSnapshots?.length ?? 0,
      startedAt: row.startedAt,
      updatedAt: row.updatedAt,
    },
    null,
    2
  )
);
