"use client";

import { useEffect } from "react";
import {
  hardReloadAfterStaleChunk,
  isStaleChunkError,
  RELOAD_KEY,
} from "@/lib/client/stale-chunk-recovery";

/** Reload once when a stale JS chunk fails after deploy (common post-release client crash). */
export function ClientRecovery() {
  useEffect(() => {
    // Successful mount — allow a future deploy recovery in this tab.
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      /* private mode */
    }

    // Drop one-shot cache-bust query from hardReloadAfterStaleChunk.
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("_aee_r")) {
        url.searchParams.delete("_aee_r");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
    } catch {
      /* ignore */
    }

    function maybeReload(reason: string) {
      if (!isStaleChunkError(reason)) return;
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      void hardReloadAfterStaleChunk();
    }

    const onError = (event: ErrorEvent) => {
      maybeReload(event.message ?? "");
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "";
      maybeReload(message);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
