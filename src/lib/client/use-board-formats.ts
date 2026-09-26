"use client";

import { useEffect, useState } from "react";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import { scrubPublicFormatCopy } from "@/lib/marketing/public-format-copy";

type BoardFormatMap = Record<string, FormatCounts>;

let inflight: Promise<BoardFormatMap> | null = null;

function fetchBoardFormats(): Promise<BoardFormatMap> {
  if (!inflight) {
    inflight = fetch("/api/marketing/bank-counts", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const boards = (data?.inventory?.boards ?? {}) as Record<
          string,
          { formats?: FormatCounts }
        >;
        const map: BoardFormatMap = {};
        for (const [slug, board] of Object.entries(boards)) {
          if (board?.formats) map[slug] = board.formats;
        }
        return map;
      })
      .catch(() => ({}));
  }
  return inflight;
}

/** Null until the public inventory responds. */
export function useBoardFormatMap(): BoardFormatMap | null {
  const [formats, setFormats] = useState<BoardFormatMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchBoardFormats().then((map) => {
      if (!cancelled) setFormats(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return formats;
}

/** Null until the public inventory responds. Callers must not advertise formats meanwhile. */
export function useBoardFormats(slug: string | null | undefined): FormatCounts | null {
  const [formats, setFormats] = useState<FormatCounts | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void fetchBoardFormats().then((map) => {
      if (cancelled) return;
      setFormats(map[slug] ?? { mcq: 0, ngn: 0, case: 0 });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return formats;
}

export function useScrubbedBoardCopy(slug: string | null | undefined, text: string): string {
  const formats = useBoardFormats(slug);
  return scrubPublicFormatCopy(text, formats) ?? "";
}
