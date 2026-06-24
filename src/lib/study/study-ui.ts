/**
 * Shared Apple-style tokens for study surfaces (Library, High-Yield, Analytics).
 * Theme-aware via CSS variables — keep dashboard tokens in dashboard-ui.ts.
 */
export const studyUi = {
  page: "w-full min-w-0 space-y-4 sm:space-y-6",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] text-[var(--color-ink-muted)]",
  panel:
    "overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]",
  panelPad: "p-5 sm:p-6",
  stickyBar:
    "sticky top-[calc(var(--nav-height)+0.25rem)] z-20 min-w-0 space-y-2.5 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 p-2.5 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl sm:space-y-3 sm:rounded-[20px] sm:p-3",
  chipRow:
    "flex flex-wrap gap-2 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  filterPill:
    "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition active:scale-[0.98]",
  filterPillIdle:
    "border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)] hover:border-[var(--color-accent)]/20 hover:text-[var(--color-ink)]",
  filterPillActive:
    "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  metricCard:
    "rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)]",
  chartPanel:
    "rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] sm:p-6",
  emptyState:
    "rounded-[18px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center text-sm text-[var(--color-ink-muted)]",
  searchInput:
    "w-full rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-3 pl-11 pr-4 text-[15px] shadow-[var(--shadow-apple-sm)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20",
} as const;
