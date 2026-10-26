import { PAID_REFUND_PARAGRAPH } from "@/lib/marketing/legal-copy";
import { SITE_NAME, formatMonthlyPrice, formatTrialLabel, formatTrialQuestionLimit } from "@/lib/site";

export type PricingFaqItem = {
  question: string;
  answer: string;
};

/** Visible FAQ and FAQPage schema share this list so the answers cannot drift. */
export function pricingFaqItems(): PricingFaqItem[] {
  return [
    {
      question: "What is included in the free trial?",
      answer: `${formatTrialLabel()} with ${formatTrialQuestionLimit()} across all six board exams — no payment method required.`,
    },
    {
      question: "Can I cancel?",
      answer: "Cancel anytime in Settings.",
    },
    {
      question: "What is the refund policy?",
      answer: PAID_REFUND_PARAGRAPH,
    },
    {
      question: "What is included in Pro?",
      answer: `${SITE_NAME} Pro includes NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, AANP FNP, and NPTE-PT on one subscription at ${formatMonthlyPrice("pro")}/mo, plus the Roadmap, Deep Dives, and full-length practice exams.`,
    },
  ];
}
