"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  /** Expand the intersection root so chunks prefetch slightly before scroll. */
  rootMargin?: string;
  className?: string;
  /**
   * Always mount after this many ms even if never near the viewport.
   * Prevents empty skeleton bands when IO is slow/missed (hash jumps, tall ATF).
   */
  maxWaitMs?: number;
};

/**
 * Keep below-fold dynamic imports off the network until near the viewport.
 * Children must not mount before `ready` — that is what defers `next/dynamic` chunks.
 */
export function DeferredMount({
  children,
  fallback,
  rootMargin = "280px 0px",
  className,
  maxWaitMs = 1800,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || ready) return;

    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);

    const timer =
      maxWaitMs > 0
        ? window.setTimeout(() => {
            setReady(true);
            io.disconnect();
          }, maxWaitMs)
        : undefined;

    return () => {
      io.disconnect();
      if (timer != null) window.clearTimeout(timer);
    };
  }, [ready, rootMargin, maxWaitMs]);

  return (
    <div ref={hostRef} className={className}>
      {ready ? children : fallback}
    </div>
  );
}
