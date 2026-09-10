"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import {
  formatPlanUsd,
  getBillingPlanTier,
  parseBillingInterval,
} from "@/lib/billing-plans";
import { UpgradeIntervalChoice } from "@/components/checkout/UpgradeIntervalChoice";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { parseSubscriptionTier, type SubscriptionTier } from "@/lib/subscription-tiers";

type BillingStatus = {
  status: string;
  hasAccess: boolean;
  planTier?: string;
  planInterval?: string;
  pendingPlanTier?: string | null;
  pendingPlanInterval?: string | null;
  currentPeriodEnd?: string | null;
  nextRecurringAt?: string | null;
  nextRecurringUsd?: number | null;
  nextRecurringInterval?: string | null;
  nextRecurringLabel?: string | null;
  trialEndsAt: string | null;
  daysRemaining: number | null;
  needsPaymentMethod?: boolean;
  hasStripeSubscription?: boolean;
  purchaseType?: string | null;
  accessEndsAt?: string | null;
  reactivation?: {
    method: "checkout" | "update_payment";
    checkoutPath?: string;
    settingsPath?: string;
    message?: string;
    checkoutPlan?: "trial" | "subscribe";
    trialAvailable?: boolean;
  } | null;
};

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Status, next charge, change cycle, manage — nothing else. Policy essays and
 * redundant "recurring payments" cards are cut; the next-charge line carries
 * what a subscriber actually needs to know.
 */
export function BillingSettingsSection() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [tier, setTier] = useState<SubscriptionTier>("pro");
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/status");
      const data = await res.json();
      setStatus(data);
      if (data.planInterval) setInterval(parseBillingInterval(data.planInterval));
      if (data.planTier) setTier(parseSubscriptionTier(data.planTier));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function handleChangePlan() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval, tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update plan");
      setMessage(data.message ?? "Plan updated.");
      await loadStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update plan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading billing…
        </p>
      </section>
    );
  }

  const paymentPastDue = status?.status === "past_due";
  const reactivation = status?.reactivation;
  const reactivatePlan =
    reactivation?.checkoutPlan ?? (reactivation?.trialAvailable ? "trial" : "subscribe");
  const isOneTime = status?.purchaseType === "one_time";
  const onTrial = status?.status === "trialing";
  const currentTier = parseSubscriptionTier(status?.planTier);
  const currentInterval = parseBillingInterval(status?.planInterval);
  const pendingInterval = status?.pendingPlanInterval
    ? parseBillingInterval(status.pendingPlanInterval)
    : null;
  const pendingTier = status?.pendingPlanTier
    ? parseSubscriptionTier(status.pendingPlanTier)
    : null;
  const accessEndsLabel = formatDate(status?.accessEndsAt);
  const nextChargeLabel = formatDate(status?.nextRecurringAt);
  const periodEndLabel = formatDate(status?.currentPeriodEnd);

  const needsCheckout =
    !status?.hasAccess &&
    !paymentPastDue &&
    (status?.needsPaymentMethod ||
      status?.status === "inactive" ||
      status?.status === "none" ||
      status?.status === "trial_expired" ||
      status?.status === "canceled" ||
      status?.reactivation?.method === "checkout");

  const canChangePlan =
    status?.hasAccess &&
    !isOneTime &&
    (status.status === "trialing" || status.status === "active");

  const planAlreadySelected =
    interval === currentInterval && tier === currentTier && !pendingInterval && !pendingTier
      ? true
      : interval === pendingInterval && tier === pendingTier;

  const planLabel = getBillingPlanTier(currentTier, currentInterval).label;

  let statusTitle = "Subscription";
  let statusBody = `Pro · ${planLabel}`;
  if (onTrial) {
    statusTitle = `Free trial · ${status?.daysRemaining ?? "—"} day${status?.daysRemaining === 1 ? "" : "s"} left`;
    statusBody = "Not charged until the trial ends.";
  } else if (isOneTime) {
    statusTitle = `Pay-once access · ${status?.daysRemaining ?? "—"} day${status?.daysRemaining === 1 ? "" : "s"} left`;
    statusBody = accessEndsLabel
      ? `Access ends ${accessEndsLabel} and will not renew.`
      : "This pass will not renew.";
  } else if (status?.status === "active") {
    statusTitle = "Active subscription";
    statusBody = `Pro · ${planLabel}`;
  }

  if (needsCheckout) {
    return (
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-teal-600" aria-hidden />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Subscription
          </h2>
        </div>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {isOneTime
              ? "Your pay-once pass has ended."
              : "Choose a plan to unlock study features."}
          </p>
          <UpgradeIntervalChoice value={interval} onChange={setInterval} tier={tier} />
          <Button
            href={
              isOneTime
                ? `/checkout?plan=subscribe&interval=${interval}&mode=manual&reactivate=1`
                : `/checkout?plan=${reactivatePlan}&interval=${interval}&reactivate=1`
            }
            className="w-full"
          >
            {isOneTime
              ? "Buy another pass"
              : reactivatePlan === "trial"
                ? "Start free trial"
                : "Reactivate subscription"}
          </Button>
        </div>
        {error && <InlineError className="mt-4">{error}</InlineError>}
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-teal-600" aria-hidden />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Subscription
        </h2>
      </div>

      <div className="mt-4 space-y-5">
        {paymentPastDue && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-950 dark:text-red-100">
              Payment failed — access paused
            </p>
            <div className="mt-3">
              <ManageBillingButton
                label="Update payment method"
                variant="secondary"
                intent="payment_method"
              />
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{statusTitle}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{statusBody}</p>
          {!isOneTime && nextChargeLabel && status?.nextRecurringLabel && (
            <p className="mt-1 text-xs text-slate-500">
              Next charge {status.nextRecurringLabel} on {nextChargeLabel}
              {status.nextRecurringUsd != null
                ? ` (${formatPlanUsd(status.nextRecurringUsd)})`
                : ""}
              .
            </p>
          )}
          {pendingInterval && periodEndLabel && !onTrial && (
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
              Switching to{" "}
              {getBillingPlanTier(pendingTier ?? currentTier, pendingInterval).label} on{" "}
              {periodEndLabel}.
            </p>
          )}
        </div>

        {isOneTime && !paymentPastDue && (
          <Button
            href={`/checkout?plan=subscribe&interval=${currentInterval}&mode=manual`}
            className="w-full"
          >
            Buy more time
          </Button>
        )}

        {canChangePlan && !paymentPastDue && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Change plan</p>
            <UpgradeIntervalChoice value={interval} onChange={setInterval} tier={tier} />
            <Button
              type="button"
              className="w-full"
              disabled={saving || planAlreadySelected}
              onClick={() => void handleChangePlan()}
            >
              {saving
                ? "Updating…"
                : onTrial
                  ? "Update plan"
                  : pendingInterval && interval === pendingInterval
                    ? "Already scheduled"
                    : "Schedule plan change"}
            </Button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {!isOneTime && (
            <ManageBillingButton label="Cancel or manage billing" variant="secondary" />
          )}
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            View all plans
          </Link>
        </div>

        {message && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {message}
          </p>
        )}
        {error && <InlineError>{error}</InlineError>}
      </div>
    </section>
  );
}
