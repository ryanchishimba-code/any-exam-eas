import { ROUTES } from "@/lib/routes";

/** Shareable walkthrough. The file can be swapped without a code change. */
export const HOW_TO_PASS_PATH = ROUTES.howToPass;

export const HOW_TO_PASS_VIDEO_ID = "video";

export const HOW_TO_PASS_TITLE = "How to pass any board exam — in 3 minutes";

/** 150 characters. Stays inside the public meta description budget. */
export const HOW_TO_PASS_DESCRIPTION =
  "A three-minute walkthrough of one study system for six boards, with a rationale on every option. Start a 5-day free trial. No payment method required.";

export const HOW_TO_PASS_POSTER_WIDTH = 1280;
export const HOW_TO_PASS_POSTER_HEIGHT = 720;

function publicAsset(envValue: string | undefined, fallback: string): string {
  const value = envValue?.trim();
  return value || fallback;
}

/**
 * Public marketing files in /public. Override with:
 * NEXT_PUBLIC_HOW_TO_PASS_VIDEO_SRC
 * NEXT_PUBLIC_HOW_TO_PASS_POSTER_SRC
 * NEXT_PUBLIC_HOW_TO_PASS_CAPTIONS_SRC
 */
export const HOW_TO_PASS_MEDIA = {
  src: publicAsset(
    process.env.NEXT_PUBLIC_HOW_TO_PASS_VIDEO_SRC,
    "/videos/landing/how-to-pass.mp4"
  ),
  poster: publicAsset(
    process.env.NEXT_PUBLIC_HOW_TO_PASS_POSTER_SRC,
    "/images/how-to-pass-poster.png"
  ),
  captions: publicAsset(
    process.env.NEXT_PUBLIC_HOW_TO_PASS_CAPTIONS_SRC,
    "/videos/landing/how-to-pass.vtt"
  ),
} as const;

/** Deep link that lands on the player, not the homepage fold. */
export function howToPassSharePath(): string {
  return `${HOW_TO_PASS_PATH}#${HOW_TO_PASS_VIDEO_ID}`;
}

export type HomeShareLink = {
  id: "facebook" | "x" | "whatsapp" | "linkedin" | "email";
  label: string;
  href: string;
};

export function buildShareLinks(url: string, title: string): HomeShareLink[] {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const message = encodeURIComponent(`${title} ${url}`);
  return [
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${message}`,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n${url}`)}`,
    },
  ];
}
