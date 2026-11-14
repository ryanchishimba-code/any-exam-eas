import type { Metadata } from "next";
import { boardProfile, type CrosswordBoard } from "@/lib/crossword/boards";
import {
  crosswordBoardPath,
  crosswordDatedPath,
  crosswordHubPath,
  formatCrosswordDate,
  formatCrosswordDateShort,
} from "@/lib/crossword/schedule";
import { getSiteUrl } from "@/lib/seo";

const BRAND = "AnyExamEasy";

function shortenDateLabel(label: string): string {
  return label.replace(
    /\b(January|February|March|April|August|September|October|November|December)\b/,
    (month) => month.slice(0, 3),
  );
}

/** Date-specific title. Prefers "Free Daily Pharmacy Crossword — Nov 14, 2026 | AnyExamEasy". */
export function crosswordTitle(titleName: string, dateLabel: string): string {
  const short = shortenDateLabel(dateLabel);
  const candidates = [
    `Free Daily ${titleName} Crossword — ${dateLabel} | ${BRAND}`,
    `Free Daily ${titleName} Crossword — ${short} | ${BRAND}`,
    `${titleName} Crossword — ${dateLabel} | ${BRAND}`,
    `${titleName} Crossword — ${short} | ${BRAND}`,
    `Free Daily ${titleName} Crossword | ${BRAND}`,
    `${titleName} Crossword | ${BRAND}`,
  ];
  for (const text of candidates) {
    if (text.length >= 15 && text.length <= 60) return text;
  }
  return candidates[candidates.length - 1]!.slice(0, 60);
}

export function crosswordDescription(
  spokenName: string,
  examName: string,
  dateLabel: string,
  focus: string,
): string {
  const head = `Free ${spokenName} crossword for ${dateLabel}.`;
  const candidates = [
    `${head} ${focus} Not a promise you'll pass.`,
    `${head} ${focus} Practice only — not a promise you'll pass.`,
    `${head} High-yield ${examName} clues. Not a promise you'll pass.`,
    `${head} ${focus} No account needed. Not a promise you'll pass.`,
    `${head} Daily ${examName} practice. Not a promise you'll pass. Open to anyone.`,
  ];
  for (const text of candidates) {
    if (text.length >= 140 && text.length <= 160) return text;
  }
  let text = candidates.reduce((best, item) => (Math.abs(item.length - 150) < Math.abs(best.length - 150) ? item : best));
  if (text.length > 160) {
    const cut = text.slice(0, 157);
    const space = cut.lastIndexOf(" ");
    text = `${(space > 120 ? cut.slice(0, space) : cut).trimEnd()}.`;
  }
  const pads = [" No account needed.", " Open to anyone.", " Play today's grid."];
  for (const pad of pads) {
    if (text.length >= 140) break;
    if (text.length + pad.length <= 160) text += pad;
  }
  if (text.length < 140) text = `${text}${" ·".repeat(140 - text.length)}`.slice(0, 160);
  return text.slice(0, 160);
}

export const HUB_TITLE = "Free Daily Board Exam Crossword | AnyExamEasy";
export const HUB_DESCRIPTION =
  "Free daily crossword for nursing boards, pharmacy boards, physician assistant boards, and nurse practitioner practice. Not a promise you'll pass.";

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
  const title = crosswordTitle(profile.titleName, dateLabel);
  const description = crosswordDescription(profile.spokenName, profile.examName, dateLabel, profile.focus);
  const path = crosswordDatedPath(board, dateIso);
  const url = `${getSiteUrl()}${path}`;
  const image = `${url}/opengraph-image`;
  const square = `${url}/square-image`;
  const alt = `Free daily ${profile.spokenName} crossword for ${formatCrosswordDateShort(dateIso)} on AnyExamEasy`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        { url: image, width: 1200, height: 630, alt },
        { url: square, width: 1080, height: 1080, alt },
      ],
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
        "@type": ["CollectionPage", "WebApplication"],
        name: HUB_TITLE,
        description: HUB_DESCRIPTION,
        url,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
  const description = crosswordDescription(profile.spokenName, profile.examName, dateLabel, profile.focus);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LearningResource", "Game"],
        name: crosswordTitle(profile.titleName, dateLabel),
        description,
        url,
        learningResourceType: "Crossword",
        educationalUse: "practice",
        genre: "Crossword",
        isAccessibleForFree: true,
        datePublished: dateIso,
        dateModified: dateIso,
        about: `${profile.spokenName} (${profile.examName})`,
        teaches: clueTexts.slice(0, 12),
        provider: { "@type": "Organization", name: BRAND, url: getSiteUrl() },
        publisher: { "@type": "Organization", name: BRAND, url: getSiteUrl() },
      },
      breadcrumb([
        { name: "Home", path: "/" },
        { name: "Daily crossword", path: crosswordHubPath() },
        { name: `${profile.titleName} crossword`, path: crosswordBoardPath(board) },
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
          text: "No. The crossword is public. A streak stays on this device until you create a free account to keep it.",
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
