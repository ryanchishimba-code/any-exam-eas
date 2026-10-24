import type { Metadata } from "next";
import "@/components/nclex-study-guide/study-guide-reader.css";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  PANCE_STUDY_GUIDE_DESCRIPTION,
  PANCE_STUDY_GUIDE_PATH,
  PANCE_STUDY_GUIDE_TITLE,
  loadPanceStudyGuidePage,
} from "@/lib/pance-study-guide/public-guide";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: PANCE_STUDY_GUIDE_TITLE },
  description: PANCE_STUDY_GUIDE_DESCRIPTION,
  alternates: { canonical: PANCE_STUDY_GUIDE_PATH },
  openGraph: {
    title: PANCE_STUDY_GUIDE_TITLE,
    description: PANCE_STUDY_GUIDE_DESCRIPTION,
    url: PANCE_STUDY_GUIDE_PATH,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: PANCE_STUDY_GUIDE_TITLE,
    description: PANCE_STUDY_GUIDE_DESCRIPTION,
  },
};

/** Public PANCE study guide. Rendered from the chapter files, with no database read. */
export default function PanceStudyGuidePage() {
  const page = loadPanceStudyGuidePage();
  return (
    <article className="mx-auto max-w-3xl px-5 pb-20 pt-[var(--page-top)] text-[var(--color-ink)] sm:px-6">
      <JsonLdScript data={page.jsonLd} />
      <div className="sg-paper sg-prose" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
