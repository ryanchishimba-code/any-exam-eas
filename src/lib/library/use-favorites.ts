"use client";

import { useEffect, useMemo, useState } from "react";
import { FAVORITE_CHANGE_EVENT, readFavorites, toggleFavorite } from "./favorites";
import type { ExamSlug } from "@/types/edtech";

/** Client favorites state for an exam, kept in sync across the page. */
export function useFavorites(examSlug: ExamSlug) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(readFavorites(examSlug));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ examSlug: ExamSlug }>).detail;
      if (detail?.examSlug === examSlug) setFavoriteIds(readFavorites(examSlug));
    };
    window.addEventListener(FAVORITE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(FAVORITE_CHANGE_EVENT, onChange);
  }, [examSlug]);

  const set = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  return {
    favoriteIds,
    isFavorite: (id: string) => set.has(id),
    toggle: (id: string) => toggleFavorite(examSlug, id),
  };
}
