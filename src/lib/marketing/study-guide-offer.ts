import { landingTrialHrefForExam } from "@/lib/landing/content";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

/** Honest offer for the premium reference books. No discount percentages. */
export function studyGuideTrialLine(): string {
  return `${formatTrialLabel()} — no payment method. Then Pro at ${formatMonthlyPrice("pro")}/mo.`;
}

export type StudyGuideOfferCard = {
  exam: StudyGuideExam;
  title: string;
  body: string;
  trialHref: string;
  signInHref: string;
};

function offerBody(): string {
  return `Bookmarks and highlights save on the trial or Pro plan. ${studyGuideTrialLine()}`;
}

export function studyGuideOfferCards(): StudyGuideOfferCard[] {
  return (Object.keys(STUDY_GUIDES) as StudyGuideExam[]).map((exam) => {
    const config = STUDY_GUIDES[exam];
    return {
      exam,
      title: config.title,
      body: offerBody(),
      trialHref: landingTrialHrefForExam(exam),
      signInHref: `/login?callbackUrl=${encodeURIComponent(config.routeBase)}`,
    };
  });
}

export function isStudyGuideCallback(callbackUrl: string): boolean {
  return /\/(nclex|naplex|aanp-fnp)\/study-guide(\/|$|\?)/.test(callbackUrl);
}
