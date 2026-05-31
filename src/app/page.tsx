import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeBottomCta } from "@/components/home/HomeBottomCta";
import { buildHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomeMetadata();

const HowWeCompare = dynamic(() =>
  import("@/components/home/HowWeCompare").then((m) => m.HowWeCompare)
);
const HomeLivePulse = dynamic(() =>
  import("@/components/home/HomeLivePulse").then((m) => m.HomeLivePulse)
);

/** Below-the-fold sections — code-split to reduce initial JS bundle. */
const LandingFeatures = dynamic(() =>
  import("@/components/home/LandingFeatures").then((m) => m.LandingFeatures)
);
const Top300DrugsMastery = dynamic(() =>
  import("@/components/home/Top300DrugsMastery").then((m) => m.Top300DrugsMastery)
);
const ChooseYourExam = dynamic(() =>
  import("@/components/home/ChooseYourExam").then((m) => m.ChooseYourExam)
);
const WelcomeBackSection = dynamic(() =>
  import("@/components/home/WelcomeBackSection").then((m) => m.WelcomeBackSection)
);
const NgnInteractiveDemo = dynamic(() =>
  import("@/components/home/NgnInteractiveDemo").then((m) => m.NgnInteractiveDemo)
);

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <HowWeCompare />
      <HomeLivePulse />
      <NgnInteractiveDemo />
      <ChooseYourExam />
      <Top300DrugsMastery />
      <LandingFeatures />
      <WelcomeBackSection />
      <HomeBottomCta />
    </>
  );
}
