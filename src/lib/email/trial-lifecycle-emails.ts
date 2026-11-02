import {
  TRIAL_DAYS,
  TRIAL_LIFETIME_QUESTIONS,
  type BillingInterval,
} from "@/lib/billing-config";
import { formatPlanUsd, getBillingPlanTier } from "@/lib/billing-plans";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { appBaseUrl, isEmailConfigured } from "@/lib/email/config";
import {
  emailParagraph,
  emailTipList,
  transactionalEmailLayout,
} from "@/lib/email/layout";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import type { EmailDeliveryResult } from "@/lib/email/config";
import { displayFirstName } from "@/lib/display-name";
import { LEGAL_ENTITY } from "@/lib/legal";

type TrialEmailParams = {
  to: string;
  name?: string | null;
};

function greeting(name?: string | null): string {
  const first = displayFirstName(name);
  return first !== "there" ? `Hi ${first},` : "Hi there,";
}

function formatEmailDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function dashboardEmailUrl(): string {
  return `${appBaseUrl()}/dashboard`;
}

export const TRIAL_EMAIL_LIABILITY_LINE =
  "Any Exam Easy is a study aid for self-assessment. It does not guarantee a score, a passing result, licensure, or certification.";

export function upgradeEmailUrl(context: "welcome" | "trial-ending" | "trial-ended"): string {
  if (context === "trial-ending" || context === "trial-ended") {
    const params = new URLSearchParams({
      plan: "subscribe",
      tier: "pro",
      interval: "monthly",
      from: context === "trial-ended" ? "email-trial-ended" : "email-trial-ending",
    });
    return `${appBaseUrl()}/checkout?${params.toString()}`;
  }
  const params = new URLSearchParams({
    upgrade: "pro",
    highlight: "pro",
    from: "email-welcome",
  });
  return `${appBaseUrl()}/pricing?${params.toString()}`;
}

