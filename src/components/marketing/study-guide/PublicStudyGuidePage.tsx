import type { Metadata } from "next";
import { PublicStudyGuideView } from "@/components/marketing/study-guide/PublicStudyGuideView";
import { loadPublicStudyGuide, loadUsmleStepGuide } from "@/lib/study-guides/load-public-guide";
import {
  publicStudyGuide,
  USMLE_PUBLIC_STEPS,
  type PublicStudyGuideId,
} from "@/lib/study-guides/public-catalog";

export function publicGuideMetadata(id: PublicStudyGuideId): Metadata {
  const guide = publicStudyGuide(id);
  return {
    title: { absolute: guide.title },
    description: guide.description,
    alternates: { canonical: guide.path },
    robots: { index: true, follow: true },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: guide.path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export function PublicStudyGuidePage({ id }: { id: PublicStudyGuideId }) {
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
  const title = step?.title ?? "Free USMLE Study Guide";
  const description = step?.description ?? publicStudyGuide("usmle").description;
  const path = step?.path ?? "/usmle-study-guide";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: { title, description, url: path, type: "article" },
  };
}

export function UsmleStepGuidePage({ stepId }: { stepId: string }) {
  const page = loadUsmleStepGuide(stepId);
  if (!page) return null;
  return <PublicStudyGuideView guide={publicStudyGuide("usmle")} page={page} />;
}
