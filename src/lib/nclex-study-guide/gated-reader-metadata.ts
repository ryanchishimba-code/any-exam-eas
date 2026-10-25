import type { Metadata } from "next";

/** Premium study-guide reader routes should not be indexed. */
export function studyGuideGatedMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: { absolute: title },
    description:
      description ??
      `${title}. Bookmarks and highlights are included with the trial or Pro plan.`,
    robots: { index: false, follow: false },
  };
}
