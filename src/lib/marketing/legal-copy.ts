import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";

/**
 * Shared liability and compliance strings. Marketing pages should import
 * these instead of restating the same sentence.
 */

/** Shown under the existing marketing disclaimer in the footer. */
export const NOT_FOR_PATIENT_CARE_LINE =
  "For exam study only. Not medical, nursing, or pharmacy advice, and not for patient care.";

/** Inline note under rationales and sample questions. */
export const RATIONALE_STUDY_NOTE =
  "Study use only · not medical advice or for patient care · verify with current references.";

/** Under every "From students" heading. */
export const TESTIMONIAL_RESULTS_NOTE = "Individual experiences. Results vary.";

/**
 * Terms §2 and the Disclaimers "Marketing examples" clause.
 * The displayed quotes are real consenting users. The sentence lives on
 * LEGAL_DISCLAIMERS.testimonials so Terms and the disclaimer page stay in sync.
 */
export const STUDENT_QUOTE_CLAUSE = LEGAL_DISCLAIMERS.testimonials;

/** Added on /how-questions-are-reviewed. */
export const AI_ASSISTED_REVIEW_NOTE =
  "Questions are AI-assisted and pass automated quality checks. Not every item has been individually reviewed by a clinician.";

export function nclexContentReviewLedBy(displayName: string): string {
  return `NCLEX content review led by ${displayName}`;
}

export function contentReviewLedBy(displayName: string): string {
  return `Content review led by ${displayName}`;
}

/** Board-page badge. NCLEX keeps the exam name in the line. */
export function boardReviewBadge(examKey: string, displayName: string): string {
  if (examKey === "nclex") return nclexContentReviewLedBy(displayName);
  return contentReviewLedBy(displayName);
}

/** Public date on competitor prices checked for this audit. */
export const COMPETITOR_PRICE_AS_OF = "Sep 27, 2026";

export function withPriceAsOf(text: string): string {
  if (/as of/i.test(text)) return text;
  return `${text} (as of ${COMPETITOR_PRICE_AS_OF})`;
}

/** Version stored with a pass check-in quote the student agreed to share. */
export const QUOTE_CONSENT_VERSION = "2026-09-27";

export function passCheckInSubtitle(exam: string): string {
  return `Optional check-in for ${exam}. Your answer is private unless you choose to share a quote below.`;
}

export function quoteShareConsentLabel(): string {
  return `AnyExamEasy may show this quote with my first name, last initial, and exam on its website and marketing. I wasn't paid for it and can withdraw permission anytime at ${LEGAL_ENTITY.supportEmail}.`;
}

/** Stamped into Stripe Checkout session metadata. Not a database column. */
export const PAID_RENEWAL_CONSENT_VERSION = "2026-09-27";

export function paidRenewalConsentText(price: string, interval: string): string {
  return `I agree that my subscription renews automatically at ${price}/${interval} until I cancel in Settings. Payments are non-refundable except where required by law.`;
}

export function requestClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    return first || null;
  }
  return req.headers.get("x-real-ip");
}
