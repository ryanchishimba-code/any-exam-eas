/**
 * Blueprint-balanced timed exam sessions for live full exams and mocks.
 * Uses board category weights unless focusAreas narrows the exam to specific topics.
 */
import type { BankItem } from "@/lib/question-bank";
import type { SelectionSummary } from "@/lib/exam-prep/naplex/blueprint-selection";
import { composePracticeExamProgressive } from "./compose-practice-exam";
import { resolveExamComposeConfig } from "./exam-compose-config";

export type ComposeTimedExamSessionParams = {
  fieldId: string;
  numQuestions: number;
  /** Blueprint category ids/labels to overweight; omit for full board mix. */
  focusAreas?: string[];
  seed?: number;
};

export type ComposeTimedExamSessionResult = {
  items: BankItem[];
  selectionSummary: SelectionSummary;
  tierId: string;
};

/** True when this field has a published blueprint + compose config. */
export function fieldSupportsBlueprintTimedExam(fieldId: string): boolean {
  return Boolean(resolveExamComposeConfig(fieldId));
}

/**
 * Compose a timed exam session aligned to the board content outline.
 * Progressive tiers relax only when the bank cannot fill at strict bar.
 */
export async function composeBlueprintTimedExamSession(
  params: ComposeTimedExamSessionParams
): Promise<ComposeTimedExamSessionResult | null> {
  const config = resolveExamComposeConfig(params.fieldId);
  if (!config) return null;

  const numQuestions = Math.max(1, Math.floor(params.numQuestions));
  const seed = params.seed ?? ((Date.now() ^ 0x51ed270b) >>> 0);

  const result = await composePracticeExamProgressive(config.slug, {
    numQuestions,
    focusAreas: params.focusAreas?.length ? params.focusAreas : undefined,
    outputFormat: "ids_only",
    seed,
  });

  if (!result || result.items.length < numQuestions) return null;

  return {
    items: result.items.slice(0, numQuestions),
    selectionSummary: result.exam.selectionSummary,
    tierId: result.tier.id,
  };
}
