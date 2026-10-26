import type { CSSProperties, ReactNode } from "react";
import {
  type MarketingPhotoHeroId,
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";
import "@/styles/marketing-photo-hero.css";

type MarketingPhotoHeroProps = {
  heroId: MarketingPhotoHeroId;
  children: ReactNode;
  /** Extra classes on the outer section (e.g. home-hero, bl-hero--single). */
  className?: string;
  ariaLabelledBy?: string;
  priority?: boolean;
};

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

  return (
    <>
      {priority ? (
        <>
          <link rel="preload" as="image" href={mobileAvif} type="image/avif" fetchPriority="high" />
          <link
            rel="preload"
            as="image"
            href={desktopAvif}
            type="image/avif"
            fetchPriority="high"
            media="(min-width: 768px)"
          />
        </>
      ) : null}
      <section
        className={`mkt-photo-hero ${className}`.trim()}
        aria-labelledby={ariaLabelledBy}
        data-exam-hero={examAttr}
        data-hero={heroId}
        style={{ "--mkt-hero-focal": config.focalPosition } as CSSProperties}
      >
        <div className="mkt-photo-hero__media" aria-hidden="true" />
        <div className="mkt-photo-hero__scrim" aria-hidden="true" />
        <div className="mkt-photo-hero__inner mkt-photo-hero__reveal">{children}</div>
      </section>
    </>
  );
}
