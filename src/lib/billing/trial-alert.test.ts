import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    userExamPreference: { findUnique: vi.fn(), groupBy: vi.fn() },
    userPreference: { findUnique: vi.fn() },
    trialEligibility: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    analyticsEvent: { findFirst: vi.fn() },
  },
}));

vi.mock("@/lib/email/resend-client", () => ({
  sendTransactionalEmail: vi.fn(),
}));

vi.mock("@/lib/trial-email-triggers", () => ({
  triggerWelcomeTrialEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import { startCardFreeTrialForUser } from "@/lib/billing/start-app-trial";
import {
  notifyOwnerOfTrialStart,
  resetTrialAlertClaimMemory,
  scheduleTrialStartAlert,
} from "@/lib/billing/trial-alert";
import {
  chicagoDayStartUtc,
  chicagoWeekStartUtc,
  formatTrialAlertEmail,
  formatTrialSource,
  isInitialStripeTrial,
  maskEmailAddress,
  trialAlertWebhookRequest,
  trialExamDisplayName,
  trialIdentityLabel,
  type TrialAlertWebhookPayload,
} from "@/lib/billing/trial-alert-content";

const trialEndsAt = new Date("2026-10-13T18:00:00.000Z");
const FULL_EMAIL = "jordan.lee@gmail.com";

function trialingSub(overrides?: { email?: string; name?: string | null; trialEndsAt?: Date; status?: string; plan?: string }) {
  return {
    id: "sub_1",
    status: overrides?.status ?? "trialing",
    plan: overrides?.plan ?? "trial",
    planTier: "pro",
    planInterval: "yearly",
    trialEndsAt: overrides?.trialEndsAt ?? trialEndsAt,
    user: {
      email: overrides?.email ?? FULL_EMAIL,
      name: overrides?.name === undefined ? "Jordan Lee" : overrides.name,
    },
  };
}

describe("trial exam names and masking", () => {
  it("maps board slugs and USMLE steps to display names", () => {
    expect(trialExamDisplayName("nclex")).toEqual({ slug: "nclex", name: "NCLEX-RN" });
    expect(trialExamDisplayName("naplex")).toEqual({ slug: "naplex", name: "NAPLEX" });
    expect(trialExamDisplayName("aanp-fnp")).toEqual({ slug: "aanp-fnp", name: "AANP FNP" });
    expect(trialExamDisplayName("pance")).toEqual({ slug: "pance", name: "PANCE" });
    expect(trialExamDisplayName("npte-pt")).toEqual({ slug: "npte-pt", name: "NPTE-PT" });
    expect(trialExamDisplayName("mpje")).toEqual({ slug: "mpje", name: "MPJE" });
    expect(trialExamDisplayName("usmle", "usmle-step-1").name).toBe("USMLE Step 1");
    expect(trialExamDisplayName("usmle", "usmle-step-2").name).toBe("USMLE Step 2 CK");
    expect(trialExamDisplayName("usmle", "usmle-step-3").name).toBe("USMLE Step 3");
    expect(trialExamDisplayName("usmle").name).toBe("USMLE");
    expect(trialExamDisplayName(null).name).toBe("Exam not selected");
  });

  it("uses a first name or a masked email, never the full address", () => {
    expect(trialIdentityLabel("Jordan Lee", FULL_EMAIL)).toBe("Jordan");
    expect(trialIdentityLabel(null, FULL_EMAIL)).toBe("j***@gmail.com");
    expect(trialIdentityLabel("  ", "A@Gmail.com")).toBe("a***@gmail.com");
    expect(maskEmailAddress("not-an-email")).toBe("***");
  });

  it("renders a NAPLEX celebration without the full email", () => {
    const email = formatTrialAlertEmail({
      examName: "NAPLEX",
      identity: "Jordan",
      startedAt: new Date("2026-10-08T18:30:00.000Z"),
      planLabel: "Pro · Annual · $235.12",
      source: "google · naplex",
      trialsToday: 4,
      trialsWeek: 12,
      todayByExam: [
        { name: "NAPLEX", count: 3 },
        { name: "NCLEX-RN", count: 1 },
      ],
      analyticsUrl: "https://www.anyexameasy.com/admin/analytics",
      logoUrl: "https://www.anyexameasy.com/images/brand/anyexameasy-logo.png",
    });
    expect(email.subject).toBe("🎉 New trial: NAPLEX");
    expect(email.html).toContain("NAPLEX");
    expect(email.html).toContain("Jordan");
    expect(email.html).toContain("Open analytics");
    expect(email.html).toContain("prefers-color-scheme: dark");
    expect(email.html).not.toContain(FULL_EMAIL);
    expect(email.html).not.toContain("tel:");
    expect(email.text).toContain("Trials today: 4");
    expect(email.text).toContain("Trials this week: 12");
    expect(email.text).toContain("NAPLEX 3");
    expect(email.text).not.toContain(FULL_EMAIL);
  });

  it("keeps same-site referrers out and keeps UTM", () => {
    expect(formatTrialSource({ referrer: "https://www.anyexameasy.com/signup" })).toBeNull();
    expect(
      formatTrialSource({
        utmSource: "google",
        utmCampaign: "naplex",
        referrer: "https://www.google.com/search?q=naplex",
      })
    ).toBe("google · naplex · google.com");
  });

  it("treats only a trialing trial checkout as a new Stripe trial", () => {
    expect(isInitialStripeTrial("trial", "trialing")).toBe(true);
    expect(isInitialStripeTrial("trial", "active")).toBe(false);
    expect(isInitialStripeTrial("subscribe", "active")).toBe(false);
    expect(isInitialStripeTrial("subscribe", "trialing")).toBe(false);
  });

  it("anchors today and this week to America/Chicago", () => {
    const now = new Date("2026-10-08T03:00:00.000Z");
    expect(chicagoDayStartUtc(now).toISOString()).toBe("2026-10-07T05:00:00.000Z");
    expect(chicagoWeekStartUtc(now).toISOString()).toBe("2026-10-05T05:00:00.000Z");
  });
});

describe("trial alert webhook", () => {
  const payload: TrialAlertWebhookPayload = {
    event: "trial_started",
    exam_slug: "naplex",
    exam_name: "NAPLEX",
    plan: "Pro · Annual · $235.12",
    started_at: "2026-10-08T18:30:00.000Z",
    source: "google",
    first_name_or_masked_email: "Jordan",
    trials_today: 4,
    trials_week: 12,
  };

  afterEach(() => {
    delete process.env.TRIAL_ALERT_WEBHOOK_URL;
    delete process.env.TRIAL_ALERT_WEBHOOK_KEY;
    delete process.env.TRIAL_ALERT_WEBHOOK_KEY_HEADER;
  });

  it("skips when the URL is unset", () => {
    delete process.env.TRIAL_ALERT_WEBHOOK_URL;
    expect(trialAlertWebhookRequest(payload)).toBeNull();
  });

  it("posts JSON with a bearer token by default and a custom header when named", () => {
    process.env.TRIAL_ALERT_WEBHOOK_URL = "https://hooks.example/trial";
    process.env.TRIAL_ALERT_WEBHOOK_KEY = "secret-key";
    const bearer = trialAlertWebhookRequest(payload);
    expect(bearer?.init.method).toBe("POST");
    expect(JSON.parse(String(bearer?.init.body))).toEqual(payload);
    expect((bearer?.init.headers as Record<string, string>).Authorization).toBe("Bearer secret-key");
    expect(bearer?.init.signal).toBeInstanceOf(AbortSignal);

    process.env.TRIAL_ALERT_WEBHOOK_KEY_HEADER = "X-Webhook-Key";
    const custom = trialAlertWebhookRequest(payload);
    const headers = custom?.init.headers as Record<string, string>;
    expect(headers["X-Webhook-Key"]).toBe("secret-key");
    expect(headers.Authorization).toBeUndefined();
  });
});

describe("notifyOwnerOfTrialStart", () => {
  const env: Record<string, string | undefined> = {};

  beforeEach(() => {
    resetTrialAlertClaimMemory();
    env.NIGHTLY_TRAFFIC_REPORT_TO = process.env.NIGHTLY_TRAFFIC_REPORT_TO;
    env.TRIAL_ALERT_INCLUDE_TEST_ACCOUNTS = process.env.TRIAL_ALERT_INCLUDE_TEST_ACCOUNTS;
    env.TRIAL_ALERT_WEBHOOK_URL = process.env.TRIAL_ALERT_WEBHOOK_URL;
    env.TRIAL_ALERT_WEBHOOK_KEY = process.env.TRIAL_ALERT_WEBHOOK_KEY;
    env.TRIAL_ALERT_WEBHOOK_KEY_HEADER = process.env.TRIAL_ALERT_WEBHOOK_KEY_HEADER;
    process.env.NIGHTLY_TRAFFIC_REPORT_TO = "owner@example.com";
    delete process.env.TRIAL_ALERT_INCLUDE_TEST_ACCOUNTS;
    delete process.env.TRIAL_ALERT_WEBHOOK_URL;
    delete process.env.TRIAL_ALERT_WEBHOOK_KEY;
    delete process.env.TRIAL_ALERT_WEBHOOK_KEY_HEADER;

    let claimed: string | null = null;
    vi.mocked(prisma.subscription.updateMany).mockImplementation(async (args) => {
      const next = (args?.data as { trialAlertForEndsAt?: Date } | undefined)?.trialAlertForEndsAt;
      const iso = next?.toISOString() ?? "";
      if (claimed === iso) return { count: 0 };
      claimed = iso;
      return { count: 1 };
    });
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(trialingSub() as never);
    vi.mocked(prisma.userExamPreference.findUnique).mockResolvedValue({ examSlug: "naplex" } as never);
    vi.mocked(prisma.userPreference.findUnique).mockResolvedValue({ metadata: null } as never);
    vi.mocked(prisma.trialEligibility.count).mockResolvedValue(4);
    vi.mocked(prisma.trialEligibility.findMany).mockResolvedValue([{ userId: "user_1" }] as never);
    vi.mocked(prisma.userExamPreference.groupBy).mockResolvedValue([
      { examSlug: "naplex", _count: { userId: 4 } },
    ] as never);
    vi.mocked(prisma.analyticsEvent.findFirst).mockResolvedValue(null as never);
    vi.mocked(sendTransactionalEmail).mockResolvedValue({ ok: true, provider: "resend" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200 })
    );
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("emails the traffic-report recipients once per trial window", async () => {
    const first = await notifyOwnerOfTrialStart({ userId: "user_1", source: "google" });
    const second = await notifyOwnerOfTrialStart({ userId: "user_1", source: "google" });
    expect(first).toEqual({ ok: true, announced: true });
    expect(second).toEqual({ ok: true, announced: false, reason: "already_sent" });
    expect(sendTransactionalEmail).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendTransactionalEmail).mock.calls[0]?.[0]).toMatchObject({
      to: "owner@example.com",
      subject: "🎉 New trial: NAPLEX",
    });
    const html = String(vi.mocked(sendTransactionalEmail).mock.calls[0]?.[0].html);
    expect(html).not.toContain(FULL_EMAIL);
    expect(html).toContain("Jordan");
  });

  it("alerts again when the same subscription starts a later trial", async () => {
    await notifyOwnerOfTrialStart({ userId: "user_1" });
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(
      trialingSub({ trialEndsAt: new Date("2026-11-01T18:00:00.000Z") }) as never
    );
    const again = await notifyOwnerOfTrialStart({ userId: "user_1" });
    expect(again.announced).toBe(true);
    expect(sendTransactionalEmail).toHaveBeenCalledTimes(2);
  });

  it("skips renewals and other non-trial statuses", async () => {
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(
      trialingSub({ status: "active", plan: "subscribe" }) as never
    );
    const result = await notifyOwnerOfTrialStart({ userId: "user_1" });
    expect(result).toEqual({ ok: true, announced: false, reason: "not_trial" });
    expect(sendTransactionalEmail).not.toHaveBeenCalled();
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("skips @anyexameasy.test unless the include flag is set", async () => {
    vi.mocked(prisma.subscription.findUnique).mockResolvedValue(
      trialingSub({ email: "qa@anyexameasy.test", name: "QA" }) as never
    );
    const skipped = await notifyOwnerOfTrialStart({ userId: "user_1" });
    expect(skipped).toEqual({ ok: true, announced: false, reason: "test_account" });
    expect(sendTransactionalEmail).not.toHaveBeenCalled();

    process.env.TRIAL_ALERT_INCLUDE_TEST_ACCOUNTS = "1";
    const allowed = await notifyOwnerOfTrialStart({ userId: "user_1" });
    expect(allowed.announced).toBe(true);
    expect(sendTransactionalEmail).toHaveBeenCalledTimes(1);
  });

  it("still resolves when email and webhook both fail", async () => {
    process.env.TRIAL_ALERT_WEBHOOK_URL = "https://hooks.example/trial";
    process.env.TRIAL_ALERT_WEBHOOK_KEY = "secret-key";
    vi.mocked(sendTransactionalEmail).mockRejectedValue(new Error("resend down"));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("webhook down")));
    await expect(notifyOwnerOfTrialStart({ userId: "user_1", source: "google" })).resolves.toEqual({
      ok: true,
      announced: true,
    });
    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body));
    expect(body).toMatchObject({
      event: "trial_started",
      exam_slug: "naplex",
      exam_name: "NAPLEX",
      first_name_or_masked_email: "Jordan",
      trials_today: 4,
      trials_week: 4,
    });
    expect(body.first_name_or_masked_email).not.toContain("@");
    expect(JSON.stringify(body)).not.toContain(FULL_EMAIL);
  });

  it("does not break card-free trial start when the alert throws", async () => {
    vi.mocked(prisma.trialEligibility.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.trialEligibility.upsert).mockResolvedValue({} as never);
    vi.mocked(prisma.subscription.findUnique)
      .mockResolvedValueOnce(null)
      .mockRejectedValue(new Error("alert db down"));
    vi.mocked(prisma.subscription.create).mockResolvedValue({ id: "sub_1" } as never);

    const result = await startCardFreeTrialForUser({
      userId: "user_1",
      email: FULL_EMAIL,
      signupSource: "google",
    });
    expect(result).toEqual({ started: true });
    await vi.waitFor(() => {
      expect(prisma.subscription.findUnique).toHaveBeenCalledTimes(2);
    });
  });

  it("does not reject the scheduler when notify throws", async () => {
    vi.mocked(prisma.subscription.findUnique).mockRejectedValue(new Error("db down"));
    expect(() => scheduleTrialStartAlert({ userId: "user_1", source: "google" })).not.toThrow();
    await vi.waitFor(() => {
      expect(prisma.subscription.findUnique).toHaveBeenCalled();
    });
  });
});
