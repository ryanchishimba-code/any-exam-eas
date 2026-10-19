import type { BoardQuestionUnits } from "@/lib/counts";
import type { BoardFormatCard, BoardQuickBite } from "@/lib/marketing/board-landing/model";
import { nclexFormatCards } from "@/lib/marketing/board-landing/model";
import { ROUTES } from "@/lib/routes";

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
  href?: string;
  spotlight?: boolean;
};

const NCLEX_QUICK_BITES_HREF = `${ROUTES.dashboard}#video-quick-bites`;

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
    href: ROUTES.anatomy,
    spotlight: true,
  });

  if (input.quickBite) {
    cards.push({
      id: "quick-bites-lectures",
      title: "Quick Bites video lectures",
      line: "Short teaching videos with captions and follow-up quizzes.",
      icon: "quick-bites",
      href: NCLEX_QUICK_BITES_HREF,
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
    line: "Practice progress and a baseline check—in-app only.",
    icon: "readiness",
  });

  cards.push({
    id: "explained",
    title: "Every answer explained",
    line: "Keyed answer, distractor reasons, and sources behind a check mark.",
    icon: "explained",
  });

  cards.push({
    id: "qotd",
    title: "Question of the Day",
    line: "One fresh NCLEX question daily—free to try.",
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
