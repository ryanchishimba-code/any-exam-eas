type ScrollTarget = Window | Document | HTMLElement;

/** Coalesce rapid scroll/resize work to one rAF per frame. */
export function rafThrottle<T extends (...args: never[]) => void>(fn: T): T {
  let frame = 0;
  const throttled = (...args: Parameters<T>) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...args);
    });
  };
  return throttled as T;
}

type PassiveScrollOptions = {
  capture?: boolean;
};

/**
 * Passive scroll listener with rAF coalescing — avoids blocking the compositor
 * and prevents setState storms during touch/wheel scrolling.
 */
export function addPassiveScrollListener(
  target: ScrollTarget,
  handler: () => void,
  options?: PassiveScrollOptions
): () => void {
  const onScroll = rafThrottle(handler);
  const capture = options?.capture ?? false;
  target.addEventListener("scroll", onScroll, { passive: true, capture });
  return () => target.removeEventListener("scroll", onScroll, capture);
}
