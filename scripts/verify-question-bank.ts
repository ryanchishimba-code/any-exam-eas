import { MIN_QUESTIONS_PER_SUBJECT } from "../src/lib/bulk-question-generator";
import { collectAllSubjectAreas } from "../src/lib/question-bank-seed";
import { getSubjectQuestionCount } from "../src/lib/sync-question-bank";

async function main() {
  const areas = collectAllSubjectAreas();
  const failures: { fieldId: string; subject: string; count: number }[] = [];

  for (const { fieldId, subject } of areas) {
    const count = await getSubjectQuestionCount(fieldId, subject.id);
    if (count < MIN_QUESTIONS_PER_SUBJECT) {
      failures.push({ fieldId, subject: subject.label, count });
    }
  }

  console.log(
    `Checked ${areas.length} subject areas (minimum ${MIN_QUESTIONS_PER_SUBJECT} each).\n`
  );

  if (failures.length === 0) {
    console.log("All subject areas meet the minimum question bank size.");
  } else {
    console.log(`${failures.length} subject area(s) below minimum:\n`);
    for (const f of failures) {
      console.log(`  ${f.fieldId} / ${f.subject}: ${f.count}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
