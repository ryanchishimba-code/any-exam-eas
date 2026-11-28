import { DAILY_VITALS_SHARE_URL } from "@/lib/daily-vitals/schedule";

/** The payload passed to navigator.share. Files are included only when the device accepts them. */
export type DailyVitalsShareData = {
  text?: string;
  url?: string;
  files?: File[];
};

export type DailyVitalsShareAttempt =
  | { mode: "share"; data: DailyVitalsShareData }
  | { mode: "clipboard" };

function withLink(text: string, url: string): string {
  return text.includes(url) ? text : `${text}\n${url}`;
}

/**
 * Pick a share payload without waiting. The caller must hand it to navigator.share
 * in the same tap, before any await, or iOS Safari drops the share sheet.
 * The text always includes the game URL. A file is attached only when canShare accepts that exact payload.
 */
export function chooseShareAttempt(input: {
  text: string;
  url?: string;
  file?: File | null;
  hasShare: boolean;
  canShare?: (data: DailyVitalsShareData) => boolean;
}): DailyVitalsShareAttempt {
  const url = input.url || DAILY_VITALS_SHARE_URL;
  const text = withLink(input.text, url);
  if (!input.hasShare) return { mode: "clipboard" };

  const file = input.file ?? null;
  if (file && input.canShare?.({ files: [file], text })) {
    return { mode: "share", data: { files: [file], text } };
  }

  const withUrl: DailyVitalsShareData = { text, url };
  if (!input.canShare || input.canShare(withUrl)) {
    return { mode: "share", data: withUrl };
  }

  const textOnly: DailyVitalsShareData = { text };
  if (input.canShare(textOnly)) return { mode: "share", data: textOnly };
  return { mode: "clipboard" };
}

/** Starts the share sheet now. Returns the promise without awaiting it. */
export function invokeShare(
  attempt: DailyVitalsShareAttempt,
  share: ((data: DailyVitalsShareData) => Promise<void>) | undefined,
): Promise<void> | null {
  if (attempt.mode !== "share" || typeof share !== "function") return null;
  return share(attempt.data);
}

export function shareWasCancelled(error: unknown): boolean {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}

export function pngDataUrlToBlob(dataUrl: string): Blob | null {
  const match = /^data:image\/png(?:;base64)?,([\s\S]+)$/.exec(dataUrl);
  if (!match?.[1]) return null;
  try {
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: "image/png" });
  } catch {
    return null;
  }
}

export function pngFileFromDataUrl(dataUrl: string, filename: string): File | null {
  const blob = pngDataUrlToBlob(dataUrl);
  if (!blob || typeof File === "undefined") return null;
  try {
    return new File([blob], filename, { type: "image/png" });
  } catch {
    return null;
  }
}
