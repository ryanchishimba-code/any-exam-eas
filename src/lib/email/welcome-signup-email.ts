import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { displayFirstName } from "@/lib/display-name";
import { LEGAL_ENTITY } from "@/lib/legal";
import { LEGAL_SUPPORT_PHONE } from "@/lib/legal-phone";

export const WELCOME_SIGNUP_EMAIL_SUBJECT = "Welcome to AnyExamEasy";

export const WELCOME_EMAIL_DELAY_MS = 60 * 60 * 1000;

/** Same no-pass line used on the other trial notes. */
export const WELCOME_NO_PASS_LINE =
  "AnyExamEasy is a study aid for self-assessment. It does not guarantee a score, a passing result, licensure, or certification.";

export function welcomeEmailSendAfter(now = new Date()): Date {
  return new Date(now.getTime() + WELCOME_EMAIL_DELAY_MS);
}

/**
 * Resend accepts a display name in the From header. This welcome note is the
 * one message that should arrive from Ryan rather than the shared EMAIL_FROM.
 */
export const WELCOME_SIGNUP_EMAIL_FROM = `Ryan C <${LEGAL_ENTITY.supportEmail}>`;

export const WELCOME_SIGNUP_EMAIL_REPLY_TO = LEGAL_ENTITY.supportEmail;

export type WelcomeSignupEmailInput = {
  name?: string | null;
  /** Selected exam short name. Omit when the account has no exam yet. */
  examName?: string | null;
  /** Sentence before the link, such as "Start with 10 NCLEX questions". */
  startCta: string;
  startUrl: string;
  unsubscribeUrl: string;
};

export function welcomeSubject(examName?: string | null): string {
  return examName ? `Welcome to AnyExamEasy — ${examName}` : WELCOME_SIGNUP_EMAIL_SUBJECT;
}

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export type WelcomeSignupEmail = {
  subject: string;
  html: string;
  text: string;
  from: string;
  replyTo: string;
  headers: Record<string, string>;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function greetingLine(name?: string | null): string {
  return `Hi ${displayFirstName(name)},`;
}

function thankYouLine(examName?: string | null): string {
  if (examName) {
    return `Thank you for joining ${LEGAL_ENTITY.productName}. Your ${examName} trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions over ${TRIAL_DAYS} days.`;
  }
  return `Thank you for joining ${LEGAL_ENTITY.productName}. Your ${TRIAL_DAYS}-day trial includes ${TRIAL_LIFETIME_QUESTIONS} practice questions.`;
}

function helpLine(): string {
  return `Whenever you have a question, just reply to this email or call us at ${LEGAL_SUPPORT_PHONE.display}. We're here for you.`;
}

function signatureLines(): string[] {
  return ["Support Team", LEGAL_ENTITY.productName, LEGAL_SUPPORT_PHONE.display];
}

function paragraph(html: string, marginBottom = "18px"): string {
  return `<p style="margin:0 0 ${marginBottom};font-family:${FONT};font-size:16px;line-height:1.7;color:#3f4a5a;">${html}</p>`;
}

function welcomeHtml(input: WelcomeSignupEmailInput, greeting: string, subject: string): string {
  const phoneLink = `<a href="${LEGAL_SUPPORT_PHONE.tel}" style="color:#0f766e;font-weight:600;text-decoration:none;">${escapeHtml(LEGAL_SUPPORT_PHONE.display)}</a>`;
  const start = `<a href="${escapeHtml(input.startUrl)}" style="color:#0f766e;font-weight:600;text-decoration:underline;">${escapeHtml(input.startCta)}</a>`;
  const thanks = escapeHtml(thankYouLine(input.examName));
  const help = `Whenever you have a question, just reply to this email or call us at ${phoneLink}. We're here for you.`;
  const unsubscribeHref = escapeHtml(input.unsubscribeUrl);
  const preheader = input.examName
    ? `Your ${input.examName} trial is ready. Start with 10 questions.`
    : "Choose your exam, then start with 10 questions.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(subject)}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .welcome-shell { padding: 20px 12px !important; }
      .welcome-card { padding: 28px 20px 26px !important; }
      .welcome-unsubscribe a { display: block !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f3f1;color:#1c1917;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f3f1" style="background:#f4f3f1;">
    <tr>
      <td class="welcome-shell" align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td bgcolor="#ffffff" style="background:#ffffff;border:1px solid #e7e5e4;border-radius:20px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="#0f766e" height="4" style="height:4px;background:#0f766e;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td class="welcome-card" style="padding:40px 40px 32px;">
                    <p style="margin:0 0 28px;font-family:${FONT};font-size:12px;line-height:1;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#0f766e;">${escapeHtml(LEGAL_ENTITY.productName)}</p>
                    <h1 style="margin:0 0 18px;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:600;color:#0f172a;">${escapeHtml(greeting)}</h1>
                    ${paragraph(thanks)}
                    ${paragraph(start)}
                    ${paragraph(escapeHtml(WELCOME_NO_PASS_LINE))}
                    ${paragraph(help, "0")}
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 22px;">
                      <tr>
                        <td style="border-top:1px solid #e7e5e4;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                    <p style="margin:0 0 2px;font-family:${FONT};font-size:15px;line-height:1.5;font-weight:600;color:#0f172a;">Support Team</p>
                    <p style="margin:0 0 2px;font-family:${FONT};font-size:15px;line-height:1.5;color:#57534e;">${escapeHtml(LEGAL_ENTITY.productName)}</p>
                    <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.5;">${phoneLink}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="welcome-unsubscribe" align="center" style="padding:22px 8px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" bgcolor="#111827" style="border-radius:12px;background:#111827;">
                    <a href="${unsubscribeHref}" style="display:inline-block;padding:14px 22px;font-family:${FONT};font-size:14px;line-height:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Copy and HTML for the delayed signup welcome email. */
export function buildWelcomeSignupEmail(input: WelcomeSignupEmailInput): WelcomeSignupEmail {
  const greeting = greetingLine(input.name);
  const subject = welcomeSubject(input.examName);
  const text = [
    greeting,
    "",
    thankYouLine(input.examName),
    "",
    `${input.startCta}: ${input.startUrl}`,
    "",
    WELCOME_NO_PASS_LINE,
    "",
    helpLine(),
    "",
    ...signatureLines(),
    "",
    `Unsubscribe: ${input.unsubscribeUrl}`,
  ].join("\n");

  return {
    subject,
    html: welcomeHtml(input, greeting, subject),
    text,
    from: WELCOME_SIGNUP_EMAIL_FROM,
    replyTo: WELCOME_SIGNUP_EMAIL_REPLY_TO,
    headers: {
      "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
    },
  };
}
