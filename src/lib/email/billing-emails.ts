import {
  appBaseUrl,
  getEmailFromAddress,
  isEmailConfigured,
  type EmailDeliveryResult,
} from "@/lib/email/config";
import { formatPlanUsd, getBillingPlanTier, parseBillingInterval } from "@/lib/billing-plans";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";

type BillingEmailParams = {
  to: string;
  name?: string | null;
};

function greeting(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? `Hi ${trimmed},` : "Hi there,";
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
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Any Exam Easy</p>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0f172a;">${title}</h1>
          ${bodyHtml}
          <p style="margin:24px 0 0;text-align:center;">
            <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;">${ctaLabel}</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">© Any Exam Easy · anyexameasy.com</p>
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
  }
): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  const settingsUrl = `${appBaseUrl()}/settings`;
  const tier = getBillingPlanTier("pro", params.planInterval);
  const when = formatEmailDate(params.trialEndsAt);
  const amount = formatPlanUsd(params.amountUsd);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">${greeting(params.name)}</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your ${TRIAL_DAYS}-day free trial ends in about 24 hours (<strong>${when}</strong>).</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Unless you cancel before then, your saved payment method will be charged <strong>${amount}</strong> for your ${tier.label} plan.</p>
    <p style="margin:0;font-size:14px;color:#64748b;">Want to keep studying for free a bit longer? Cancel anytime before your trial ends and you won't be charged. You can also switch billing plans in Settings before billing starts.</p>`;

  const text = [
    greeting(params.name),
    "",
    `Your ${TRIAL_DAYS}-day free trial ends in about 24 hours (${when}).`,
    `Unless you cancel before then, your saved payment method will be charged ${amount} for your ${tier.label} plan.`,
    "",
    "Cancel anytime before your trial ends to avoid being charged.",
    "",
    `Manage billing: ${settingsUrl}`,
  ].join("\n");

  return sendBillingEmail({
    to: params.to,
    subject: `Your Any Exam Easy trial ends in 24 hours`,
    html: billingEmailShell(
      "Your free trial ends tomorrow",
      bodyHtml,
      "Manage subscription",
      settingsUrl
    ),
    text,
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
    <p style="margin:0 0 16px;font-size:15px;color:#475569;">Your Any Exam Easy subscription renews in about 24 hours (<strong>${when}</strong>).</p>
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
    subject: `Your Any Exam Easy subscription renews in 24 hours`,
    html: billingEmailShell(
      "Subscription renews tomorrow",
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
