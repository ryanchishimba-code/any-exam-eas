import { servedQuestionCount } from "@/lib/counts";
import { loadFieldBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import {
  boardPageQuestionUnits,
  liveUsmleStepCounts,
  loadLiveBoardQuestionCounts,
} from "@/lib/marketing/live-board-counts";
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
  const [{ bundle, display }, testimonials, bankTypes, liveCounts] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getCachedPublishedTestimonials(6),
    examKey === "usmle" ? Promise.resolve({}) : loadFieldBankTypeCounts(fieldId),
    loadLiveBoardQuestionCounts(),
  ]);
  const snapshotUnits = !display.degraded ? (bundle.snapshot.boards?.[examKey] ?? null) : null;
  const units = boardPageQuestionUnits({ slug: examKey, snapshotUnits, live: liveCounts });
  const counted = units != null && servedQuestionCount(units) > 0;

  const inventorySteps =
    examKey === "usmle" && !bundle.inventory.degraded
      ? {
          step1: bundle.inventory.fields["usmle-step-1"]?.active ?? 0,
          step2: bundle.inventory.fields["usmle-step-2"]?.active ?? 0,
          step3: bundle.inventory.fields["usmle-step-3"]?.active ?? 0,
        }
      : undefined;
  const usmleStepCounts =
    examKey === "usmle" ? (liveUsmleStepCounts(liveCounts) ?? inventorySteps) : undefined;

  const model = buildHubLandingModel({
    examKey,
    degraded: !counted,
    units,
    testimonials,
    usmleStepCounts,
  });

  const liveQuestionCount = units ? servedQuestionCount(units) : 0;
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
