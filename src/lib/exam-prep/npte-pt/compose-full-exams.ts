/**
 * Compose NPTE-PT full-length practice exams from QA-passed bank items.
 */
import type { BankItem } from "@/lib/question-bank";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { nptePtItemPassesTimedExamGate } from "@/lib/exam-prep/npte-pt-serve-gate";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import {
  finalizeExamSessionQuestions,
  assertExamSessionReady,
  resolveExamBankSampleCount,
} from "@/lib/questions/finalize-exam-session";
import type { NptePtFullExamBundle } from "./types";
import {
  planNptePtFullExamSlots,
  summarizeNptePtExamBlueprint,
  summarizeNptePtTaskMix,
} from "./blueprint-quota";

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

export async function composeNptePtFullExamSet(params: {
  examCount?: number;
  questionCountPerExam?: number;
}): Promise<NptePtFullExamBundle[]> {
  const examCount = params.examCount ?? 4;
  const questionCount = params.questionCountPerExam ?? 80;
  const usedKeys = new Set<string>();
  const exams: NptePtFullExamBundle[] = [];
  const sampleCount = resolveExamBankSampleCount("npte-pt", questionCount, true);

  for (let examNumber = 1; examNumber <= examCount; examNumber++) {
    let success = false;
    let lastError: unknown;

    for (let attempt = 0; attempt < 8 && !success; attempt++) {
      try {
        const filterFn = (item: BankItem) => {
          if (!nptePtItemPassesTimedExamGate(item)) return false;
          return !usedKeys.has(itemDedupeKey(item));
        };

        const gathered = await gatherTimedExamBankItems({
          fieldId: "npte-pt",
          limit: questionCount + 40,
          filterFn,
          initialSampleCount: sampleCount + attempt * 60,
        });

        if (gathered.length < questionCount) {
          throw new Error(`Insufficient unique items: ${gathered.length}/${questionCount}`);
        }

        const slice = gathered.slice(0, questionCount);
        const rawInputs = slice.map((item, i) =>
          bankItemToRawQuestion(item, i, {
            field: "npte-pt",
            subjectId: item.subjectId ?? "__mixed__",
          })
        );

        const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, questionCount);
        assertExamSessionReady(quality, "npte-pt");

        for (const item of slice) usedKeys.add(itemDedupeKey(item));

        const slots = planNptePtFullExamSlots({ examNumber, questionCount });

        exams.push({
          examNumber,
          title: `NPTE-PT Full-Length Practice Exam ${examNumber}`,
          questionCount,
          blueprintSummary: summarizeNptePtExamBlueprint(slots),
          taskSummary: summarizeNptePtTaskMix(slots),
          actualSubjectMix: summarizeCategories(slice),
          items: slice,
          qaReport: {
            accepted: prepared.length,
            rejected: 0,
            allPassed: quality.ok,
            issues: quality.issues,
          },
        });

        console.log(
          `[npte-pt-compose] Exam ${examNumber}: ${prepared.length}/${questionCount} QA ok=${quality.ok}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`
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
