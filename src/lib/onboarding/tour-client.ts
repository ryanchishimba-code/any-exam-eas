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

export function measureTourHole(el: HTMLElement, pad = 8, bottomInset = 0): TourHole {
  const style = window.getComputedStyle(el);
  const fixed = style.position === "fixed";
  const rect = el.getBoundingClientRect();
  const limit = window.innerHeight - Math.max(8, bottomInset);
  const inView = rect.top >= 8 && rect.bottom <= limit;
  if (!fixed && !inView) {
    el.scrollIntoView({ block: "center", inline: "nearest" });
  }
  const next = el.getBoundingClientRect();
  return {
    x: Math.max(8, next.left - pad),
    y: Math.max(8, next.top - pad),
    width: next.width + pad * 2,
    height: next.height + pad * 2,
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
