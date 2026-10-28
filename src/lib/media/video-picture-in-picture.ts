/** WebKit presentation-mode PiP (iOS/iPadOS Safari). */
export type WebKitPresentationVideo = HTMLVideoElement & {
  webkitSupportsPresentationMode?: (mode: string) => boolean;
  webkitSetPresentationMode?: (mode: string) => void;
};

export const VIDEO_PIP_ARTIST = "AnyExamEasy";

export type VideoPictureInPictureMetadata = {
  title: string;
  artist?: string;
  /** Poster or thumbnail URL for lock-screen / Media Session artwork. */
  artworkUrl?: string;
};

export function supportsWebKitPictureInPicture(video: HTMLVideoElement): boolean {
  const el = video as WebKitPresentationVideo;
  return (
    typeof el.webkitSupportsPresentationMode === "function" &&
    el.webkitSupportsPresentationMode("picture-in-picture")
  );
}

export function supportsDocumentPictureInPicture(): boolean {
  if (typeof document === "undefined") return false;
  try {
    return document.pictureInPictureEnabled === true;
  } catch {
    return false;
  }
}

export function isVideoPictureInPictureAvailable(video: HTMLVideoElement | null): boolean {
  if (!video) return false;
  if (supportsWebKitPictureInPicture(video)) return true;
  return supportsDocumentPictureInPicture() && typeof video.requestPictureInPicture === "function";
}

export function isVideoInPictureInPicture(video: HTMLVideoElement | null): boolean {
  if (!video) return false;
  if (typeof document !== "undefined" && document.pictureInPictureElement === video) return true;
  const el = video as WebKitPresentationVideo;
  if (
    typeof el.webkitSupportsPresentationMode === "function" &&
    el.webkitSupportsPresentationMode("picture-in-picture") &&
    typeof el.webkitSetPresentationMode === "function"
  ) {
    // WebKit does not expose a stable "currently in PiP" getter; treat document PiP as primary signal.
  }
  return false;
}

/** Enter PiP when supported. Resolves false when unavailable or user-gesture rules block entry. */
export async function requestVideoPictureInPicture(video: HTMLVideoElement): Promise<boolean> {
  try {
    if (supportsWebKitPictureInPicture(video)) {
      const el = video as WebKitPresentationVideo;
      el.webkitSetPresentationMode?.("picture-in-picture");
      return true;
    }
    if (typeof document !== "undefined" && document.pictureInPictureElement === video) {
      return true;
    }
    if (typeof video.requestPictureInPicture === "function") {
      await video.requestPictureInPicture();
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function shouldAttemptAutoPictureInPictureOnHide(video: HTMLVideoElement | null): boolean {
  if (!video || video.paused || video.ended) return false;
  if (isVideoInPictureInPicture(video)) return false;
  return isVideoPictureInPictureAvailable(video);
}

export function applyMediaSessionMetadata(metadata: VideoPictureInPictureMetadata | null): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  if (!metadata?.title?.trim()) {
    navigator.mediaSession.metadata = null;
    return;
  }
  const artist = metadata.artist?.trim() || VIDEO_PIP_ARTIST;
  const artworkSrc = metadata.artworkUrl?.trim();
  const artwork =
    artworkSrc && artworkSrc.length > 0
      ? [{ src: artworkSrc, sizes: "512x512", type: guessArtworkMime(artworkSrc) }]
      : [];
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: metadata.title,
      artist,
      album: "Quick Bites",
      artwork,
    });
  } catch {
    /* MediaMetadata unsupported or artwork rejected */
  }
}

function guessArtworkMime(url: string): string {
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

export type MediaSessionActionHandler = (() => void | Promise<void>) | null;

/** Safe wrapper — action may be unsupported on the platform. */
export function setMediaSessionActionHandler(
  action: MediaSessionAction | "enterpictureinpicture",
  handler: MediaSessionActionHandler
): void {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.setActionHandler(
      action as MediaSessionAction,
      handler as MediaSessionActionHandler
    );
  } catch {
    /* action not supported */
  }
}
