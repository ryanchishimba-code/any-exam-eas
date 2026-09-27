import type { Metadata } from "next";
import { LandingFaqV2 } from "@/components/landing/v2/LandingFaqV2";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Which exams are included, what Pro costs, how the free trial works, and how to reach support.",
  alternates: { canonical: "/faq" },
};

/** Full FAQ. The home page links here instead of repeating it. */
export default function FaqPage() {
  return (
    <div className="bg-[var(--color-bg)] pt-[var(--nav-height)]">
      <LandingFaqV2 pageHeading />
    </div>
  );
}
