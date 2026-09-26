import type { BoardInventoryPresentation } from "@/lib/inventory/active-questions";
import type { LandingSuccessStory } from "@/lib/landing/content";
import {
  TRUST_PASS_PATH,
  TRUST_PASS_PATH_COPY,
  TRUST_READINESS_LINE,
  citedSampleForBoard,
  testimonialsForBoard,
  trustInventoryForPresentation,
} from "@/lib/marketing/why-trust-it";
import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

type Props = {
  examKey: ExamSeoKey;
  /** Same presentation the board page already computed. Null when inventory failed. */
  inventory?: BoardInventoryPresentation | null;
  /**
   * Admin-approved testimonials only. The section stays empty when this is
   * empty — Ryan supplies real quotes; we do not ship stand-ins.
   */
  testimonials?: LandingSuccessStory[];
};

/**
 * Compact, board-generic proof. Every number and quotation is passed in or
 * read from the public sample item. No pass rates, user counts, or expert names.
 */
export function WhyTrustIt({ examKey, inventory, testimonials }: Props) {
  const config = getExamSeoConfig(examKey);
  const bank = trustInventoryForPresentation(examKey, inventory);
  const sample = citedSampleForBoard(examKey, inventory?.formats);
  const quotes = testimonialsForBoard(testimonials, examKey);
  const categories =
    inventory?.countSource === "active-inventory" ? inventory.categories : [];

  return (
    <section
      className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface)] py-12 sm:py-14"
      aria-labelledby={`${examKey}-why-trust`}
      data-why-trust={examKey}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Credible proof
        </p>
        <h2
          id={`${examKey}-why-trust`}
          className="mt-3 text-[clamp(1.6rem,3vw,2.15rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
        >
          Why trust it
        </h2>

        <ul className="mt-8 grid gap-4 lg:grid-cols-3" role="list">
          <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
            <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              What is in the bank
            </h3>
            {bank.line ? (
              <p
                className="mt-3 text-base font-semibold tabular-nums tracking-[-0.02em] text-[var(--color-ink)]"
                data-trust-inventory
                data-count-source={inventory?.countSource}
              >
                {bank.line}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]" data-trust-inventory>
                {bank.definition ??
                  "The live format split is unavailable, so this page does not show a made-up count."}
              </p>
            )}
            {bank.line && bank.definition ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {bank.definition}
              </p>
            ) : null}
            {categories.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2" role="list" aria-label={inventory?.categoryLabel}>
                {categories.slice(0, 6).map((category) => (
                  <li
                    key={category.id}
                    className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium tabular-nums text-[var(--color-ink)]"
                  >
                    {category.label}{" "}
                    <span className="text-[var(--color-ink-muted)]">
                      {category.count.toLocaleString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>

          <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
            <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              Rationales name a source
            </h3>
            {sample ? (
              <figure className="mt-3">
                <blockquote className="text-sm leading-relaxed text-[var(--color-ink)]">
                  {sample.rationale}
                </blockquote>
                <figcaption className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  <span className="font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
                    Source
                  </span>
                  {" · "}
                  <cite className="not-italic" data-trust-citation>
                    {sample.citation}
                  </cite>
                  <span className="mt-1 block">
                    Sample {sample.boardLabel} item. The citation is the one stored on that question.
                  </span>
                </figcaption>
              </figure>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {`${config.shortName} public samples do not store a citation on the demo item yet, so this block does not invent one. Served rationales show a source when the item has one.`}
              </p>
            )}
          </li>

          <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5">
            <h3 className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              How the pass path works
            </h3>
            <ol className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm font-medium text-[var(--color-ink)]">
              {TRUST_PASS_PATH.map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span aria-hidden className="text-[var(--color-ink-muted)]">
                      →
                    </span>
                  ) : null}
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {TRUST_PASS_PATH_COPY}
            </p>
            <p className="mt-3 text-sm font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
              {TRUST_READINESS_LINE}
            </p>
          </li>
        </ul>

        {quotes.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list" aria-label="Approved testimonials">
            {quotes.slice(0, 2).map((quote) => (
              <li
                key={`${quote.name}-${quote.exam}`}
                className="rounded-2xl border border-[var(--color-border)] px-4 py-4"
              >
                <p className="text-sm leading-relaxed text-[var(--color-ink)]">“{quote.quote}”</p>
                <p className="mt-2 text-xs font-medium text-[var(--color-ink-muted)]">
                  {quote.name} · {quote.exam}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
