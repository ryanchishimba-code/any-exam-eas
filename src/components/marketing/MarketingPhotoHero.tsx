import type { CSSProperties, ReactNode } from "react";
import { preload } from "react-dom";
import {
  type MarketingPhotoHeroId,
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";

type MarketingPhotoHeroProps = {
  heroId: MarketingPhotoHeroId;
  children: ReactNode;
  /** Extra classes on the outer section (e.g. home-hero, bl-hero--single). */
  className?: string;
  ariaLabelledBy?: string;
  priority?: boolean;
};

/**
 * Full-bleed photo. Mobile uses one AVIF URL (preloaded as that exact URL)
 * so the lab doesn't wait on a srcset mismatch. Wider screens get the larger
 * file. The photo is decorative and paints immediately — fading it delays LCP.
 */
export function MarketingPhotoHero({
  heroId,
  children,
  className = "",
  ariaLabelledBy,
  priority = true,
}: MarketingPhotoHeroProps) {
  const config = MARKETING_PHOTO_HEROES[heroId];
  const examAttr = heroId === "home" ? undefined : heroId;
  const mobileAvif = marketingPhotoHeroSrc(heroId, "mobile", "avif");
  const desktopAvif = marketingPhotoHeroSrc(heroId, "desktop", "avif");

  if (priority) {
    preload(mobileAvif, {
      as: "image",
      fetchPriority: "high",
      type: "image/avif",
      media: "(max-width: 767px)",
    });
  }

  return (
    <section
      className={`mkt-photo-hero ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      data-exam-hero={examAttr}
      data-hero={heroId}
      style={{ "--mkt-hero-focal": config.focalPosition } as CSSProperties}
    >
      <picture className="mkt-photo-hero__picture">
        <source media="(min-width: 768px)" srcSet={desktopAvif} type="image/avif" />
        <img
          className="mkt-photo-hero__img"
          src={mobileAvif}
          alt=""
          width={768}
          height={432}
          fetchPriority={priority ? "high" : "auto"}
          decoding="sync"
        />
      </picture>
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner">{children}</div>
    </section>
  );
}
