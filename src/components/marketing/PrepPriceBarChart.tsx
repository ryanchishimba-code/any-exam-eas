import type { CSSProperties } from "react";
import type { PrepPriceBarChartData } from "@/lib/marketing/prep-price-bar-chart";

export function PrepPriceBarChart({ data }: { data: PrepPriceBarChartData }) {
  return (
    <section
      className="bl-prep-bars"
      aria-labelledby="bl-prep-bars-heading"
      aria-describedby="bl-prep-bars-alt"
    >
      <div className="bl-prep-bars__panel">
        <h2 id="bl-prep-bars-heading">{data.heading}</h2>
        {data.lede ? <p className="bl-prep-bars__lede">{data.lede}</p> : null}
        {data.saveLabel ? <p className="bl-prep-bars__save">{data.saveLabel}</p> : null}

        <ul className="bl-prep-bars__list" role="list">
          {data.bars.map((bar, index) => (
            <li key={bar.id} className="bl-prep-bars__row">
              <div className="bl-prep-bars__meta">
                <span className="bl-prep-bars__label">{bar.label}</span>
                <span
                  className={
                    bar.highlight ? "bl-prep-bars__amount bl-prep-bars__amount--ours" : "bl-prep-bars__amount"
                  }
                >
                  {bar.amountLabel}
                </span>
              </div>
              <div
                className="bl-prep-bars__track"
                role="img"
                aria-label={`${bar.label}: ${bar.amountLabel}. ${bar.sublabel}`}
              >
                <span
                  className={`bl-prep-bars__fill${bar.highlight ? " bl-prep-bars__fill--ours" : ""}`}
                  style={
                    {
                      "--bar-end": `${bar.fillPct}%`,
                      "--bar-delay": `${index * 70}ms`,
                    } as CSSProperties
                  }
                />
              </div>
              <p className="bl-prep-bars__sub">{bar.sublabel}</p>
            </li>
          ))}
        </ul>
      </div>
      <p id="bl-prep-bars-alt" className="bl-prep-bars__alt">{data.textAlternative}</p>
      <p className="bl-prep-bars__fine">Typical prep from public listings ({data.priceAsOf}). No vendor names.</p>
    </section>
  );
}
