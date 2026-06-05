/**
 * Pull random questions per exam hub and run the same prep/scoring path as study sessions.
 * Usage: npx tsx scripts/sample-exam-questions.mjs
 */
import { EXAM_HUBS } from "../src/lib/exams/catalog.ts";
import { getFieldMeta } from "../src/lib/fields.ts";
import { getSubjectsForFieldId } from "../src/lib/subjects/registry.ts";
import {
  prepareQuestionsForSession,
  isAnswerCorrect,
} from "../src/lib/questions/prepare.ts";
import { sampleQuestionBankItems } from "../src/lib/question-bank-db.ts";
import { getSubjectQuestionCount } from "../src/lib/sync-question-bank.ts";

const SAMPLES_PER_EXAM = 2;

function truncate(text, max = 220) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

async function main() {
  console.log("=== Random exam question sample ===\n");

  for (const hub of EXAM_HUBS) {
    const meta = getFieldMeta(hub.fieldId);
    const fieldLabel = meta?.label ?? hub.fieldId;
    const subjects = getSubjectsForFieldId(hub.fieldId);
    const subject = subjects[Math.floor(Math.random() * subjects.length)];

    console.log(`── ${hub.title} (${hub.slug}) ──`);
    console.log(`   Field: ${hub.fieldId} · Subject: ${subject?.label ?? "—"} (${subject?.id})\n`);

    if (!subject) {
      console.log("   No subjects registered.\n");
      continue;
    }

    const count = await getSubjectQuestionCount(hub.fieldId, subject.id);
    const items =
      hub.slug === "top500"
        ? []
        : await sampleQuestionBankItems({
            fieldId: hub.fieldId,
            subjectId: subject.id,
            count: SAMPLES_PER_EXAM,
          });
    console.log(`   Bank: ${count.toLocaleString()} active items in this subject\n`);

    if (hub.slug === "top500") {
      console.log("   (flashcards only — use /study/drugs300)\n");
      continue;
    }

    if (items.length === 0) {
      console.log("   (empty — sync question bank or seed)\n");
      continue;
    }

    const raw = items.map((item, i) => ({
      id: i + 1,
      type: "multiple_choice",
      question: item.question,
      options: [...item.options],
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      tags: item.tags,
      field: fieldLabel,
      subjectId: subject.id,
      bankItemId: item.id,
    }));

    const prepared = prepareQuestionsForSession(raw, { shuffleOrder: true });

    for (let i = 0; i < prepared.length; i++) {
      const q = prepared[i];
      const correctOpt = q.correctAnswers[0] ?? "";
      const wrongOpt =
        q.options.find((o) => o !== correctOpt) ?? q.options[0] ?? "";

      const correctHit = isAnswerCorrect(q, [correctOpt]);
      const wrongHit = isAnswerCorrect(q, [wrongOpt]);

      console.log(`   Q${i + 1} [${q.type}] bank:${raw[i].bankItemId}`);
      console.log(`   Stem: ${truncate(q.stem, 280)}`);
      console.log(`   Options (${q.options.length}):`);
      for (const opt of q.options.slice(0, 4)) {
        const mark = opt === correctOpt ? " ✓" : "";
        console.log(`     • ${truncate(opt, 72)}${mark}`);
      }
      if (q.options.length > 4) console.log(`     … +${q.options.length - 4} more`);
      console.log(`   Correct (stored): ${truncate(correctOpt, 80)}`);
      console.log(`   Scoring: correct pick → ${correctHit}, wrong pick → ${wrongHit}`);
      console.log(`   Rationale: ${truncate(q.explanation, 200)}\n`);
    }
  }

}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
