"use client";

import { useEffect, useState } from "react";
import { loadFdaDrugSearchIndex, type FdaDrugSearchIndex } from "@/lib/drugs300/fda-reference";

export function useFdaDrugSearchIndex() {
  const [index, setIndex] = useState<FdaDrugSearchIndex | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadFdaDrugSearchIndex()
      .then((loaded) => {
        if (!cancelled) setIndex(loaded);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load FDA reference catalog");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { index, error, ready: Boolean(index) };
}
