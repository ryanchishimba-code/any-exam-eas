"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  boardFromPathname,
  boardFromSearchParams,
  boardIntentPathAction,
  clearBoardIntentCookieValue,
  rememberBoardIntent,
} from "@/lib/auth/board-intent";

/**
 * Remembers the board on a landing, guide, quiz, or pricing-with-board page
 * so signup and sign-in still see it after an OAuth or email round trip.
 * Home and other generic pages clear it. Login and signup keep it.
 */
export function BoardIntentBeacon() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  useEffect(() => {
    const board = boardFromSearchParams(searchParams) ?? boardFromPathname(pathname);
    if (board) {
      rememberBoardIntent(board);
      return;
    }
    if (boardIntentPathAction(pathname) === "keep") return;
    document.cookie = clearBoardIntentCookieValue();
  }, [pathname, searchParams]);

  return null;
}
