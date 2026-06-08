"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { SubscriberHome } from "@/components/home/SubscriberHome";
import { useUserAccess } from "@/lib/client/use-user-access";
import { useSession } from "next-auth/react";

const LandingCompact = dynamic(() =>
  import("@/components/home/LandingCompact").then((m) => m.LandingCompact)
);
const LandingFeatures = dynamic(() =>
  import("@/components/home/LandingFeatures").then((m) => m.LandingFeatures)
);
const HomeBottomCta = dynamic(() =>
  import("@/components/home/HomeBottomCta").then((m) => m.HomeBottomCta)
);

export function HomeExperience() {
  const { status } = useSession();
  const { hasPremiumAccess, loading: accessLoading } = useUserAccess();
  const isAuthed = status === "authenticated";
  const resolvingAccess = status === "loading" || (isAuthed && accessLoading);

  return (
    <>
      <Hero />
      {resolvingAccess ? (
        <div className="border-b border-slate-100 bg-slate-50/50 py-6" aria-hidden />
      ) : isAuthed && hasPremiumAccess ? (
        <SubscriberHome />
      ) : (
        <>
          <LandingCompact />
          <LandingFeatures />
          <HomeBottomCta />
        </>
      )}
    </>
  );
}
