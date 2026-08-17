import { appBaseUrl } from "@/lib/email/config";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import {
  deltaLabel,
  type NightlyTrafficReport,
} from "@/lib/analytics/nightly-traffic-report";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function metricRow(
  label: string,
  value: number | string,
  delta?: string
): string {
  const deltaHtml = delta
    ? `<span style="display:inline-block;margin-left:8px;font-size:12px;font-weight:600;color:${
        delta.startsWith("+") ? "#059669" : delta.startsWith("-") ? "#dc2626" : "#64748b"
      };">${escapeHtml(delta)} vs prior day</span>`
    : "";
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-size:18px;font-weight:700;color:#0f172a;">${escapeHtml(String(value))}${deltaHtml}</td>
  </tr>`;
}

function listRows(
  rows: { label: string; value: string }[]
): string {
  if (rows.length === 0) {
    return `<p style="margin:0;font-size:13px;color:#94a3b8;">No data for this period.</p>`;
  }
  return `<table width="100%" cellpadding="0" cellspacing="0">${rows
    .map(
      (r) => `<tr>
      <td style="padding:6px 0;font-size:13px;color:#334155;">${escapeHtml(r.label)}</td>
      <td style="padding:6px 0;text-align:right;font-size:13px;font-weight:600;color:#0f172a;">${escapeHtml(r.value)}</td>
    </tr>`
    )
    .join("")}</table>`;
}

export function formatNightlyTrafficReportEmail(report: NightlyTrafficReport): {
  subject: string;
  html: string;
  text: string;
} {
  const adminUrl = `${appBaseUrl()}/admin/analytics`;
  const subject = `Any Exam Easy traffic · ${report.date}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;color:#1d1d1f;margin:0;padding:0;background:#f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:28px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:28px 24px;border:1px solid rgba(0,0,0,0.06);">
        <tr><td>
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0e7490;">Nightly traffic report</p>
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;">${escapeHtml(report.date)} (UTC)</h1>
          <p style="margin:0 0 20px;font-size:13px;color:#64748b;">Visitors, trials, and acquisition for the previous UTC day.</p>

          <h2 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Overview</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            ${metricRow("Unique visitors", report.uniqueVisitors, deltaLabel(report.uniqueVisitors, report.priorDayUniqueVisitors))}
            ${metricRow("Page views", report.pageViews)}
            ${metricRow("New signups", report.newSignups, deltaLabel(report.newSignups, report.priorDaySignups))}
            ${metricRow("New trials (subscriptions)", report.newTrials, deltaLabel(report.newTrials, report.priorDayTrials))}
            ${metricRow("Trial started events", report.trialStartedEvents)}
            ${metricRow("Logins", report.logins)}
            ${metricRow("Checkout events", report.checkouts)}
            ${metricRow("Bounce rate", `${report.bounceRate}%`)}
          </table>

          <h2 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Audience mix</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            ${metricRow("Anonymous page views", report.anonymousPageViews)}
            ${metricRow("Authenticated page views", report.authenticatedPageViews)}
            ${metricRow("Active trials (now)", report.activeTrialsNow)}
            ${metricRow("Paid / Stripe active (now)", report.paidActiveNow)}
          </table>

          <h2 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Top pages</h2>
          <div style="margin-bottom:20px;">
            ${listRows(
              report.topPages.map((p) => ({
                label: p.path,
                value: `${p.views} views · ${p.avgDurationSec}s avg`,
              }))
            )}
          </div>

          <h2 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a;">Traffic sources</h2>
          <div style="margin-bottom:24px;">
            ${listRows(
              report.topReferrers.map((r) => ({
                label: r.source,
                value: `${r.views} views`,
              }))
            )}
          </div>

          <p style="margin:0;text-align:center;">
            <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:12px;">Open analytics</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:14px 0 0;font-size:11px;color:#94a3b8;">Any Exam Easy · automated nightly digest</p>
    </td></tr>
  </table>
</body>
</html>`;

  const textLines = [
    `Any Exam Easy traffic · ${report.date} (UTC)`,
    "",
    `Unique visitors: ${report.uniqueVisitors} (${deltaLabel(report.uniqueVisitors, report.priorDayUniqueVisitors)} vs prior day)`,
    `Page views: ${report.pageViews}`,
    `New signups: ${report.newSignups} (${deltaLabel(report.newSignups, report.priorDaySignups)})`,
    `New trials: ${report.newTrials} (${deltaLabel(report.newTrials, report.priorDayTrials)})`,
    `Trial started events: ${report.trialStartedEvents}`,
    `Logins: ${report.logins}`,
    `Checkouts: ${report.checkouts}`,
    `Bounce rate: ${report.bounceRate}%`,
    "",
    `Anonymous views: ${report.anonymousPageViews}`,
    `Authenticated views: ${report.authenticatedPageViews}`,
    `Active trials now: ${report.activeTrialsNow}`,
    `Paid/Stripe active now: ${report.paidActiveNow}`,
    "",
    "Top pages:",
    ...report.topPages.map((p) => `  ${p.path} — ${p.views} views (${p.avgDurationSec}s avg)`),
    "",
    "Sources:",
    ...report.topReferrers.map((r) => `  ${r.source} — ${r.views} views`),
    "",
    `Analytics: ${adminUrl}`,
  ];

  return { subject, html, text: textLines.join("\n") };
}

export async function sendNightlyTrafficReportEmail(
  report: NightlyTrafficReport,
  recipients: string[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const content = formatNightlyTrafficReportEmail(report);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const to of recipients) {
    const result = await sendTransactionalEmail({
      to,
      subject: content.subject,
      html: content.html,
      text: content.text,
      tags: [
        { name: "category", value: "nightly_traffic_report" },
        { name: "report_date", value: report.date },
      ],
    });
    if (result.ok) {
      sent += 1;
    } else {
      failed += 1;
      errors.push(`${to}: ${result.reason}${result.detail ? ` (${result.detail})` : ""}`);
    }
  }

  return { sent, failed, errors };
}
