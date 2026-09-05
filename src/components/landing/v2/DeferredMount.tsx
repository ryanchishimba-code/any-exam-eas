"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  /** Expand the intersection root so chunks prefetch slightly before scroll. */
  rootMargin?: string;
  className?: string;
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
    return () => io.disconnect();
  }, [ready, rootMargin]);

  return (
    <div ref={hostRef} className={className}>
      {ready ? children : fallback}
    </div>
  );
}
