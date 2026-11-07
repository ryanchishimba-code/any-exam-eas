import {
  TRIAL_DAYS,
  TRIAL_LIFETIME_QUESTIONS,
  type BillingInterval,
} from "@/lib/billing-config";
import { formatPlanUsd, getBillingPlanTier } from "@/lib/billing-plans";
import { appBaseUrl, isEmailConfigured } from "@/lib/email/config";
import {
  emailParagraph,
  transactionalEmailLayout,
} from "@/lib/email/layout";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import { buildWelcomeSignupEmail } from "@/lib/email/welcome-signup-email";
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
  "AnyExamEasy is a study aid for self-assessment. It does not guarantee a score, a passing result, licensure, or certification.";

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
  params: TrialEmailParams & {
    startCta: string;
    startUrl: string;
    unsubscribeUrl: string;
    headers?: Record<string, string>;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const message = buildWelcomeSignupEmail({
    name: params.name,
    startCta: params.startCta,
    startUrl: params.startUrl,
    unsubscribeUrl: params.unsubscribeUrl,
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    from: message.from,
    replyTo: message.replyTo,
    headers: params.headers ?? message.headers,
    tags: [{ name: "category", value: "trial-welcome" }],
  });
}

export function trialEndingContinueLine(legacyStripeTrial?: boolean): string {
  if (legacyStripeTrial) {
    return "You can subscribe if you want to continue. You can also cancel in Settings before the trial ends.";
  }
  return "You can subscribe if you want to continue. This trial did not ask for a card, so nothing is charged when it ends.";
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

export function midTrialStudyNudgeSubject(examName: string): string {
  return `Start 10 ${examName} questions`;
}

/** Board-specific note for someone who has not answered a question. Title matches the subject. */
export function buildMidTrialStudyNudge(params: {
  name?: string | null;
  examName: string;
  startUrl: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string; text: string } {
  const subject = midTrialStudyNudgeSubject(params.examName);
  const body = `You have not answered a question yet. About 2 to 3 days are left in your ${TRIAL_DAYS}-day trial, which includes ${TRIAL_LIFETIME_QUESTIONS} practice questions. Start with 10 ${params.examName} questions.`;
  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(body),
    emailParagraph(TRIAL_EMAIL_LIABILITY_LINE),
  ].join("");
  const text = [
    greeting(params.name),
    "",
    body,
    "",
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `${subject}: ${params.startUrl}`,
    params.unsubscribeUrl ? `Unsubscribe: ${params.unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const html = transactionalEmailLayout({
    title: subject,
    preheader: body,
    bodyHtml,
    primaryCta: { label: subject, url: params.startUrl },
    footerNote: params.unsubscribeUrl
      ? `<a href="${params.unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>`
      : undefined,
  });
  return { subject, html, text };
}

export async function sendTrialDay4ReminderEmail(
  params: TrialEmailParams & {
    examName: string;
    startUrl: string;
    unsubscribeUrl?: string;
    headers?: Record<string, string>;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const message = buildMidTrialStudyNudge(params);
  return sendTransactionalEmail({
    to: params.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: LEGAL_ENTITY.supportEmail,
    headers: params.headers,
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
    unsubscribeUrl?: string;
    headers?: Record<string, string>;
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
    emailParagraph(trialEndingContinueLine(params.legacyStripeTrial)),
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
    trialEndingContinueLine(params.legacyStripeTrial),
    billingNote.text,
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `Subscribe: ${upgradeUrl}`,
    `Dashboard: ${dashboardUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
    params.unsubscribeUrl ? `Unsubscribe: ${params.unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial ends in about a day",
    preheader: "Practice questions from the trial stop when it ends. Subscribe only if you want to continue.",
    bodyHtml,
    primaryCta: { label: "Review subscribe options", url: upgradeUrl },
    secondaryCta: { label: "Open dashboard", url: dashboardUrl },
    footerNote: params.unsubscribeUrl
      ? `<a href="${params.unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>`
      : "You are receiving this because your AnyExamEasy trial is ending soon. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy trial ends in about a day",
    html,
    text,
    replyTo: LEGAL_ENTITY.supportEmail,
    headers: params.headers,
    tags: [{ name: "category", value: "trial-ending" }],
  });
}

export async function sendTrialEndedEmail(
  params: TrialEmailParams & {
    trialEndsAt: Date;
    unsubscribeUrl?: string;
    headers?: Record<string, string>;
  }
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
    params.unsubscribeUrl ? `Unsubscribe: ${params.unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: "Your trial has ended",
    preheader: "Trial practice questions are no longer included. Subscribe only if you want to continue.",
    bodyHtml,
    primaryCta: { label: "See subscribe options", url: subscribeUrl },
    secondaryCta: { label: "Open dashboard", url: dashboardUrl },
    footerNote: params.unsubscribeUrl
      ? `<a href="${params.unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>`
      : "You are receiving this because your AnyExamEasy trial ended. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject: "Your AnyExamEasy trial has ended",
    html,
    text,
    replyTo: LEGAL_ENTITY.supportEmail,
    headers: params.headers,
    tags: [{ name: "category", value: "trial-ended" }],
  });
}
