import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
} from "@/lib/seo";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { SITE_NAME } from "@/lib/site";

const INDEXABLE: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

/** Open Graph and Twitter cards for a public URL. Image is the shared 1200×630 card. */
export function shareMeta(
  title: string,
  description: string,
  path: string
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
  };
}

function indexedPage(title: string, description: string, path: string): Metadata {
  const safeTitle = enforceMetaTitle(title, path);
  const safeDescription = enforceMetaDescription(description, path);
  return {
    title: { absolute: safeTitle },
    description: safeDescription,
    alternates: { canonical: path },
    robots: INDEXABLE,
    ...shareMeta(safeTitle, safeDescription, path),
  };
}

export const DRUGS_PAGE_TITLE = enforceMetaTitle(
  "Top 500+ Drugs Flashcards for NAPLEX & NCLEX | AnyExamEasy",
  "/study/drugs300"
);
export const DRUGS_PAGE_DESCRIPTION = enforceMetaDescription(
  "Top 500+ drug flashcards with brand, class, indications, key side effects and a mnemonic on every card. Free preview; spaced repetition with a free trial.",
  "/study/drugs300"
);

export const ANATOMY_PAGE_TITLE = "3D Anatomy Explorer for Board Prep | AnyExamEasy";
export const ANATOMY_PAGE_DESCRIPTION =
  "Orbit a stylized 3D body, open organs, and jump into pearls, tours, and board-style practice for NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE.";

export const ANATOMY_CATALOG_TITLE = "Anatomy Catalog — Tours and Quizzes | AnyExamEasy";
export const ANATOMY_CATALOG_DESCRIPTION =
  "Browse anatomy structures, guided tours, quizzes, and pearls without the 3D body viewer. Open the catalog before starting an AnyExamEasy trial.";

export const COMMUNITY_PAGE_TITLE = "Community Wall for Board Candidates | AnyExamEasy";
export const COMMUNITY_PAGE_DESCRIPTION =
  "Study tips, pass-day wins, and questions from NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE candidates on the public AnyExamEasy community wall.";

export function drugsPageMetadata(): Metadata {
  return indexedPage(DRUGS_PAGE_TITLE, DRUGS_PAGE_DESCRIPTION, "/study/drugs300");
}

export function anatomyPageMetadata(): Metadata {
  return indexedPage(ANATOMY_PAGE_TITLE, ANATOMY_PAGE_DESCRIPTION, "/anatomy");
}

export function anatomyCatalogMetadata(): Metadata {
  return indexedPage(ANATOMY_CATALOG_TITLE, ANATOMY_CATALOG_DESCRIPTION, "/anatomy/catalog");
}

export function communityPageMetadata(): Metadata {
  return indexedPage(COMMUNITY_PAGE_TITLE, COMMUNITY_PAGE_DESCRIPTION, "/community");
}
