import { prisma } from "@/lib/prisma";
import { nightlyTrafficReportRecipients } from "@/lib/analytics/nightly-traffic-report";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { sendTransactionalEmail } from "@/lib/email/resend-client";
import { recordTrialUsed } from "@/lib/trial-eligibility";
import {
  buildTrialAlertWebhookPayload,
  chicagoDayStartUtc,
  chicagoWeekStartUtc,
  formatTrialAlertEmail,
  formatTrialSource,
  shouldAnnounceTrial,
  trialAlertWebhookRequest,
  trialExamDisplayName,
  trialIdentityLabel,
  trialPlanLabel,
  type TrialAlertWebhookPayload,
} from "@/lib/billing/trial-alert-content";

const claimMemory = new Set<string>();

/** Test-only reset for the process-local claim set. */
export function resetTrialAlertClaimMemory(): void {
  claimMemory.clear();
}

export type TrialAlertResult = {
  ok: true;
  announced: boolean;
  reason?: "not_trial" | "test_account" | "missing_subscription" | "already_sent";
};

function claimKey(subscriptionId: string, trialEndsAt: Date): string {
  return `${subscriptionId}:${trialEndsAt.toISOString()}`;
}

async function claimTrialAlert(subscriptionId: string, trialEndsAt: Date): Promise<boolean> {
  const key = claimKey(subscriptionId, trialEndsAt);
  if (claimMemory.has(key)) return false;
  try {
    const claimed = await prisma.subscription.updateMany({
      where: {
        id: subscriptionId,
        OR: [{ trialAlertForEndsAt: null }, { NOT: { trialAlertForEndsAt: trialEndsAt } }],
      },
      data: { trialAlertForEndsAt: trialEndsAt },
    });
    if (claimed.count === 0) {
      claimMemory.add(key);
      return false;
    }
    claimMemory.add(key);
    return true;
  } catch (err) {
    console.error("[trial-alert] idempotency claim failed", err);
    if (claimMemory.has(key)) return false;
    claimMemory.add(key);
    return true;
  }
}

