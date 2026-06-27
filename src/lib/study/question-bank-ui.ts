/** Calm question bank tokens — aligned with library and dashboard UI. */
export const qbUi = {
  page: "question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 overflow-x-hidden pb-10",
  surface:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]",
  title: "text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[26px]",
  subtitle: "text-[14px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[13px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[12px] leading-relaxed text-[var(--color-ink-muted)]",
  statPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]",
  segmentTrack:
    "inline-flex w-full rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-1 sm:w-auto",
  segmentBtn:
    "flex-1 rounded-lg px-4 py-2 text-[12px] font-semibold text-[var(--color-ink-muted)] transition sm:flex-none sm:min-w-[7rem]",
  segmentBtnActive: "bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-sm",
  chipRow:
    "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] text-[var(--color-ink)] hover:border-[var(--color-accent)]/20",
  chipActive: "border-transparent bg-[var(--color-accent)] text-white",
  listSurface:
    "divide-y divide-[var(--color-border)]/60 overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  listRow:
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface)]/60",
  listRowSelected: "bg-[var(--color-accent)]/[0.06]",
  searchInput:
    "w-full rounded-xl border border-transparent bg-[var(--color-surface-elevated)] py-2 pl-9 pr-4 text-[13px] text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-accent)]/25",
  stickyBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]/95 p-4 shadow-sm backdrop-blur-lg lg:static lg:border-[var(--color-border)]/60 lg:bg-[var(--color-surface-elevated)] lg:backdrop-blur-none",
  exploreGrid: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
  exploreLink:
    "group flex items-center gap-3 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-3.5 py-3 text-left transition hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-surface)]/40",
  exploreLinkActive:
    "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] ring-1 ring-[var(--color-accent)]/15",
  optionCard:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-3.5 py-3 text-left transition hover:border-[var(--color-accent)]/20 active:scale-[0.99]",
  optionCardActive:
    "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] ring-1 ring-[var(--color-accent)]/15",
  modeCard:
    "flex min-w-[9rem] shrink-0 snap-start flex-col rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-3.5 text-left transition hover:border-[var(--color-accent)]/20 active:scale-[0.99]",
  modeCardActive:
    "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.06] ring-1 ring-[var(--color-accent)]/15",
  primaryBtn:
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50",
  ghostBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]",
  switchExam:
    "inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-ink)]",
  emptyState:
    "rounded-2xl border border-dashed border-[var(--color-border)]/80 bg-[var(--color-surface)]/50 px-6 py-10 text-center text-[13px] text-[var(--color-ink-muted)]",
  /** Legacy aliases */
  pageShell: "space-y-5",
  panel: "space-y-5",
  panelInner: "space-y-5",
  insetGroup:
    "overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]",
  heroCard:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4 sm:p-5",
  startBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]/95 p-4 shadow-sm backdrop-blur-lg lg:static lg:backdrop-blur-none",
  startBtn:
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50",
} as const;
