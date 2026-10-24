import type { BoardPainPoint } from "@/lib/marketing/board-landing/board-theme";

function PainIcon({ id }: { id: string }) {
  switch (id) {
    case "calc":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 8h8M8 12h3M13 12h3M8 16h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
          <path
            d="M4 18V8l8-4 8 4v10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "anatomy":
    case "msk":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
          <circle cx="12" cy="6" r="2.5" fill="currentColor" />
          <path d="M12 9v5M9 20l3-6 3 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "cost":
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v10M9.5 9.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2c0 2-5 1.5-5 4 0 1.2 1.1 2 2.5 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
          <path
            d="M12 3l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.5 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function BoardPainIcons({ points }: { points: BoardPainPoint[] }) {
  if (points.length === 0) return null;
  return (
    <section className="bl-pain-icons" aria-labelledby="bl-pain-icons-heading">
      <h2 id="bl-pain-icons-heading" className="sr-only">Common prep worries</h2>
      <ul className="bl-pain-icons__grid" role="list">
        {points.map((point) => (
          <li key={point.id}>
            <span className="bl-pain-icons__icon" aria-hidden>
              <PainIcon id={point.id} />
            </span>
            <span className="bl-pain-icons__label">{point.shortLabel}</span>
            <span className="sr-only">{point.fix}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
