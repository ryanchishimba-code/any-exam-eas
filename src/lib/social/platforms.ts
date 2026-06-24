import type { SharePlatform } from "./types";

/**
 * Share-target metadata + URL builders. Pure functions (no DOM/network) so they
 * are safe to import in both server and client components.
 */

export type ShareContent = {
  /** Absolute URL to share. */
  url: string;
  /** Short text/caption (used by X, WhatsApp; ignored by Facebook). */
  text?: string;
};

export const SHARE_PLATFORMS: {
  id: Exclude<SharePlatform, "copy">;
  label: string;
}[] = [
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
  { id: "whatsapp", label: "WhatsApp" },
];

/**
 * Build the intent/share URL for a given platform. Returns null for "copy"
 * (handled client-side via the clipboard API).
 */
export function buildShareUrl(platform: SharePlatform, content: ShareContent): string | null {
  const url = encodeURIComponent(content.url);
  const text = encodeURIComponent(content.text ?? "");

  switch (platform) {
    case "x":
      return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "whatsapp":
      return `https://wa.me/?text=${text}%20${url}`;
    case "copy":
      return null;
  }
}
