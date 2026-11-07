import { LANDING_TRIAL_HREF } from "@/lib/landing/trial-href";
import {
  FREE_PRACTICE_BOARDS,
  FREE_PRACTICE_PATH,
  type FreePracticeBoardSlug,
} from "@/lib/marketing/free-practice/paths";
import { FREE_PRACTICE_QUESTIONS, type FreePracticeQuestion } from "@/lib/marketing/free-practice/questions";
import { absoluteUrl } from "@/lib/seo";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";

export { FREE_PRACTICE_BOARDS, FREE_PRACTICE_PATH, freePracticeHref } from "@/lib/marketing/free-practice/paths";
export type { FreePracticeBoardSlug } from "@/lib/marketing/free-practice/paths";

export const FREE_PRACTICE_TITLE = enforceMetaTitle(
  "Free NCLEX, NAPLEX & USMLE Practice Questions",
  FREE_PRACTICE_PATH
);

export const FREE_PRACTICE_DESCRIPTION = enforceMetaDescription(
  "Free NCLEX practice questions, free NAPLEX practice questions, and free PANCE, AANP FNP, USMLE, and NPTE-PT practice questions with answers and rationales.",
  FREE_PRACTICE_PATH
);

export const FREE_PRACTICE_H1 =
  "Free practice questions for NCLEX, NAPLEX, PANCE, AANP FNP, USMLE, and NPTE-PT";

export const FREE_PRACTICE_CTA_LABEL = "Start free trial, no card required";

export const FREE_PRACTICE_TRIAL_HREF = LANDING_TRIAL_HREF;

const BOARD_INTRO: Record<FreePracticeBoardSlug, string> = {
  nclex:
    "Ten free NCLEX practice questions from the student bank. Each item shows the choices, the keyed answer, and the full rationale.",
  naplex:
    "Ten free NAPLEX practice questions on dosing, safety, and therapeutics. Open an item to read the answer and the full rationale.",
  pance:
    "Ten free PANCE practice questions across organ systems. The answer and rationale stay in the page so you can review them without an account.",
  "aanp-fnp":
    "Ten free AANP FNP practice questions for primary care decisions. Each one includes the keyed answer and the stored rationale.",
  usmle:
    "Ten free USMLE practice questions drawn from Step 1, Step 2 CK, and Step 3. Read the answer and the full rationale on this page.",
  "npte-pt":
    "Ten free NPTE-PT practice questions for physical therapy. The answer is on the page, with the rationale and a guideline when the item has one.",
};

export function freePracticeIntro(slug: FreePracticeBoardSlug): string {
  return BOARD_INTRO[slug];
}

export const FREE_PRACTICE_FAQS = [
  {
    question: "Can I read these free practice questions without an account?",
    answer:
      "Yes. Every question, answer, and rationale on this page is in the HTML. You do not need to sign in or start a trial to read them.",
  },
  {
    question: "Which exams have free practice questions on this page?",
    answer:
      "AnyExamEasy publishes a section of free practice questions for NCLEX, NAPLEX, PANCE, AANP FNP, USMLE, and NPTE-PT. Each section links to that board’s prep page.",
  },
  {
    question: "Do I need a card to start a free trial?",
    answer:
      "No. Choose Start free trial, no card required. The trial does not ask for a payment method up front.",
  },
  {
    question: "Does AnyExamEasy promise a passing result?",
    answer:
      "No. AnyExamEasy is a study support tool. Practice on this page does not guarantee a score, a passing result, a license, or a job.",
  },
  {
    question: "When is a guideline source shown?",
    answer:
      "A guideline source is shown when that bank item stores one. If an item has no stored source, the page still shows the full rationale and does not add a citation.",
  },
] as const;

export function questionsForBoard(slug: FreePracticeBoardSlug): FreePracticeQuestion[] {
  return FREE_PRACTICE_QUESTIONS[slug];
}

function quizNode(board: (typeof FREE_PRACTICE_BOARDS)[number]) {
  const page = absoluteUrl(FREE_PRACTICE_PATH);
  return {
    "@type": "Quiz",
    "@id": `${page}#${board.slug}-quiz`,
    name: board.h2,
    url: `${page}#${board.slug}`,
    educationalUse: "practice",
    about: board.label,
    hasPart: questionsForBoard(board.slug).map((question, index) => ({
      "@type": "Question",
      eduQuestionType: "Multiple choice",
      learningResourceType: "Practice problem",
      name: `${board.h2} ${index + 1}`,
      text: question.stem,
      acceptedAnswer: { "@type": "Answer", text: question.answer },
      suggestedAnswer: question.options
        .filter((option) => option !== question.answer)
        .map((text) => ({ "@type": "Answer", text })),
      comment: { "@type": "Comment", text: question.rationale },
    })),
  };
}

export function buildFreePracticeJsonLd(): Record<string, unknown> {
  const page = absoluteUrl(FREE_PRACTICE_PATH);
  const home = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": page,
        url: page,
        name: FREE_PRACTICE_TITLE,
        description: FREE_PRACTICE_DESCRIPTION,
        isPartOf: { "@type": "WebSite", name: "AnyExamEasy", url: home },
        about: FREE_PRACTICE_BOARDS.map((board) => board.label),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: home },
          { "@type": "ListItem", position: 2, name: "Free practice questions", item: page },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        mainEntity: FREE_PRACTICE_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      ...FREE_PRACTICE_BOARDS.map(quizNode),
    ],
  };
}
