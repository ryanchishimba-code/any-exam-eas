"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm primary nav targets so a tap feels instant. Idempotent. */
export function usePrefetchHrefs(hrefs: readonly string[]): void {
  const router = useRouter();
  const key = hrefs.join("|");

  useEffect(() => {
    for (const href of key.split("|")) {
      if (!href) continue;
      router.prefetch(href);
    }
  }, [router, key]);
}
