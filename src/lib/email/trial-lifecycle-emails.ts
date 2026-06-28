import {
  TRIAL_DAYS,
  TRIAL_LIFETIME_QUESTIONS,
  type BillingInterval,
} from "@/lib/billing-config";
import { formatPlanUsd, getBillingPlanTier } from "@/lib/billing-plans";
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

export function upgradeEmailUrl(context: "welcome" | "trial-ending"): string {
  const params = new URLSearchParams({
    upgrade: "pro",
    highlight: "pro",
    from: context === "welcome" ? "email-welcome" : "email-trial-ending",
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
      `Welcome to <strong>${LEGAL_ENTITY.productName}</strong> — your ${TRIAL_DAYS}-day trial is live. You have <strong>${TRIAL_LIFETIME_QUESTIONS} practice questions</strong> to explore every board bank, plus Roadmaps and concise explanations while you decide if Pro is right for you.`
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
      "When you're ready for unlimited questions, goat-mode rationales, AI Tutor, and full-length mocks, upgrading takes one click."
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

export async function sendTrialEndingUpgradeEmail(
  params: TrialEmailParams & {
    trialEndsAt: Date;
    hasStripeSubscription?: boolean;
    planInterval?: BillingInterval;
    amountUsd?: number;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const dashboardUrl = dashboardEmailUrl();
  const upgradeUrl = upgradeEmailUrl("trial-ending");
  const when = formatEmailDate(params.trialEndsAt);

  let billingNoteHtml = "";
  let billingNoteText = "";

  if (
    params.hasStripeSubscription &&
    params.planInterval &&
    params.amountUsd != null
  ) {
    const tier = getBillingPlanTier("pro", params.planInterval);
    const amount = formatPlanUsd(params.amountUsd);
    billingNoteHtml = emailParagraph(
      `You added a payment method at checkout — unless you cancel before your trial ends, <strong>${amount}</strong> for your ${tier.label} plan will be charged when the trial ends. You can still upgrade or change plans anytime.`
    );
    billingNoteText = `\nPayment note: ${amount} for ${tier.label} may be charged at trial end unless you cancel.\n`;
  }

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(
      `Your AnyExamEasy trial ends in about <strong>24 hours</strong> (${when}). After that, you'll move to our free tier — dashboard access plus a limited question allowance unless you upgrade.`
    ),
    emailParagraph(
      "You've already started building real study momentum. Keep it going with unlimited questions, rich goat-mode rationales, AI Tutor, spaced repetition, and full-length mocks on Pro."
    ),
    billingNoteHtml,
    emailParagraph(
      "Upgrade now and pick up exactly where you left off — no reset, no re-setup."
    ),
  ]
    .filter(Boolean)
    .join("");

  const text = [
    greeting(params.name),
    "",
    `Your trial ends in about 24 hours (${when}).`,
    "After that, access downgrades to the free tier unless you upgrade.",
    "",
    "Keep your momentum — upgrade for unlimited questions, goat-mode rationales, AI Tutor, and Pro tools.",
    billingNoteText,
    "",
    `Upgrade: ${upgradeUrl}`,
    `Dashboard: ${dashboardUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial ends tomorrow",
    preheader: "Don't lose momentum — upgrade to keep unlimited practice",
    bodyHtml,
    primaryCta: { label: "Upgrade Now", url: upgradeUrl },
    secondaryCta: { label: "Go to Dashboard", url: dashboardUrl },
    footerNote:
      "You're receiving this because your AnyExamEasy trial is ending soon. Manage email in account settings.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy Trial Ends Tomorrow — Don't Lose Access!",
    html,
    text,
    tags: [{ name: "category", value: "trial-ending" }],
  });
}
