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
import { lifecycleExamFromSlug } from "@/lib/email/lifecycle-exam";
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
    examName?: string | null;
    startCta: string;
    startUrl: string;
    unsubscribeUrl: string;
    headers?: Record<string, string>;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const message = buildWelcomeSignupEmail({
    name: params.name,
    examName: params.examName,
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

export function midTrialStudyNudgeSubject(examName?: string | null): string {
  return examName ? `Start 10 ${examName} questions` : "Start 10 practice questions";
}

/** Board-specific note for someone who has not answered a question. Title matches the subject. */
export function buildMidTrialStudyNudge(params: {
  name?: string | null;
  examName?: string | null;
  startUrl: string;
  unsubscribeUrl?: string;
}): { subject: string; html: string; text: string } {
  const subject = midTrialStudyNudgeSubject(params.examName);
  const body = params.examName
    ? `You have not answered a ${params.examName} question yet. About 2 to 3 days are left in your ${TRIAL_DAYS}-day ${params.examName} trial, which includes ${TRIAL_LIFETIME_QUESTIONS} practice questions. Start with 10 ${params.examName} questions.`
    : `You have not answered a question yet. About 2 to 3 days are left in your ${TRIAL_DAYS}-day trial, which includes ${TRIAL_LIFETIME_QUESTIONS} practice questions. Choose your exam, then start with 10.`;
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
    examName?: string | null;
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
    examSlug?: string | null;
    unsubscribeUrl?: string;
    headers?: Record<string, string>;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const exam = lifecycleExamFromSlug(params.examSlug);
  const upgradeUrl = upgradeEmailUrl("trial-ending");
  const when = formatEmailDate(params.trialEndsAt);
  const subject = exam.name
    ? `Your ${exam.name} trial ends in about a day`
    : "Your AnyExamEasy trial ends in about a day";
  const endingLine = exam.name
    ? `Your ${exam.name} trial ends in about 24 hours (${when}). After that, the ${exam.name} practice questions included with the trial are no longer available.`
    : `Your trial ends in about 24 hours (${when}). After that, the practice questions included with the trial are no longer available.`;
  const billingNote = buildTrialEndingBillingNote({
    legacyStripeTrial: params.legacyStripeTrial,
    planInterval: params.planInterval,
    amountUsd: params.amountUsd,
  });

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(endingLine.replace(when, `<strong>${when}</strong>`)),
    emailParagraph(trialEndingContinueLine(params.legacyStripeTrial)),
    billingNote.html,
    emailParagraph(TRIAL_EMAIL_LIABILITY_LINE),
  ]
    .filter(Boolean)
    .join("");

  const text = [
    greeting(params.name),
    "",
    endingLine,
    trialEndingContinueLine(params.legacyStripeTrial),
    billingNote.text,
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `${exam.startCta}: ${exam.startUrl}`,
    `Subscribe: ${upgradeUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
    params.unsubscribeUrl ? `Unsubscribe: ${params.unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: subject,
    preheader: endingLine,
    bodyHtml,
    primaryCta: { label: exam.startCta, url: exam.startUrl },
    secondaryCta: { label: "Review subscribe options", url: upgradeUrl },
    footerNote: params.unsubscribeUrl
      ? `<a href="${params.unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>`
      : "You are receiving this because your AnyExamEasy trial is ending soon. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject,
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
    examSlug?: string | null;
    unsubscribeUrl?: string;
    headers?: Record<string, string>;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const exam = lifecycleExamFromSlug(params.examSlug);
  const subscribeUrl = upgradeEmailUrl("trial-ended");
  const when = formatEmailDate(params.trialEndsAt);
  const subject = exam.name ? `Your ${exam.name} trial has ended` : "Your AnyExamEasy trial has ended";
  const endedLine = exam.name
    ? `Your ${exam.name} trial ended on ${when}. ${exam.name} practice questions from the trial are no longer included.`
    : `Your trial ended on ${when}. Practice questions from the trial are no longer included.`;
  const continueLine = exam.name
    ? `Subscribe if you want to keep ${exam.name} practice. Subscribing starts a paid plan. This note is not a bill, and it does not charge a card by itself.`
    : "If you want to continue, you can subscribe from the link below. Subscribing starts a paid plan. This note is not a bill, and it does not charge a card by itself.";

  const bodyHtml = [
    emailParagraph(`${greeting(params.name)}`),
    emailParagraph(endedLine.replace(when, `<strong>${when}</strong>`)),
    emailParagraph(continueLine),
    emailParagraph(TRIAL_EMAIL_LIABILITY_LINE),
  ].join("");

  const text = [
    greeting(params.name),
    "",
    endedLine,
    continueLine,
    TRIAL_EMAIL_LIABILITY_LINE,
    "",
    `Subscribe: ${subscribeUrl}`,
    `${exam.startCta}: ${exam.startUrl}`,
    "",
    `Support: ${LEGAL_ENTITY.supportEmail}`,
    params.unsubscribeUrl ? `Unsubscribe: ${params.unsubscribeUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const html = transactionalEmailLayout({
    title: subject,
    preheader: endedLine,
    bodyHtml,
    primaryCta: { label: exam.name ? `Continue ${exam.name}` : "See subscribe options", url: subscribeUrl },
    secondaryCta: { label: exam.startCta, url: exam.startUrl },
    footerNote: params.unsubscribeUrl
      ? `<a href="${params.unsubscribeUrl}" style="color:#64748b;">Unsubscribe</a>`
      : "You are receiving this because your AnyExamEasy trial ended. This is an account notice, not a bill.",
  });

  return sendTransactionalEmail({
    to: params.to,
    subject,
    html,
    text,
    replyTo: LEGAL_ENTITY.supportEmail,
    headers: params.headers,
    tags: [{ name: "category", value: "trial-ended" }],
  });
}
