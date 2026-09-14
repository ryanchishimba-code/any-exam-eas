import { formatMonthlyPrice, formatTrialLabel } from "@/lib/site";

const FRAMES = [
  {
    id: "roadmap",
    kicker: "Roadmap",
    title: "Weak areas, blueprint-weighted",
    caption: "Each session queues the domains you still miss — not a random dump.",
    rows: [
      { label: "Management of Care", pct: "72%", tone: "ok" as const },
      { label: "Pharm / Parenteral", pct: "41%", tone: "gap" as const },
      { label: "NGN judgment", pct: "38%", tone: "gap" as const },
    ],
  },
  {
    id: "deep-dive",
    kicker: "Deep Dive",
    title: "Miss → structured teaching",
    caption: "Wrong answers open an 8-section lesson, then send you back to practice.",
    rows: [
      { label: "1. Why this miss", pct: "Open", tone: "ok" as const },
      { label: "2. High-yield map", pct: "Open", tone: "ok" as const },
      { label: "3. Return to set", pct: "Next", tone: "gap" as const },
    ],
  },
  {
    id: "ngn",
    kicker: "Sample NGN",
    title: "Formats that match the sitting",
    caption: "Bow-tie, matrix, and SATA on the same bank you practice against.",
    rows: [
      { label: "Recognize cues", pct: "Case", tone: "ok" as const },
      { label: "Prioritize hypotheses", pct: "SATA", tone: "ok" as const },
      { label: "Take action", pct: "Bow-tie", tone: "gap" as const },
    ],
  },
] as const;

/**
 * Restrained in-product UI captures — not stock-photo students.
 * Styled after the live Roadmap / Deep Dive / NGN chrome.
 */
export function MarketingProductProof({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <section
      className={`aee-product-proof ${compact ? "aee-product-proof--compact" : ""}`}
      aria-labelledby="product-proof-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            The product, not a stock photo
          </p>
          <h2
            id="product-proof-heading"
            className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--color-ink)]"
          >
            Roadmap. Deep Dive. Sample NGN.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            {formatTrialLabel()} · no card · then {formatMonthlyPrice("pro")}/mo. These frames
            mirror the in-app study window.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3" role="list">
          {FRAMES.map((frame) => (
            <li key={frame.id}>
              <figure className="aee-product-proof__frame">
                <div className="aee-product-proof__chrome" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>
                <figcaption className="sr-only">
                  {frame.kicker}: {frame.title}
                </figcaption>
                <div className="aee-product-proof__body">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
                    {frame.kicker}
                  </p>
                  <p className="mt-1 text-sm font-bold tracking-tight text-slate-900">
                    {frame.title}
                  </p>
                  <ul className="mt-4 space-y-2" role="presentation">
                    {frame.rows.map((row) => (
                      <li
                        key={row.label}
                        className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3 py-2"
                      >
                        <span className="text-xs font-semibold text-slate-800">{row.label}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            row.tone === "gap"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-teal-50 text-teal-800"
                          }`}
                        >
                          {row.pct}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  {frame.caption}
                </p>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
