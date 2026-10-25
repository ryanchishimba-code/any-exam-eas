import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";
import type { BoardLandingModel, LandingQuestion } from "@/lib/marketing/board-landing/model";
import { buildLandingQuestionMock, type LandingQuestionMockModel } from "@/lib/marketing/landing-question-mock";
import {
  buildPrepPriceBarChartData,
  type PrepPriceBarChartData,
} from "@/lib/marketing/prep-price-bar-chart";
import type { NclexNgnTypeRow } from "@/lib/marketing/board-landing/nclex-ngn-type-chart";
import type { HubBoardDonutRenderInput } from "@/lib/marketing/board-landing/hub-board-donut";
import type { HubExamKey } from "@/lib/marketing/board-landing/hub-model";
import type { HubLiveBarRow } from "@/lib/marketing/board-landing/hub-live-bar-chart";
import { practiceHref } from "@/lib/routes";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

/** Secondary hero CTA on board hubs (no inline sample). */
export const NAPLEX_SEE_QUESTIONS_HREF = practiceHref("naplex");
export const NCLEX_SEE_QUESTIONS_HREF = practiceHref("nclex");

const BOARD_FAQ_LIMIT = 4;
const NAPLEX_FAQ_LIMIT = BOARD_FAQ_LIMIT;

const MAX_OPTION_RATIONALE = 140;
const MAX_SOURCES = 2;

/** Drop long feature blurbs from RSC flight (visual grid uses sr-only one-liners). */
export function trimFeaturesForFlight(cards: BoardFeatureCard[]): BoardFeatureCard[] {
  return cards.map((card) => ({ ...card, line: "" }));
}

/** Shorter sample copy for landing HTML + flight (full bank rationales stay in-app). */
export function trimLandingSample(question: LandingQuestion | null): LandingQuestion | null {
  if (!question) return null;
  return {
    ...question,
    rationale:
      question.rationale.length > MAX_OPTION_RATIONALE
        ? `${question.rationale.slice(0, MAX_OPTION_RATIONALE - 1)}…`
        : question.rationale,
    sources: question.sources.slice(0, MAX_SOURCES),
    options: question.options.map((option) => ({
      ...option,
      rationale:
        option.rationale && option.rationale.length > MAX_OPTION_RATIONALE
          ? `${option.rationale.slice(0, MAX_OPTION_RATIONALE - 1)}…`
          : option.rationale,
    })),
  };
}

/** Fields the Tesla `BoardLanding` shell actually reads (drops JSON-LD and lean-dead weight). */
export type BoardLandingRenderModel = Pick<
  BoardLandingModel,
  | "h1Lead"
  | "h1Accent"
  | "lede"
  | "trialHref"
  | "trialLabel"
  | "features"
  | "stats"
  | "statsLabel"
  | "sample"
  | "sampleSecondary"
  | "quickBite"
  | "stories"
  | "faqs"
  | "finalHeading"
  | "finalLede"
  | "boardName"
  | "themeClass"
  | "contentYear"
  | "heroCtaName"
  | "heroCtaLocation"
  | "finalCtaName"
  | "finalCtaLocation"
  | "sceneKicker"
  | "sceneIdPrefix"
  | "nclexCompare"
  | "studentTrustBadge"
  | "reviewers"
  | "painPoints"
  | "heroWhyUs"
  | "heroTestimonial"
  | "ctaMicrocopy"
> & {
  lean: true;
  naplexDonut?: NaplexDonutRenderInput;
  priceChart: PrepPriceBarChartData;
  questionMock: LandingQuestionMockModel | null;
};

export type NaplexDonutRenderInput = {
  liveQuestionCount: number;
  includeQuickBite: boolean;
  includeItemTypes: boolean;
};

export type NclexDonutRenderInput = {
  liveQuestionCount: number;
  includeQuickBite: boolean;
  includeNgn: boolean;
};

export type NaplexBoardLandingRenderModel = BoardLandingRenderModel & {
  layout: "naplex";
  seeQuestionsHref: string;
  testimonialsHeading: string;
};

export type NclexBoardLandingRenderModel = BoardLandingRenderModel & {
  layout: "nclex";
  seeQuestionsHref: string;
  testimonialsHeading: string;
  nclexDonut: NclexDonutRenderInput;
  ngnTypeRows: NclexNgnTypeRow[];
  ngnTypeChartAlt: string;
};

const HUB_TESTIMONIALS_HEADING: Record<HubExamKey, string> = {
  usmle: "What medical students say",
  pance: "What PA students say",
  "aanp-fnp": "What FNP students say",
  "npte-pt": "What PT students say",
};

