/** Calm dashboard tokens — aligned with library and study-ui. */
export const dbUi = {
  page: "dashboard-ui mx-auto w-full min-w-0 max-w-5xl space-y-4 overflow-x-hidden pb-10",
  surface:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  /** Graphic-first hero — one composition for ring + sparks + CTA. */
  heroSurface:
    "apple-animate-in rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4 sm:p-6",
  heroLayout:
    "flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8",
  sparkTrack:
    "h-1.5 overflow-hidden rounded-full bg-[var(--color-border)]/70",
  sparkBar: "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
  statusPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]",
  statusPillAccent:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--color-accent)]",
  weakChip:
    "inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/30 hover:text-[var(--color-accent)]",
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]",
  title: "text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[26px]",
  subtitle: "text-[14px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[13px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[12px] leading-relaxed text-[var(--color-ink-muted)]",
  statPill:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-ink-muted)]",
  statPillHighlight:
    "inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[var(--color-accent)]",
  listSurface:
    "divide-y divide-[var(--color-border)]/60 overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  listRow:
    "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface)]/60",
  exploreGrid: "grid gap-2 sm:grid-cols-2",
  exploreLink:
    "group flex items-center gap-3 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-3.5 py-3 transition hover:border-[var(--color-accent)]/20 hover:bg-[var(--color-surface)]/40",
  primaryBtn:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-[0.98]",
  ghostBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]",
  switchExam:
    "inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface-elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-ink)]",
  /** Legacy tokens — used by SubscriberHome quick-start panel. */
  pageShell:
    "rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)]",
  panelSection: "space-y-4 p-4 sm:p-5",
  sectionDivider: "border-t border-[var(--color-border)]/60",
  chipRow:
    "flex gap-2.5 overflow-x-auto pb-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  actionCard:
    "flex w-[min(240px,82vw)] shrink-0 snap-start flex-col rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] p-4 text-left transition hover:border-[var(--color-accent)]/20 active:scale-[0.99]",
} as const;
