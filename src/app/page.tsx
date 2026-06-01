import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { buildHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = buildHomeMetadata();

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeExperience />
    </>
  );
}
