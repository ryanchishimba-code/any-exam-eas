import type { CSSProperties } from "react";
import type { NclexCompareChartData } from "@/lib/marketing/board-landing/nclex-compare-chart";

export function NclexLandingCompareChart({ data }: { data: NclexCompareChartData }) {
  return (
    <section
      className="bl-nclex-chart"
      aria-labelledby="bl-nclex-chart-heading"
      aria-describedby="bl-nclex-chart-alt"
    >
      <div className="bl-nclex-chart__panel">
        <p className="bl-nclex-chart__kicker">Compare prep spend</p>
        <h2 id="bl-nclex-chart-heading">{data.heading}</h2>
        <p className="bl-nclex-chart__lede">{data.lede}</p>

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
                {bar.rangePct ? (
                  <span
                    className="bl-nclex-chart__fill bl-nclex-chart__fill--range"
                    style={
                      {
                        "--bar-end": `${Math.min(bar.fillPct + bar.rangePct, 100)}%`,
                        "--bar-delay": `${index * 80}ms`,
                      } as CSSProperties
                    }
                  />
                ) : null}
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

        <svg className="bl-nclex-chart__accent" viewBox="0 0 400 48" aria-hidden preserveAspectRatio="none">
          <defs>
            <linearGradient id="bl-nclex-chart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--bl-teal)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--bl-accent, #14b8a6)" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <path
            d="M0 40 Q100 8 200 28 T400 18 L400 48 L0 48 Z"
            fill="url(#bl-nclex-chart-grad)"
          />
        </svg>
      </div>

      <p id="bl-nclex-chart-alt" className="bl-nclex-chart__alt">
        {data.textAlternative}
      </p>
      <p className="bl-nclex-chart__fine">
        Typical prep figures are from public listings ({data.priceAsOf}). AnyExamEasy is not affiliated with other
        prep providers. Bar lengths for live counts are scaled to internal serve targets for layout only — not a
        competitor comparison.
      </p>
    </section>
  );
}
