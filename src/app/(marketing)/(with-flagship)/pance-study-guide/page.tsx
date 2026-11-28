import type { Metadata } from "next";
import { PublicStudyGuideView } from "@/components/marketing/study-guide/PublicStudyGuideView";
import { loadPanceStudyGuidePage, PANCE_STUDY_GUIDE_DESCRIPTION, PANCE_STUDY_GUIDE_PATH, PANCE_STUDY_GUIDE_TITLE } from "@/lib/pance-study-guide/public-guide";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import { publicStudyGuide } from "@/lib/study-guides/public-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: PANCE_STUDY_GUIDE_TITLE },
  description: PANCE_STUDY_GUIDE_DESCRIPTION,
  alternates: { canonical: PANCE_STUDY_GUIDE_PATH },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: PANCE_STUDY_GUIDE_TITLE,
    description: PANCE_STUDY_GUIDE_DESCRIPTION,
    images: [landingOgImage("pance").url],
  },
  openGraph: {
    title: PANCE_STUDY_GUIDE_TITLE,
    description: PANCE_STUDY_GUIDE_DESCRIPTION,
    url: PANCE_STUDY_GUIDE_PATH,
    type: "article",
    images: [{ ...landingOgImage("pance"), alt: PANCE_STUDY_GUIDE_TITLE }],
  },
};

/** Public PANCE study guide. The full manuscript, with no login and no database read. */
export default function PanceStudyGuidePage() {
  const loaded = loadPanceStudyGuidePage();
  return (
    <PublicStudyGuideView
      guide={publicStudyGuide("pance")}
      page={{ ...loaded, toc: toc(loaded.html) }}
    />
  );
}

function toc(html: string): { id: string; text: string }[] {
  const items: { id: string; text: string }[] = [];
  for (const match of html.matchAll(/<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const text = (match[2] ?? "").replace(/<[^>]+>/g, "").trim();
    if (match[1] && text) items.push({ id: match[1], text });
  }
  return items.slice(0, 24);
}
