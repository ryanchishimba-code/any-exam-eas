import { FIELD_LABELS } from "../src/lib/fields.ts";
import { getSubjectsForField } from "../src/lib/field-subjects.ts";
import { getBankQuestions } from "../src/lib/question-bank.ts";

const COUNTS = [10, 15, 20, 25, 30, 35, 40, 45, 50];

const failures = [];

for (const field of FIELD_LABELS) {
  const subjects = getSubjectsForField(field);
  if (subjects.length === 0) {
    failures.push({ field, subject: "(none)", count: "-", got: 0, reason: "no subjects defined" });
    continue;
  }
  for (const subject of subjects) {
    for (const count of COUNTS) {
      const questions = getBankQuestions({
        field,
        subjectId: subject.id,
        topic: subject.label,
        count,
      });
      if (questions.length !== count) {
        failures.push({
          field,
          subject: subject.label,
          subjectId: subject.id,
          requested: count,
          got: questions.length,
        });
      }
    }
  }
}

console.log("=== Question count test ===\n");
if (failures.length === 0) {
  console.log("All subjects passed all counts (10-50).");
} else {
  const bySubject = new Map();
  for (const f of failures) {
    const key = `${f.field}::${f.subject}`;
    if (!bySubject.has(key)) bySubject.set(key, { ...f, maxGot: f.got, failures: [] });
    const entry = bySubject.get(key);
    entry.failures.push(`${f.requested}→${f.got}`);
    entry.maxGot = Math.max(entry.maxGot, f.got);
  }
  console.log(`Failures: ${failures.length} (unique subjects with gaps: ${bySubject.size})\n`);
  for (const [, v] of bySubject) {
    console.log(`${v.field} / ${v.subject} (${v.subjectId}): max available = ${v.maxGot}`);
    console.log(`  gaps: ${[...new Set(v.failures)].slice(0, 8).join(", ")}${v.failures.length > 8 ? "…" : ""}`);
  }
}

process.exit(failures.length > 0 ? 1 : 0);
