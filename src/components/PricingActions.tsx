"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import { SubscribeButton } from "./SubscribeButton";
import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

type AccessInfo = {
  hasAccess: boolean;
  status: string;
  daysRemaining: number | null;
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
    if (access?.status === "active") {
      return (
        <p className="text-sm text-[var(--color-ink-muted)]">
          You have an active subscription. Manage it from your{" "}
          <a href="/dashboard" className="text-[var(--color-accent)] hover:underline">
            dashboard
          </a>
          .
        </p>
      );
    }

    if (access?.status === "trialing" && access.hasAccess) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[var(--color-ink-muted)]">
            {formatTrialLabel()} active
            {access.daysRemaining != null
              ? ` · ${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left`
              : ""}
            .
          </p>
          <Button href="/study">Continue studying</Button>
          <SubscribeButton label={`Subscribe now — ${formatMonthlyPrice()}/mo`} variant="secondary" />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <SubscribeButton />
        <Button href="/dashboard" variant="ghost">
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button href="/signup?plan=trial">{formatTrialLabel()} — no card</Button>
      <Button href="/signup?plan=subscribe" variant="secondary">
        Subscribe — {formatMonthlyPrice()}/month
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
