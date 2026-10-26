import Link from "next/link";
import { BoardFeatureIcon } from "@/components/marketing/board-landing/BoardFeatureIcons";
import type { BoardFeatureCard } from "@/lib/marketing/board-landing/board-features";

function shortFeatureTitle(title: string): string {
  const words = title.split(/\s+/);
  if (words.length <= 4) return title;
  return words.slice(0, 3).join(" ");
}

function FeatureCard({ card, visual }: { card: BoardFeatureCard; visual: boolean }) {
  const className = `bl-feature-card${card.spotlight ? " bl-feature-card--spotlight" : ""}${visual ? " bl-feature-card--visual" : ""}`;
  const body = (
    <>
      <span className="bl-feature-icon" aria-hidden>
        <BoardFeatureIcon id={card.icon} />
      </span>
      <h3>{visual ? shortFeatureTitle(card.title) : card.title}</h3>
      {visual ? <span className="sr-only">{card.line}</span> : <p>{card.line}</p>}
    </>
  );
  return (
    <li className="bl-feature-item">
      {card.href ? (
        <Link href={card.href} prefetch={false} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  );
}

export function BoardFeatureGrid({
  heading = "Features",
  id = "features",
  cards,
  tight = false,
  visual = false,
}: {
  heading?: string;
  id?: string;
  cards: BoardFeatureCard[];
  tight?: boolean;
  visual?: boolean;
}) {
  if (cards.length === 0) return null;
  const spotlight = cards.filter((card) => card.spotlight);
  const standard = cards.filter((card) => !card.spotlight);
  return (
    <section
      className={`bl-section bl-features${tight ? " bl-section--tight" : ""}${visual ? " bl-features--visual" : ""}`}
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      {visual ? <h2 id={`${id}-heading`} className="sr-only">{heading}</h2> : <h2 id={`${id}-heading`}>{heading}</h2>}
      {spotlight.length > 0 ? (
        <ul className="bl-feature-spotlight">
          {spotlight.map((card) => (
            <FeatureCard key={card.id} card={card} visual={visual} />
          ))}
        </ul>
      ) : null}
      {standard.length > 0 ? (
        <ul className="bl-feature-grid">
          {standard.map((card) => (
            <FeatureCard key={card.id} card={card} visual={visual} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
