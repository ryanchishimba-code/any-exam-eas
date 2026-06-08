"use client";

import { useEffect } from "react";

/** Reload once when a stale JS chunk fails after deploy (common post-release client crash). */
export function ClientRecovery() {
  useEffect(() => {
    const key = "aee_chunk_reload";

    function shouldReload(message: string) {
      return (
        /Loading chunk \d+ failed/i.test(message) ||
        /Failed to fetch dynamically imported module/i.test(message) ||
        /Cannot read properties of undefined \(reading 'call'\)/i.test(message)
      );
    }

    function maybeReload(reason: string) {
      if (!shouldReload(reason)) return;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      window.location.reload();
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
