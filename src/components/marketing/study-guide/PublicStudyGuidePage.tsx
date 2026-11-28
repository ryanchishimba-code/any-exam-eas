import type { Metadata } from "next";
import { preload } from "react-dom";
import { PublicStudyGuideView } from "@/components/marketing/study-guide/PublicStudyGuideView";
import {
  publishGuide,
  publishUsmleStep,
  boardChapterAt,
  usmleChapterAt,
  type LoadedPublicGuide,
} from "@/lib/study-guides/load-public-guide";
import { marketingPhotoHeroSrc } from "@/lib/marketing/marketing-photo-heroes";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import {
  publicStudyGuide,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO, STEP_SEO } from "@/lib/study-guides/seo-copy";
import { clampMetaDescription, fitMetaTitle } from "@/lib/seo/meta-budget";

function guideSocial(id: PublicStudyGuideId, title: string, description: string, path: string) {
  const card = { ...landingOgImage(id), alt: title };
  return {
    openGraph: {
      title,
      description,
      url: path,
      type: "article" as const,
      images: [card],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [card.url],
    },
  };
}

export function publicGuideMetadata(id: PublicStudyGuideId): Metadata {
  const guide = publicStudyGuide(id);
  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: guide.path },
    robots: { index: true, follow: true },
    ...guideSocial(id, guide.title, guide.description, guide.path),
  };
}

function emptyPage(title: string): LoadedPublicGuide {
  return { html: "", h1: title, faqs: [], toc: [], jsonLd: {} };
}

function chapterDescription(excerpt: string, query: string): string {
  const tail = ` Free to read in the ${query}. No login is required.`;
  const room = 160 - tail.length;
  const lead =
    excerpt.length > room ? excerpt.slice(0, Math.max(room, 0)).replace(/\s+\S*$/, "").trim() : excerpt;
  let text = `${lead}${tail}`.replace(/\s+/g, " ").trim();
  if (text.length < 140 || text.length > 160) text = clampMetaDescription(text);
  return text;
}

export function boardChapterMetadata(id: PublicStudyGuideId, slug: string): Metadata {
  const guide = publicStudyGuide(id);
  const query = GUIDE_SEO[id]?.query ?? guide.title;
  const located = boardChapterAt(id, slug);
  if (!located) {
    return { title: guide.title, robots: { index: false, follow: false } };
  }
  const title = fitMetaTitle([located.chapter.title, query]);
  const description = chapterDescription(located.chapter.excerpt, query);
  const path = `${guide.path}/${located.chapter.slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...guideSocial(id, title, description, path),
  };
}

export function usmleChapterMetadata(stepId: string, slug: string): Metadata {
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  const query = STEP_SEO[stepId]?.query ?? "USMLE study guide";
  const located = usmleChapterAt(stepId, slug);
  const path = step ? `${step.path}/${slug}` : "/usmle-study-guide";
  if (!located || !step) {
    return { title: query, robots: { index: false, follow: false } };
  }
  const title = fitMetaTitle([located.chapter.title, query]);
  const description = chapterDescription(located.chapter.excerpt, query);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...guideSocial("usmle", title, description, path),
  };
}

export function PublicStudyGuidePage({ id }: { id: PublicStudyGuideId }) {
  preload(marketingPhotoHeroSrc(id, "desktop", "avif"), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });
  const guide = publicStudyGuide(id);
  const published = publishGuide(id);
  if (published.mode === "hub") {
    return (
      <PublicStudyGuideView
        guide={guide}
        page={emptyPage(guide.title)}
        hubCards={published.cards}
        minutesOverride={published.minutes}
      />
    );
  }
  if (published.mode === "chapters") {
    return (
      <PublicStudyGuideView
        guide={guide}
        page={emptyPage(guide.title)}
        minutesOverride={published.minutes}
        chapterLinks={published.chapters.map((chapter) => ({
          href: `${guide.path}/${chapter.slug}`,
          title: chapter.title,
          excerpt: chapter.excerpt,
        }))}
      />
    );
  }
  return <PublicStudyGuideView guide={guide} page={published.page} />;
}

export function usmleStepMetadata(stepId: string): Metadata {
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  const title = step?.title ?? GUIDE_SEO.usmle!.headline;
  const description = step?.description ?? publicStudyGuide("usmle").description;
  const path = step?.path ?? "/usmle-study-guide";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    ...guideSocial("usmle", title, description, path),
  };
}

export function UsmleStepGuidePage({ stepId }: { stepId: string }) {
  preload(marketingPhotoHeroSrc("usmle", "desktop", "avif"), {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });
  const published = publishUsmleStep(stepId);
  if (!published) return null;
  const guide = publicStudyGuide("usmle");
  const step = USMLE_PUBLIC_STEPS.find((item) => item.id === stepId);
  if (published.mode === "chapters" && step) {
    return (
      <PublicStudyGuideView
        guide={guide}
        page={emptyPage(step.title)}
        stepId={stepId}
        minutesOverride={published.minutes}
        chapterLinks={published.chapters.map((chapter) => ({
          href: `${step.path}/${chapter.slug}`,
          title: chapter.title,
          excerpt: chapter.excerpt,
        }))}
      />
    );
  }
  if (published.mode === "single") {
    return <PublicStudyGuideView guide={guide} page={published.page} stepId={stepId} />;
  }
  return null;
}
