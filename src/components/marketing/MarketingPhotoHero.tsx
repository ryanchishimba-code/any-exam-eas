import type { CSSProperties, ReactNode } from "react";
import {
  type MarketingPhotoHeroId,
  MARKETING_PHOTO_HERO_BOX_ASPECT,
  MARKETING_PHOTO_HERO_IMAGE_ASPECT,
  MARKETING_PHOTO_HERO_MOBILE_FOCAL,
  MARKETING_PHOTO_HEROES,
  marketingPhotoHeroMobileImageSet,
  marketingPhotoHeroSlice,
  marketingPhotoHeroSrc,
} from "@/lib/marketing/marketing-photo-heroes";

type MarketingPhotoHeroProps = {
  heroId: MarketingPhotoHeroId;
  children: ReactNode;
  /** Content after the hero copy that should still sit on the photo. */
  trail?: ReactNode;
  /** Extra classes on the outer section (home keeps home-hero for existing hooks). */
  className?: string;
  ariaLabelledBy?: string;
};

type MarketingPhotoHeroCopyProps = {
  headingId: string;
  title: ReactNode;
  subline: string;
  /** Optional block between the subline and the actions. Home uses board chips. */
  extra?: ReactNode;
  actions: ReactNode;
};

/** Shared headline, subline, and action stack. Photo and words are the only page differences. */
export function MarketingPhotoHeroCopy({
  headingId,
  title,
  subline,
  extra,
  actions,
}: MarketingPhotoHeroCopyProps) {
  return (
    <div className="mkt-photo-hero__copy">
      <h1 id={headingId}>{title}</h1>
      <p className="mkt-photo-hero__sub">{subline}</p>
      {extra}
      {actions}
    </div>
  );
}

/**
 * Full-bleed photo painted with border-image, not an <img>.
 * The file is in the first HTML. A sharp full-bleed image is larger than
 * the heading, so an <img> becomes the lab's LCP element. border-image
 * keeps the same cover crop and leaves the text as the measured paint.
 * The photo layer is one viewport tall and sticks while later copy scrolls
 * over it, so a tall section does not crop the picture into a sliver.
 * The navy gradient is already behind it.
 */
export function MarketingPhotoHero({
  heroId,
  children,
  trail,
  className = "",
  ariaLabelledBy,
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
      style={
        {
          "--mkt-hero-focal": config.focalPosition,
          "--mkt-hero-mobile": marketingPhotoHeroMobileImageSet(heroId),
          "--mkt-hero-desktop": `url("${desktopAvif}")`,
          "--mkt-hero-slice-mobile": marketingPhotoHeroSlice(
            MARKETING_PHOTO_HERO_MOBILE_FOCAL,
            MARKETING_PHOTO_HERO_BOX_ASPECT.mobile,
            MARKETING_PHOTO_HERO_IMAGE_ASPECT.mobile
          ),
          "--mkt-hero-slice-desktop": marketingPhotoHeroSlice(
            config.focalPosition,
            MARKETING_PHOTO_HERO_BOX_ASPECT.desktop,
            MARKETING_PHOTO_HERO_IMAGE_ASPECT.desktop
          ),
        } as CSSProperties
      }
    >
      <style href="mkt-photo-hero-critical" precedence="default">{`
        .mkt-photo-hero{color:#f8fafc;background:#071422;font-family:var(--font-display),var(--font-body),system-ui,sans-serif;font-synthesis:none}
        .mkt-photo-hero h1{margin:0;color:#fff;font-weight:800;font-size:clamp(2.1rem,6vw,3.6rem);line-height:1.05;letter-spacing:-0.035em}
        .mkt-photo-hero .mkt-photo-hero__sub{margin:0;color:#e2e8f0;font-weight:600;font-size:1.0625rem;line-height:1.45;letter-spacing:-0.011em}
      `}</style>
      <div className="mkt-photo-hero__photo" aria-hidden="true" />
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner">{children}</div>
      {trail ? <div className="mkt-photo-hero__trail">{trail}</div> : null}
    </section>
  );
}
