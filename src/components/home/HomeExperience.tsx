"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { SubscriberHome } from "@/components/home/SubscriberHome";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSession } from "next-auth/react";

const LandingEssentials = dynamic(() =>
  import("@/components/home/LandingEssentials").then((m) => m.LandingEssentials)
);
const HowWeCompare = dynamic(() =>
  import("@/components/home/HowWeCompare").then((m) => m.HowWeCompare)
);
const HomeBottomCta = dynamic(() =>
  import("@/components/home/HomeBottomCta").then((m) => m.HomeBottomCta)
);

function MarketingSections() {
  return (
    <>
      <HowWeCompare />
      <LandingEssentials />
      <HomeBottomCta />
    </>
  );
}

export function HomeExperience() {
  const { status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const isAuthed = status === "authenticated";
  const resolvingAccess = status === "loading" || (isAuthed && accessLoading);

  return (
    <>
      <Hero />
      {resolvingAccess ? (
        <div className="border-b border-slate-100 bg-slate-50/50 py-10" aria-hidden />
      ) : isAuthed && hasPremiumAccess ? (
        <SubscriberHome />
      ) : (
        <MarketingSections />
      )}
    </>
  );
}
