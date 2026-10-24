import type { BoardLandingVisuals } from "@/lib/marketing/board-landing/board-theme";

function TypeIcon({ id }: { id: string }) {
  switch (id) {
    case "matrix":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <rect x="4" y="6" width="24" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 14h24M4 22h24M12 6v20M20 6v20" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        </svg>
      );
    case "bowtie":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <path
            d="M6 16 L14 8 L14 24 L6 16 Z M26 16 L18 8 L18 24 L26 16 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        </svg>
      );
    case "highlight":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <rect x="5" y="10" width="22" height="4" rx="1" fill="currentColor" opacity="0.35" />
          <rect x="5" y="18" width="14" height="4" rx="1" fill="currentColor" opacity="0.2" />
          <path d="M6 8h20M6 24h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "drag":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <rect x="6" y="8" width="10" height="6" rx="1.5" fill="currentColor" opacity="0.25" stroke="currentColor" />
          <rect x="16" y="18" width="10" height="6" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M11 14v4M21 18v-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "vignette":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <path d="M8 6h16a2 2 0 012 2v16l-4-3-4 3-4-3-4 3-4-3V8a2 2 0 012-2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "calc":
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <rect x="7" y="5" width="18" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11h10M11 16h6M11 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden>
          <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 16l3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function BoardLandingInfographics({
  visuals,
  hidePriceBars = false,
}: {
  visuals: BoardLandingVisuals;
  hidePriceBars?: boolean;
}) {
  const maxBar = 100;
  const ours = 27.99;
  const rangeParts = visuals.typicalRange.replace(/\$/g, "").split("–");
  const highTypical = Number.parseFloat(rangeParts[rangeParts.length - 1]?.replace(/,/g, "") ?? "299");
  const oursWidth = Math.max(12, Math.round((ours / highTypical) * maxBar));
  const typicalWidth = maxBar;

  return (
    <section className="bl-visuals" aria-labelledby="bl-visuals-heading">
      <h2 id="bl-visuals-heading" className="bl-visuals__sr">Prep at a glance</h2>

      {hidePriceBars ? null : (
      <div className="bl-visuals__price" aria-label="Monthly Pro price compared with typical prep spend">
        <div className="bl-visuals__price-head">
          <span className="bl-visuals__price-label">AnyExamEasy Pro</span>
          <span className="bl-visuals__price-ours">{visuals.proPrice}</span>
        </div>
        <div className="bl-visuals__bar-wrap">
          <div className="bl-visuals__bar bl-visuals__bar--ours" style={{ width: `${oursWidth}%` }}>
            <span>Pro</span>
          </div>
        </div>
        <div className="bl-visuals__price-head bl-visuals__price-head--typical">
          <span className="bl-visuals__price-label">Typical {visuals.typicalPeriod}</span>
          <span className="bl-visuals__price-typical">{visuals.typicalRange}</span>
        </div>
        <div className="bl-visuals__bar-wrap">
          <div className="bl-visuals__bar bl-visuals__bar--typical" style={{ width: `${typicalWidth}%` }}>
            <span>Typical prep</span>
          </div>
        </div>
      </div>
      )}

      <ol className="bl-visuals__steps" aria-label="Practice, review, and pass">
        {visuals.steps.map((step, index) => (
          <li key={step.id}>
            <span className="bl-visuals__step-num" aria-hidden>{index + 1}</span>
            <div>
              <p className="bl-visuals__step-label">{step.label}</p>
              <p className="bl-visuals__step-detail">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {visuals.liveCount ? (
        <p className="bl-visuals__badge" aria-label={`${visuals.liveCount} live questions in the bank`}>
          <span className="bl-visuals__badge-dot" aria-hidden />
          {visuals.liveCount} live questions
        </p>
      ) : null}

      {visuals.questionTypes.length > 0 ? (
        <ul className="bl-visuals__types" aria-label="Question formats in the live bank">
          {visuals.questionTypes.map((type) => (
            <li key={type.id}>
              <span className="bl-visuals__type-icon">
                <TypeIcon id={type.id} />
              </span>
              <span>{type.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {visuals.showPracticeDevice ? (
        <div className="bl-visuals__device" aria-hidden>
          <div className="bl-device-chrome">
            <span className="bl-device-cam" />
            <span className="bl-device-speaker" />
          </div>
          <div className="bl-visuals__device-screen">
            <p className="bl-device-kicker">Practice UI</p>
            <p className="bl-visuals__device-stem">Stem, choices, and rationales—same layout as study mode.</p>
            <div className="bl-visuals__device-options">
              <span />
              <span className="is-keyed" />
              <span />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
