import { boardStatStripFigures } from "@/lib/marketing/board-landing/stat-strip";

export function BoardStatStrip({
  stats,
  label,
}: {
  stats: { value: string; label: string }[];
  label: string;
}) {
  const figures = boardStatStripFigures(stats);
  if (figures.length === 0) return null;

  return (
    <section className="bl-stat-strip" aria-label={label}>
      <dl className="bl-stat-strip__grid">
        {figures.map((figure) => (
          <div key={figure.label} className="bl-stat-strip__cell">
            <dt>{figure.label}</dt>
            <dd>{figure.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
