import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { enforceMetaDescription, enforceMetaTitle } from "@/lib/seo/meta-budget";
import { SITE_NAME } from "@/lib/site";
import {
  HOW_TO_PASS_DESCRIPTION,
  HOW_TO_PASS_MEDIA,
  HOW_TO_PASS_PATH,
  HOW_TO_PASS_POSTER_HEIGHT,
  HOW_TO_PASS_POSTER_WIDTH,
  HOW_TO_PASS_TITLE,
} from "@/lib/marketing/home-video";

function absoluteMediaUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  return absoluteUrl(src.startsWith("/") ? src : `/${src}`);
}

export function buildHowToPassMetadata(): Metadata {
  const title = enforceMetaTitle(HOW_TO_PASS_TITLE, HOW_TO_PASS_PATH);
  const description = enforceMetaDescription(HOW_TO_PASS_DESCRIPTION, HOW_TO_PASS_PATH);
  const pageUrl = absoluteUrl(HOW_TO_PASS_PATH);
  const posterUrl = absoluteMediaUrl(HOW_TO_PASS_MEDIA.poster);
  const videoUrl = absoluteMediaUrl(HOW_TO_PASS_MEDIA.src);

  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: HOW_TO_PASS_PATH },
    openGraph: {
      type: "video.other",
      locale: "en_US",
      url: pageUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: posterUrl,
          width: HOW_TO_PASS_POSTER_WIDTH,
          height: HOW_TO_PASS_POSTER_HEIGHT,
          alt: title,
        },
      ],
      videos: [
        {
          url: videoUrl,
          secureUrl: videoUrl,
          type: "video/mp4",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [posterUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
