import {
  appBaseUrl,
  getEmailFromAddress,
  isEmailConfigured,
  type EmailDeliveryResult,
} from "@/lib/email/config";
import { formatPlanUsd, getBillingPlanTier, renewalIntervalWord } from "@/lib/billing-plans";
import { LEGAL_ENTITY } from "@/lib/legal";
import { displayFirstName } from "@/lib/display-name";
import type { BillingInterval } from "@/lib/billing-config";

type BillingEmailParams = {
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

function billingEmailShell(title: string, bodyHtml: string, ctaLabel: string, ctaUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1d1d1f;margin:0;padding:0;background:#f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px 28px;border:1px solid rgba(0,0,0,0.06);">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">AnyExamEasy</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0f172a;">${title}</h1>
          ${bodyHtml}
          <p style="margin:24px 0 0;text-align:center;">
            <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;">${ctaLabel}</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">© AnyExamEasy · anyexameasy.com</p>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendBillingEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — billing email not sent.", {
        subject: params.subject,
        toDomain: params.to.split("@")[1] ?? "unknown",
      });
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        reply_to: LEGAL_ENTITY.supportEmail,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("[email] Billing email failed:", params.subject, res.status, bodyText);
      return { ok: false, reason: "send_failed", detail: bodyText.slice(0, 200) };
    }

    return { ok: true, provider: "resend" };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "send_failed", detail };
  }
}

export async function sendTrialEndingReminderEmail(
  params: BillingEmailParams & {
    trialEndsAt: Date;
    planInterval: BillingInterval;
    amountUsd: number;
    /** True only for a live Stripe subscription whose status is trialing. */
    legacyStripeTrial?: boolean;
    examSlug?: string | null;
  }
): Promise<EmailDeliveryResult> {
  const { sendTrialEndingUpgradeEmail } = await import(
    "@/lib/email/trial-lifecycle-emails"
  );
  return sendTrialEndingUpgradeEmail({
    to: params.to,
    name: params.name,
    trialEndsAt: params.trialEndsAt,
    legacyStripeTrial: params.legacyStripeTrial,
    planInterval: params.planInterval,
    amountUsd: params.amountUsd,
    examSlug: params.examSlug,
  });
}

