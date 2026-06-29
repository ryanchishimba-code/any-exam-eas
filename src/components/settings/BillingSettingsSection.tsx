"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import type { BillingInterval } from "@/lib/billing-config";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { getBillingPlanTier, parseBillingInterval, formatPlanUsd, BILLING_PLAN_CHANGE_POLICY, BILLING_RECURRING_POLICY } from "@/lib/billing-plans";
import { BillingIntervalDropdown } from "@/components/pricing/BillingIntervalDropdown";
import { CheckoutTierSelector } from "@/components/checkout/CheckoutTierSelector";
import { ManageBillingButton } from "@/components/ManageBillingButton";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/StatusMessage";
import { SIGNUP_PAYMENT_REQUIRED_NOTE, formatTrialCtaWithSavings } from "@/lib/site";
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
  reactivation?: {
    method: "checkout" | "update_payment";
    checkoutPath?: string;
    settingsPath?: string;
    message?: string;
    checkoutPlan?: "trial" | "subscribe";
    trialAvailable?: boolean;
  } | null;
};

export function BillingSettingsSection() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [tier, setTier] = useState<SubscriptionTier>("pro");
  const [interval, setInterval] = useState<BillingInterval>("yearly");
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
      if (data.planInterval) {
        setInterval(parseBillingInterval(data.planInterval));
      }
      if (data.planTier) {
        setTier(parseSubscriptionTier(data.planTier));
      }
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
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
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
    (status.status === "trialing" || status.status === "active");

  const onTrial = status?.status === "trialing";
  const currentTier = parseSubscriptionTier(status?.planTier);
  const currentInterval = parseBillingInterval(status?.planInterval);
  const pendingTier = status?.pendingPlanTier
    ? parseSubscriptionTier(status.pendingPlanTier)
    : null;
  const pendingInterval = status?.pendingPlanInterval
    ? parseBillingInterval(status.pendingPlanInterval)
    : null;
  const periodEndLabel = status?.currentPeriodEnd
    ? new Date(status.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const nextChargeLabel = status?.nextRecurringAt
    ? new Date(status.nextRecurringAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const nextChargeInterval = status?.nextRecurringInterval
    ? getBillingPlanTier(
        parseSubscriptionTier(status.planTier),
        parseBillingInterval(status.nextRecurringInterval)
      )
    : null;

  const planAlreadySelected =
    interval === currentInterval && tier === currentTier && !pendingInterval && !pendingTier
      ? true
      : interval === pendingInterval && tier === pendingTier;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-teal-600" aria-hidden />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Subscription
        </h2>
      </div>

      {needsCheckout ? (
        <div className="mt-4 space-y-4">
          {reactivation?.message && (
            <div className="rounded-2xl border border-teal-200/80 bg-teal-50/80 px-4 py-4 dark:border-teal-900/40 dark:bg-teal-950/30">
              <p className="text-sm font-semibold text-teal-950 dark:text-teal-100">
                Welcome back
              </p>
              <p className="mt-1 text-xs leading-relaxed text-teal-900/90 dark:text-teal-200/90">
                {reactivation.message} Full access restores automatically once payment is received.
              </p>
            </div>
          )}
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {reactivation?.method === "checkout" && reactivatePlan === "subscribe"
              ? "Choose a billing plan and resubscribe to unlock study features."
              : SIGNUP_PAYMENT_REQUIRED_NOTE}
          </p>
          <BillingIntervalDropdown value={interval} onChange={setInterval} variant="checkout" />
          <Button
            href={`/checkout?plan=${reactivatePlan}&interval=${interval}&reactivate=1`}
            className="w-full"
          >
            {reactivatePlan === "trial"
              ? formatTrialCtaWithSavings(tier, interval)
              : "Reactivate subscription"}
          </Button>
          <p className="flex items-start gap-2 text-xs text-slate-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
            {reactivatePlan === "trial"
              ? `Cancel before your ${TRIAL_DAYS}-day trial ends and you will not be charged.`
              : "Access restores automatically once payment is received."}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {paymentPastDue && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/50 dark:bg-red-950/30">
              <p className="text-sm font-semibold text-red-950 dark:text-red-100">
                Payment failed — study access paused
              </p>
              <p className="mt-1 text-xs leading-relaxed text-red-900/90 dark:text-red-200/90">
                We couldn&apos;t charge your saved payment method. Update it below to restore full
                access. Study features stay locked until payment succeeds.
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

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {onTrial
                ? `Free trial · ${status?.daysRemaining ?? "—"} day${status?.daysRemaining === 1 ? "" : "s"} left`
                : status?.status === "active"
                  ? "Active subscription"
                  : "Subscription"}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {onTrial && status?.needsPaymentMethod
                ? SIGNUP_PAYMENT_REQUIRED_NOTE
                : onTrial
                  ? "Payment method on file. You are not charged until the trial ends — cancel anytime before then for no charge."
                  : `Current plan: Pro · ${getBillingPlanTier(currentTier, currentInterval).label}. Payments are non-refundable.`}
            </p>
          </div>

          {pendingInterval && periodEndLabel && !onTrial && (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
              Switching to{" "}
              <span className="font-semibold">
                {getBillingPlanTier(pendingTier ?? currentTier, pendingInterval).label}
              </span> on{" "}
              {periodEndLabel}. No charge until then — your first payment at the new rate is when
              the switch occurs.
            </p>
          )}

          {status?.hasStripeSubscription && nextChargeLabel && nextChargeInterval && (
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Recurring payments
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {onTrial
                  ? `First charge ${status.nextRecurringLabel ?? formatPlanUsd(status.nextRecurringUsd ?? 0)} (${nextChargeInterval.label}) on ${nextChargeLabel} when your trial ends — not when you change plans.`
                  : pendingInterval
                    ? `Next charge ${status.nextRecurringLabel ?? formatPlanUsd(status.nextRecurringUsd ?? 0)} (${getBillingPlanTier(pendingTier ?? currentTier, pendingInterval).label}) on ${nextChargeLabel} when your plan switch takes effect.`
                    : `Next charge ${status.nextRecurringLabel ?? formatPlanUsd(status.nextRecurringUsd ?? 0)} (${nextChargeInterval.label}) on ${nextChargeLabel}.`}
              </p>
              <p className="mt-2 text-xs text-slate-500">{BILLING_RECURRING_POLICY}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <ManageBillingButton
                  label="Update payment method"
                  variant="secondary"
                  intent="payment_method"
                />
              </div>
            </div>
          )}

          {canChangePlan && !paymentPastDue && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Change plan
              </p>
              <CheckoutTierSelector value={tier} onChange={setTier} />
              <BillingIntervalDropdown value={interval} onChange={setInterval} tier={tier} variant="checkout" />
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
              <p className="text-xs leading-relaxed text-slate-500">
                {onTrial
                  ? "Switch plans during your trial — changes apply when billing starts at the end of the trial."
                  : BILLING_PLAN_CHANGE_POLICY}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <ManageBillingButton label="Cancel or manage billing" variant="secondary" />
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            >
              View all plans
            </Link>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </p>
      )}
      {error && <InlineError className="mt-4">{error}</InlineError>}
    </section>
  );
}
