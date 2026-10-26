import type { BoardQuestionUnits } from "@/lib/counts";
import { getStudyGuideConfig, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import type { BoardFormatCard, BoardQuickBite } from "@/lib/marketing/board-landing/model";
import { nclexFormatCards } from "@/lib/marketing/board-landing/model";
import type { ExamSeoKey } from "@/lib/seo/exam-config";
import { naplexFormatCards } from "@/lib/marketing/board-landing/naplex";

export type BoardFeatureIconId =
  | "ngn"
  | "adaptive"
  | "readiness"
  | "explained"
  | "quick-bites"
  | "qotd"
  | "review"
  | "mobile"
  | "anatomy";

export type BoardFeatureCard = {
  id: string;
  title: string;
  line: string;
  icon: BoardFeatureIconId;
  spotlight?: boolean;
};

/** One crawlable sentence listing live NGN buckets (from nclexFormatCards titles only). */
export function ngnFeatureLineFromFormatCards(cards: BoardFormatCard[]): string {
  if (cards.length === 0) return "";
  const names = cards.map((card) => card.title);
  if (names.length === 1) return `${names[0]} in the live bank.`;
  if (names.length === 2) return `${names[0]} and ${names[1].toLowerCase()} in the live bank.`;
  if (names.length === 3) {
    return `${names[0]}, ${names[1].toLowerCase()}, and ${names[2].toLowerCase()} in the live bank.`;
  }
  return `${names[0]}, ${names[1].toLowerCase()}, ${names[2].toLowerCase()}, and more in the live bank.`;
}

function nclexNgnInput(
  units: BoardQuestionUnits | null,
  bankTypes: Record<string, number>
): Parameters<typeof nclexFormatCards>[0] {
  return {
    bankTypes,
    caseStudies: units?.caseStudies ?? 0,
    caseItems: units?.caseItems ?? 0,
    standaloneNgn: units?.standaloneNgn ?? 0,
    bankNgnStyle: units?.bankNgnStyle ?? 0,
    bankCaseStyle: units?.bankCaseStyle ?? 0,
  };
}

/** Verified NCLEX product features for the board landing grid. */
export function nclexFeatureCards(input: {
  units: BoardQuestionUnits | null;
  bankTypes: Record<string, number>;
  quickBite: BoardQuickBite | null;
}): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [];

  cards.push({
    id: "anatomy-explorer",
    title: "Anatomy Explorer",
    line: "Orbit 3D structures and jump to board-style practice.",
    icon: "anatomy",
    spotlight: true,
  });

  if (input.quickBite) {
    cards.push({
      id: "quick-bites-lectures",
      title: "Quick Bites video lectures",
      line: "Short teaching videos with captions and follow-up quizzes.",
      icon: "quick-bites",
      spotlight: true,
    });
  }

  const ngnCards = nclexFormatCards(nclexNgnInput(input.units, input.bankTypes));
  const ngnLine = ngnFeatureLineFromFormatCards(ngnCards);
  if (ngnLine) {
    cards.push({
      id: "ngn",
      title: "Next Gen NCLEX",
      line: ngnLine,
      icon: "ngn",
    });
  }

  cards.push({
    id: "adaptive",
    title: "CAT & timed exams",
    line: "CAT-style adaptive full exams and timed study blocks.",
    icon: "adaptive",
  });

  cards.push({
    id: "readiness",
    title: "Readiness score",
    line: "Track practice progress and your readiness score in the dashboard.",
    icon: "readiness",
  });

  cards.push({
    id: "explained",
    title: "Every answer explained",
    line: "Keyed answer, distractor reasons, and cited sources on scored items.",
    icon: "explained",
  });

  cards.push({
    id: "qotd",
    title: "Question of the Day",
    line: "One fresh NCLEX-RN question daily — free to try.",
    icon: "qotd",
  });

  cards.push({
    id: "review",
    title: "Topic & weak-area review",
    line: "Blueprint topic drills and silent weak-area blocks.",
    icon: "review",
  });

  cards.push({
    id: "mobile",
    title: "Mobile-friendly",
    line: "Study on your phone without sideways scroll.",
    icon: "mobile",
  });

  return cards;
}

