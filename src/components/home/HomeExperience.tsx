"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { LandingHeroSkeleton } from "@/components/landing/v2/LandingHeroSkeleton";
import { useLandingBankCounts } from "@/lib/client/use-landing-bank-counts";
import { useUserAccess } from "@/lib/client/use-user-access";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { useSession } from "next-auth/react";

const SubscriberHome = dynamic(
  () => import("@/components/home/SubscriberHome").then((m) => m.SubscriberHome),
  {
    // Logged-in premium shell only — skip SSR so webpack never blocks the static
    // marketing homepage on this (previously oversized) client chunk.
    ssr: false,
    loading: () => (
      <section className="bg-[var(--color-surface)] py-12 sm:py-16" aria-hidden>
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-[var(--color-border)]"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  }
);

function GuestLanding({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

/** Authed-only branch so guests never pay for /api/subscription/status work. */
function AuthenticatedHomeBranch({
  bankCounts,
  children,
}: {
  bankCounts: LandingBankCountsDisplay;
  children?: ReactNode;
}) {
  const { hasPremiumAccess, hasAppAccess, loading: accessLoading } = useUserAccess();
  const [accessTimedOut, setAccessTimedOut] = useState(false);
  const resolvingPremiumAccess = accessLoading && !accessTimedOut;
  const showSubscriberHome = !accessLoading && (hasPremiumAccess || hasAppAccess);

  useEffect(() => {
    if (!accessLoading) {
      setAccessTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setAccessTimedOut(true), 4000);
    return () => window.clearTimeout(timer);
  }, [accessLoading]);

  if (showSubscriberHome) {
    return (
      <>
        <Hero />
        <SubscriberHome />
      </>
    );
  }

  if (resolvingPremiumAccess) {
    return <LandingHeroSkeleton bankCounts={bankCounts} />;
  }

  return <GuestLanding>{children}</GuestLanding>;
}

export function HomeExperience({
  bankCounts: initialBankCounts,
  children,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  /** Server-rendered public page. */
  children?: ReactNode;
  boardFormats?: Partial<Record<string, FormatCounts | null>> | null;
}) {
  const bankCounts = useLandingBankCounts(initialBankCounts);
  const { status } = useSession();

  // Paint the server-rendered public page in the first HTML, including while
  // the session is still resolving, so the hero is what a visitor and Lighthouse see.
  if (status === "loading" || status !== "authenticated") {
    return <GuestLanding>{children}</GuestLanding>;
  }

  return (
    <AuthenticatedHomeBranch bankCounts={bankCounts}>{children}</AuthenticatedHomeBranch>
  );
}
