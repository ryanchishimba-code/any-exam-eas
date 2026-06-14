/** Shared Apple-style surface tokens for Anatomy Explorer UI. */
export const anatomyUi = {
  page: "anatomy-explorer space-y-5",
  pageBg:
    "rounded-[28px] border border-black/[0.04] bg-gradient-to-b from-[#f5f5f7] to-[#eef0f4] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/90 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelElevated:
    "overflow-hidden rounded-[22px] border border-black/[0.06] bg-white shadow-[var(--shadow-apple-md)]",
  glass:
    "rounded-full border border-white/60 bg-white/75 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  heroTitle: "text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]",
  heroSubtitle: "mt-1 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  sectionLabel:
    "text-[13px] font-semibold text-[var(--color-ink)]",
  sectionHint: "text-[12px] text-[var(--color-ink-muted)]",
  searchInput:
    "w-full rounded-[14px] border-0 bg-black/[0.04] py-2.5 pl-10 pr-10 text-[15px] text-[var(--color-ink)] outline-none ring-0 placeholder:text-[var(--color-ink-muted)] focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]",
  select:
    "w-full appearance-none rounded-[14px] border border-black/[0.06] bg-black/[0.03] py-2.5 pl-3 pr-9 text-[15px] text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.18)]",
  insetGroup: "overflow-hidden rounded-[16px] bg-black/[0.03]",
  listItem:
    "flex w-full flex-col items-start gap-0.5 rounded-[12px] px-3 py-2.5 text-left text-[15px] transition active:scale-[0.99]",
  listItemSelected: "bg-[var(--color-accent)] text-white shadow-sm",
  listItemHover: "hover:bg-white/80",
  chip:
    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border border-black/[0.06] bg-white/90 text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:bg-white",
  chipActive: "border-transparent bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]",
  segmentTrack: "inline-flex rounded-[12px] bg-black/[0.05] p-0.5",
  segmentBtn:
    "rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-muted)] transition",
  segmentBtnActive: "bg-white text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]",
  detailSection:
    "rounded-[18px] border border-black/[0.04] bg-[var(--color-surface)]/80 p-4",
  viewportShell:
    "relative min-h-[min(72vh,640px)] overflow-hidden rounded-[22px] border border-black/[0.06] bg-gradient-to-b from-[#fafafa] to-[#f0f2f5] shadow-[var(--shadow-apple-md)] lg:min-h-[min(78vh,760px)] xl:min-h-[min(82vh,900px)]",
  emptyState:
    "flex h-full min-h-[240px] flex-col items-center justify-center rounded-[22px] border border-dashed border-black/[0.08] bg-white/60 p-8 text-center backdrop-blur-sm",
} as const;
