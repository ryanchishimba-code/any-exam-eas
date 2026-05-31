"use client";

import { useEffect, useState } from "react";
import {
  loadReturningUserHint,
  touchReturningVisit,
  type ReturningUserHint,
} from "@/lib/client/returning-user";

/** Shared returning-user hint — loaded once on mount for instant UI. */
export function useReturningUserHint(): ReturningUserHint | null {
  const [hint, setHint] = useState<ReturningUserHint | null>(null);

  useEffect(() => {
    setHint(loadReturningUserHint());
    touchReturningVisit();
  }, []);

  return hint;
}
