import { TOUR_LOCAL_KEY, TOUR_REPLAY_EVENT, TOUR_REPLAY_KEY } from "@/lib/onboarding/tour-record";
import type { TourViewport } from "@/lib/onboarding/first-login-tour";

export function readLocalTourSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(TOUR_LOCAL_KEY) != null;
  } catch {
    return false;
  }
}

export function writeLocalTourSeen(status: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TOUR_LOCAL_KEY,
      JSON.stringify({ status, at: new Date().toISOString() })
    );
  } catch {
    /* private mode */
  }
}

export function requestTourReplay(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(TOUR_REPLAY_KEY, "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(TOUR_REPLAY_EVENT));
}

/**
 * Replay intent survives the settings → dashboard navigation, including a
 * remount while the desktop shell is still streaming in. Cleared only once
 * the tour actually opens (or the open attempt gives up).
 */
export function peekTourReplay(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(TOUR_REPLAY_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearTourReplay(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(TOUR_REPLAY_KEY);
  } catch {
    /* ignore */
  }
}

export function tourViewport(): TourViewport {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "desktop";
  return window.matchMedia("(max-width: 1023px)").matches ? "mobile" : "desktop";
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}

function hiddenByAncestor(el: HTMLElement): boolean {
  let parent: HTMLElement | null = el;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden") return true;
    if (style.opacity === "0") return true;
    parent = parent.parentElement;
  }
  return false;
}

/**
 * Laid out and not hidden. Below-the-fold still counts: the spotlight scrolls
 * the target into view. `display: none` (closed sidebar, boards without a
 * study-guide link) does not.
 */
function isShownTourElement(el: HTMLElement): boolean {
  if (hiddenByAncestor(el)) return false;
  const rect = el.getBoundingClientRect();
  return rect.width >= 8 && rect.height >= 8;
}

export function isTourAnchorVisible(anchor: string): boolean {
  return findVisibleTourAnchor(anchor) != null;
}

export function findVisibleTourAnchor(anchor: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const nodes = document.querySelectorAll(`[data-tour="${cssEscape(anchor)}"]`);
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    if (!isShownTourElement(node)) continue;
    return node;
  }
  return null;
}

export type TourHole = { x: number; y: number; width: number; height: number };

/** Fixed header plus a little air, so a scrolled target is not hidden under the nav. */
export function tourScrollOffsetPx(): number {
  const fallback = 64;
  if (typeof window === "undefined") return fallback + 12;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--nav-height").trim();
  let header = fallback;
  if (raw.endsWith("rem")) {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) header = n * 16;
  } else if (raw.endsWith("px") || raw !== "") {
    const n = parseFloat(raw);
    if (Number.isFinite(n) && n > 0) header = n;
  }
  return Math.round(header + 12);
}

/**
 * Bring a tour target's top edge just under the fixed header.
 * Fixed chrome (mobile bottom bar) is already on screen.
 */
export function scrollTourAnchorIntoView(el: HTMLElement): void {
  const position = window.getComputedStyle(el).position;
  if (position === "fixed") return;
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.style.scrollMarginTop = `${tourScrollOffsetPx()}px`;
  el.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
    inline: "nearest",
  });
}

/** Visible slice of the target. A tall block must not produce a hole taller than the viewport. */
export function measureTourHole(el: HTMLElement, pad = 8, bottomInset = 0): TourHole {
  const rect = el.getBoundingClientRect();
  const limit = window.innerHeight - Math.max(pad, bottomInset);
  const top = Math.max(pad, rect.top);
  const bottom = Math.min(limit, rect.bottom);
  const left = Math.max(pad, rect.left);
  const right = Math.min(window.innerWidth - pad, rect.right);
  const visible = bottom - top >= 8 && right - left >= 8;
  if (!visible) {
    const y = Math.max(pad, Math.min(Math.max(rect.top, pad), limit - 24));
    return {
      x: Math.max(pad, rect.left - pad),
      y,
      width: Math.max(24, Math.min(rect.width + pad * 2, window.innerWidth - pad * 2)),
      height: Math.max(24, Math.min(rect.height + pad * 2, limit - y)),
    };
  }
  return {
    x: left - pad,
    y: top - pad,
    width: right - left + pad * 2,
    height: bottom - top + pad * 2,
  };
}

/** Dialogs, paywall modals, and the mobile drawer. The tour card itself is ignored. */
export function isTourBlockedByOverlay(): boolean {
  if (typeof document === "undefined") return false;
  const nodes = document.querySelectorAll(
    '[role="dialog"], [aria-modal="true"], [data-tour-block="true"]'
  );
  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;
    if (node.dataset.tourDialog === "true") continue;
    if (hiddenByAncestor(node)) continue;
    return true;
  }
  return false;
}

export async function persistTourStatus(body: {
  tour: string;
  status: "shown" | "completed" | "skipped";
  step: number;
  device: TourViewport;
}): Promise<void> {
  try {
    await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(body),
    });
  } catch {
    /* localStorage already prevents a same-browser replay */
  }
}
