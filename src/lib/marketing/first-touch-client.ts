"use client";

import {
  FIRST_TOUCH_COOKIE,
  FIRST_TOUCH_MAX_AGE_SEC,
  FUNNEL_EVENT_COOKIE,
  type FirstTouchAttribution,
  attributionFromSearch,
  decodeFirstTouch,
  encodeFirstTouch,
  externalReferrer,
  hasFirstTouch,
  mergeFirstTouch,
} from "@/lib/marketing/first-touch";

const STORAGE_KEY = FIRST_TOUCH_COOKIE;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    const prefix = `${name}=`;
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return undefined;
}

function writeCookie(name: string, value: string, maxAge: number): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function readClientFirstTouch(): FirstTouchAttribution {
  let fromStorage: FirstTouchAttribution = {};
  try {
    fromStorage = decodeFirstTouch(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    fromStorage = {};
  }
  const fromCookie = decodeFirstTouch(readCookie(FIRST_TOUCH_COOKIE));
  return mergeFirstTouch(fromCookie, fromStorage);
}

/** Store the first visit once. Later campaigns do not overwrite it. */
export function captureFirstTouch(pageUrl: string, referrer: string): FirstTouchAttribution {
  const existing = readClientFirstTouch();
  if (hasFirstTouch(existing)) {
    persistFirstTouch(existing);
    return existing;
  }
  const url = new URL(pageUrl);
  const captured = mergeFirstTouch(existing, {
    ...attributionFromSearch(url.search),
    referrer: externalReferrer(referrer, url.origin),
  });
  if (hasFirstTouch(captured)) persistFirstTouch(captured);
  return captured;
}

function persistFirstTouch(attr: FirstTouchAttribution): void {
  const encoded = encodeFirstTouch(attr);
  try {
    window.localStorage.setItem(STORAGE_KEY, encoded);
  } catch {
    /* private mode */
  }
  writeCookie(FIRST_TOUCH_COOKIE, encoded, FIRST_TOUCH_MAX_AGE_SEC);
}

export function consumeFunnelEventCookie(): string[] {
  const raw = readCookie(FUNNEL_EVENT_COOKIE);
  if (!raw) return [];
  writeCookie(FUNNEL_EVENT_COOKIE, "", 0);
  try {
    return decodeURIComponent(raw)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}
