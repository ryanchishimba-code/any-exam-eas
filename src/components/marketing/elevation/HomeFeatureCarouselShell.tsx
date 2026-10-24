"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type HomeFeatureCarouselShellProps = {
  trackId: string;
  slideCount: number;
  children: ReactNode;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HomeFeatureCarouselShell({
  trackId,
  slideCount,
  children,
}: HomeFeatureCarouselShellProps) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<HTMLElement[]>([]);

  const syncSlideRefs = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      slideRefs.current = [];
      return;
    }
    slideRefs.current = Array.from(
      track.querySelectorAll<HTMLElement>("[data-home-feature-slide]")
    );
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slides = slideRefs.current;
    if (!track || slides.length === 0) return;
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    const target = slides[clamped];
    if (!target) return;
    const trackRect = track.getBoundingClientRect();
    const slideRect = target.getBoundingClientRect();
    const delta =
      slideRect.left + slideRect.width / 2 - (trackRect.left + trackRect.width / 2);
    track.scrollBy({
      left: delta,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || slideCount === 0) return;

    syncSlideRefs();

    const updateCentered = () => {
      const slides = slideRefs.current;
      if (slides.length === 0) return;
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < slides.length; i++) {
        const rect = slides[i]!.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const dist = Math.abs(slideCenter - centerX);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      for (let i = 0; i < slides.length; i++) {
        slides[i]!.classList.toggle("is-centered", i === bestIdx);
      }
      setActiveIndex(bestIdx);
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        () => {
          updateCentered();
        },
        { root: track, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      for (const slide of slideRefs.current) {
        observer.observe(slide);
      }
    }

    track.addEventListener("scroll", updateCentered, { passive: true });
    updateCentered();

    return () => {
      track.removeEventListener("scroll", updateCentered);
      observer?.disconnect();
    };
  }, [slideCount, syncSlideRefs]);

  const onTrackKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    scrollToIndex(activeIndex + delta);
  };

  const assignTrackRef = (node: HTMLUListElement | null) => {
    trackRef.current = node;
    if (node) {
      syncSlideRefs();
    }
  };

  return (
    <div className="home-feature-wheel__chrome">
      <button
        type="button"
        className="home-feature-wheel__arrow home-feature-wheel__arrow--prev"
        aria-label="Previous feature"
        aria-controls={trackId}
        disabled={activeIndex <= 0}
        onClick={() => scrollToIndex(activeIndex - 1)}
      />
      <div className="home-feature-wheel__track-wrap">
        <ul
          ref={assignTrackRef}
          id={trackId}
          className="home-feature-wheel__track"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Product features"
          onKeyDown={onTrackKeyDown}
        >
          {children}
        </ul>
      </div>
      <button
        type="button"
        className="home-feature-wheel__arrow home-feature-wheel__arrow--next"
        aria-label="Next feature"
        aria-controls={trackId}
        disabled={activeIndex >= slideCount - 1}
        onClick={() => scrollToIndex(activeIndex + 1)}
      />
      <div
        className="home-feature-wheel__dots"
        role="tablist"
        aria-label="Choose feature"
      >
        {Array.from({ length: slideCount }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            className="home-feature-wheel__dot"
            aria-label={`Feature ${i + 1} of ${slideCount}`}
            aria-selected={i === activeIndex}
            tabIndex={i === activeIndex ? 0 : -1}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
