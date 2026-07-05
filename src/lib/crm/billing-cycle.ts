export type BillingUrgency = "calm" | "soon" | "urgent" | "past_due" | "trial" | "none";

export type BillingCycleSummary = {
  status: string;
  planInterval: string | null;
  renewsAt: string | null;
  daysUntil: number | null;
  label: string;
  detail: string;
  urgency: BillingUrgency;
};

type SubscriptionRow = {
  status: string;
  plan: string | null;
  planInterval: string | null;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
  compAccessUntil: Date | null;
};

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (86_400_000));
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function intervalLabel(interval: string | null): string {
  switch (interval) {
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    case "semiannual":
      return "Semi-annual";
    case "yearly":
      return "Yearly";
    default:
      return interval ?? "—";
  }
}

export function summarizeBillingCycle(sub: SubscriptionRow | null | undefined): BillingCycleSummary {
  const now = new Date();

  if (!sub) {
    return {
      status: "none",
      planInterval: null,
      renewsAt: null,
      daysUntil: null,
      label: "No subscription",
      detail: "No billing record on file",
      urgency: "none",
    };
  }

  if (sub.status === "past_due") {
    return {
      status: sub.status,
      planInterval: sub.planInterval,
      renewsAt: sub.currentPeriodEnd?.toISOString() ?? null,
      daysUntil: sub.currentPeriodEnd ? daysBetween(now, sub.currentPeriodEnd) : null,
      label: "Payment failed",
      detail: "Rebill blocked — update payment method",
      urgency: "past_due",
    };
  }

  if (sub.status === "trialing" && sub.trialEndsAt) {
    const days = daysBetween(now, sub.trialEndsAt);
    const urgency: BillingUrgency = days <= 1 ? "urgent" : days <= 3 ? "soon" : "trial";
    return {
      status: sub.status,
      planInterval: sub.planInterval,
      renewsAt: sub.trialEndsAt.toISOString(),
      daysUntil: days,
      label: days <= 0 ? "Trial ended" : `Trial · ${days}d left`,
      detail: `Converts ${formatShortDate(sub.trialEndsAt)} unless canceled`,
      urgency,
    };
  }

  if (sub.status === "active" && sub.currentPeriodEnd) {
    const days = daysBetween(now, sub.currentPeriodEnd);
    let urgency: BillingUrgency = "calm";
    if (days <= 3) urgency = "urgent";
    else if (days <= 14) urgency = "soon";

    const canceled = Boolean(sub.canceledAt);
    return {
      status: sub.status,
      planInterval: sub.planInterval,
      renewsAt: sub.currentPeriodEnd.toISOString(),
      daysUntil: days,
      label: canceled
        ? `Access until ${formatShortDate(sub.currentPeriodEnd)}`
        : days <= 0
          ? "Renews today"
          : `Rebill in ${days}d`,
      detail: canceled
        ? `Canceled · ${intervalLabel(sub.planInterval)} plan`
        : `${intervalLabel(sub.planInterval)} · next charge ${formatShortDate(sub.currentPeriodEnd)}`,
      urgency: canceled ? "none" : urgency,
    };
  }

  if (sub.status === "canceled" || sub.status === "trial_expired") {
    return {
      status: sub.status,
      planInterval: sub.planInterval,
      renewsAt: sub.canceledAt?.toISOString() ?? null,
      daysUntil: null,
      label: sub.status === "trial_expired" ? "Trial expired" : "Canceled",
      detail: "No upcoming rebill",
      urgency: "none",
    };
  }

  if (sub.compAccessUntil && sub.compAccessUntil > now) {
    const days = daysBetween(now, sub.compAccessUntil);
    return {
      status: "comp",
      planInterval: null,
      renewsAt: sub.compAccessUntil.toISOString(),
      daysUntil: days,
      label: `Comp access · ${days}d`,
      detail: `Complimentary until ${formatShortDate(sub.compAccessUntil)}`,
      urgency: "calm",
    };
  }

  return {
    status: sub.status,
    planInterval: sub.planInterval,
    renewsAt: null,
    daysUntil: null,
    label: sub.status.replace(/_/g, " "),
    detail: "No rebill scheduled",
    urgency: "none",
  };
}
