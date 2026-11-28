import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";

export const BLOG_INDEX_TITLE = enforceMetaTitle(
  "Board Exam Study Plans & Guides | AnyExamEasy",
  "/blog"
);

export const BLOG_INDEX_DESCRIPTION = enforceMetaDescription(
  "Study plans for NCLEX, NAPLEX, USMLE, PANCE, AANP FNP and NPTE-PT built on the official exam outlines. Practice habits and what a subscription includes.",
  "/blog"
);
