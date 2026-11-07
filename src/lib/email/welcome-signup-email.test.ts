import { afterEach, describe, expect, it, vi } from "vitest";
import { sendWelcomeTrialEmail } from "@/lib/email/trial-lifecycle-emails";
import {
  WELCOME_EMAIL_DELAY_MS,
  WELCOME_NO_PASS_LINE,
  WELCOME_SIGNUP_EMAIL_FROM,
  WELCOME_SIGNUP_EMAIL_REPLY_TO,
  WELCOME_SIGNUP_EMAIL_SUBJECT,
  buildWelcomeSignupEmail,
  welcomeEmailSendAfter,
  type WelcomeSignupEmailInput,
} from "@/lib/email/welcome-signup-email";

const sample: WelcomeSignupEmailInput = {
  name: "Jordan Lee",
  examName: "NCLEX",
  startCta: "Start with 10 NCLEX questions",
  startUrl: "https://www.anyexameasy.com/question-bank?field=nursing&mode=bank&count=10",
  unsubscribeUrl: "https://www.anyexameasy.com/email/unsubscribe?token=abc",
};

const NAMED_TEXT = `Hi Jordan,

Thank you for joining AnyExamEasy. Your NCLEX trial includes 100 practice questions over 5 days.

Start with 10 NCLEX questions: https://www.anyexameasy.com/question-bank?field=nursing&mode=bank&count=10

AnyExamEasy is a study aid for self-assessment. It does not guarantee a score, a passing result, licensure, or certification.

Whenever you have a question, just reply to this email or call us at (214) 883-6375. We're here for you.

Support Team
AnyExamEasy
(214) 883-6375

Unsubscribe: https://www.anyexameasy.com/email/unsubscribe?token=abc`;

describe("welcome signup email copy", () => {
  it("uses the requested subject, sender, and reply-to", () => {
    const message = buildWelcomeSignupEmail(sample);

    expect(message.subject).toBe("Welcome to AnyExamEasy — NCLEX");
    expect(WELCOME_SIGNUP_EMAIL_SUBJECT).toBe("Welcome to AnyExamEasy");
    expect(message.text).not.toMatch(/NAPLEX|PANCE|USMLE|NPTE|Step 2|six boards/i);
    expect(message.from).toBe("Ryan C <support@anyexameasy.com>");
    expect(WELCOME_SIGNUP_EMAIL_FROM).toBe(message.from);
    expect(message.replyTo).toBe("support@anyexameasy.com");
    expect(WELCOME_SIGNUP_EMAIL_REPLY_TO).toBe(message.replyTo);
    expect(message.headers["List-Unsubscribe"]).toBe(`<${sample.unsubscribeUrl}>`);
    expect(message.text).not.toMatch(/upgrade/i);
    expect(message.text).toContain(WELCOME_NO_PASS_LINE);
  });

  it("writes the exact plain-text letter and falls back to there", () => {
    expect(buildWelcomeSignupEmail(sample).text).toBe(NAMED_TEXT);
    expect(buildWelcomeSignupEmail({ ...sample, name: null }).text.startsWith("Hi there,\n")).toBe(true);
    expect(buildWelcomeSignupEmail({ ...sample, name: "   " }).text.startsWith("Hi there,\n")).toBe(true);
    expect(buildWelcomeSignupEmail({ ...sample, name: "mary jane" }).text.startsWith("Hi Mary,\n")).toBe(true);
  });

  it("waits about an hour before the welcome is eligible", () => {
    const now = new Date("2026-11-07T16:00:00.000Z");
    expect(welcomeEmailSendAfter(now).getTime() - now.getTime()).toBe(WELCOME_EMAIL_DELAY_MS);
    expect(WELCOME_EMAIL_DELAY_MS).toBe(60 * 60 * 1000);
  });

  it("renders a mobile-friendly html letter with an unsubscribe button", () => {
    const { html } = buildWelcomeSignupEmail(sample);

    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1"');
    expect(html).toContain("Hi Jordan,");
    expect(html).toContain("Your NCLEX trial includes 100 practice questions over 5 days.");
    expect(html).not.toMatch(/NAPLEX|PANCE|USMLE|Step 2|six boards/i);
    expect(html).toContain(">Start with 10 NCLEX questions</a>");
    expect(html).toContain("question-bank?field=nursing&amp;mode=bank&amp;count=10");
    expect(html).toContain("We're here for you.");
    expect(html).toContain("(214) 883-6375");
    expect(html).toContain('href="tel:+12148836375"');
    expect(html).toContain(">Support Team<");
    expect(html).toContain(`href="${sample.unsubscribeUrl}"`);
    expect(html).toContain(">Unsubscribe</a>");
    expect(html).toContain("@media only screen and (max-width: 600px)");
    expect(html).not.toContain("Upgrade Now");
    expect(html).toContain("does not guarantee a score");
  });

  it("escapes a name before placing it in html", () => {
    const { html, text } = buildWelcomeSignupEmail({
      ...sample,
      name: "<script>alert(1)</script>",
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(text).toContain("Hi <script>alert(1)</script>,");
  });
});

describe("welcome signup email delivery", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("does not send when Resend is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendWelcomeTrialEmail({ to: "jordan@example.com", ...sample, name: "Jordan" });

    expect(result).toEqual({ ok: false, reason: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the new letter with reply-to and leaves the welcome tag in place", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ id: "msg_welcome" }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendWelcomeTrialEmail({
      to: "jordan@example.com",
      ...sample,
    });

    expect(result).toEqual({ ok: true, provider: "resend", messageId: "msg_welcome" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(init.body)) as {
      from: string;
      reply_to: string;
      subject: string;
      text: string;
      html: string;
      headers: Record<string, string>;
      tags: { name: string; value: string }[];
    };
    expect(body.from).toBe("Ryan C <support@anyexameasy.com>");
    expect(body.reply_to).toBe("support@anyexameasy.com");
    expect(body.subject).toBe("Welcome to AnyExamEasy — NCLEX");
    expect(body.text).toBe(NAMED_TEXT);
    expect(body.html).toContain(`href="${sample.unsubscribeUrl}"`);
    expect(body.headers["List-Unsubscribe"]).toBe(`<${sample.unsubscribeUrl}>`);
    expect(body.tags).toEqual([{ name: "category", value: "trial-welcome" }]);
  });
});
