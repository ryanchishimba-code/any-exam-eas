"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { LandingSeoGuide } from "@/components/landing/LandingSeoGuide";
import { LandingFlagshipV2 } from "@/components/landing/v2/LandingFlagshipV2";
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

function GuestLanding({
  bankCounts,
  testimonials,
  children,
  boardFormats,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  children?: ReactNode;
  boardFormats?: Partial<Record<string, FormatCounts | null>> | null;
}) {
  return (
    <LandingFlagshipV2
      bankCounts={bankCounts}
      testimonials={testimonials}
      boardFormats={boardFormats}
    >
      {children}
      <LandingSeoGuide
        questionCountLabel={bankCounts.totalLabel}
        nclexFormats={boardFormats?.nclex ?? null}
      />
    </LandingFlagshipV2>
  );
}

/** Authed-only branch so guests never pay for /api/subscription/status work. */
function AuthenticatedHomeBranch({
  bankCounts,
  testimonials,
  children,
  boardFormats,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  children?: ReactNode;
  boardFormats?: Partial<Record<string, FormatCounts | null>> | null;
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

  return (
    <GuestLanding bankCounts={bankCounts} testimonials={testimonials} boardFormats={boardFormats}>
      {children}
    </GuestLanding>
  );
}

export function HomeExperience({
  bankCounts: initialBankCounts,
  testimonials,
  children,
  boardFormats = null,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  /** Server-rendered SEO / long-form blocks (passed through to the guest landing). */
  children?: ReactNode;
  boardFormats?: Partial<Record<string, FormatCounts | null>> | null;
}) {
  const bankCounts = useLandingBankCounts(initialBankCounts);
  const { status } = useSession();

  // While session resolves, don't flash the guest conversion landing for
  // returning subscribers (looks like a post-login bounce to marketing).
  if (status === "loading") {
    return <LandingHeroSkeleton bankCounts={bankCounts} />;
  }

  // Guests: paint conversion landing immediately (no access API).
  if (status !== "authenticated") {
    return (
      <GuestLanding bankCounts={bankCounts} testimonials={testimonials} boardFormats={boardFormats}>
        {children}
      </GuestLanding>
    );
  }

  return (
    <AuthenticatedHomeBranch
      bankCounts={bankCounts}
      testimonials={testimonials}
      boardFormats={boardFormats}
    >
      {children}
    </AuthenticatedHomeBranch>
  );
}
