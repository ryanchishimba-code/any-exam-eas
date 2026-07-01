/**
 * Compose NCLEX-RN full-length practice exams from QA-passed bank items.
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
import { dedupeItemsByClinicalCase, sessionDedupeKey } from "@/lib/exam-prep/diverse-session-selection";
import { enforceExamItemUniqueness } from "@/lib/exam-prep/exam-similarity";
import { timedExamGatePairForField } from "@/lib/exam-prep/exam-fill-gates";
import {
  PROGRESSIVE_COMPOSE_TIERS,
  minQuestionsForTier,
  padToMinimum,
  sessionMeetsTierFill,
  startingTierIndex,
  trimToRequested,
} from "@/lib/exam-prep/progressive-compose";
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
  const gates = timedExamGatePairForField("nursing");

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
            fieldId: "nursing",
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

          let slice: BankItem[];
          if (tier.useDiverseSelection) {
            const casePool = tier.dedupeClinicalCases
              ? dedupeItemsByClinicalCase(gathered)
              : gathered;
            slice = selectNclexSessionBankItems(
              casePool,
              questionCount,
              examNumber * 9973 + attempt + tierIdx * 101
            );
          } else {
            slice = gathered.slice(0, questionCount);
          }

          const usedInExam = new Set(slice.map((i) => sessionDedupeKey(i)));
          slice = padToMinimum(slice, gathered, minCount, usedInExam, sessionDedupeKey);
          slice = trimToRequested(slice, questionCount);
          slice = enforceExamItemUniqueness(slice, questionCount);

          if (!sessionMeetsTierFill(slice.length, questionCount, tier)) {
            lastError = new Error(
              `Selection short: ${slice.length}/${minCount} (tier ${tier.id})`
            );
            continue;
          }

          const rawInputs = slice.map((item, i) =>
            bankItemToRawQuestion(item, i, {
              field: "nursing",
              subjectId: item.subjectId ?? "__mixed__",
            })
          );

          const { prepared, quality } = finalizeExamSessionQuestions(rawInputs, questionCount);

          if (tier.minFillRatio >= 1) {
            assertExamSessionReady(quality, "nursing");
          } else if (!sessionMeetsTierFill(prepared.length, questionCount, tier)) {
            lastError = new Error(
              `QA short: ${prepared.length}/${minCount} (tier ${tier.id})`
            );
            continue;
          }

          if (excludeUsed) {
            for (const item of slice) usedKeys.add(itemDedupeKey(item));
          }

          const slots = planNclexFullExamSlots({ examNumber, questionCount: slice.length });
          const blueprintSummary: Record<string, number> = {};
          for (const slot of slots) {
            blueprintSummary[slot.categoryLabel] =
              (blueprintSummary[slot.categoryLabel] ?? 0) + 1;
          }

          exams.push({
            examNumber,
            title: `NCLEX-RN Full-Length Practice Exam ${examNumber}`,
            questionCount: slice.length,
            blueprintSummary,
            actualSubjectMix: summarizeCategories(slice),
            caseStudyGroups: summarizeCaseStudies(slots),
            items: slice,
            qaReport: {
              accepted: prepared.length,
              rejected: 0,
              allPassed: quality.ok,
              issues: [...quality.issues, `compose_tier:${tier.id}`],
            },
          });

          console.log(
            `[nclex-compose] Exam ${examNumber}: ${prepared.length}/${questionCount} tier=${tier.id} ok=${quality.ok}${attempt > 0 ? ` (attempt ${attempt + 1})` : ""}`
          );
          success = true;
        } catch (err) {
          lastError = err;
        }
      }
    }

    if (!success) {
      console.warn(
        `[nclex-compose] Stopping at exam ${examNumber}: could not assemble exam (${lastError instanceof Error ? lastError.message : "unknown"})`
      );
      break;
    }
  }

  return exams;
}

export { serializeExamForImport };
