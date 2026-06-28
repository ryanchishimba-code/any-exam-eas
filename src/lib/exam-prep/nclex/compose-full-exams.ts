/**
 * Compose NCLEX-RN full-length practice exams from QA-passed bank items.
 * Uses live /full-exam sampling gates; reports 2026 blueprint targets vs actual mix.
 */
import type { BankItem } from "@/lib/question-bank";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { nclexItemPassesTimedExamGate } from "@/lib/exam-prep/nclex-serve-gate";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import {
  finalizeExamSessionQuestions,
  assertExamSessionReady,
  resolveExamBankSampleCount,
} from "@/lib/questions/finalize-exam-session";
import { selectNclexSessionBankItems } from "@/lib/exam-prep/nclex/session-selection";
import type { NclexFullExamBundle } from "./types";
import { planNclexFullExamSlots, summarizeCaseStudies } from "./blueprint-quota";
import { serializeExamForImport } from "./generation-pipeline";

function itemDedupeKey(item: BankItem): string {
  return item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
}

function summarizeCategories(items: BankItem[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const label = item.topicCategory ?? item.subjectId ?? "Unknown";
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}

export async function composeNclexFullExamSet(params: {
  examCount?: number;
  questionCountPerExam?: number;
}): Promise<NclexFullExamBundle[]> {
  const examCount = params.examCount ?? 10;
  const questionCount = params.questionCountPerExam ?? 80;
  const usedKeys = new Set<string>();
  const exams: NclexFullExamBundle[] = [];
  const sampleCount = resolveExamBankSampleCount("nursing", questionCount, true);

  for (let examNumber = 1; examNumber <= examCount; examNumber++) {
    let success = false;
    let lastError: unknown;

    for (let attempt = 0; attempt < 8 && !success; attempt++) {
      try {
        const filterFn = (item: BankItem) => {
          if (!nclexItemPassesTimedExamGate(item)) return false;
          return !usedKeys.has(itemDedupeKey(item));
        };

        const gathered = await gatherTimedExamBankItems({
          fieldId: "nursing",
          limit: questionCount + 40,
          filterFn,
          initialSampleCount: sampleCount + attempt * 60,
        });

        if (gathered.length < questionCount) {
          throw new Error(`Insufficient unique items: ${gathered.length}/${questionCount}`);
        }

        const slice = selectNclexSessionBankItems(gathered, questionCount, examNumber * 9973 + attempt);
        const rawInputs = slice.map((item, i) =>
          bankItemToRawQuestion(item, i, {
            field: "nursing",
            subjectId: item.subjectId ?? "__mixed__",
          })
        );

        const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, questionCount);
        assertExamSessionReady(quality, "nursing");

        for (const item of slice) usedKeys.add(itemDedupeKey(item));

        const slots = planNclexFullExamSlots({ examNumber, questionCount });
        const blueprintSummary: Record<string, number> = {};
        for (const slot of slots) {
          blueprintSummary[slot.categoryLabel] =
            (blueprintSummary[slot.categoryLabel] ?? 0) + 1;
        }

        exams.push({
          examNumber,
          title: `NCLEX-RN Full-Length Practice Exam ${examNumber}`,
          questionCount,
          blueprintSummary,
          actualSubjectMix: summarizeCategories(slice),
          caseStudyGroups: summarizeCaseStudies(slots),
          items: slice,
          qaReport: {
            accepted: prepared.length,
            rejected: 0,
            allPassed: quality.ok,
            issues: quality.issues,
          },
        });

        console.log(
          `[nclex-compose] Exam ${examNumber}: ${prepared.length}/${questionCount} QA ok=${quality.ok}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`
        );
        success = true;
      } catch (err) {
        lastError = err;
      }
    }

    if (!success) throw lastError ?? new Error(`Failed exam ${examNumber}`);
  }

  return exams;
}

export { serializeExamForImport };
