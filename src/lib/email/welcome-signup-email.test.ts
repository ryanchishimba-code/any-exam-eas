import { afterEach, describe, expect, it, vi } from "vitest";
import { sendWelcomeTrialEmail } from "@/lib/email/trial-lifecycle-emails";
import {
  WELCOME_SIGNUP_EMAIL_FROM,
  WELCOME_SIGNUP_EMAIL_REPLY_TO,
  WELCOME_SIGNUP_EMAIL_SUBJECT,
  WELCOME_SIGNUP_UNSUBSCRIBE_MAILTO,
  WELCOME_SIGNUP_UNSUBSCRIBE_TEXT,
  buildWelcomeSignupEmail,
} from "@/lib/email/welcome-signup-email";

const NAMED_TEXT = `Hi Jordan,

Thank you for joining AnyExamEasy. Your account is ready, and everything you need to prepare is waiting for you at https://www.anyexameasy.com.

Whenever you have a question, just reply to this email or call us at (214) 883-6375. We're here for you.

Support Team
AnyExamEasy
(214) 883-6375

Reply UNSUBSCRIBE to opt out`;

describe("welcome signup email copy", () => {
  it("uses the requested subject, sender, and reply-to", () => {
    const message = buildWelcomeSignupEmail("Jordan Lee");

    expect(message.subject).toBe("Welcome to AnyExamEasy");
    expect(WELCOME_SIGNUP_EMAIL_SUBJECT).toBe("Welcome to AnyExamEasy");
    expect(message.from).toBe("Ryan C <support@anyexameasy.com>");
    expect(WELCOME_SIGNUP_EMAIL_FROM).toBe(message.from);
    expect(message.replyTo).toBe("support@anyexameasy.com");
    expect(WELCOME_SIGNUP_EMAIL_REPLY_TO).toBe(message.replyTo);
    expect(message.headers["List-Unsubscribe"]).toBe(
      "<mailto:support@anyexameasy.com?subject=Unsubscribe>"
    );
  });

  it("writes the exact plain-text letter and falls back to there", () => {
    expect(buildWelcomeSignupEmail("Jordan Lee").text).toBe(NAMED_TEXT);
    expect(buildWelcomeSignupEmail(null).text.startsWith("Hi there,\n")).toBe(true);
    expect(buildWelcomeSignupEmail("   ").text.startsWith("Hi there,\n")).toBe(true);
    expect(buildWelcomeSignupEmail("mary jane").text.startsWith("Hi Mary,\n")).toBe(true);
    expect(buildWelcomeSignupEmail("Jordan Lee").text).toContain(WELCOME_SIGNUP_UNSUBSCRIBE_TEXT);
  });

  it("renders a mobile-friendly html letter with an unsubscribe button", () => {
    const { html } = buildWelcomeSignupEmail("Jordan Lee");

    expect(html).toContain('name="viewport" content="width=device-width, initial-scale=1"');
    expect(html).toContain("Hi Jordan,");
    expect(html).toContain("Thank you for joining AnyExamEasy.");
    expect(html).toContain('href="https://www.anyexameasy.com"');
    expect(html).toContain("https://www.anyexameasy.com");
    expect(html).toContain("We're here for you.");
    expect(html).toContain("(214) 883-6375");
    expect(html).toContain('href="tel:+12148836375"');
    expect(html).toContain(">Support Team<");
    expect(html).toContain(`href="${WELCOME_SIGNUP_UNSUBSCRIBE_MAILTO}"`);
    expect(html).toContain(">Unsubscribe</a>");
    expect(html).toContain("@media only screen and (max-width: 600px)");
    expect(html).not.toMatch(/trial/i);
    expect(html).not.toContain("Upgrade Now");
    expect(html).not.toContain("Open Dashboard");
  });

  it("escapes a name before placing it in html", () => {
    const { html, text } = buildWelcomeSignupEmail("<script>alert(1)</script>");

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

    const result = await sendWelcomeTrialEmail({ to: "jordan@example.com", name: "Jordan" });

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
      name: "Jordan Lee",
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
    expect(body.subject).toBe("Welcome to AnyExamEasy");
    expect(body.text).toBe(NAMED_TEXT);
    expect(body.html).toContain('href="mailto:support@anyexameasy.com?subject=Unsubscribe"');
    expect(body.headers["List-Unsubscribe"]).toBe(
      "<mailto:support@anyexameasy.com?subject=Unsubscribe>"
    );
    expect(body.tags).toEqual([{ name: "category", value: "trial-welcome" }]);
  });
});
