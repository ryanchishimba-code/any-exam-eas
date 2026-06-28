"use client";

import { useEffect } from "react";

/** Registers a lightweight service worker for offline shell + faster repeat visits. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* Non-fatal — PWA is progressive enhancement */
    });
  }, []);

  return null;
}
