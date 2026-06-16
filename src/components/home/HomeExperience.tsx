"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { SubscriberHome } from "@/components/home/SubscriberHome";
import { useUserAccess } from "@/lib/client/use-user-access";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { useSession } from "next-auth/react";

const LandingFlagship = dynamic(
  () => import("@/components/landing/LandingFlagship").then((m) => m.LandingFlagship),
  { ssr: true }
);

export function HomeExperience({ bankCounts }: { bankCounts: LandingBankCountsDisplay }) {
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
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-4" aria-hidden />
      </>
    );
  }

  return <LandingFlagship bankCounts={bankCounts} />;
}
