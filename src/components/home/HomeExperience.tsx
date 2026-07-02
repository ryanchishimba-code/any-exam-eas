"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { useUserAccess } from "@/lib/client/use-user-access";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { useSession } from "next-auth/react";

const LandingFlagship = dynamic(
  () => import("@/components/landing/v2/LandingFlagshipV2").then((m) => m.LandingFlagshipV2),
  { ssr: true }
);

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
  bankCounts,
  testimonials,
}: {
  bankCounts: LandingBankCountsDisplay;
  testimonials?: LandingSuccessStory[];
}) {
  const { status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const isAuthed = status === "authenticated";
  const showSubscriberHome = isAuthed && !accessLoading && hasPremiumAccess;
  const resolvingPremiumAccess = isAuthed && accessLoading;

  if (showSubscriberHome) {
    return (
      <>
        <Hero />
        <SubscriberHome />
      </>
    );
  }

  if (resolvingPremiumAccess) {
    return (
      <>
        <Hero />
        <section
          className="bg-[var(--color-surface)] py-12 sm:py-16"
          aria-hidden
        >
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <div className="flex flex-col items-center gap-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-[var(--color-border)]" />
              <div className="h-7 w-64 animate-pulse rounded-lg bg-[var(--color-border)]" />
              <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-[var(--color-border)]" />
              <div className="mt-2 h-11 w-40 animate-pulse rounded-full bg-[var(--color-border)]" />
            </div>
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
      </>
    );
  }

  return <LandingFlagship bankCounts={bankCounts} testimonials={testimonials} />;
}
