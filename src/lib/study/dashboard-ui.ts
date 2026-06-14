/** Apple-style surface tokens for the Dashboard. */
export const dbUi = {
  page: "dashboard-ui w-full space-y-4",
  pageShell:
    "rounded-[28px] border border-black/[0.04] bg-gradient-to-b from-[#f5f5f7] to-[#eef0f4] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelSection: "space-y-4 p-4 sm:p-5 md:p-6",
  sectionDivider: "border-t border-black/[0.05]",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[22px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[26px]",
  subtitle: "text-[14px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] text-[var(--color-ink-muted)]",
  statPill:
    "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/[0.04] px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[var(--color-ink)]",
  statPillHighlight:
    "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-[12px] font-semibold tabular-nums text-[var(--color-accent)]",
  chipRow:
    "flex gap-2.5 overflow-x-auto pb-0.5 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  actionCard:
    "flex w-[min(240px,82vw)] shrink-0 snap-start flex-col rounded-[18px] border border-black/[0.06] bg-white p-4 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  actionCardWide:
    "flex w-[min(300px,88vw)] shrink-0 snap-start flex-col rounded-[18px] border border-black/[0.06] bg-white p-4 text-left shadow-[var(--shadow-apple-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] active:scale-[0.99]",
  exploreRow: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  exploreLink:
    "group flex items-center gap-3 rounded-[16px] border border-black/[0.06] bg-black/[0.02] px-3.5 py-3 transition hover:border-[var(--color-accent)]/25 hover:bg-white hover:shadow-[var(--shadow-apple-sm)] active:scale-[0.995]",
  listRow:
    "flex items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-[14px] transition hover:bg-black/[0.03]",
  insetGroup: "overflow-hidden rounded-[16px] border border-black/[0.05] bg-black/[0.02]",
  switchExam:
    "inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--color-ink-muted)] transition hover:border-black/[0.12] hover:text-[var(--color-ink)]",
} as const;
