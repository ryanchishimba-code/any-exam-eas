import { scoredQuestionCount } from "@/lib/counts";
import { loadFieldBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import {
  hubBoardIncludesStudyGuide,
  type HubBoardDonutRenderInput,
} from "@/lib/marketing/board-landing/hub-board-donut";
import { buildHubLiveBarRows } from "@/lib/marketing/board-landing/hub-live-bar-chart";
import {
  buildHubLandingModel,
  hubSampleFieldId,
  type HubExamKey,
} from "@/lib/marketing/board-landing/hub-model";
import { hubBoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";

function usmleStepsPopulated(
  stepCounts: Partial<Record<"step1" | "step2" | "step3", number>>
): boolean {
  return (["step1", "step2", "step3"] as const).every((step) => (stepCounts[step] ?? 0) > 0);
}

export async function loadHubBoardLanding(examKey: HubExamKey) {
  const fieldId = hubSampleFieldId(examKey);
  const [{ bundle, display }, testimonials, bankTypes] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getCachedPublishedTestimonials(6),
    examKey === "usmle" ? Promise.resolve({}) : loadFieldBankTypeCounts(fieldId),
  ]);
  const exam = display.exams.find((row) => row.slug === examKey);
  const live = !display.degraded && (exam?.served ?? 0) > 0;
  const units = live ? (bundle.snapshot.boards?.[examKey] ?? null) : null;

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
    units,
    testimonials,
    usmleStepCounts,
  });

  const liveQuestionCount = units ? scoredQuestionCount(units) : 0;
  const hubDonut: HubBoardDonutRenderInput = {
    examKey,
    liveQuestionCount,
    includeStudyGuide: hubBoardIncludesStudyGuide(examKey),
    includeAllUsmleSteps: examKey === "usmle" && usmleStepsPopulated(usmleStepCounts ?? {}),
  };
  const liveBarRows = buildHubLiveBarRows(examKey, {
    usmleStepCounts,
    bankTypes,
  });
  const render = hubBoardLandingRenderModel(model, {
    examKey,
    hubDonut,
    liveBarRows,
  });

  return { model, render };
}
