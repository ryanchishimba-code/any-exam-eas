import type { Metadata } from "next";
import { preload } from "react-dom";
import { PublicStudyGuideView } from "@/components/marketing/study-guide/PublicStudyGuideView";
import { loadPublicStudyGuide, loadUsmleStepGuide } from "@/lib/study-guides/load-public-guide";
import {
  marketingPhotoHeroSrc,
  MARKETING_PHOTO_HERO_MOBILE_MEDIA,
} from "@/lib/marketing/marketing-photo-heroes";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import {
  publicStudyGuide,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";
import { GUIDE_SEO } from "@/lib/study-guides/seo-copy";

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

export function PublicStudyGuidePage({ id }: { id: PublicStudyGuideId }) {
  preload(marketingPhotoHeroSrc(id, "mobile", "avif"), {
    as: "image",
    type: "image/avif",
    media: MARKETING_PHOTO_HERO_MOBILE_MEDIA,
    fetchPriority: "high",
  });
  const guide = publicStudyGuide(id);
  const page = loadPublicStudyGuide(id);
  const stepLinks =
    id === "usmle"
      ? USMLE_PUBLIC_STEPS.map((step) => ({ href: step.path, label: step.label }))
      : undefined;
  return <PublicStudyGuideView guide={guide} page={page} stepLinks={stepLinks} />;
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
  preload(marketingPhotoHeroSrc("usmle", "mobile", "avif"), {
    as: "image",
    type: "image/avif",
    media: MARKETING_PHOTO_HERO_MOBILE_MEDIA,
    fetchPriority: "high",
  });
  const page = loadUsmleStepGuide(stepId);
  if (!page) return null;
  return <PublicStudyGuideView guide={publicStudyGuide("usmle")} page={page} stepId={stepId} />;
}
