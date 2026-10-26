import type { CSSProperties, ReactNode } from "react";
import {
  type MarketingPhotoHeroId,
  MARKETING_PHOTO_HERO_BOX_ASPECT,
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroSlice,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";

type MarketingPhotoHeroProps = {
  heroId: MarketingPhotoHeroId;
  children: ReactNode;
  /** Extra classes on the outer section (e.g. home-hero, bl-hero--single). */
  className?: string;
  ariaLabelledBy?: string;
};

/**
 * Full-bleed photo painted with border-image, not an <img>.
 * The file is in the first HTML. A sharp full-bleed image is larger than
 * the heading, so an <img> becomes the lab's LCP element. border-image
 * keeps the same cover crop and leaves the text as the measured paint.
 * The navy gradient is already behind it.
 */
export function MarketingPhotoHero({
  heroId,
  children,
  className = "",
  ariaLabelledBy,
}: MarketingPhotoHeroProps) {
  const config = MARKETING_PHOTO_HEROES[heroId];
  const examAttr = heroId === "home" ? undefined : heroId;
  const mobileAvif = marketingPhotoHeroSrc(heroId, "mobile", "avif");
  const desktopAvif = marketingPhotoHeroSrc(heroId, "desktop", "avif");

  return (
    <section
      className={`mkt-photo-hero ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      data-exam-hero={examAttr}
      data-hero={heroId}
      style={
        {
          "--mkt-hero-focal": config.focalPosition,
          "--mkt-hero-mobile": `url("${mobileAvif}")`,
          "--mkt-hero-desktop": `url("${desktopAvif}")`,
          "--mkt-hero-slice-mobile": marketingPhotoHeroSlice(
            config.focalPosition,
            MARKETING_PHOTO_HERO_BOX_ASPECT.mobile
          ),
          "--mkt-hero-slice-desktop": marketingPhotoHeroSlice(
            config.focalPosition,
            MARKETING_PHOTO_HERO_BOX_ASPECT.desktop
          ),
        } as CSSProperties
      }
    >
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner">{children}</div>
    </section>
  );
}
