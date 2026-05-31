import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeBottomCta } from "@/components/home/HomeBottomCta";
import { buildHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomeMetadata();

/** Below-the-fold sections — code-split to reduce initial JS bundle. */
const LandingFeatures = dynamic(() =>
  import("@/components/home/LandingFeatures").then((m) => m.LandingFeatures)
);
const Testimonials = dynamic(() =>
  import("@/components/home/Testimonials").then((m) => m.Testimonials)
);
const ChooseYourExam = dynamic(() =>
  import("@/components/home/ChooseYourExam").then((m) => m.ChooseYourExam)
);
const SubjectsShowcase = dynamic(() =>
  import("@/components/home/SubjectsShowcase").then((m) => m.SubjectsShowcase)
);
const FeatureGrid = dynamic(() =>
  import("@/components/FeatureGrid").then((m) => m.FeatureGrid)
);
const WelcomeBackSection = dynamic(() =>
  import("@/components/home/WelcomeBackSection").then((m) => m.WelcomeBackSection)
);

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <LandingFeatures />
      <Testimonials />
      <ChooseYourExam />
      <SubjectsShowcase />
      <FeatureGrid />
      <WelcomeBackSection />
      <HomeBottomCta />
    </>
  );
}