export type HubBoardLandingRenderModel = BoardLandingRenderModel & {
  layout: HubExamKey;
  seeQuestionsHref: string;
  testimonialsHeading: string;
  hubDonut: HubBoardDonutRenderInput;
  liveBarRows: HubLiveBarRow[];
};

export function hubBoardLandingRenderModel(
  model: BoardLandingModel,
  input: {
    examKey: HubExamKey;
    hubDonut: HubBoardDonutRenderInput;
    liveBarRows: HubLiveBarRow[];
  }
): HubBoardLandingRenderModel {
  const base = boardLandingRenderModel(model, { examKey: input.examKey });
  return {
    ...base,
    layout: input.examKey,
    sample: null,
    sampleSecondary: null,
    faqs: model.faqs.slice(0, BOARD_FAQ_LIMIT),
    seeQuestionsHref: practiceHref(input.examKey),
    testimonialsHeading: HUB_TESTIMONIALS_HEADING[input.examKey],
    hubDonut: input.hubDonut,
    liveBarRows: input.liveBarRows,
  };
}

export function nclexBoardLandingRenderModel(
  model: BoardLandingModel,
  input: {
    nclexDonut: NclexDonutRenderInput;
    ngnTypeRows: NclexNgnTypeRow[];
    ngnTypeChartAlt: string;
  }
): NclexBoardLandingRenderModel {
  const base = boardLandingRenderModel(model, { examKey: "nclex" });
  return {
    ...base,
    layout: "nclex",
    sample: null,
    sampleSecondary: null,
    faqs: model.faqs.slice(0, BOARD_FAQ_LIMIT),
    seeQuestionsHref: NCLEX_SEE_QUESTIONS_HREF,
    testimonialsHeading: "What nursing students say",
    nclexDonut: input.nclexDonut,
    ngnTypeRows: input.ngnTypeRows,
    ngnTypeChartAlt: input.ngnTypeChartAlt,
  };
}

export function naplexBoardLandingRenderModel(
  model: BoardLandingModel,
  naplexDonut: NaplexDonutRenderInput
): NaplexBoardLandingRenderModel {
  const base = boardLandingRenderModel(model, { naplexDonut, examKey: "naplex" });
  return {
    ...base,
    layout: "naplex",
    sample: null,
    sampleSecondary: null,
    faqs: model.faqs.slice(0, NAPLEX_FAQ_LIMIT),
    seeQuestionsHref: NAPLEX_SEE_QUESTIONS_HREF,
    testimonialsHeading: "What pharmacy students say",
  };
}

export function boardLandingRenderModel(
  model: BoardLandingModel,
  opts?: { naplexDonut?: NaplexDonutRenderInput; examKey?: ExamSeoKey }
): BoardLandingRenderModel {
  const examKey = opts?.examKey ?? "nclex";
  const trimmedSample = trimLandingSample(model.sample);
  return {
    lean: true,
    h1Lead: model.h1Lead,
    h1Accent: model.h1Accent,
    lede: model.lede,
    trialHref: model.trialHref,
    trialLabel: model.trialLabel,
    features: trimFeaturesForFlight(model.features),
    stats: model.stats,
    statsLabel: model.statsLabel,
    sample: trimmedSample,
    sampleSecondary: trimLandingSample(model.sampleSecondary),
    quickBite: model.quickBite,
    stories: model.stories.slice(0, 3),
    faqs: model.faqs.slice(0, BOARD_FAQ_LIMIT),
    painPoints: model.painPoints,
    heroWhyUs: model.heroWhyUs,
    heroTestimonial: model.heroTestimonial,
    ctaMicrocopy: model.ctaMicrocopy,
    priceChart: buildPrepPriceBarChartData(examKey),
    questionMock: buildLandingQuestionMock(trimmedSample),
    finalHeading: model.finalHeading,
    finalLede: model.finalLede,
    boardName: model.boardName,
    themeClass: model.themeClass,
    contentYear: model.contentYear,
    heroCtaName: model.heroCtaName,
    heroCtaLocation: model.heroCtaLocation,
    finalCtaName: model.finalCtaName,
    finalCtaLocation: model.finalCtaLocation,
    sceneKicker: model.sceneKicker,
    sceneIdPrefix: model.sceneIdPrefix,
    nclexCompare: model.nclexCompare,
    studentTrustBadge: model.studentTrustBadge,
    naplexDonut: opts?.naplexDonut,
    reviewers: model.reviewers.length ? model.reviewers : [],
  };
}
