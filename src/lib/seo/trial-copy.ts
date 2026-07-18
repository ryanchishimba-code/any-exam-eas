import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { TRIAL_CTA_LABEL } from "@/lib/site";

/** Meta description suffix for exam SEO pages. */
export const SEO_TRIAL_META_SUFFIX = `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} practice questions · no payment required`;

export const SEO_TRIAL_META_WITH_BOARDS = `${SEO_TRIAL_META_SUFFIX} · all six boards included`;

export function seoTrialTryBeforePayFaq(): string {
  return `Yes — start a ${TRIAL_DAYS}-day free trial with ${TRIAL_LIFETIME_QUESTIONS} practice questions across every board bank. No payment required at signup; upgrade anytime for unlimited access.`;
}

export function seoTrialLengthFaq(): string {
  return `${TRIAL_DAYS} days with ${TRIAL_LIFETIME_QUESTIONS} practice questions. No payment required at signup — upgrade anytime for unlimited access.`;
}

export function seoTrialIncludedFaq(): string {
  return `${TRIAL_DAYS} days of access to all question banks, Roadmaps, and reference tools — ${TRIAL_LIFETIME_QUESTIONS} practice questions included.`;
}

export function seoTrialHeading(): string {
  return TRIAL_CTA_LABEL;
}

export function seoTrialTryNclexHeading(): string {
  return `Try NCLEX prep free for ${TRIAL_DAYS} days`;
}

export function seoTrialResourceParagraph(): string {
  return `Start with a ${TRIAL_DAYS}-day trial — ${TRIAL_LIFETIME_QUESTIONS} practice questions, no payment required — and access the full NCLEX bank plus USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT on the same plan.`;
}

export function seoTrialNaplexStudyTip(): string {
  return `Start your ${TRIAL_DAYS}-day trial to access the NAPLEX bank and sample questions before subscribing — ${TRIAL_LIFETIME_QUESTIONS} practice questions included.`;
}

export function seoResourcesCtaLine(): string {
  return `Access all six board banks with Blueprint Roadmaps, Deep Dives, and Full Exam practice — ${TRIAL_LIFETIME_QUESTIONS} practice questions during your ${TRIAL_DAYS}-day trial, no payment required.`;
}

export function seoSixBoardTrialParagraph(): string {
  return `No payment required at signup. Explore every exam track with ${TRIAL_LIFETIME_QUESTIONS} practice questions during your ${TRIAL_DAYS}-day trial, then upgrade to Pro for unlimited access.`;
}
