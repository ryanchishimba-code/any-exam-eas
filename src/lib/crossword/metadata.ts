import type { Metadata } from "next";
import { boardProfile, type CrosswordBoard } from "@/lib/crossword/boards";
import {
  crosswordBoardPath,
  crosswordDatedPath,
  crosswordHubPath,
  formatCrosswordDate,
} from "@/lib/crossword/schedule";
import { getSiteUrl } from "@/lib/seo";

const BRAND = "AnyExamEasy";

export function crosswordTitle(shortName: string, dateLabel: string): string {
  const branded = `${shortName} Daily Crossword — ${dateLabel} | ${BRAND}`;
  if (branded.length <= 60) return branded;
  const plain = `${shortName} Daily Crossword — ${dateLabel}`;
  return plain.length <= 60 ? plain : plain.slice(0, 60);
}

export function crosswordDescription(shortName: string, dateLabel: string, focus: string): string {
  const head = `Free ${shortName} crossword for ${dateLabel}.`;
  const options = [
    `${head} ${focus} Practice only — not a promise you'll pass.`,
    `${head} ${focus} No account needed. Not a promise you'll pass.`,
    `${head} High-yield exam clues. Practice only — not a promise you'll pass.`,
    `${head} High-yield clues for daily practice. Not a promise you'll pass.`,
  ];
  for (const text of options) {
    if (text.length >= 140 && text.length <= 160) return text;
  }
  let text = options[0]!;
  if (text.length > 160) text = options[3] ?? text;
  if (text.length < 140) text = `${text} Open to anyone.`;
  if (text.length > 160) text = `${text.slice(0, 159).trimEnd()}.`;
  return text;
}

export const HUB_TITLE = "Daily Crossword for Board Exam Practice | AnyExamEasy";
export const HUB_DESCRIPTION =
  "Free daily crossword for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT. High-yield practice clues. No account needed. Not a promise you'll pass.";

export function hubMetadata(): Metadata {
  const url = `${getSiteUrl()}${crosswordHubPath()}`;
  const image = `${url}/opengraph-image`;
  return {
    title: { absolute: HUB_TITLE },
    description: HUB_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: HUB_TITLE,
      description: HUB_DESCRIPTION,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: "AnyExamEasy daily crossword" }],
    },
    twitter: {
      card: "summary_large_image",
      title: HUB_TITLE,
      description: HUB_DESCRIPTION,
      images: [image],
    },
  };
}

export function dayMetadata(board: CrosswordBoard, dateIso: string): Metadata {
  const profile = boardProfile(board);
  const dateLabel = formatCrosswordDate(dateIso);
  const title = crosswordTitle(profile.shortName, dateLabel);
  const description = crosswordDescription(profile.shortName, dateLabel, profile.focus);
  const path = crosswordDatedPath(board, dateIso);
  const url = `${getSiteUrl()}${path}`;
  const image = `${url}/opengraph-image`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${profile.shortName} crossword ${dateLabel}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function boardCanonicalPath(board: CrosswordBoard, dateIso: string): string {
  return crosswordDatedPath(board, dateIso);
}

export function hubJsonLd(): Record<string, unknown> {
  const url = `${getSiteUrl()}${crosswordHubPath()}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: HUB_TITLE,
        description: HUB_DESCRIPTION,
        url,
        isAccessibleForFree: true,
        provider: { "@type": "Organization", name: BRAND, url: getSiteUrl() },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Daily crossword", path: crosswordHubPath() },
      ]),
      faqNode(),
    ],
  };
}

export function dayJsonLd(board: CrosswordBoard, dateIso: string, clueTexts: string[]): Record<string, unknown> {
  const profile = boardProfile(board);
  const dateLabel = formatCrosswordDate(dateIso);
  const path = crosswordDatedPath(board, dateIso);
  const url = `${getSiteUrl()}${path}`;
  const description = crosswordDescription(profile.shortName, dateLabel, profile.focus);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name: crosswordTitle(profile.shortName, dateLabel),
        description,
        url,
        learningResourceType: "Crossword",
        educationalUse: "practice",
        isAccessibleForFree: true,
        datePublished: dateIso,
        about: profile.examName,
        teaches: clueTexts.slice(0, 12),
        provider: { "@type": "Organization", name: BRAND, url: getSiteUrl() },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Daily crossword", path: crosswordHubPath() },
        { name: profile.shortName, path: crosswordBoardPath(board) },
        { name: dateLabel, path },
      ]),
    ],
  };
}

function breadcrumb(items: { name: string; path: string }[]): Record<string, unknown> {
  const origin = getSiteUrl();
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

function faqNode(): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When does the daily crossword change?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A new puzzle unlocks at midnight, America/Chicago. Everyone on that calendar day shares the same grid.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need an account to play?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The crossword is public. A streak is saved in this browser only.",
        },
      },
      {
        "@type": "Question",
        name: "Does the crossword mean I will pass?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It is practice, not a promise you'll pass. Use it with questions and a full study plan.",
        },
      },
    ],
  };
}
