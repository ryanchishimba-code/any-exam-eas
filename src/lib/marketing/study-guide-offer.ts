import { landingTrialHrefForExam } from "@/lib/landing/content";
import {
  STUDY_GUIDES,
  studyGuideRouteBases,
  type StudyGuideExam,
} from "@/lib/nclex-study-guide/guide-registry";
import { formatPricingCheckoutTrialOffer } from "@/lib/site";

/** Honest offer for the premium reference books. No discount percentages. */
export function studyGuideTrialLine(): string {
  return formatPricingCheckoutTrialOffer();
}

export type StudyGuideOfferCard = {
  exam: StudyGuideExam;
  title: string;
  body: string;
  trialHref: string;
  signInHref: string;
};

function offerBody(): string {
  return "Included with your trial. Bookmarks and highlights save on the trial or Pro plan.";
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
  const path = callbackUrl.split("?")[0] ?? callbackUrl;
  return studyGuideRouteBases().some(
    (base) => path === base || path.startsWith(`${base}/`)
  );
}
