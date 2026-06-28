import { LEGAL_ENTITY } from "@/lib/legal";
import { appBaseUrl } from "@/lib/email/config";

export type EmailCta = {
  label: string;
  url: string;
};

export type TransactionalEmailLayoutParams = {
  title: string;
  bodyHtml: string;
  preheader?: string;
  primaryCta?: EmailCta;
  secondaryCta?: EmailCta;
  footerNote?: string;
};

function ctaButton(cta: EmailCta, primary: boolean): string {
  const style = primary
    ? "display:inline-block;background:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;"
    : "display:inline-block;background:#ffffff;color:#0e7490;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:12px;border:1px solid rgba(14,116,144,0.35);";

  return `<a href="${cta.url}" style="${style}">${cta.label}</a>`;
}

/** Mobile-friendly transactional HTML shell — Apple-like, minimal chrome. */
export function transactionalEmailLayout({
  title,
  bodyHtml,
  preheader,
  primaryCta,
  secondaryCta,
  footerNote,
}: TransactionalEmailLayoutParams): string {
  const settingsUrl = `${appBaseUrl()}/settings`;
  const supportUrl = `mailto:${LEGAL_ENTITY.supportEmail}`;
  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>`
    : "";

  const ctaBlock =
    primaryCta || secondaryCta
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
          <tr>
            <td align="center" style="padding:0;">
              ${primaryCta ? `<p style="margin:0 0 12px;text-align:center;">${ctaButton(primaryCta, true)}</p>` : ""}
              ${secondaryCta ? `<p style="margin:0;text-align:center;">${ctaButton(secondaryCta, false)}</p>` : ""}
            </td>
          </tr>
        </table>`
      : "";

  const footerExtra = footerNote
    ? `<p style="margin:12px 0 0;font-size:11px;color:#94a3b8;line-height:1.5;">${footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1d1d1f;margin:0;padding:0;background:#f5f5f7;">
  ${preheaderHtml}
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px 28px;border:1px solid rgba(0,0,0,0.06);">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">${LEGAL_ENTITY.productName}</p>
              <h1 style="margin:0 0 20px;font-size:22px;font-weight:600;color:#0f172a;line-height:1.3;">${title}</h1>
              ${bodyHtml}
              ${ctaBlock}
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;margin-top:16px;">
          <tr>
            <td style="text-align:center;">
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
                © ${LEGAL_ENTITY.companyName} · ${LEGAL_ENTITY.productDomain}<br />
                Questions? <a href="${supportUrl}" style="color:#0891b2;text-decoration:none;">${LEGAL_ENTITY.supportEmail}</a>
                · <a href="${settingsUrl}" style="color:#0891b2;text-decoration:none;">Account settings</a>
              </p>
              ${footerExtra}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailParagraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.65;">${html}</p>`;
}

export function emailTipList(items: string[]): string {
  const rows = items
    .map(
      (item, index) =>
        `<tr>
          <td style="vertical-align:top;padding:0 10px 10px 0;width:22px;font-size:14px;font-weight:600;color:#0891b2;">${index + 1}.</td>
          <td style="vertical-align:top;padding:0 0 10px;font-size:14px;color:#475569;line-height:1.55;">${item}</td>
        </tr>`
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 8px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
    <tr><td style="padding:16px 18px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Quick start</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows}</table>
    </td></tr>
  </table>`;
}
