"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { Hero } from "@/components/Hero";
import { LandingFlagshipV2 } from "@/components/landing/v2/LandingFlagshipV2";
import { LandingHeroSkeleton } from "@/components/landing/v2/LandingHeroSkeleton";
import { useLandingBankCounts } from "@/lib/client/use-landing-bank-counts";
import { useUserAccess } from "@/lib/client/use-user-access";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { useSession } from "next-auth/react";

const SubscriberHome = dynamic(
  () => import("@/components/home/SubscriberHome").then((m) => m.SubscriberHome),
  {
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

export function HomeExperience({
  bankCounts: initialBankCounts,
  testimonials,
  children,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
  /** Server-rendered SEO / long-form blocks (passed through to the guest landing). */
  children?: ReactNode;
}) {
  const bankCounts = useLandingBankCounts(initialBankCounts);
  const { status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const [accessTimedOut, setAccessTimedOut] = useState(false);
  const isAuthed = status === "authenticated";
  const resolvingPremiumAccess = isAuthed && accessLoading && !accessTimedOut;
  const showSubscriberHome = isAuthed && !accessLoading && hasPremiumAccess;

  useEffect(() => {
    if (!isAuthed || !accessLoading) {
      setAccessTimedOut(false);
      return;
    }
    const timer = window.setTimeout(() => setAccessTimedOut(true), 4000);
    return () => window.clearTimeout(timer);
  }, [isAuthed, accessLoading]);

  // Guests and unresolved session: paint conversion landing immediately (no access API).
  if (status !== "authenticated") {
    return (
      <LandingFlagshipV2 bankCounts={bankCounts} testimonials={testimonials}>
        {children}
      </LandingFlagshipV2>
    );
  }

  // Confirmed premium only — avoid flashing the returning-user hero for unpaid sessions.
  if (showSubscriberHome) {
    return (
      <>
        <Hero />
        <SubscriberHome />
      </>
    );
  }

  // While premium access is still resolving, keep the marketing-aligned shell so unpaid
  // users never briefly see "Keep going…" then jump to the conversion landing.
  if (resolvingPremiumAccess) {
    return <LandingHeroSkeleton bankCounts={bankCounts} />;
  }

  return (
    <LandingFlagshipV2 bankCounts={bankCounts} testimonials={testimonials}>
      {children}
    </LandingFlagshipV2>
  );
}