function studyGuideExamForKey(examKey: ExamSeoKey): StudyGuideExam | null {
  const guide = getStudyGuideConfig(examKey);
  return guide?.exam ?? null;
}

function anatomyFeatureCard(): BoardFeatureCard {
  return {
    id: "anatomy-explorer",
    title: "Anatomy Explorer",
    line: "Orbit 3D structures and jump to board-style practice.",
    icon: "anatomy",
    spotlight: true,
  };
}

function quickBitesLectureCard(): BoardFeatureCard {
  return {
    id: "quick-bites-lectures",
    title: "Quick Bites video lectures",
    line: "Short teaching videos with captions and follow-up quizzes.",
    icon: "quick-bites",
    spotlight: true,
  };
}

function explainedCard(boardShort: string): BoardFeatureCard {
  return {
    id: "explained",
    title: "Every answer explained",
    line: "Keyed answer, distractor reasons, and cited sources on scored items.",
    icon: "explained",
  };
}

function qotdCard(boardShort: string): BoardFeatureCard {
  return {
    id: "qotd",
    title: "Question of the Day",
    line: `One fresh ${boardShort} question daily — free to try.`,
    icon: "qotd",
  };
}

function readinessCard(): BoardFeatureCard {
  return {
    id: "readiness",
    title: "Readiness score",
    line: "Track practice progress and your readiness score in the dashboard.",
    icon: "readiness",
  };
}

function mobileCard(): BoardFeatureCard {
  return {
    id: "mobile",
    title: "Mobile-friendly",
    line: "Study on your phone without sideways scroll.",
    icon: "mobile",
  };
}

function practiceExamsCard(boardShort: string): BoardFeatureCard {
  return {
    id: "practice-exams",
    title: "Practice & full exams",
    line: `Timed sets and full-length mocks for ${boardShort}.`,
    icon: "adaptive",
  };
}

function studyGuideCard(boardShort: string): BoardFeatureCard {
  return {
    id: "study-guide",
    title: `${boardShort} study guide`,
    line: "Blueprint-aligned reference chapters included with Pro.",
    icon: "review",
    spotlight: true,
  };
}

/** Verified NAPLEX product features for the board landing grid. */
export function naplexFeatureCards(input: {
  degraded: boolean;
  bankTypes: Record<string, number>;
  quickBite: BoardQuickBite | null;
}): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [];
  const formats = input.degraded ? [] : naplexFormatCards(input.bankTypes);
  const formatLine = ngnFeatureLineFromFormatCards(formats);
  if (formatLine) {
    cards.push({
      id: "formats",
      title: "NAPLEX item types",
      line: formatLine,
      icon: "ngn",
    });
  }
  if (input.quickBite) {
    cards.push(quickBitesLectureCard());
  }
  cards.push(
    {
      id: "calc",
      title: "Pharmacy calculations",
      line: "Dosing and compounding walkthroughs on scored items.",
      icon: "explained",
    },
    qotdCard("NAPLEX"),
    readinessCard(),
    practiceExamsCard("NAPLEX"),
    mobileCard()
  );
  return cards;
}

export function usmleFeatureCards(input: {
  quickBite: BoardQuickBite | null;
  stepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
}): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [anatomyFeatureCard()];
  const steps = (["step1", "step2", "step3"] as const)
    .filter((step) => (input.stepCounts?.[step] ?? 0) > 0)
    .map((step) => (step === "step1" ? "Step 1" : step === "step2" ? "Step 2 CK" : "Step 3"));
  if (steps.length > 0) {
    cards.push({
      id: "steps",
      title: "All three USMLE steps",
      line: `${steps.join(", ")} banks on one Pro plan.`,
      icon: "ngn",
    });
  }
  cards.push(
    explainedCard("USMLE"),
    qotdCard("USMLE"),
    readinessCard(),
    practiceExamsCard("USMLE"),
    mobileCard()
  );
  return cards;
}

