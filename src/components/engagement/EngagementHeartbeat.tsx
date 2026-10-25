"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  HEARTBEAT_ACTIVE_WINDOW_MS,
  HEARTBEAT_CLIENT_INTERVAL_MS,
} from "@/lib/engagement/config";
import { inferEngagementSurface } from "@/lib/engagement/infer-surface";

function isVideoPlaying(): boolean {
  const videos = document.querySelectorAll("video");
  for (const video of videos) {
    if (!video.paused && !video.ended && video.readyState > 2) return true;
  }
  return false;
}

export function EngagementHeartbeat() {
  const pathname = usePathname();
  const lastActivityRef = useRef(Date.now());
  const surfaceRef = useRef(inferEngagementSurface(pathname));

  useEffect(() => {
    surfaceRef.current = inferEngagementSurface(pathname);
  }, [pathname]);

  useEffect(() => {
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("pointerdown", markActive, opts);
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive, opts);
    window.addEventListener("wheel", markActive, opts);
    return () => {
      window.removeEventListener("pointerdown", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("scroll", markActive);
      window.removeEventListener("wheel", markActive);
    };
  }, []);

  useEffect(() => {
    const send = (requestedSeconds: number) => {
      const payload = JSON.stringify({
        surface: surfaceRef.current,
        requestedSeconds,
      });
      if (document.visibilityState !== "visible") return;
      const activeRecently =
        Date.now() - lastActivityRef.current <= HEARTBEAT_ACTIVE_WINDOW_MS || isVideoPlaying();
      if (!activeRecently) return;

      if (navigator.sendBeacon && requestedSeconds <= 35) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/engagement/heartbeat", blob);
        return;
      }
      void fetch("/api/engagement/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    };

    const interval = window.setInterval(() => send(30), HEARTBEAT_CLIENT_INTERVAL_MS);

    const onHide = () => send(30);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onHide();
    });
    window.addEventListener("pagehide", onHide);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  return null;
}