export async function sendNextBillingReminderEmail(
  params: BillingEmailParams & {
    chargeAt: Date;
    planInterval: BillingInterval;
    amountUsd: number;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const settingsUrl = `${appBaseUrl()}/settings`;
  const tier = getBillingPlanTier("pro", params.planInterval);
  const when = formatEmailDate(params.chargeAt);
  const amount = formatPlanUsd(params.amountUsd);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your AnyExamEasy subscription renews in about 24 hours (<strong>${when}</strong>).</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your saved payment method will be charged <strong>${amount}</strong> for your ${tier.label} plan.</p>
    <p style="margin:0;font-size:14px;color:#64748b;">Update your payment method or cancel anytime in Settings before renewal. Payments are non-refundable.</p>`;

  const text = [
    greeting(params.name),
    "",
    `Your subscription renews in about 24 hours (${when}).`,
    `Your saved payment method will be charged ${amount} for your ${tier.label} plan.`,
    "",
    `Manage billing: ${settingsUrl}`,
  ].join("\n");

  return sendBillingEmail({
    to: params.to,
    subject: `Your AnyExamEasy subscription renews in 24 hours`,
    html: billingEmailShell(
      "Subscription renews tomorrow",
      bodyHtml,
      "Manage subscription",
      settingsUrl
    ),
    text,
  });
}

export async function sendSubscriptionActiveEmail(
  params: BillingEmailParams & {
    planLabel: string;
    amountUsd: number;
    interval: BillingInterval;
    nextChargeAt: Date | null;
    examName?: string | null;
    startCta?: string | null;
    startUrl?: string | null;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const settingsUrl = `${appBaseUrl()}/settings`;
  const refundsUrl = `${appBaseUrl()}/legal/refunds`;
  const amount = `${formatPlanUsd(params.amountUsd)}/${renewalIntervalWord(params.interval)}`;
  const nextCharge = params.nextChargeAt ? formatEmailDate(params.nextChargeAt) : "the end of this billing period";
  const support = LEGAL_ENTITY.supportEmail;
  const examName = params.examName?.trim() || null;
  const subject = examName
    ? `Payment received — your ${examName} subscription is active`
    : "Payment received — your AnyExamEasy subscription is active";
  const activeLine = examName
    ? `Payment received: <strong>${amount}</strong>. Your ${examName} subscription is active.`
    : `Payment received: <strong>${amount}</strong>. Your AnyExamEasy subscription is active.`;
  const startLine =
    params.startCta && params.startUrl
      ? `<a href="${params.startUrl}">${params.startCta}</a>`
      : "";

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${activeLine}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;"><strong>${params.planLabel}</strong>. Next charge: ${nextCharge}.</p>
    ${startLine ? `<p style="margin:0 0 16px;font-size:15px;color:#475569;">${startLine}</p>` : ""}
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Cancel anytime in Settings. Canceling stops the next charge. Payments are non-refundable except where required by law.</p>
    <p style="margin:0;font-size:14px;color:#64748b;">Refund policy: <a href="${refundsUrl}">${refundsUrl}</a><br/>Support: ${support}</p>`;

  const text = [
    greeting(params.name),
    "",
    examName
      ? `Payment received: ${amount}. Your ${examName} subscription is active.`
      : `Payment received: ${amount}. Your AnyExamEasy subscription is active.`,
    params.planLabel,
    `Next charge: ${nextCharge}.`,
    params.startCta && params.startUrl ? `${params.startCta}: ${params.startUrl}` : "",
    "",
    `Cancel anytime in Settings: ${settingsUrl}`,
    `Refund policy: ${refundsUrl}`,
    `Support: ${support}`,
  ].join("\n");

  return sendBillingEmail({
    to: params.to,
    subject,
    html: billingEmailShell(
      subject,
      bodyHtml,
      "Manage subscription",
      settingsUrl
    ),
    text,
  });
}

export async function sendAnnualRenewalReminderEmail(
  params: BillingEmailParams & {
    chargeAt: Date;
    planInterval: BillingInterval;
    amountUsd: number;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const settingsUrl = `${appBaseUrl()}/settings`;
  const tier = getBillingPlanTier("pro", params.planInterval);
  const when = formatEmailDate(params.chargeAt);
  const amount = formatPlanUsd(params.amountUsd);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your AnyExamEasy annual subscription renews in about 30 days (<strong>${when}</strong>).</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your saved payment method will be charged <strong>${amount}</strong> for your ${tier.label} plan.</p>
    <p style="margin:0;font-size:14px;color:#64748b;">Update your payment method or cancel anytime in Settings before renewal. Payments are non-refundable.</p>`;

  const text = [
    greeting(params.name),
    "",
    `Your annual subscription renews in about 30 days (${when}).`,
    `Your saved payment method will be charged ${amount} for your ${tier.label} plan.`,
    "",
    `Manage billing: ${settingsUrl}`,
  ].join("\n");

  return sendBillingEmail({
    to: params.to,
    subject: "Your AnyExamEasy annual plan renews in about 30 days",
    html: billingEmailShell(
      "Annual plan renews in about 30 days",
      bodyHtml,
      "Manage subscription",
      settingsUrl
    ),
    text,
  });
}

export async function sendPaymentFailedEmail(
  params: BillingEmailParams
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const settingsUrl = `${appBaseUrl()}/settings`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">We couldn't process your latest subscription payment. Study access is paused until your payment method is updated.</p>
    <p style="margin:0;font-size:14px;color:#64748b;">Update your card or wallet in Settings to restore full access. If you've already fixed this, access will resume automatically once payment succeeds.</p>`;

  const text = [
    greeting(params.name),
    "",
    "We couldn't process your latest subscription payment. Study access is paused until your payment method is updated.",
    "",
    `Update payment method: ${settingsUrl}`,
  ].join("\n");

  return sendBillingEmail({
    to: params.to,
    subject: "Action required — update your payment method",
    html: billingEmailShell(
      "Payment failed",
      bodyHtml,
      "Update payment method",
      settingsUrl
    ),
    text,
  });
}

export function renewalReceiptContent(params: {
  name?: string | null;
  amountLabel: string;
  planLabel: string;
  examName?: string | null;
  startCta?: string | null;
  startUrl?: string | null;
}): { subject: string; html: string; text: string } {
  const examName = params.examName?.trim() || null;
  const subject = examName ? `Your ${examName} renewal receipt` : "Your AnyExamEasy renewal receipt";
  const settingsUrl = `${appBaseUrl()}/settings`;
  const paidLine = examName
    ? `Payment received: <strong>${params.amountLabel}</strong> for your ${examName} plan (${params.planLabel}).`
    : `Payment received: <strong>${params.amountLabel}</strong> for ${params.planLabel}.`;
  const startLine =
    params.startCta && params.startUrl
      ? `<a href="${params.startUrl}">${params.startCta}</a>`
      : "";
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${paidLine}</p>
    ${startLine ? `<p style="margin:0 0 16px;font-size:15px;color:#475569;">${startLine}</p>` : ""}
    <p style="margin:0;font-size:14px;color:#64748b;">This confirms a renewal charge. It is not a new signup.</p>`;
  const text = [
    greeting(params.name),
    "",
    examName
      ? `Payment received: ${params.amountLabel} for your ${examName} plan (${params.planLabel}).`
      : `Payment received: ${params.amountLabel} for ${params.planLabel}.`,
    params.startCta && params.startUrl ? `${params.startCta}: ${params.startUrl}` : "",
    "This confirms a renewal charge. It is not a new signup.",
    "",
    `Manage billing: ${settingsUrl}`,
  ]
    .filter((line) => line !== "")
    .join("\n");
  return {
    subject,
    text,
    html: billingEmailShell(subject, bodyHtml, "Manage subscription", settingsUrl),
  };
}

export async function sendRenewalReceiptEmail(
  params: BillingEmailParams & {
    amountLabel: string;
    planLabel: string;
    examName?: string | null;
    startCta?: string | null;
    startUrl?: string | null;
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };
  const message = renewalReceiptContent(params);
  return sendBillingEmail({ to: params.to, ...message });
}

export function cancellationEmailContent(params: {
  name?: string | null;
  accessUntilLabel?: string | null;
}): { subject: string; html: string; text: string } {
  const subject = "Your AnyExamEasy subscription is canceled";
  const settingsUrl = `${appBaseUrl()}/settings`;
  const until = params.accessUntilLabel
    ? `Paid access continues until ${params.accessUntilLabel}.`
    : "You will not be charged again.";
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your AnyExamEasy subscription is canceled. ${until}</p>
    <p style="margin:0;font-size:14px;color:#64748b;">This note is not a bill, and it does not promise a score or a license.</p>`;
  const text = [
    greeting(params.name),
    "",
    `Your AnyExamEasy subscription is canceled. ${until}`,
    "This note is not a bill, and it does not promise a score or a license.",
    "",
    `Settings: ${settingsUrl}`,
  ].join("\n");
  return {
    subject,
    text,
    html: billingEmailShell("Subscription canceled", bodyHtml, "Open settings", settingsUrl),
  };
}

export async function sendCancellationEmail(
  params: BillingEmailParams & { accessUntilLabel?: string | null }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };
  const message = cancellationEmailContent(params);
  return sendBillingEmail({ to: params.to, ...message });
}