export function panceFeatureCards(input?: { quickBite: BoardQuickBite | null }): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [];
  if (studyGuideExamForKey("pance")) {
    cards.push(studyGuideCard("PANCE"));
  }
  if (input?.quickBite) {
    cards.push(quickBitesLectureCard());
  }
  cards.push(
    anatomyFeatureCard(),
    explainedCard("PANCE"),
    qotdCard("PANCE"),
    readinessCard(),
    practiceExamsCard("PANCE"),
    mobileCard()
  );
  return cards;
}

export function aanpFnpFeatureCards(input?: { quickBite: BoardQuickBite | null }): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [];
  if (studyGuideExamForKey("aanp-fnp")) {
    cards.push(studyGuideCard("AANP FNP"));
  }
  if (input?.quickBite) {
    cards.push(quickBitesLectureCard());
  }
  cards.push(
    anatomyFeatureCard(),
    explainedCard("AANP FNP"),
    qotdCard("AANP FNP"),
    readinessCard(),
    practiceExamsCard("AANP FNP"),
    mobileCard()
  );
  return cards;
}

export function npteFeatureCards(): BoardFeatureCard[] {
  return [
    anatomyFeatureCard(),
    explainedCard("NPTE-PT"),
    qotdCard("NPTE-PT"),
    readinessCard(),
    practiceExamsCard("NPTE-PT"),
    mobileCard(),
  ];
}

export function homeFeatureCards(input: {
  ngnCaseStudies: boolean;
  nursingQuickBite: BoardQuickBite | null;
  pharmacyQuickBite: BoardQuickBite | null;
}): BoardFeatureCard[] {
  const cards: BoardFeatureCard[] = [
    {
      id: "six-boards",
      title: "Six boards, one plan",
      line: "NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT on Pro.",
      icon: "adaptive",
      spotlight: true,
    },
    anatomyFeatureCard(),
  ];
  if (input.nursingQuickBite || input.pharmacyQuickBite) {
    cards.push(quickBitesLectureCard());
  }
  if (input.ngnCaseStudies) {
    cards.push({
      id: "ngn",
      title: "Next Gen NCLEX",
      line: "Published NGN case studies and CAT-style exams for nursing.",
      icon: "ngn",
    });
  }
  cards.push(
    explainedCard("board"),
    {
      id: "content-review",
      title: "Content review",
      line: "Named clinical reviewers on scored bank items.",
      icon: "review",
    },
    {
      id: "how-to-pass",
      title: "How to pass in 3 minutes",
      line: "Short walkthrough of Roadmap, Deep Dive, and mock exams.",
      icon: "adaptive",
    },
    qotdCard("board"),
    readinessCard(),
    mobileCard()
  );
  return cards;
}

export function boardFeatureCardsForExam(
  examKey: ExamSeoKey,
  input: {
    degraded: boolean;
    units: BoardQuestionUnits | null;
    bankTypes: Record<string, number>;
    quickBite: BoardQuickBite | null;
    usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
  }
): BoardFeatureCard[] {
  switch (examKey) {
    case "nclex":
      return nclexFeatureCards({
        units: input.units,
        bankTypes: input.bankTypes,
        quickBite: input.quickBite,
      });
    case "naplex":
      return naplexFeatureCards({
        degraded: input.degraded,
        bankTypes: input.bankTypes,
        quickBite: input.quickBite,
      });
    case "usmle":
      return usmleFeatureCards({
        quickBite: input.quickBite,
        stepCounts: input.usmleStepCounts,
      });
    case "pance":
      return panceFeatureCards({ quickBite: input.quickBite });
    case "aanp-fnp":
      return aanpFnpFeatureCards({ quickBite: input.quickBite });
    case "npte-pt":
      return npteFeatureCards();
    default:
      return [];
  }
}
