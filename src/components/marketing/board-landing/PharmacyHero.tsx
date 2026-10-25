import { MarketingHeroActions } from "@/components/marketing/MarketingHeroActions";
import type { PharmacyHeroScene } from "@/lib/marketing/board-landing/pharmacy-case";

type PharmacyHeroProps = {
  hero: PharmacyHeroScene;
  trialHref: string;
  ctaName: string;
  ctaLocation: string;
  seeQuestionsHref: string;
};

/** Server-rendered pharmacy device. The Rx mark is decorative; the question is HTML. */
export function PharmacyHero({
  hero,
  trialHref,
  ctaName,
  ctaLocation,
  seeQuestionsHref,
}: PharmacyHeroProps) {
  return (
    <div className="bl-rx-scene">
      <article className="bl-rx" id="sample-question" aria-labelledby="naplex-calc-heading">
        <p className="bl-rx-mark" aria-hidden="true">
          Rx
        </p>
        <p className="bl-device-kicker">PharmD practice</p>
        <h2 id="naplex-calc-heading">{hero.kicker}</h2>
        <p>{hero.stem}</p>
        <ol>
          {hero.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ol>
      </article>

      <ul className="bl-float">
        <li>
          <p className="bl-float-kicker">Dosing calc</p>
          <p className="bl-float-score">{hero.keyedAnswer}</p>
          <p>{hero.work}</p>
        </li>
        {hero.monograph ? (
          <li className="bl-float-desktop">
            <p className="bl-float-kicker">Monograph</p>
            <p className="bl-rx-drug">
              {hero.monograph.generic}
              <span> · {hero.monograph.brand}</span>
            </p>
            <p>{hero.monograph.line}</p>
          </li>
        ) : null}
        <li>
          <p className="bl-float-kicker">Top drugs</p>
          <p className="bl-float-score">{hero.topDrugCount.toLocaleString("en-US")}</p>
          <p>high-yield drugs in the deck</p>
        </li>
      </ul>

      <MarketingHeroActions
        trialHref={trialHref}
        ctaName={ctaName}
        ctaLocation={ctaLocation}
        seeQuestionsHref={seeQuestionsHref}
        showFinishLineOffer
      />
    </div>
  );
}
