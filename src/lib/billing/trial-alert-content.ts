import { formatDisplayName } from "@/lib/display-name";
import { appBaseUrl } from "@/lib/email/config";
import { formatPlanUsd, getBillingPlanTier, parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { resolveUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { isInternalTestEmail } from "@/lib/test-accounts";

export const TRIAL_ALERT_WEBHOOK_TIMEOUT_MS = 4_000;
const CHICAGO = "America/Chicago";

const EXAM_DISPLAY: Record<string, string> = {
  nclex: "NCLEX-RN",
  naplex: "NAPLEX",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
  mpje: "MPJE",
};

export type TrialExamLabel = { slug: string; name: string };

/** Selected exam slug (plus USMLE step field when the slug is usmle) → display name. */
export function trialExamDisplayName(
  examSlug: string | null | undefined,
  usmleFieldId?: string | null
): TrialExamLabel {
  const slug = (examSlug ?? "").trim().toLowerCase();
  const stepField =
    usmleFieldId?.trim() ||
    (slug.startsWith("usmle-step") ? slug : null);
  const step = stepField ? usmleStepDefinition(stepField) : undefined;
  if (slug === "usmle" || slug.startsWith("usmle-step") || (stepField && resolveUsmleFieldId(stepField))) {
    if (step) return { slug: "usmle", name: step.name };
    if (slug === "usmle" || slug.startsWith("usmle")) return { slug: "usmle", name: "USMLE" };
  }
  if (slug && EXAM_DISPLAY[slug]) return { slug, name: EXAM_DISPLAY[slug] };
  if (!slug) return { slug: "unknown", name: "Exam not selected" };
  return { slug, name: slug.toUpperCase() };
}

/** First name only, otherwise j***@gmail.com. Never the full address. */
export function maskEmailAddress(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0 || at === trimmed.length - 1) return "***";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  return `${local.charAt(0)}***@${domain}`;
}

export function trialIdentityLabel(name: string | null | undefined, email: string): string {
  const formatted = formatDisplayName(name);
  if (formatted) {
    const first = formatted.split(/\s+/).filter(Boolean)[0];
    if (first && !first.includes("@")) return first;
  }
  return maskEmailAddress(email);
}

export function trialAlertIncludesTestAccounts(): boolean {
  const raw = process.env.TRIAL_ALERT_INCLUDE_TEST_ACCOUNTS?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/** Internal QA and load-test inboxes stay quiet unless the flag is on. */
export function shouldAnnounceTrial(email: string | null | undefined): boolean {
  if (!email) return false;
  if (!isInternalTestEmail(email)) return true;
  return trialAlertIncludesTestAccounts();
}

export function trialPlanLabel(
  planTier: string | null | undefined,
  planInterval: string | null | undefined
): string {
  const tier = parseSubscriptionTier(planTier);
  const interval = parseBillingInterval(planInterval);
  const plan = getBillingPlanTier(tier, interval);
  return `Pro · ${plan.label} · ${formatPlanUsd(plan.totalUsd)}`;
}

export function formatTrialSource(input: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
}): string | null {
  const utm = [input.utmSource, input.utmMedium, input.utmCampaign, input.utmContent]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  let referrer = input.referrer?.trim() ?? "";
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      referrer = host && !host.includes("anyexameasy") ? host : "";
    } catch {
      referrer = referrer.slice(0, 80);
    }
  }
  const parts = [...utm];
  if (referrer && !parts.includes(referrer)) parts.push(referrer);
  if (parts.length === 0) return null;
  return parts.join(" · ").slice(0, 180);
}

/** True only for a Stripe Checkout that just opened a trial. Renewals are not this. */
export function isInitialStripeTrial(
  plan: string | null | undefined,
  status: string | null | undefined
): boolean {
  return plan === "trial" && status === "trialing";
}

type ChicagoClock = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
};

function chicagoWallClock(now: Date): ChicagoClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour,
    minute: Number(get("minute")),
    second: Number(get("second")),
    weekday: get("weekday"),
  };
}

