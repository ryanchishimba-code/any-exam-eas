import type { CSSProperties } from "react";
import type { NclexNgnTypeRow } from "@/lib/marketing/board-landing/nclex-ngn-type-chart";
import { formatNgnTypeCount } from "@/lib/marketing/board-landing/nclex-ngn-type-chart";

export function NclexNgnTypeChart({ rows }: { rows: NclexNgnTypeRow[] }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((row) => row.count));

  return (
    <section className="bl-ngn-types" aria-labelledby="nclex-ngn-types-heading">
      <h2 id="nclex-ngn-types-heading">Live NGN item types</h2>
      <ul className="bl-ngn-types__list" role="list">
        {rows.map((row, index) => {
          const pct = max > 0 ? Math.max(10, Math.round((row.count / max) * 100)) : 10;
          return (
            <li key={row.id} className="bl-ngn-types__row">
              <div className="bl-ngn-types__meta">
                <span className="bl-ngn-types__label">{row.label}</span>
                <span className="bl-ngn-types__count">{formatNgnTypeCount(row.count)}</span>
              </div>
              <div
                className="bl-ngn-types__track"
                role="img"
                aria-label={`${row.label}: ${formatNgnTypeCount(row.count)} live items`}
              >
                <span
                  className="bl-ngn-types__fill"
                  style={
                    {
                      "--bar-end": `${pct}%`,
                      "--bar-delay": `${index * 60}ms`,
                    } as CSSProperties
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
