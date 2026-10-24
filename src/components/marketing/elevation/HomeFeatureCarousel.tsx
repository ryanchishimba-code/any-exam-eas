import { BoardFeatureIcon } from "@/components/marketing/board-landing/BoardFeatureIcons";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";
import { homeFeatureShortTitle } from "@/lib/marketing/home-feature-title";
import { HomeFeatureCarouselShell } from "@/components/marketing/elevation/HomeFeatureCarouselShell";

const TRACK_ID = "home-feature-wheel-track";

function orderedHomeFeatures(cards: BoardFeatureCard[]): BoardFeatureCard[] {
  const spotlight = cards.filter((card) => card.spotlight);
  const standard = cards.filter((card) => !card.spotlight);
  return [...spotlight, ...standard];
}

export function HomeFeatureCarousel({ cards }: { cards: BoardFeatureCard[] }) {
  if (cards.length === 0) return null;
  const ordered = orderedHomeFeatures(cards);

  return (
    <section
      className="home-feature-wheel bl-section bl-section--tight"
      id="features"
      aria-labelledby="features-heading"
    >
      <h2 id="features-heading">Features</h2>
      <HomeFeatureCarouselShell trackId={TRACK_ID} slideCount={ordered.length}>
        {ordered.map((card, index) => (
          <li
            key={card.id}
            className="home-feature-wheel__slide"
            data-home-feature-slide
            data-index={index}
          >
            <article
              className={`home-feature-wheel__card bl-feature-card${card.spotlight ? " bl-feature-card--spotlight" : ""}`}
            >
              <span className="bl-feature-icon" aria-hidden>
                <BoardFeatureIcon id={card.icon} />
              </span>
              <h3>{homeFeatureShortTitle(card.title)}</h3>
              <p className="sr-only">{card.line}</p>
            </article>
          </li>
        ))}
      </HomeFeatureCarouselShell>
    </section>
  );
}
