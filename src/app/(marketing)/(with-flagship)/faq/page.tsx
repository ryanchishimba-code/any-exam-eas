import type { Metadata } from "next";
import { LandingFaqV2 } from "@/components/landing/v2/LandingFaqV2";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { publicBreadcrumbJsonLd } from "@/lib/seo/public-schema";

const FAQ_TITLE = enforceMetaTitle(
  "FAQ — Pricing, Trial & Exam Coverage | AnyExamEasy",
  "/faq"
);
const FAQ_DESCRIPTION = enforceMetaDescription(
  "Which exams are included, what Pro costs, how the 5-day free trial works, and how to reach support for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT.",
  "/faq"
);

export const metadata: Metadata = {
  title: { absolute: FAQ_TITLE },
  description: FAQ_DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: { title: FAQ_TITLE, description: FAQ_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: FAQ_TITLE, description: FAQ_DESCRIPTION },
};

/** Full FAQ. The home page links here instead of repeating it. */
export default function FaqPage() {
  return (
    <div className="bg-[var(--color-bg)] pt-[var(--nav-height)]">
      <JsonLdScript
        data={publicBreadcrumbJsonLd([{ name: "FAQ", path: "/faq" }])}
      />
      <LandingFaqV2 pageHeading />
    </div>
  );
}
