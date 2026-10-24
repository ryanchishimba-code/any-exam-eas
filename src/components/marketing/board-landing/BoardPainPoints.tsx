import type { BoardPainPoint } from "@/lib/marketing/board-landing/board-theme";

export function BoardPainPoints({ points }: { points: BoardPainPoint[] }) {
  if (points.length === 0) return null;
  return (
    <section className="bl-pain" aria-labelledby="bl-pain-heading">
      <h2 id="bl-pain-heading">Built for what worries you</h2>
      <ul className="bl-pain__grid">
        {points.map((point) => (
          <li key={point.id}>
            <p className="bl-pain__worry">{point.worry}</p>
            <p className="bl-pain__fix">{point.fix}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
