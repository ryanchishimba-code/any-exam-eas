/** Tesla-flat question bank tokens — hairline borders, solid CTAs, no glow. */
export const qbUi = {
  page: "question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 overflow-x-hidden pb-10",
  surface:
    "rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))]",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--qb-muted,var(--color-ink-muted))]",
  title:
    "text-[26px] font-semibold tracking-[-0.035em] text-[var(--qb-ink,var(--color-ink))] sm:text-[30px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--qb-muted,var(--color-ink-muted))]",
  sectionTitle:
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--qb-muted,var(--color-ink-muted))]",
  sectionHint: "text-[12px] leading-relaxed text-[var(--qb-muted,var(--color-ink-muted))]",
  statPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--qb-surface,var(--color-surface))] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--qb-muted,var(--color-ink-muted))]",
  segmentTrack:
    "inline-flex w-full rounded-xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-surface,var(--color-surface))] p-1 sm:w-auto",
  segmentBtn:
    "flex-1 rounded-lg px-4 py-2 text-[12px] font-semibold text-[var(--qb-muted,var(--color-ink-muted))] transition sm:flex-none sm:min-w-[7rem]",
  segmentBtnActive:
    "bg-[var(--qb-card,var(--color-surface-elevated))] text-[var(--qb-ink,var(--color-ink))] border border-[var(--qb-line,var(--color-border))]/60",
  chipRow:
    "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] text-[var(--qb-ink,var(--color-ink))] hover:border-[var(--color-accent)]/35",
  chipActive: "border-transparent bg-[var(--color-accent)] text-white",
  listSurface:
    "divide-y divide-[var(--qb-line,var(--color-border))]/70 overflow-hidden rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))]",
  listRow:
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--qb-surface,var(--color-surface))]/70",
  listRowSelected: "bg-[var(--color-accent)]/[0.06]",
  searchInput:
    "w-full rounded-xl border border-[var(--qb-line,var(--color-border))]/50 bg-[var(--qb-card,var(--color-surface-elevated))] py-2 pl-9 pr-4 text-[13px] text-[var(--qb-ink,var(--color-ink))] outline-none transition placeholder:text-[var(--qb-muted,var(--color-ink-muted))] focus:border-[var(--color-accent)]/35",
  stickyBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))]/98 p-4 backdrop-blur-md lg:static lg:border-[var(--qb-line,var(--color-border))]/80 lg:bg-[var(--qb-card,var(--color-surface-elevated))] lg:backdrop-blur-none",
  exploreGrid: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
  exploreLink:
    "group flex items-center gap-3 rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] px-3.5 py-3 text-left transition hover:border-[var(--color-accent)]/35 hover:bg-[var(--qb-surface,var(--color-surface))]/50",
  exploreLinkActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06]",
  optionCard:
    "rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] px-3.5 py-3 text-left transition hover:border-[var(--color-accent)]/35 active:scale-[0.99]",
  optionCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06]",
  modeCard:
    "flex min-w-[9rem] shrink-0 snap-start flex-col rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] p-3.5 text-left transition hover:border-[var(--color-accent)]/35 active:scale-[0.99]",
  modeCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06]",
  primaryBtn:
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-[14px] font-semibold text-white shadow-[var(--qb-cta-shadow,0_1px_2px_rgba(15,23,42,0.08))] transition hover:opacity-95 hover:shadow-[var(--qb-cta-shadow-hover,0_2px_8px_rgba(15,23,42,0.12))] active:scale-[0.98] disabled:opacity-50",
  ghostBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] px-3 py-2 text-[12px] font-semibold text-[var(--qb-ink,var(--color-ink))] transition hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)]",
  switchExam:
    "inline-flex items-center gap-1.5 rounded-xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] px-3 py-2 text-[12px] font-semibold text-[var(--qb-muted,var(--color-ink-muted))] transition hover:border-[var(--color-accent)]/35 hover:text-[var(--qb-ink,var(--color-ink))]",
  emptyState:
    "rounded-2xl border border-dashed border-[var(--qb-line,var(--color-border))]/90 bg-[var(--qb-surface,var(--color-surface))]/50 px-6 py-10 text-center text-[13px] text-[var(--qb-muted,var(--color-ink-muted))]",
  /** Legacy aliases */
  pageShell: "space-y-5",
  panel: "space-y-5",
  panelInner: "space-y-5",
  insetGroup:
    "overflow-hidden rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-surface,var(--color-surface))]",
  heroCard:
    "rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))] p-4 sm:p-5",
  startBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 rounded-2xl border border-[var(--qb-line,var(--color-border))]/80 bg-[var(--qb-card,var(--color-surface-elevated))]/98 p-4 backdrop-blur-md lg:static lg:backdrop-blur-none",
  startBtn:
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-[14px] font-semibold text-white shadow-[var(--qb-cta-shadow,0_1px_2px_rgba(15,23,42,0.08))] transition hover:opacity-95 hover:shadow-[var(--qb-cta-shadow-hover,0_2px_8px_rgba(15,23,42,0.12))] disabled:opacity-50",
} as const;
