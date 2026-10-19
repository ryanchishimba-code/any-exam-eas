import Link from "next/link";
import { BoardFeatureIcon } from "@/components/marketing/board-landing/BoardFeatureIcons";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";

function FeatureCard({ card }: { card: BoardFeatureCard }) {
  const className = `bl-feature-card${card.spotlight ? " bl-feature-card--spotlight" : ""}`;
  const content = (
    <>
      <span className="bl-feature-icon" aria-hidden>
        <BoardFeatureIcon id={card.icon} />
      </span>
      <h3>{card.title}</h3>
      <p>{card.line}</p>
    </>
  );
  if (card.href) {
    return (
      <li className="bl-feature-item">
        <Link href={card.href} className={className}>
          {content}
        </Link>
      </li>
    );
  }
  return (
    <li className="bl-feature-item">
      <div className={className}>{content}</div>
    </li>
  );
}

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
  const spotlight = cards.filter((card) => card.spotlight);
  const standard = cards.filter((card) => !card.spotlight);
  return (
    <section
      className={`bl-section bl-features${tight ? " bl-section--tight" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <h2 id={`${id}-heading`}>{heading}</h2>
      {spotlight.length > 0 ? (
        <ul className="bl-feature-spotlight">
          {spotlight.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </ul>
      ) : null}
      {standard.length > 0 ? (
        <ul className="bl-feature-grid">
          {standard.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
