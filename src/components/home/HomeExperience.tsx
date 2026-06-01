"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { SubscriberHome } from "@/components/home/SubscriberHome";
import { useUserAccess } from "@/lib/client/use-user-access";

const LandingEssentials = dynamic(() =>
  import("@/components/home/LandingEssentials").then((m) => m.LandingEssentials)
);
const HomeBottomCta = dynamic(() =>
  import("@/components/home/HomeBottomCta").then((m) => m.HomeBottomCta)
);

function MarketingSections() {
  return (
    <>
      <LandingEssentials />
      <HomeBottomCta />
    </>
  );
}

export function HomeExperience() {
  const { hasPremiumAccess, loading } = useUserAccess();
  const showPremiumHome = !loading && hasPremiumAccess;

  return (
    <>
      <Hero />
      {showPremiumHome ? <SubscriberHome /> : <MarketingSections />}
    </>
  );
}
