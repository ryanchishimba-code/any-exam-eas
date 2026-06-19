/** Apple-style surface tokens for the Library — theme-aware via CSS variables. */
export const libUi = {
  page: "library-hub w-full min-w-0 max-w-full space-y-3 overflow-x-hidden sm:space-y-4",
  pageShell:
    "rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5 sm:rounded-[28px] sm:p-1.5",
  panel:
    "min-w-0 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)] backdrop-blur-xl sm:rounded-[22px]",
  panelSection: "space-y-4 p-3 sm:space-y-5 sm:p-5 md:p-6",
  sectionDivider: "border-t border-[var(--color-border)]",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] text-[var(--color-ink-muted)]",
  stickyBar:
    "sticky top-[calc(var(--nav-height)+0.25rem)] z-20 min-w-0 space-y-2.5 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 p-2.5 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl sm:space-y-3 sm:rounded-[20px] sm:p-3",
  statPill:
    "inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[var(--color-ink)]",
  chipRow:
    "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:border-[var(--color-accent)]/20",
  chipActive:
    "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  filterPill:
    "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
  cardGrid: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  cardCompact:
    "flex w-[min(280px,78vw)] shrink-0 snap-start flex-col rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  emptyState:
    "rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center",
} as const;
