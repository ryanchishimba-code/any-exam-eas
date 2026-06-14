/** Shared Apple-style surface tokens for Question Bank UI. */
export const qbUi = {
  page: "question-bank-ui space-y-5",
  pageShell:
    "rounded-[28px] border border-black/[0.04] bg-gradient-to-b from-[#f5f5f7] to-[#eef0f4] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelInner: "space-y-5 p-4 sm:p-5 md:p-6",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] leading-relaxed text-[var(--color-ink-muted)]",
  stepLabel:
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/12 text-[11px] font-bold text-[var(--color-accent)]",
  segmentTrack:
    "inline-flex w-full rounded-[14px] bg-black/[0.05] p-1 sm:w-auto",
  segmentBtn:
    "flex-1 rounded-[11px] px-4 py-2 text-[13px] font-semibold text-[var(--color-ink-muted)] transition-all duration-200 sm:flex-none sm:min-w-[7.5rem]",
  segmentBtnActive:
    "bg-white text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]",
  chipRow: "flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  chip:
    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border-black/[0.06] bg-white text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:border-black/[0.1]",
  chipActive:
    "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  insetGroup: "overflow-hidden rounded-[16px] bg-black/[0.03]",
  listItem:
    "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] transition active:scale-[0.995]",
  listItemSelected: "bg-[var(--color-accent)] text-white",
  listItemIdle: "text-[var(--color-ink)] hover:bg-white/70",
  searchInput:
    "w-full rounded-[14px] border-0 bg-black/[0.04] py-2.5 pl-10 pr-4 text-[15px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-muted)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]",
  heroCard:
    "relative overflow-hidden rounded-[20px] border border-black/[0.05] bg-white p-4 shadow-[var(--shadow-apple-sm)] sm:p-5",
  modeCard:
    "flex min-w-[9.5rem] shrink-0 snap-start flex-col rounded-[18px] border border-black/[0.06] bg-white p-3.5 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  modeCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/25",
  startBar:
    "sticky bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] z-20 -mx-1 rounded-[20px] border border-black/[0.06] bg-white/90 p-3 shadow-[var(--shadow-apple-md)] backdrop-blur-xl lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none",
  startBtn:
    "h-12 w-full rounded-full text-[15px] font-semibold shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
} as const;
