import { formatMonthlyPrice } from "@/lib/site";
import { seoPlatformPitch } from "@/lib/seo/seo-copy";

export type ComparePageFaqItem = {
  question: string;
  answer: string;
};

/** Shared copy for /compare visible FAQ and FAQPage JSON-LD. */
export function getComparePageFaq(): ComparePageFaqItem[] {
  return [
    {
      question: "How does AnyExamEasy pricing work for multiple exams?",
      answer: `AnyExamEasy Pro is ${formatMonthlyPrice("pro")}/month on the monthly plan and includes NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, FNP, and NPTE on one subscription — instead of buying separate single-exam products for each board.`,
    },
    {
      question: "Is AnyExamEasy a good fit if I need more than one board exam?",
      answer: `${seoPlatformPitch()} One Pro subscription covers six boards with Roadmap, Deep Dive modules, and Full Exam simulations on the same account.`,
    },
    {
      question: "When is a single-exam prep product a better fit?",
      answer:
        "If you are only sitting one board and want a product built exclusively for that exam, a premium single-exam QBank or live review course may match your workflow. AnyExamEasy is designed for candidates who want multiple boards on one plan.",
    },
  ];
}

export function comparePageFaqJsonLdEntities() {
  return getComparePageFaq().map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));
}
