import { BoardHeroFoot } from "@/components/marketing/board-landing/BoardHeroFoot";
import { MarketingHeroActions } from "@/components/marketing/MarketingHeroActions";
import {
  MarketingPhotoHero,
  MarketingPhotoHeroCopy,
} from "@/components/marketing/MarketingPhotoHero";
import {
  BOARD_LANDING_HERO_QUIZ_HREF,
  type BoardHeroTestimonial,
} from "@/lib/marketing/board-landing/board-hero-marketing";
import type { MarketingPhotoHeroId } from "@/lib/marketing/marketing-photo-heroes";
import type { ReactNode } from "react";

export type BoardLandingHeroProps = {
  photoHeroId: MarketingPhotoHeroId;
  headline: string;
  subline: string;
  trialHref: string;
  heroCtaName: string;
  heroCtaLocation: string;
  testimonial: BoardHeroTestimonial | null;
  proofFacts: readonly string[];
  boardName: string;
  /** Bands that sit on the photo, ending before the features section. */
  trail?: ReactNode;
};

export function BoardLandingHero({
  photoHeroId,
  headline,
  subline,
  trialHref,
  heroCtaName,
  heroCtaLocation,
  testimonial,
  proofFacts,
  boardName,
  trail,
}: BoardLandingHeroProps) {
  return (
    <>
      <MarketingPhotoHero
        heroId={photoHeroId}
        ariaLabelledBy="board-hero-heading"
        foot={
          <BoardHeroFoot
            testimonial={testimonial}
            proofFacts={proofFacts}
            boardName={boardName}
          />
        }
      >
        <MarketingPhotoHeroCopy
          headingId="board-hero-heading"
          title={headline}
          subline={subline}
          actions={
            <MarketingHeroActions
              trialHref={trialHref}
              ctaName={heroCtaName}
              ctaLocation={heroCtaLocation}
              seeQuestionsHref={BOARD_LANDING_HERO_QUIZ_HREF}
              className="mkt-photo-hero__actions"
            />
          }
        />
      </MarketingPhotoHero>
      {trail}
    </>
  );
}
