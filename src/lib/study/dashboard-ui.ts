/** Calm dashboard tokens — Apple Health clarity + soft accent balance. */
export const dbUi = {
  page: "dashboard-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 overflow-x-hidden pb-12 sm:space-y-6",
  surface:
    "rounded-3xl border border-[var(--db-line,var(--color-border))]/70 bg-[var(--db-card,var(--color-surface-elevated))] shadow-[var(--shadow-apple-sm)]",
  /** Graphic-first hero — ring + domain map + one CTA. */
  heroSurface:
    "apple-animate-in rounded-3xl border border-[var(--db-line,var(--color-border))]/70 bg-[var(--db-card,var(--color-surface-elevated))] p-5 shadow-[var(--shadow-apple-sm)] sm:p-7",
  heroLayout:
    "flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-9",
  sparkTrack:
    "h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]/55",
  sparkBar: "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
  statusPill:
    "inline-flex items-center gap-1 rounded-full border border-[var(--color-border)]/50 bg-[var(--color-surface)]/80 px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)] backdrop-blur-sm",
  statusPillAccent:
    "inline-flex items-center gap-1 rounded-full border border-[var(--color-accent)]/15 bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--color-accent)]",
  weakChip:
    "inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-border)]/55 bg-[var(--db-card,var(--color-surface-elevated))] px-3.5 py-2 text-[12px] font-medium text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]",
  title:
    "text-[26px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[32px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[13px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[12px] leading-relaxed text-[var(--color-ink-muted)]",
  statPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)]/80 px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]",
  statPillHighlight:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--color-accent)]",
  listSurface:
    "divide-y divide-[var(--color-border)]/50 overflow-hidden rounded-3xl border border-[var(--color-border)]/55 bg-[var(--db-card,var(--color-surface-elevated))] shadow-[var(--shadow-apple-sm)]",
  listRow:
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface)]/55",
  exploreGrid: "grid gap-2.5 sm:grid-cols-2",
  exploreLink:
    "group flex items-center gap-3 rounded-3xl border border-[var(--color-border)]/55 bg-[var(--db-card,var(--color-surface-elevated))] px-4 py-3.5 shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/25 hover:bg-[var(--color-surface)]/40",
  primaryBtn:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-[14px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:opacity-95 active:scale-[0.98]",
  ghostBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)]/90 px-3.5 py-2 text-[12px] font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]",
  switchExam:
    "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)]/90 px-3.5 py-2 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-ink)]",
  /** Legacy tokens — used by SubscriberHome quick-start panel. */
  pageShell:
    "rounded-3xl border border-[var(--color-border)]/55 bg-[var(--color-surface)] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-3xl border border-[var(--color-border)]/55 bg-[var(--db-card,var(--color-surface-elevated))] shadow-[var(--shadow-apple-sm)]",
  panelSection: "space-y-4 p-4 sm:p-5",
  sectionDivider: "border-t border-[var(--color-border)]/50",
  chipRow:
    "flex gap-2.5 overflow-x-auto pb-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  actionCard:
    "flex w-[min(240px,82vw)] shrink-0 snap-start flex-col rounded-3xl border border-[var(--color-border)]/55 bg-[var(--db-card,var(--color-surface-elevated))] p-4 text-left shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/20 active:scale-[0.99]",
} as const;
