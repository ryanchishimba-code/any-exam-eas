import type { CSSProperties, ReactNode } from "react";
import { marketingPhotoHeroMobileDataUri } from "@/lib/marketing/marketing-photo-hero-inline";
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
 * Full-bleed photo. The mobile AVIF is inlined so it paints with the headline
 * (a separate image request was the LCP gap). Desktop keeps the larger file
 * via a media source. The photo is decorative — no text is baked into it.
 * It is not faded in: hiding it delays LCP.
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
  const desktopAvif = marketingPhotoHeroSrc(heroId, "desktop", "avif");

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
          src={marketingPhotoHeroMobileDataUri(heroId)}
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