async function loadTrialCounts(now: Date): Promise<{
  today: number;
  week: number;
  todayByExam: { name: string; count: number }[];
}> {
  const dayStart = chicagoDayStartUtc(now);
  const weekStart = chicagoWeekStartUtc(now);
  try {
    const [today, week] = await Promise.all([
      prisma.trialEligibility.count({ where: { usedAt: { gte: dayStart } } }),
      prisma.trialEligibility.count({ where: { usedAt: { gte: weekStart } } }),
    ]);
    let todayByExam: { name: string; count: number }[] = [];
    try {
      const rows = await prisma.trialEligibility.findMany({
        where: { usedAt: { gte: dayStart } },
        select: { userId: true },
        take: 500,
      });
      const ids = rows.map((row) => row.userId).filter((id): id is string => Boolean(id));
      if (ids.length > 0) {
        const groups = await prisma.userExamPreference.groupBy({
          by: ["examSlug"],
          where: { userId: { in: ids } },
          _count: { userId: true },
        });
        todayByExam = groups
          .map((group) => ({
            name: trialExamDisplayName(group.examSlug).name,
            count: group._count.userId,
          }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      }
    } catch (err) {
      console.error("[trial-alert] per-exam tally skipped", err);
    }
    return { today, week, todayByExam };
  } catch (err) {
    console.error("[trial-alert] counts failed", err);
    return { today: 0, week: 0, todayByExam: [] };
  }
}

async function lookupRecentSource(userId: string): Promise<string | null> {
  try {
    const row = await prisma.analyticsEvent.findFirst({
      where: { userId, eventType: EVENT_TYPES.PAGE_VIEW },
      orderBy: { createdAt: "desc" },
      select: { metadata: true },
    });
    if (!row?.metadata) return null;
    const meta = JSON.parse(row.metadata) as { referrer?: string };
    return formatTrialSource({ referrer: meta.referrer ?? null });
  } catch {
    return null;
  }
}

async function deliverTrialAlert(input: {
  recipients: string[];
  subject: string;
  html: string;
  text: string;
  examSlug: string;
  payload: TrialAlertWebhookPayload;
}): Promise<void> {
  for (const to of input.recipients) {
    try {
      const result = await sendTransactionalEmail({
        to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        tags: [
          { name: "category", value: "trial_start_alert" },
          { name: "exam", value: input.examSlug.slice(0, 40) },
        ],
      });
      if (!result.ok) {
        console.error("[trial-alert] email not sent", { reason: result.reason });
      }
    } catch (err) {
      console.error("[trial-alert] email failed", err);
    }
  }

  const request = trialAlertWebhookRequest(input.payload);
  if (!request) return;
  try {
    const response = await fetch(request.url, request.init);
    if (!response.ok) {
      console.error("[trial-alert] webhook failed", { status: response.status });
    }
  } catch (err) {
    console.error("[trial-alert] webhook failed", err);
  }
}

/**
 * Owner celebration for one new trial. Keyed on the subscription row and that
 * trial's trialEndsAt, so checkout retries and renewals do not send again.
 * Email and webhook failures are logged and never thrown.
 */
export async function notifyOwnerOfTrialStart(input: {
  userId: string;
  source?: string | null;
}): Promise<TrialAlertResult> {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId: input.userId },
      select: {
        id: true,
        status: true,
        plan: true,
        planTier: true,
        planInterval: true,
        trialEndsAt: true,
        user: { select: { email: true, name: true } },
      },
    });
    if (!sub) return { ok: true, announced: false, reason: "missing_subscription" };
    if (sub.status !== "trialing" || sub.plan !== "trial") {
      return { ok: true, announced: false, reason: "not_trial" };
    }
    if (!shouldAnnounceTrial(sub.user.email)) {
      return { ok: true, announced: false, reason: "test_account" };
    }

    const trialEndsAt = sub.trialEndsAt ?? new Date(0);
    const claimed = await claimTrialAlert(sub.id, trialEndsAt);
    if (!claimed) return { ok: true, announced: false, reason: "already_sent" };

    const startedAt = new Date();
    const [pref, metaRow, counts, lookedUpSource] = await Promise.all([
      prisma.userExamPreference.findUnique({
        where: { userId: input.userId },
        select: { examSlug: true },
      }),
      prisma.userPreference.findUnique({
        where: { userId: input.userId },
        select: { metadata: true },
      }),
      loadTrialCounts(startedAt),
      input.source ? Promise.resolve(input.source) : lookupRecentSource(input.userId),
    ]);

    let usmleFieldId: string | null = null;
    if (metaRow?.metadata) {
      try {
        const parsed = JSON.parse(metaRow.metadata) as { usmleFieldId?: string };
        usmleFieldId = parsed.usmleFieldId ?? null;
      } catch {
        usmleFieldId = null;
      }
    }

    const exam = trialExamDisplayName(pref?.examSlug, usmleFieldId);
    const identity = trialIdentityLabel(sub.user.name, sub.user.email);
    const plan = trialPlanLabel(sub.planTier, sub.planInterval);
    const source = lookedUpSource?.trim() || null;
    const email = formatTrialAlertEmail({
      examName: exam.name,
      identity,
      startedAt,
      planLabel: plan,
      source,
      trialsToday: counts.today,
      trialsWeek: counts.week,
      todayByExam: counts.todayByExam,
    });
    const payload = buildTrialAlertWebhookPayload({
      examSlug: exam.slug,
      examName: exam.name,
      plan,
      startedAt,
      source,
      identity,
      trialsToday: counts.today,
      trialsWeek: counts.week,
    });

    await deliverTrialAlert({
      recipients: nightlyTrafficReportRecipients(),
      subject: email.subject,
      html: email.html,
      text: email.text,
      examSlug: exam.slug,
      payload,
    });
    console.info("[trial-alert] announced", {
      exam: exam.slug,
      subscriptionId: sub.id,
    });
    return { ok: true, announced: true };
  } catch (err) {
    console.error("[trial-alert] failed", err);
    return { ok: true, announced: false };
  }
}

/** Fire-and-forget. Signup and webhooks keep succeeding when this fails. */
export function scheduleTrialStartAlert(input: {
  userId: string;
  email?: string | null;
  source?: string | null;
  recordTrial?: boolean;
}): void {
  void (async () => {
    if (input.recordTrial && input.email) {
      try {
        await recordTrialUsed(input.email, input.userId);
      } catch (err) {
        console.error("[trial-alert] recordTrialUsed failed", err);
      }
    }
    try {
      await notifyOwnerOfTrialStart({
        userId: input.userId,
        source: input.source ?? null,
      });
    } catch (err) {
      console.error("[trial-alert] failed", err);
    }
  })();
}
