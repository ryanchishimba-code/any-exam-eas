import type { BoardInventoryPresentation } from "@/lib/inventory/active-questions";

type Props = {
  presentation: BoardInventoryPresentation;
};

/**
 * Format and Client Needs / blueprint breakdown for a board hub.
 * Uses the same active-question inventory as the Qbank header.
 */
export function BoardActiveInventory({ presentation }: Props) {
  const showCategories = presentation.categories.length > 0;
  const showFormat = Boolean(presentation.formatLine);
  if (
    presentation.countSource !== "active-inventory" ||
    (!showCategories && !showFormat && !presentation.scopeNote)
  ) {
    return null;
  }

  return (
    <section
      className="border-b border-[var(--color-border)]/40 bg-[var(--color-surface)] py-8"
      aria-label="Active question inventory"
      data-count-source={presentation.countSource}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Active bank
        </p>
        {showFormat ? (
          <p className="mt-3 text-base font-semibold tabular-nums text-[var(--color-ink)]">
            {presentation.formatLine}
          </p>
        ) : null}
        {presentation.scopeNote ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {presentation.scopeNote}
          </p>
        ) : null}
        {showCategories ? (
          <>
            <h2 className="mt-5 text-sm font-semibold text-[var(--color-ink)]">
              {presentation.categoryLabel}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2" role="list">
              {presentation.categories.map((category) => (
                <li
                  key={category.id}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1 text-xs font-medium tabular-nums text-[var(--color-ink)]"
                >
                  {category.label}{" "}
                  <span className="text-[var(--color-ink-muted)]">
                    {category.count.toLocaleString("en-US")}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
