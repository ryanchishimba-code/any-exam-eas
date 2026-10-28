"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyMediaSessionMetadata,
  isVideoPictureInPictureAvailable,
  requestVideoPictureInPicture,
  setMediaSessionActionHandler,
  shouldAttemptAutoPictureInPictureOnHide,
  type VideoPictureInPictureMetadata,
} from "@/lib/media/video-picture-in-picture";

/**
 * Media Session + auto-PiP on hide + enterpictureinpicture handler for HTML5 lecture players.
 * Does not pause on visibility change.
 */
export function useVideoPictureInPicture({
  video,
  metadata,
  enabled,
}: {
  video: HTMLVideoElement | null;
  metadata: VideoPictureInPictureMetadata | null;
  enabled: boolean;
}) {
  const [pipSupported, setPipSupported] = useState(false);

  useEffect(() => {
    if (!enabled || !video) {
      setPipSupported(false);
      return;
    }
    video.setAttribute("autopictureinpicture", "");
    setPipSupported(isVideoPictureInPictureAvailable(video));
    return () => {
      video.removeAttribute("autopictureinpicture");
    };
  }, [enabled, video]);

  const enterPictureInPicture = useCallback(async () => {
    if (!video) return false;
    return requestVideoPictureInPicture(video);
  }, [video]);

  useEffect(() => {
    const title = metadata?.title?.trim() ?? "";
    const artworkUrl = metadata?.artworkUrl?.trim() ?? "";
    if (!enabled || !video || !title) return;

    applyMediaSessionMetadata({ title, artworkUrl, artist: metadata?.artist });

    setMediaSessionActionHandler("play", () => {
      try {
        const pending = video.play?.();
        if (pending && typeof pending.catch === "function") pending.catch(() => {});
      } catch {
        /* blocked */
      }
    });
    setMediaSessionActionHandler("pause", () => {
      try {
        video.pause();
      } catch {
        /* jsdom */
      }
    });
    setMediaSessionActionHandler("enterpictureinpicture", () => {
      void requestVideoPictureInPicture(video);
    });

    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      if (!shouldAttemptAutoPictureInPictureOnHide(video)) return;
      void requestVideoPictureInPicture(video);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      setMediaSessionActionHandler("play", null);
      setMediaSessionActionHandler("pause", null);
      setMediaSessionActionHandler("enterpictureinpicture", null);
      applyMediaSessionMetadata(null);
    };
  }, [enabled, metadata?.artist, metadata?.artworkUrl, metadata?.title, video]);

  return { pipSupported, enterPictureInPicture };
}
