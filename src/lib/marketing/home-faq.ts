import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { formatLandingTrialScopeSentence } from "@/lib/site";

/**
 * Short homepage FAQ. The price stays in the pricing card, and this list
 * does not state support hours or a bank-wide question count.
 */
export const HOME_FAQ = [
  {
    q: "Which exams are included?",
    a: `All six are on one subscription: ${PLATFORM_EXAM_LIST}. USMLE covers Step 1, Step 2 CK, and Step 3.`,
  },
  {
    q: "Do I need a payment method to start?",
    a: `No. ${formatLandingTrialScopeSentence()}. Cancel in Settings before it ends and you are not charged.`,
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime in Settings. That stops the next charge. Paid charges are non-refundable except where the law requires a refund.",
  },
  {
    q: "Are you affiliated with the exam boards?",
    a: "No. AnyExamEasy is independent. We are not affiliated with NCSBN, NABP, NBME, or the organizations that own the other board exams.",
  },
] as const;
