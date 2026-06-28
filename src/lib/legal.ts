/** Legal entity and product identifiers — used across Terms, Privacy, and marketing. */
export const LEGAL_ENTITY = {
  /** Legal name of the operating company. */
  companyName: "AI Software Product Solutions, LLC",
  productName: "Any Exam Easy",
  productDomain: "anyexameasy.com",
  supportEmail: "support@anyexameasy.com",
  legalEmail: "legal@anyexameasy.com",
} as const;

export const LEGAL_LAST_UPDATED = "June 15, 2026";

/** Short disclaimers for signup, pricing, checkboxes, and the Disclaimers page. */
export const LEGAL_DISCLAIMERS = {
  companyRelationship: `${LEGAL_ENTITY.productName} is a software product and service operated by ${LEGAL_ENTITY.companyName} ("Company," "we," "us," or "our"). References to "${LEGAL_ENTITY.productName}" mean the Service offered by the Company.`,

  educationalPurpose:
    "Any Exam Easy provides AI-generated study materials for educational and self-assessment purposes only. Content is not a substitute for accredited instruction, clinical judgment, licensure exam prep guarantees, or professional certification.",

  noGuarantee:
    "We do not guarantee exam scores, grades, employment outcomes, licensure, certification, or the accuracy or completeness of AI-generated content. You are solely responsible for verifying facts against authoritative sources before relying on them in academic or professional settings.",

  notMedicalAdvice:
    "Content related to medicine, nursing, pharmacy, or other health fields is for study support only and does not constitute medical, nursing, or pharmacy advice, diagnosis, or treatment guidance.",

  userResponsibility:
    "By using this service you agree to use generated materials ethically, comply with your institution's and licensing board's academic integrity and professional standards, and not misrepresent AI output as your own work where prohibited.",

  aiGenerated:
    "AI-generated questions, explanations, and exam content may contain errors, omissions, or outdated information. Always verify critical facts against authoritative textbooks, course materials, and official exam prep resources before relying on them.",

  progressMetrics:
    "Practice progress, readiness, and mastery scores shown in the app are derived from your in-app question attempts only. They are self-assessment tools for study planning and are not predictors of board exam scores, pass rates, or licensure outcomes.",

  studySupport:
    "Content is for educational and self-assessment purposes only. Features, pricing, and availability may change. This is not medical, nursing, or pharmacy advice.",

  ageRequirement:
    "You must be at least 18 years old to create an account. By registering you represent and warrant that you meet this requirement.",

  testimonials:
    "Stories, quotes, and personas on our marketing pages are composite or illustrative examples created for demonstration only. They are not verified reviews, endorsements, or depictions of actual customers or guaranteed outcomes. Any described or implied results are not typical, are not guaranteed, and vary widely based on individual effort, prior knowledge, study time, and exam conditions. Past performance of other learners cannot predict your results.",

  trademarks:
    "All exam names and related marks are the property of their respective owners and are used here for identification and descriptive purposes only. USMLE® is a joint program of, and a registered trademark of, the Federation of State Medical Boards (FSMB) and the National Board of Medical Examiners (NBME). NCLEX®, NCLEX-RN®, and NCLEX-PN® are registered trademarks of the National Council of State Boards of Nursing, Inc. (NCSBN). NAPLEX® and MPJE® are registered trademarks of the National Association of Boards of Pharmacy (NABP). PANCE® is a registered trademark of the National Commission on Certification of Physician Assistants (NCCPA). NPTE® is a registered trademark of the Federation of State Boards of Physical Therapy (FSBPT). AANP® is a trademark of the American Association of Nurse Practitioners, and the FNP certification is administered by the AANP Certification Board. Any Exam Easy and AI Software Product Solutions, LLC are not affiliated with, authorized by, endorsed by, or sponsored by any of these organizations, and these organizations do not review, approve, license, or sponsor our content. Use of these names does not imply any affiliation or endorsement.",

  subscription:
    "You may start a free app trial without providing a payment method. Trial access includes a limited number of practice questions and features as described at signup. A valid payment method is required when you upgrade to a paid Basic or Pro subscription. Paid subscriptions renew automatically on your saved payment method at the price and billing interval you selected unless canceled before renewal.",

  refundsAndAccess:
    "All payments are non-refundable except where required by applicable law. If you cancel, you retain access through the end of the billing period you have already paid for. We do not provide prorated refunds for unused time within a paid period.",

  planChanges:
    "During a free trial, you may upgrade to a paid plan at any time. When you subscribe, billing for your selected Basic or Pro plan begins at checkout. On an active paid subscription, plan changes are scheduled to take effect when your current billing period ends; you are billed at the new rate only when the switch occurs, not when you schedule it.",

  paymentFailure:
    "If a recurring payment fails, premium study features may be suspended immediately until the payment method is updated and payment succeeds. You may update your payment method in Settings.",

  reactivation:
    "If your subscription lapses, is canceled, or expires, you may log in to your existing account and reactivate by resubscribing or updating your payment method. Access is restored automatically when payment is successfully processed.",

  billingCommunications:
    "We may send transactional emails about your account, including reminders approximately 24 hours before a free trial ends or before a scheduled renewal charge, and notices if payment fails.",

  stripeProcessor:
    "Payments are processed by Stripe, Inc. We do not store full payment card numbers on our servers. Stripe's terms and privacy policy apply to payment processing.",

  limitationOfLiability:
    `To the maximum extent permitted by applicable law, ${LEGAL_ENTITY.companyName}, its members, managers, officers, employees, contractors, and affiliates shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, business interruption, or loss of goodwill, arising from or related to your use of the Service or reliance on generated content, even if advised of the possibility of such damages.`,

  liabilityCap:
    `To the extent liability is not excluded, the Company's total aggregate liability for any claims arising from or related to the Service shall not exceed the greater of (a) the amounts you paid to the Company for the Service in the twelve (12) months before the event giving rise to the claim, or (b) one hundred U.S. dollars (USD $100).`,

  indemnification:
    `You agree to defend, indemnify, and hold harmless ${LEGAL_ENTITY.companyName} and its members, managers, officers, employees, contractors, licensors, and affiliates from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of the Service, your content, your violation of these Terms, or your violation of any law or third-party rights.`,

  arbitrationSummary:
    "Except for qualifying small-claims matters, disputes are resolved by binding individual arbitration—not in court and not as a class action— as described in our Terms of Service.",

  noClassAction:
    "You and the Company agree that each may bring claims against the other only in an individual capacity and not as a plaintiff or class member in any purported class, collective, or representative proceeding.",

  governingLawSummary:
    "These Terms are governed by the laws of the United States and the state in which AI Software Product Solutions, LLC is organized, without regard to conflict-of-law rules.",
} as const;

/**
 * Compact trademark / non-affiliation notice for the footer and other tight
 * spaces. The full attribution lives in `LEGAL_DISCLAIMERS.trademarks`.
 */
export const TRADEMARK_NOTICE =
  "USMLE®, NCLEX®, NAPLEX®, MPJE®, PANCE®, NPTE®, AANP®, and other exam names are trademarks of their respective owners. Any Exam Easy is independent and is not affiliated with, endorsed by, or sponsored by these organizations.";

export type LegalDisclaimerKey = keyof typeof LEGAL_DISCLAIMERS;

/** Keys shown on the public Disclaimers page (excludes long-form terms-only clauses). */
export const PUBLIC_DISCLAIMER_KEYS: LegalDisclaimerKey[] = [
  "companyRelationship",
  "educationalPurpose",
  "noGuarantee",
  "notMedicalAdvice",
  "aiGenerated",
  "progressMetrics",
  "studySupport",
  "ageRequirement",
  "testimonials",
  "trademarks",
  "subscription",
  "refundsAndAccess",
  "planChanges",
  "paymentFailure",
  "reactivation",
  "billingCommunications",
  "stripeProcessor",
  "limitationOfLiability",
  "liabilityCap",
  "arbitrationSummary",
  "noClassAction",
];
