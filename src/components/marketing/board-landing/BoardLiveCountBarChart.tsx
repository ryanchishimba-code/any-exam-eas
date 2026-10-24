import type { CSSProperties } from "react";
import type { HubLiveBarRow } from "@/lib/marketing/board-landing/hub-live-bar-chart";
import { formatHubLiveBarCount } from "@/lib/marketing/board-landing/hub-live-bar-chart";

export function BoardLiveCountBarChart({
  heading,
  headingId,
  rows,
}: {
  heading: string;
  headingId: string;
  rows: HubLiveBarRow[];
}) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((row) => row.count));

  return (
    <section className="bl-ngn-types" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <ul className="bl-ngn-types__list" role="list">
        {rows.map((row, index) => {
          const pct = max > 0 ? Math.max(10, Math.round((row.count / max) * 100)) : 10;
          return (
            <li key={row.id} className="bl-ngn-types__row">
              <div className="bl-ngn-types__meta">
                <span className="bl-ngn-types__label">{row.label}</span>
                <span className="bl-ngn-types__count">{formatHubLiveBarCount(row.count)}</span>
              </div>
              <div
                className="bl-ngn-types__track"
                role="img"
                aria-label={`${row.label}: ${formatHubLiveBarCount(row.count)} live items`}
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
