/**
 * Shared timed/full-exam assembly — mirrors /api/questions?mode=timed&scope=field.
 */
import type { BankItem } from "@/lib/question-bank";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { loadPresetExamItems } from "@/lib/exam-prep/load-preset-exam";
import { prepareNaplexBankItem } from "@/lib/exam-prep/naplex-serve-gate";
import { timedExamGatePairForField } from "@/lib/exam-prep/exam-fill-gates";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import {
  composeBlueprintTimedExamSession,
  fieldSupportsBlueprintTimedExam,
} from "./compose-timed-exam-session";

export type AssembleTimedExamSessionParams = {
  fieldId: string;
  field: string;
  limit: number;
  presetExamNumber?: number;
  focusAreas?: string[];
  sampleCount: number;
};

export type AssembleTimedExamSessionResult = {
  items: BankItem[];
  source: "preset" | "blueprint" | "gather";
  tierId?: string;
};

/** Load bank items for a timed mock using the same path as the questions API. */
export async function assembleTimedExamSessionItems(
  params: AssembleTimedExamSessionParams
): Promise<AssembleTimedExamSessionResult | null> {
  const { fieldId, limit, presetExamNumber, focusAreas, sampleCount } = params;

  if (presetExamNumber) {
    const examSlug = examSlugFromFieldId(fieldId);
    if (!examSlug) return null;
    const preset = await loadPresetExamItems(examSlug, presetExamNumber);
    if (!preset?.items.length) return null;
    return { items: preset.items, source: "preset" };
  }

  if (fieldSupportsBlueprintTimedExam(fieldId)) {
    const composed = await composeBlueprintTimedExamSession({
      fieldId,
      numQuestions: limit,
      focusAreas,
    });
    if (!composed?.items.length) return null;
    return { items: composed.items, source: "blueprint", tierId: composed.tierId };
  }

  const gates = timedExamGatePairForField(fieldId);
  let items: BankItem[];

  if (fieldId === "pharmacy") {
    items = (
      await gatherTimedExamBankItems({
        fieldId,
        limit,
        filterFn: gates.strict,
        relaxedFilterFn: gates.relaxed,
        initialSampleCount: sampleCount,
      })
    ).map(prepareNaplexBankItem);
  } else {
    items = await gatherTimedExamBankItems({
      fieldId,
      limit,
      filterFn: gates.strict,
      relaxedFilterFn: gates.relaxed,
      initialSampleCount: sampleCount,
    });
  }

  if (!items.length) return null;
  return { items, source: "gather" };
}
