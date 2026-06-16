"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import { SubscribeButton } from "./SubscribeButton";
import { formatMonthlyPrice, formatTrialCtaLabel, formatTrialLabel } from "@/lib/site";

type AccessInfo = {
  hasAccess: boolean;
  status: string;
  daysRemaining: number | null;
  needsPaymentMethod?: boolean;
};

export function PricingActions() {
  const { data: session } = useSession();
  const [access, setAccess] = useState<AccessInfo | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then(setAccess)
      .catch(() => {});
  }, [session?.user]);

  if (session?.user) {
    if (access?.hasAccess) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--color-ink-muted)]">
            {access.status === "trialing"
              ? `${formatTrialLabel()} active${access.daysRemaining != null ? ` · ${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left` : ""}`
              : "Your subscription is active."}
          </p>
          {(access.status === "inactive" || access.status === "trialing") && access.needsPaymentMethod ? (
            <Button href="/checkout?plan=trial">Complete checkout</Button>
          ) : (
            <Button href="/study">Continue studying</Button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <Button href="/checkout?plan=trial">{formatTrialCtaLabel()}</Button>
        <SubscribeButton label={`Subscribe Now — from ${formatMonthlyPrice()}/mo`} variant="secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button href="/signup?plan=trial">{formatTrialCtaLabel()}</Button>
      <Button href="/signup?plan=subscribe" variant="secondary">
        Subscribe Now — from {formatMonthlyPrice()}/month
      </Button>
      <p className="text-center text-xs text-[var(--color-ink-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
