/**
 * Throwaway smoke test: compose a NAPLEX exam from the live local bank and
 * print the Selection Summary + Sequencing Validation Report.
 *   npx tsx scripts/verify-naplex-compose.ts [numQuestions]
 */
import { composeNaplexPracticeExam } from "@/lib/exam-prep/naplex/compose-practice-exam";

async function main() {
  const n = Number(process.argv[2] ?? 100);
  const exam = await composeNaplexPracticeExam({
    numQuestions: n,
    outputFormat: "full_exam_study",
  });

  console.log("\n=== HEADER ===");
  console.log(exam.header);

  console.log("\n=== SELECTION SUMMARY (target vs selected) ===");
  for (const row of exam.selectionSummary.rows) {
    console.log(
      `  ${row.domainLabel.padEnd(48)} target ${String(row.targetCount).padStart(3)} | selected ${String(
        row.selectedCount
      ).padStart(3)} | shortfall ${row.shortfall}`
    );
  }
  console.log("  difficultyMix:", exam.selectionSummary.difficultyMix);
  console.log("  formatMix    :", exam.selectionSummary.formatMix);
  console.log("  notes        :", exam.selectionSummary.notes);

  console.log("\n=== SEQUENCING VALIDATION REPORT ===");
  const r = exam.sequencingReport;
  console.log("  total:", r.total);
  console.log("  domainMinSeparation:", r.domainMinSeparation);
  console.log("  conceptMinSeparation:", r.conceptMinSeparation);
  console.log("  longestAnswerStreak:", r.longestAnswerStreak);
  console.log("  answerDistribution:", r.answerDistribution);
  console.log("  adjacentHardPairs:", r.adjacentHardPairs);
  console.log("  domainGapViolations:", r.domainGapViolations);
  console.log("  conceptGapViolations:", r.conceptGapViolations);
  console.log("  passed:", r.passed);
  console.log("  notes:", r.notes);

  console.log("\n=== FIRST 8 IN SEQUENCE ===");
  for (const q of exam.questions.slice(0, 8)) {
    console.log(
      `  ${String(q.position).padStart(3)}. [${q.domainLabel} | ${q.difficulty} | ${q.format} | ans ${q.answerKey}] ${
        q.question?.slice(0, 70) ?? ""
      }`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
