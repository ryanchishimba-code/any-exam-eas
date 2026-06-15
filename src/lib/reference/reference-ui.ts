/** Apple-style surface tokens for the Reference Hub. */
export const refUi = {
  page: "reference-hub w-full min-w-0 max-w-full space-y-3 overflow-x-hidden sm:space-y-4",
  pageShell:
    "rounded-[20px] border border-black/[0.04] bg-gradient-to-b from-[#f5f5f7] to-[#eef0f4] p-0.5 sm:rounded-[28px] sm:p-1.5",
  panel:
    "min-w-0 overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl sm:rounded-[22px]",
  panelSection: "space-y-4 p-3 sm:space-y-5 sm:p-5 md:p-6",
  sectionDivider: "border-t border-black/[0.05]",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[26px]",
  subtitle: "text-[14px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] text-[var(--color-ink-muted)]",
  stickyBar:
    "sticky top-[calc(var(--nav-height)+0.25rem)] z-20 min-w-0 space-y-2.5 rounded-[16px] border border-black/[0.06] bg-white/90 p-2.5 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl sm:space-y-3 sm:rounded-[20px] sm:p-3",
  statPill:
    "inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[var(--color-ink)]",
  chipRow:
    "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-black/[0.06] bg-white text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:border-black/[0.1]",
  chipActive:
    "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  filterPill:
    "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
  cardGrid: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  cardCompact:
    "flex w-[min(280px,78vw)] shrink-0 snap-start flex-col rounded-[18px] border border-black/[0.06] bg-white p-4 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  emptyState:
    "rounded-[18px] border border-dashed border-black/[0.08] bg-black/[0.02] px-6 py-12 text-center",
} as const;
