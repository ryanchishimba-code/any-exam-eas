/**
 * Shared calm tokens for study surfaces (High-Yield, Analytics).
 * Library uses libUi — keep these aligned for a consistent feel.
 */
export const studyUi = {
  page: "mx-auto w-full min-w-0 max-w-5xl space-y-5 overflow-x-hidden pb-10",
  surface:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]",
  title: "text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[26px]",
  subtitle: "text-[14px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[13px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[12px] leading-relaxed text-[var(--color-ink-muted)]",
  panel:
    "overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  panelPad: "p-4 sm:p-5",
  metricCard:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4",
  chartPanel:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4 sm:p-5",
  stickyBar:
    "sticky top-[calc(var(--nav-height)+0.35rem)] z-20 flex flex-col gap-2 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/85 p-2 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-lg sm:p-2.5",
  chipRow:
    "flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  filterPill:
    "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition active:scale-[0.98]",
  filterPillIdle:
    "border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]/20 hover:text-[var(--color-ink)]",
  filterPillActive: "border-transparent bg-[var(--color-accent)] text-white",
  searchInput:
    "w-full rounded-xl border border-transparent bg-[var(--color-surface-elevated)] py-2 pl-9 pr-9 text-[13px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)]/25",
  listSurface:
    "divide-y divide-[var(--color-border)]/60 overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  listRow:
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface)]/60",
  statPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]",
  primaryBtn:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]",
  ghostBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]",
  emptyState:
    "rounded-2xl border border-dashed border-[var(--color-border)]/80 bg-[var(--color-surface)]/50 px-6 py-10 text-center text-[13px] text-[var(--color-ink-muted)]",
  sheet:
    "absolute inset-y-0 right-0 flex h-full w-full max-w-2xl flex-col border-l border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] shadow-2xl",
  sheetHeader: "border-b border-[var(--color-border)]/60 px-4 py-4 sm:px-5",
  sheetFooter: "border-t border-[var(--color-border)]/60 bg-[var(--color-surface)]/40 px-4 py-4 sm:px-5",
} as const;
