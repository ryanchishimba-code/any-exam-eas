/**
 * Compose NPTE-PT full-length practice exams from QA-passed bank items.
 * Uses progressive threshold lowering when the bank cannot fill strict unique exams.
 */
import type { BankItem } from "@/lib/question-bank";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import {
  finalizeExamSessionQuestions,
  assertExamSessionReady,
  resolveExamBankSampleCount,
} from "@/lib/questions/finalize-exam-session";
import { timedExamGatePairForField } from "@/lib/exam-prep/exam-fill-gates";
import {
  PROGRESSIVE_COMPOSE_TIERS,
  minQuestionsForTier,
  padToMinimum,
  sessionMeetsTierFill,
  startingTierIndex,
  trimToRequested,
} from "@/lib/exam-prep/progressive-compose";
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
  const gates = timedExamGatePairForField("npte-pt");

  for (let examNumber = 1; examNumber <= examCount; examNumber++) {
    let success = false;
    let lastError: unknown;
    const tierStart = startingTierIndex(0, exams.length);

    for (let tierIdx = tierStart; tierIdx < PROGRESSIVE_COMPOSE_TIERS.length && !success; tierIdx++) {
      const tier = PROGRESSIVE_COMPOSE_TIERS[tierIdx]!;
      const minCount = minQuestionsForTier(questionCount, tier);

      for (let attempt = 0; attempt < 4 && !success; attempt++) {
        try {
          const excludeUsed = !tier.allowCrossExamReuse;
          const gateFn =
            tier.useRelaxedGate && gates.relaxed ? gates.relaxed : gates.strict;

          const filterFn = (item: BankItem) => {
            if (!gateFn(item)) return false;
            if (excludeUsed && usedKeys.has(itemDedupeKey(item))) return false;
            return true;
          };

          const gathered = await gatherTimedExamBankItems({
            fieldId: "npte-pt",
            limit: questionCount + 60,
            filterFn,
            relaxedFilterFn: tier.useRelaxedGate ? gates.relaxed : undefined,
            initialSampleCount: sampleCount + attempt * 60 + tierIdx * 40,
          });

          if (gathered.length < minCount) {
            lastError = new Error(
              `Insufficient items: ${gathered.length}/${minCount} (tier ${tier.id})`
            );
            continue;
          }

          let slice = gathered.slice(0, questionCount);
          const usedInExam = new Set(slice.map((i) => itemDedupeKey(i)));
          slice = padToMinimum(slice, gathered, minCount, usedInExam, itemDedupeKey);
          slice = trimToRequested(slice, questionCount);

          if (!sessionMeetsTierFill(slice.length, questionCount, tier)) {
            lastError = new Error(
              `Selection short: ${slice.length}/${minCount} (tier ${tier.id})`
            );
            continue;
          }

          const rawInputs = slice.map((item, i) =>
            bankItemToRawQuestion(item, i, {
              field: "npte-pt",
              subjectId: item.subjectId ?? "__mixed__",
            })
          );

          const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, questionCount);

          if (tier.minFillRatio >= 1) {
            assertExamSessionReady(quality, "npte-pt");
          } else if (!sessionMeetsTierFill(prepared.length, questionCount, tier)) {
            lastError = new Error(
              `QA short: ${prepared.length}/${minCount} (tier ${tier.id})`
            );
            continue;
          }

          if (excludeUsed) {
            for (const item of slice) usedKeys.add(itemDedupeKey(item));
          }

          const slots = planNptePtFullExamSlots({ examNumber, questionCount: slice.length });

          exams.push({
            examNumber,
            title: `NPTE-PT Full-Length Practice Exam ${examNumber}`,
            questionCount: slice.length,
            blueprintSummary: summarizeNptePtExamBlueprint(slots),
            taskSummary: summarizeNptePtTaskMix(slots),
            actualSubjectMix: summarizeCategories(slice),
            items: slice,
            qaReport: {
              accepted: prepared.length,
              rejected: 0,
              allPassed: quality.ok,
              issues: [...quality.issues, `compose_tier:${tier.id}`],
            },
          });

          console.log(
            `[npte-pt-compose] Exam ${examNumber}: ${prepared.length}/${questionCount} tier=${tier.id} ok=${quality.ok}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`
          );
          success = true;
        } catch (err) {
          lastError = err;
        }
      }
    }

    if (!success) {
      console.warn(
        `[npte-pt-compose] Stopping at exam ${examNumber}: could not assemble exam (${lastError instanceof Error ? lastError.message : "unknown"})`
      );
      break;
    }
  }

  return exams;
}
