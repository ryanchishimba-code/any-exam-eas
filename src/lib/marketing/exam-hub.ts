import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";
import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

export const MARKETING_DARK_HERO_PATHS = new Set([
  "/",
  "/nclex",
  "/usmle",
  "/naplex",
  "/pance",
  "/aanp-fnp",
  "/npte-pt",
]);

export function marketingExamKeyFromPath(pathname: string): ExamSeoKey | null {
  const slug = pathname.replace(/^\//, "").split("/")[0];
  if (
    slug === "nclex" ||
    slug === "usmle" ||
    slug === "naplex" ||
    slug === "pance" ||
    slug === "aanp-fnp" ||
    slug === "npte-pt"
  ) {
    return slug;
  }
  return null;
}

export type ExamHubSecondaryLink = {
  href: string;
  label: string;
};

export function examHubSecondaryLink(examKey: ExamSeoKey): ExamHubSecondaryLink {
  const guide = getStudyGuideConfig(examKey);
  if (guide) {
    return {
      href: guide.routeBase,
      label: `Free ${getExamSeoConfig(examKey).shortName} study guide`,
    };
  }
  if (examKey === "usmle") {
    return { href: "#usmle-steps", label: "See Step 1 · 2 · 3" };
  }
  return { href: ROUTES.pricing, label: "View pricing" };
}

export type ExamHubProductLink = {
  href: string;
  title: string;
  body: string;
  accent: boolean;
};

export function examHubProductLinks(examKey: ExamSeoKey): ExamHubProductLink[] {
  const config = getExamSeoConfig(examKey);
  const nav = EXAM_NAV_ITEMS.find((item) => item.slug === examKey);
  const guide = getStudyGuideConfig(examKey);
  const links: ExamHubProductLink[] = [];

  if (guide) {
    links.push({
      href: guide.routeBase,
      title: `Free ${config.shortName} study guide`,
      body: "Open the book-style reader — start without an account.",
      accent: true,
    });
  }

  links.push({
    href: nav ? `${ROUTES.questionBank}?field=${nav.fieldId}` : ROUTES.questionBank,
    title: `${config.shortName} question bank`,
    body: "Board-style stems with teachable rationales on the same Pro plan.",
    accent: false,
  });

  links.push({
    href: nav?.practiceHref ?? `/practice/${examKey}`,
    title: "Practice & full exams",
    body: "Timed sets and full-length mocks that follow the sitting.",
    accent: false,
  });

  return links;
}
