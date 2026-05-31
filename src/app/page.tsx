import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeBottomCta } from "@/components/home/HomeBottomCta";
import { HomeLivePulse } from "@/components/home/HomeLivePulse";
import { buildHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomeMetadata();

/** Below-the-fold sections — code-split to reduce initial JS bundle. */
const LandingFeatures = dynamic(() =>
  import("@/components/home/LandingFeatures").then((m) => m.LandingFeatures)
);
const Top300DrugsMastery = dynamic(() =>
  import("@/components/home/Top300DrugsMastery").then((m) => m.Top300DrugsMastery)
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((m) => m.Testimonials)
);
const HowWeCompare = dynamic(() =>
  import("@/components/home/HowWeCompare").then((m) => m.HowWeCompare)
);
const ChooseYourExam = dynamic(() =>
  import("@/components/home/ChooseYourExam").then((m) => m.ChooseYourExam)
);
const WelcomeBackSection = dynamic(() =>
  import("@/components/home/WelcomeBackSection").then((m) => m.WelcomeBackSection)
);

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <HomeLivePulse />
      <ChooseYourExam />
      <Top300DrugsMastery />
      <LandingFeatures />
      <Testimonials />
      <HowWeCompare />
      <WelcomeBackSection />
      <HomeBottomCta />
    </>
  );
}
