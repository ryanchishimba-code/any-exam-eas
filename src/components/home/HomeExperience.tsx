"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { SubscriberHome } from "@/components/home/SubscriberHome";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSession } from "next-auth/react";

const LiveBankStats = dynamic(() =>
  import("@/components/home/LiveBankStats").then((m) => m.LiveBankStats)
);
const NgnInteractiveDemo = dynamic(() =>
  import("@/components/home/NgnInteractiveDemo").then((m) => m.NgnInteractiveDemo)
);
const LandingDifferentiators = dynamic(() =>
  import("@/components/home/LandingDifferentiators").then((m) => m.LandingDifferentiators)
);
const LandingCompact = dynamic(() =>
  import("@/components/home/LandingCompact").then((m) => m.LandingCompact)
);
const HowWeCompare = dynamic(() =>
  import("@/components/home/HowWeCompare").then((m) => m.HowWeCompare)
);
const LandingTestimonials = dynamic(() =>
  import("@/components/home/LandingTestimonials").then((m) => m.LandingTestimonials)
);
const HomeBottomCta = dynamic(() =>
  import("@/components/home/HomeBottomCta").then((m) => m.HomeBottomCta)
);

export function HomeExperience() {
  const { status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const isAuthed = status === "authenticated";
  const showSubscriberHome = isAuthed && !accessLoading && hasPremiumAccess;
  const resolvingPremiumAccess = isAuthed && accessLoading;

  return (
    <>
      {showSubscriberHome || resolvingPremiumAccess ? (
        <Hero />
      ) : (
        <div className="aee-hero-compare-stack">
          <Hero />
          <HowWeCompare variant="hero-overlap" />
        </div>
      )}
      {showSubscriberHome ? (
        <SubscriberHome />
      ) : resolvingPremiumAccess ? (
        <div className="border-b border-slate-100 bg-slate-50/50 py-6" aria-hidden />
      ) : (
        <>
          <div className="border-b border-slate-100 bg-white/80 px-5 py-2.5 sm:px-6">
            <div className="mx-auto max-w-[1080px]">
              <p className="mb-2 text-center text-xs font-medium text-slate-600 lg:text-left">
                Live question banks across all four exams — updated for board-style practice.
              </p>
              <LiveBankStats />
            </div>
          </div>
          <NgnInteractiveDemo />
          <LandingDifferentiators />
          <LandingCompact />
          <LandingTestimonials />
          <HomeBottomCta />
        </>
      )}
    </>
  );
}
