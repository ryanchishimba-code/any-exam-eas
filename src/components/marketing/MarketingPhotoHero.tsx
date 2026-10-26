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
  /** Anchored to the bottom of the viewport-tall photo. Board hubs only. */
  foot?: ReactNode;
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
  foot,
  trail,
  className = "",
  ariaLabelledBy,
}: MarketingPhotoHeroProps) {
  const config = MARKETING_PHOTO_HEROES[heroId];
  const examAttr = heroId === "home" || heroId === "daily" ? undefined : heroId;
  const desktopAvif = marketingPhotoHeroSrc(heroId, "desktop", "avif");
  // The daily photo is applied after first paint. A full-bleed image that
  // finishes before the heading is still charged to the lab LCP, even though
  // border-image is not the painted element.
  const deferPhoto = heroId === "daily";
  const mobileImage = marketingPhotoHeroMobileImageSet(heroId);
  const desktopImage = `url("${desktopAvif}")`;

  return (
    <section
      className={`mkt-photo-hero ${className}`.trim()}
      aria-labelledby={ariaLabelledBy}
      data-exam-hero={examAttr}
      data-hero={heroId}
      data-mkt-mobile={deferPhoto ? mobileImage : undefined}
      data-mkt-desktop={deferPhoto ? desktopImage : undefined}
      style={
        {
          "--mkt-hero-focal": config.focalPosition,
          "--mkt-hero-mobile": deferPhoto ? undefined : mobileImage,
          "--mkt-hero-desktop": deferPhoto ? undefined : desktopImage,
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
        .mkt-hero-foot{position:absolute;z-index:3;left:0;right:0;bottom:1rem;height:9.75rem}
        .mkt-hero-foot__slot{width:min(1120px,calc(100% - 2rem));height:100%;margin-inline:auto}
        .mkt-hero-foot__card{box-sizing:border-box;height:100%;max-width:40rem;overflow:hidden}
        .mkt-photo-hero:has(.mkt-hero-foot) .mkt-photo-hero__inner{padding-bottom:calc(9.75rem + 1.35rem)}
        @media (min-width:768px){
          .mkt-hero-foot{height:8rem;bottom:1.25rem}
          .mkt-photo-hero:has(.mkt-hero-foot) .mkt-photo-hero__inner{padding-bottom:calc(8rem + 1.5rem)}
        }
      `}</style>
      <div className="mkt-photo-hero__photo" aria-hidden="true" />
      {deferPhoto ? (
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){function a(){var h=document.querySelector(\'[data-hero="daily"]\');if(!h)return;var m=h.getAttribute("data-mkt-mobile");var d=h.getAttribute("data-mkt-desktop");if(m)h.style.setProperty("--mkt-hero-mobile",m);if(d)h.style.setProperty("--mkt-hero-desktop",d);h.classList.add("is-photo")}setTimeout(a,400);setTimeout(a,1200)})();',
          }}
        />
      ) : null}
      <div className="mkt-photo-hero__scrim" aria-hidden="true" />
      <div className="mkt-photo-hero__inner">{children}</div>
      {foot}
      {trail ? <div className="mkt-photo-hero__trail">{trail}</div> : null}
    </section>
  );
}
