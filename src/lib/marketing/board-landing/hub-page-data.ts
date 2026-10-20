import { buildHubLandingModel, hubSampleFieldId, type HubExamKey } from "@/lib/marketing/board-landing/hub-model";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";

export async function loadHubBoardLanding(examKey: HubExamKey) {
  const [{ bundle, display }, samples] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getPublicSampleQuestions(),
  ]);
  const exam = display.exams.find((row) => row.slug === examKey);
  const live = !display.degraded && (exam?.served ?? 0) > 0;
  const fieldId = hubSampleFieldId(examKey);
  const sample = samples.find((item) => item.fieldId === fieldId) ?? null;

  const usmleStepCounts =
    examKey === "usmle" && !bundle.inventory.degraded
      ? {
          step1: bundle.inventory.fields["usmle-step-1"]?.active ?? 0,
          step2: bundle.inventory.fields["usmle-step-2"]?.active ?? 0,
          step3: bundle.inventory.fields["usmle-step-3"]?.active ?? 0,
        }
      : undefined;

  const model = buildHubLandingModel({
    examKey,
    degraded: !live,
    units: live ? (bundle.snapshot.boards?.[examKey] ?? null) : null,
    sample,
    usmleStepCounts,
  });

  return { model };
}