/** UTC instant of midnight America/Chicago on the calendar day of `now`. */
export function chicagoDayStartUtc(now: Date): Date {
  const clock = chicagoWallClock(now);
  const elapsedMs =
    (clock.hour * 3600 + clock.minute * 60 + clock.second) * 1000 + now.getMilliseconds();
  return new Date(now.getTime() - elapsedMs);
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Monday 00:00 America/Chicago, as a UTC instant. */
export function chicagoWeekStartUtc(now: Date): Date {
  const dayStart = chicagoDayStartUtc(now);
  const weekday = WEEKDAY_INDEX[chicagoWallClock(now).weekday] ?? 0;
  const daysSinceMonday = (weekday + 6) % 7;
  return new Date(dayStart.getTime() - daysSinceMonday * 86_400_000);
}

export function formatChicagoDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export type TrialAlertEmailModel = {
  examName: string;
  identity: string;
  startedAt: Date;
  planLabel: string | null;
  source: string | null;
  trialsToday: number;
  trialsWeek: number;
  todayByExam: { name: string; count: number }[];
  analyticsUrl?: string;
  logoUrl?: string;
};

export type TrialAlertWebhookPayload = {
  event: "trial_started";
  exam_slug: string;
  exam_name: string;
  plan: string | null;
  started_at: string;
  source: string | null;
  first_name_or_masked_email: string;
  trials_today: number;
  trials_week: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildTrialAlertWebhookPayload(input: {
  examSlug: string;
  examName: string;
  plan: string | null;
  startedAt: Date;
  source: string | null;
  identity: string;
  trialsToday: number;
  trialsWeek: number;
}): TrialAlertWebhookPayload {
  return {
    event: "trial_started",
    exam_slug: input.examSlug,
    exam_name: input.examName,
    plan: input.plan,
    started_at: input.startedAt.toISOString(),
    source: input.source,
    first_name_or_masked_email: input.identity,
    trials_today: input.trialsToday,
    trials_week: input.trialsWeek,
  };
}

export function trialAlertWebhookRequest(payload: TrialAlertWebhookPayload): {
  url: string;
  init: RequestInit;
} | null {
  const url = process.env.TRIAL_ALERT_WEBHOOK_URL?.trim();
  if (!url) return null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = process.env.TRIAL_ALERT_WEBHOOK_KEY?.trim();
  if (key) {
    const headerName = process.env.TRIAL_ALERT_WEBHOOK_KEY_HEADER?.trim() || "Authorization";
    const bearer = headerName.toLowerCase() === "authorization";
    headers[headerName] =
      bearer && !key.toLowerCase().startsWith("bearer ") ? `Bearer ${key}` : key;
  }
  return {
    url,
    init: {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TRIAL_ALERT_WEBHOOK_TIMEOUT_MS),
    },
  };
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td class="aee-muted aee-line" style="padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">${escapeHtml(label)}</td>
    <td class="aee-ink aee-line" style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(value)}</td>
  </tr>`;
}

export function formatTrialAlertEmail(model: TrialAlertEmailModel): {
  subject: string;
  html: string;
  text: string;
} {
  const analyticsUrl = model.analyticsUrl ?? `${appBaseUrl()}/admin/analytics`;
  const logoUrl = model.logoUrl ?? `${appBaseUrl()}/images/brand/anyexameasy-wordmark.png`;
  const when = formatChicagoDateTime(model.startedAt);
  const subject = `🎉 New trial: ${model.examName}`;
  const headline = `🎉 Someone just started a ${model.examName} trial!`;
  const tally =
    model.todayByExam.length > 0
      ? model.todayByExam.map((row) => `${row.name} ${row.count}`).join(" · ")
      : "";

  const rows = [
    detailRow("Started", when),
    model.planLabel ? detailRow("Plan", model.planLabel) : "",
    model.source ? detailRow("Source", model.source) : "",
    detailRow("Trials today", String(model.trialsToday)),
    detailRow("Trials this week", String(model.trialsWeek)),
    tally ? detailRow("Today by exam", tally) : "",
  ].join("");

  const dot = (color: string) =>
    `<td width="8" height="8" bgcolor="${color}" style="width:8px;height:8px;background:${color};border-radius:99px;font-size:0;line-height:0;">&nbsp;</td><td width="7" style="font-size:0;line-height:0;">&nbsp;</td>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(subject)}</title>
  <style>
    @media only screen and (max-width: 480px) {
      .aee-headline { font-size: 22px !important; }
      .aee-badge-text { font-size: 26px !important; }
    }
    @media (prefers-color-scheme: dark) {
      .aee-bg { background:#0b1220 !important; }
      .aee-card { background:#111827 !important; border-color:#1f2937 !important; }
      .aee-ink { color:#f8fafc !important; }
      .aee-muted { color:#94a3b8 !important; }
      .aee-line { border-color:#1f2937 !important; }
      .aee-foot { color:#64748b !important; }
      .aee-logo-plate { background:#ffffff !important; }
      .aee-band { background:#0e7490 !important; }
      .aee-on-band { color:#ffffff !important; }
      .aee-badge { background:#0e7490 !important; }
    }
  </style>
</head>
<body class="aee-bg" style="margin:0;padding:0;background:#f5f5f7;color:#1d1d1f;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(headline)} · ${escapeHtml(model.identity)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="aee-bg" bgcolor="#f5f5f7" style="background:#f5f5f7;padding:28px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="aee-card" bgcolor="#ffffff" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;">
        <tr><td class="aee-logo-plate" bgcolor="#ffffff" align="center" style="background:#ffffff;padding:18px 24px 14px;">
          <img src="${escapeHtml(logoUrl)}" alt="AnyExamEasy" width="160" style="display:block;width:160px;max-width:72%;height:auto;margin:0 auto;border:0;" />
        </td></tr>
        <tr><td class="aee-band" bgcolor="#0e7490" align="center" style="background-color:#0e7490;background-image:linear-gradient(135deg,#0e7490,#0891b2);padding:22px 22px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 14px;"><tr>
            ${dot("#ffffff")}${dot("#a5f3fc")}${dot("#fde68a")}${dot("#fecdd3")}${dot("#99f6e4")}
          </tr></table>
          <h1 class="aee-headline aee-on-band" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:26px;line-height:1.25;font-weight:700;color:#ffffff;">${escapeHtml(headline)}</h1>
        </td></tr>
        <tr><td align="center" style="padding:22px 24px 6px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
            <tr><td class="aee-badge" bgcolor="#0e7490" align="center" style="background-color:#0e7490;background-image:linear-gradient(135deg,#0e7490,#0891b2);border-radius:999px;padding:14px 28px;">
              <span class="aee-badge-text" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:30px;line-height:1.15;font-weight:700;color:#ffffff;">${escapeHtml(model.examName)}</span>
            </td></tr>
          </table>
          <p class="aee-ink" style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:18px;font-weight:600;color:#0f172a;">${escapeHtml(model.identity)}</p>
        </td></tr>
        <tr><td style="padding:0 24px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            ${rows}
          </table>
        </td></tr>
        <tr><td align="center" style="padding:22px 24px 28px;">
          <a href="${escapeHtml(analyticsUrl)}" style="display:inline-block;background-color:#0e7490;background-image:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-weight:600;font-size:15px;padding:12px 22px;border-radius:12px;">Open analytics</a>
        </td></tr>
      </table>
      <p class="aee-foot" style="margin:14px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;color:#94a3b8;">Any Exam Easy</p>
    </td></tr>
  </table>
</body>
</html>`;

  const textLines = [
    headline,
    "",
    model.identity,
    `Started: ${when}`,
    model.planLabel ? `Plan: ${model.planLabel}` : "",
    model.source ? `Source: ${model.source}` : "",
    `Trials today: ${model.trialsToday}`,
    `Trials this week: ${model.trialsWeek}`,
    tally ? `Today by exam: ${tally}` : "",
    "",
    `Analytics: ${analyticsUrl}`,
  ].filter((line) => line !== "");

  return { subject, html, text: textLines.join("\n") };
}
