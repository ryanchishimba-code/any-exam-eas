import type { CSSProperties } from "react";
import type { NclexCompareChartData } from "@/lib/marketing/board-landing/nclex-compare-chart";

export function NclexLandingCompareChart({ data }: { data: NclexCompareChartData }) {
  if (data.bars.length === 0) return null;

  return (
    <section
      className="bl-nclex-chart"
      aria-labelledby="bl-nclex-chart-heading"
      aria-describedby="bl-nclex-chart-alt"
    >
      <div className="bl-nclex-chart__panel">
        <h2 id="bl-nclex-chart-heading">{data.heading}</h2>
        {data.lede ? <p className="bl-nclex-chart__lede">{data.lede}</p> : null}

        <ul className="bl-nclex-chart__bars" role="list">
          {data.bars.map((bar, index) => (
            <li key={bar.id} className="bl-nclex-chart__row">
              <div className="bl-nclex-chart__meta">
                <span className="bl-nclex-chart__label">{bar.label}</span>
                <span
                  className={
                    bar.highlight ? "bl-nclex-chart__amount bl-nclex-chart__amount--ours" : "bl-nclex-chart__amount"
                  }
                >
                  {bar.amountLabel}
                </span>
              </div>
              <div
                className="bl-nclex-chart__track"
                role="img"
                aria-label={`${bar.label}: ${bar.amountLabel}. ${bar.sublabel}`}
              >
                <span
                  className={`bl-nclex-chart__fill${bar.highlight ? " bl-nclex-chart__fill--ours" : ""}`}
                  style={
                    {
                      "--bar-end": `${bar.fillPct}%`,
                      "--bar-delay": `${index * 80}ms`,
                    } as CSSProperties
                  }
                />
              </div>
              <p className="bl-nclex-chart__sub">{bar.sublabel}</p>
            </li>
          ))}
        </ul>
      </div>

      <p id="bl-nclex-chart-alt" className="bl-nclex-chart__alt">{data.textAlternative}</p>
      <p className="bl-nclex-chart__fine">
        Bar lengths scale to internal serve targets for layout only—not a competitor comparison.
      </p>
    </section>
  );
}
