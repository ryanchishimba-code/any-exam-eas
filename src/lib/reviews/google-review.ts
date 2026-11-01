/**
 * Signed-in Google review prompt.
 *
 * Off unless NEXT_PUBLIC_GOOGLE_REVIEW_URL is a non-empty http(s) URL.
 * Dismissal and clicks hide every surface for 60 days (localStorage only).
 *
 * Copy stays Google-policy compliant: honest reviews, no incentive, no
 * satisfaction gate, no pass promise, no competitor names.
 */

export const GOOGLE_REVIEW_STORAGE_KEY = "aee.google-review.hidden-until";

/** 60 days. */
export const GOOGLE_REVIEW_COOLDOWN_MS = 60 * 24 * 60 * 60 * 1000;

export const GOOGLE_REVIEW_SURFACES = [
  "practice_exam_results",
  "full_exam_results",
  "dashboard",
  "account",
] as const;

export type GoogleReviewSurface = (typeof GOOGLE_REVIEW_SURFACES)[number];

/** Funnel CTA name sent through the existing cta_clicked helper. */
export const GOOGLE_REVIEW_CTA_NAME = "google_review";

export const GOOGLE_REVIEW_COPY = {
  cardEyebrow: "Optional",
  cardTitle: "Review us on Google",
  cardBody:
    "A short, honest Google review helps other students understand what studying with AnyExamEasy is like. Say what worked, what did not, or both. Reviewing is never required, and nothing is offered in return.",
  cardAction: "Review us on Google",
  dismiss: "Not now",
  linkLabel: "Review us on Google",
  linkHint: "Honest reviews welcome.",
} as const;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function googleReviewUrl(
  raw: string | undefined | null = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
): string | null {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  return url.toString();
}

export function googleReviewHiddenUntil(now: number): number {
  return now + GOOGLE_REVIEW_COOLDOWN_MS;
}

export function readGoogleReviewHiddenUntil(storage: Pick<Storage, "getItem">): number | null {
  try {
    const raw = storage.getItem(GOOGLE_REVIEW_STORAGE_KEY);
    if (!raw) return null;
    const until = Number(raw);
    return Number.isFinite(until) ? until : null;
  } catch {
    return null;
  }
}

export function writeGoogleReviewHiddenUntil(storage: StorageLike, until: number): void {
  storage.setItem(GOOGLE_REVIEW_STORAGE_KEY, String(until));
}

export function isGoogleReviewSuppressed(until: number | null, now: number): boolean {
  return until != null && now < until;
}

export function googleReviewSurfaceForLength(lengthPreset: string | null | undefined): GoogleReviewSurface {
  return lengthPreset === "full" ? "full_exam_results" : "practice_exam_results";
}
