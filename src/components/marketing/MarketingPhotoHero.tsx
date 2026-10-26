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
  const srcSet = `${mobileAvif} 768w, ${desktopAvif} 1440w`;

  if (priority) {
    preload(mobileAvif, {
      as: "image",
      fetchPriority: "high",
      imageSrcSet: srcSet,
      imageSizes: "100vw",
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
      <img
        className="mkt-photo-hero__img"
        src={mobileAvif}
        srcSet={srcSet}
        sizes="100vw"
        alt=""
        width={768}
        height={432}
        fetchPriority={priority ? "high" : "auto"}
        decoding="sync"
      />
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner mkt-photo-hero__reveal">{children}</div>
    </section>
  );
}
