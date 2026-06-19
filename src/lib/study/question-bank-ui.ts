/** Shared Apple-style surface tokens for Question Bank UI — theme-aware via CSS variables. */
export const qbUi = {
  page: "question-bank-ui space-y-5",
  pageShell:
    "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelInner: "space-y-5 p-4 sm:p-5 md:p-6",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] leading-relaxed text-[var(--color-ink-muted)]",
  stepLabel:
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/12 text-[11px] font-bold text-[var(--color-accent)]",
  segmentTrack:
    "inline-flex w-full rounded-[14px] bg-[var(--color-surface)] p-1 sm:w-auto",
  segmentBtn:
    "flex-1 rounded-[11px] px-4 py-2 text-[13px] font-semibold text-[var(--color-ink-muted)] transition-all duration-200 sm:flex-none sm:min-w-[7.5rem]",
  segmentBtnActive:
    "bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]",
  chipRow: "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:border-[var(--color-accent)]/20",
  chipActive:
    "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  insetGroup: "overflow-hidden rounded-[16px] bg-[var(--color-surface)]",
  listItem:
    "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] transition active:scale-[0.995]",
  listItemSelected: "bg-[var(--color-accent)] text-white",
  listItemIdle: "text-[var(--color-ink)] hover:bg-[var(--color-surface-elevated)]/70",
  searchInput:
    "w-full rounded-[14px] border-0 bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-[15px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-muted)] focus:bg-[var(--color-surface-elevated)] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]",
  heroCard:
    "relative overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-[var(--shadow-apple-sm)] sm:p-5",
  modeCard:
    "flex min-w-[9.5rem] shrink-0 snap-start flex-col rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3.5 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  modeCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/25",
  startBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 -mx-1 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 p-3 shadow-[var(--shadow-apple-md)] backdrop-blur-xl lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
  startBtn:
    "h-12 w-full rounded-full text-[15px] font-semibold shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
} as const;
