/** Image share payload. The link lives in `text` so a target can make it tappable. No title and no url field: those are dropped, or they replace the caption, when a file is attached. */
export type DailyVitalsShareData = {
  files: File[];
  text?: string;
};

export type DailyVitalsShareAttempt =
  | { mode: "share"; data: DailyVitalsShareData }
  | { mode: "save" };

export const LINK_COPIED_NOTE = "Link copied, paste it with your image";

/**
 * Share the result image with the link in the text field.
 * The caller must pass this to navigator.share in the same tap, before any await.
 * When the device will not accept the file, save the image instead of sending text alone.
 */
export function chooseShareAttempt(input: {
  file?: File | null;
  link: string;
  hasShare: boolean;
  canShare?: (data: DailyVitalsShareData) => boolean;
}): DailyVitalsShareAttempt {
  const file = input.file ?? null;
  if (!file || !input.hasShare) return { mode: "save" };

  const withLink: DailyVitalsShareData = { files: [file], text: input.link };
  if (!input.canShare || input.canShare(withLink)) {
    return { mode: "share", data: withLink };
  }

  const imageOnly: DailyVitalsShareData = { files: [file] };
  if (input.canShare(imageOnly)) return { mode: "share", data: imageOnly };
  return { mode: "save" };
}

/** Starts the share sheet now. Returns the promise without awaiting it. */
export function invokeShare(
  attempt: DailyVitalsShareAttempt,
  share: ((data: DailyVitalsShareData) => Promise<void>) | undefined,
): Promise<void> | null {
  if (attempt.mode !== "share" || typeof share !== "function") return null;
  return share(attempt.data);
}

/** Starts copying the bare link. Call it in the tap, without awaiting, before the share sheet returns. */
export function startLinkCopy(
  link: string,
  writeText: ((value: string) => Promise<void>) | undefined,
): Promise<void> | null {
  if (typeof writeText !== "function") return null;
  try {
    return writeText(link);
  } catch {
    return null;
  }
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
