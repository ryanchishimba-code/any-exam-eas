import type { CSSProperties, ReactNode } from "react";
import { preload } from "react-dom";
import {
  type MarketingPhotoHeroId,
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";
import "@/styles/marketing-photo-hero.css";

function preloadHeroArt(heroId: MarketingPhotoHeroId) {
  preload(marketingPhotoHeroSrc(heroId, "mobile", "avif"), {
    as: "image",
    fetchPriority: "high",
  });
  preload(marketingPhotoHeroSrc(heroId, "desktop", "avif"), {
    as: "image",
    fetchPriority: "high",
  });
}

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
  if (priority) {
    preloadHeroArt(heroId);
  }

  return (
    <section
      className={`mkt-photo-hero ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      data-exam-hero={examAttr}
      style={{ "--mkt-hero-focal": config.focalPosition } as CSSProperties}
    >
      <div className="mkt-photo-hero__media" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet={marketingPhotoHeroSrc(heroId, "mobile", "avif")}
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet={marketingPhotoHeroSrc(heroId, "mobile", "webp")}
          />
          <source type="image/avif" srcSet={marketingPhotoHeroSrc(heroId, "desktop", "avif")} />
          <source type="image/webp" srcSet={marketingPhotoHeroSrc(heroId, "desktop", "webp")} />
          <img
            className="mkt-photo-hero__img"
            src={marketingPhotoHeroSrc(heroId, "desktop", "webp")}
            alt=""
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            width={1440}
            height={810}
          />
        </picture>
      </div>
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner mkt-photo-hero__reveal">{children}</div>
    </section>
  );
}