export async function sendWelcomeTrialEmail(
  params: TrialEmailParams
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const dashboardUrl = dashboardEmailUrl();
  const upgradeUrl = upgradeEmailUrl("welcome");

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(
      `Welcome to <strong>${LEGAL_ENTITY.productName}</strong> — your ${TRIAL_DAYS}-day trial is live. You have <strong>${TRIAL_LIFETIME_QUESTIONS} practice questions</strong> to explore every board bank, plus Roadmap and concise explanations while you decide if Pro is right for you.`
    ),
    emailParagraph(
      "Whether you're days from NCLEX, deep in Step 2 CK, or juggling NAPLEX calculations — you're in the right place. Here's how to make the first session count:"
    ),
    emailTipList([
      `Open your <strong>Dashboard</strong> to see readiness, streaks, and what to study next.`,
      `Set your <strong>exam date</strong> so your countdown and study plan stay realistic.`,
      `Start a <strong>practice block</strong> in the question bank — even 10 questions builds momentum.`,
    ]),
    emailParagraph(
      "When you're ready for unlimited questions, teachable rationales, AI Tutor, and full-length mocks, upgrading takes one click."
    ),
  ].join("");

  const text = [
    greeting(params.name),
    "",
    `Welcome to ${LEGAL_ENTITY.productName}! Your ${TRIAL_DAYS}-day trial is active with ${TRIAL_LIFETIME_QUESTIONS} practice questions.`,
    "",
    "Quick start:",
    "1. Open your Dashboard for readiness and study focus.",
    "2. Set your exam date in account settings.",
    "3. Start practicing in the question bank.",
    "",
    `Dashboard: ${dashboardUrl}`,
    `Upgrade: ${upgradeUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
  ].join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial has started — let's go",
    preheader: `${TRIAL_DAYS}-day trial · ${TRIAL_LIFETIME_QUESTIONS} questions · Dashboard ready`,
    bodyHtml,
    primaryCta: { label: "Upgrade Now", url: upgradeUrl },
    secondaryCta: { label: "Open Dashboard", url: dashboardUrl },
    footerNote:
      "You're receiving this because you created an AnyExamEasy account. Manage notifications in account settings.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: `Welcome to AnyExamEasy — Your ${TRIAL_DAYS}-Day Trial Has Started!`,
    html,
    text,
    tags: [{ name: "category", value: "trial-welcome" }],
  });
}

export function buildTrialEndingBillingNote(params: {
  legacyStripeTrial?: boolean;
  planInterval?: BillingInterval;
  amountUsd?: number | null;
}): { html: string; text: string } {
  if (params.legacyStripeTrial !== true || !params.planInterval || params.amountUsd == null) {
    return { html: "", text: "" };
  }
  const tier = getBillingPlanTier("pro", params.planInterval);
  const amount = formatPlanUsd(params.amountUsd);
  return {
    html: emailParagraph(
      `You added a payment method at checkout — unless you cancel before your trial ends, <strong>${amount}</strong> for your ${tier.label} plan will be charged when the trial ends. You can still upgrade or change plans anytime.`
    ),
    text: `\nPayment note: ${amount} for ${tier.label} may be charged at trial end unless you cancel.\n`,
  };
}

export async function sendTrialDay4ReminderEmail(
  params: TrialEmailParams & { trialEndsAt: Date }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const dashboardUrl = dashboardEmailUrl();
  const upgradeUrl = upgradeEmailUrl("trial-ending");
  const when = formatEmailDate(params.trialEndsAt);

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(
      `You are halfway through your ${TRIAL_DAYS}-day AnyExamEasy trial. Your allowance is ${TRIAL_LIFETIME_QUESTIONS} practice questions, and your dashboard stays open until <strong>${when}</strong>.`
    ),
    emailParagraph(
      "If the question bank and explanations are helping, upgrade now to keep unlimited practice, adaptive mocks, and analytics without losing your streak or history."
    ),
  ].join("");

  const text = [
    greeting(params.name),
    "",
    `Your trial continues until ${when}.`,
    `Your trial allowance is ${TRIAL_LIFETIME_QUESTIONS} practice questions.`,
    "",
    `Upgrade: ${upgradeUrl}`,
    `Dashboard: ${dashboardUrl}`,
  ].join("\n");

  const html = transactionalEmailLayout({
    title: "Two days left to explore — then upgrade to keep going",
    preheader: `Your trial ends soon — keep your progress for ${formatPlanUsd(PRO_MONTHLY_PRICE_USD)}/mo`,
    bodyHtml,
    primaryCta: { label: "Upgrade — keep my progress", url: upgradeUrl },
    secondaryCta: { label: "Open Dashboard", url: dashboardUrl },
    footerNote:
      "You're receiving this because you started an AnyExamEasy trial. Manage email in account settings.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy trial — keep your momentum",
    html,
    text,
    tags: [{ name: "category", value: "trial-day4" }],
  });
}

export async function sendTrialEndingUpgradeEmail(
  params: TrialEmailParams & {
    trialEndsAt: Date;
    /** True only when Stripe reports this subscription status as trialing. */
    legacyStripeTrial?: boolean;
    planInterval?: BillingInterval;
    amountUsd?: number;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const dashboardUrl = dashboardEmailUrl();
  const upgradeUrl = upgradeEmailUrl("trial-ending");
  const when = formatEmailDate(params.trialEndsAt);
  const billingNote = buildTrialEndingBillingNote({
    legacyStripeTrial: params.legacyStripeTrial,
    planInterval: params.planInterval,
    amountUsd: params.amountUsd,
  });

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(
      `Your AnyExamEasy trial ends in about <strong>24 hours</strong> (${when}). After that time, the practice questions included with the trial are no longer available.`
    ),
    emailParagraph(
      "You can subscribe if you want to continue. You can also cancel in Settings before the trial ends."
    ),
    billingNote.html,
    emailParagraph(TRIAL_EMAIL_LIABILITY_LINE),
  ]
    .filter(Boolean)
    .join("");

  const text = [
    greeting(params.name),
    "",
    `Your trial ends in about 24 hours (${when}).`,
    "After that time, the practice questions included with the trial are no longer available.",
    "You can subscribe if you want to continue. You can also cancel in Settings before the trial ends.",
    billingNote.text,
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `Subscribe: ${upgradeUrl}`,
    `Dashboard: ${dashboardUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial ends in about a day",
    preheader: "Practice questions from the trial stop when it ends. Subscribe only if you want to continue.",
    bodyHtml,
    primaryCta: { label: "Review subscribe options", url: upgradeUrl },
    secondaryCta: { label: "Open dashboard", url: dashboardUrl },
    footerNote:
      "You are receiving this because your AnyExamEasy trial is ending soon. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy trial ends in about a day",
    html,
    text,
    tags: [{ name: "category", value: "trial-ending" }],
  });
}

export async function sendTrialEndedEmail(
  params: TrialEmailParams & { trialEndsAt: Date }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const dashboardUrl = dashboardEmailUrl();
  const subscribeUrl = upgradeEmailUrl("trial-ended");
  const when = formatEmailDate(params.trialEndsAt);

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(
      `Your AnyExamEasy trial ended on <strong>${when}</strong>. Practice questions from the trial are no longer included.`
    ),
    emailParagraph(
      "If you want to continue, you can subscribe from the link below. Subscribing starts a paid plan. This note is not a bill, and it does not charge a card by itself."
    ),
    emailParagraph(TRIAL_EMAIL_LIABILITY_LINE),
  ].join("");

  const text = [
    greeting(params.name),
    "",
    `Your trial ended on ${when}. Practice questions from the trial are no longer included.`,
    "If you want to continue, you can subscribe. Subscribing starts a paid plan. This note is not a bill.",
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `Subscribe: ${subscribeUrl}`,
    `Dashboard: ${dashboardUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
  ].join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial has ended",
    preheader: "Trial practice questions are no longer included. Subscribe only if you want to continue.",
    bodyHtml,
    primaryCta: { label: "See subscribe options", url: subscribeUrl },
    secondaryCta: { label: "Open dashboard", url: dashboardUrl },
    footerNote: "You are receiving this because your AnyExamEasy trial ended. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy trial has ended",
    html,
    text,
    tags: [{ name: "category", value: "trial-ended" }],
  });
}
