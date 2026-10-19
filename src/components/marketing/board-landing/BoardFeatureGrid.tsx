import { BoardFeatureIcon } from "@/components/marketing/board-landing/BoardFeatureIcons";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";

export function BoardFeatureGrid({
  heading = "Features",
  id = "features",
  cards,
  tight = false,
}: {
  heading?: string;
  id?: string;
  cards: BoardFeatureCard[];
  tight?: boolean;
}) {
  if (cards.length === 0) return null;
  return (
    <section
      className={`bl-section bl-features${tight ? " bl-section--tight" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`}>{heading}</h2>
      <ul className="bl-feature-grid">
        {cards.map((card) => (
          <li key={card.id} className="bl-feature-card">
            <span className="bl-feature-icon" aria-hidden>
              <BoardFeatureIcon id={card.icon} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
