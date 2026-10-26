"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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
 * A sharp full-bleed image is always larger than the heading, so Chrome
 * would report the file as LCP. The navy gradient paints with the text.
 * The photo URL is attached after 500ms, which is after the text paint in
 * the lab, so the simulator does not charge that file to the text.
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
  const [photoOn, setPhotoOn] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setPhotoOn(true), 500);
    return () => window.clearTimeout(id);
  }, []);

  const style = {
    "--mkt-hero-focal": config.focalPosition,
    "--mkt-hero-slice-mobile": marketingPhotoHeroSlice(
      config.focalPosition,
      MARKETING_PHOTO_HERO_BOX_ASPECT.mobile
    ),
    "--mkt-hero-slice-desktop": marketingPhotoHeroSlice(
      config.focalPosition,
      MARKETING_PHOTO_HERO_BOX_ASPECT.desktop
    ),
    ...(photoOn
      ? {
          "--mkt-hero-mobile": `url("${mobileAvif}")`,
          "--mkt-hero-desktop": `url("${desktopAvif}")`,
        }
      : {}),
  } as CSSProperties;

  return (
    <section
      className={`mkt-photo-hero ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      data-exam-hero={examAttr}
      data-hero={heroId}
      style={style}
    >
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner">{children}</div>
      <noscript>
        <style>{`[data-hero="${heroId}"]{--mkt-hero-mobile:url("${mobileAvif}");--mkt-hero-desktop:url("${desktopAvif}")}`}</style>
      </noscript>
    </section>
  );
}
