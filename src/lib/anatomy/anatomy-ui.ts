/** Shared medical dark-theme tokens for Anatomy Explorer UI. */
export const anatomyUi = {
  page: "anatomy-explorer w-full space-y-4 [--anatomy-ink:#e8edf4] [--anatomy-ink-muted:#94a3b8] [--anatomy-accent:#22d3ee] [--anatomy-panel:#0f1419] [--anatomy-panel-elevated:#151b24] [--anatomy-border:rgba(255,255,255,0.08)]",
  pageShell:
    "rounded-[28px] border border-white/[0.06] bg-gradient-to-b from-[#0a0e14] to-[#06080c] p-1 sm:p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
  panel:
    "overflow-hidden rounded-[22px] border border-white/[0.08] bg-[var(--anatomy-panel)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
  panelFlat:
    "overflow-hidden border-[var(--anatomy-border)] bg-[var(--anatomy-panel-elevated)] shadow-[-16px_0_48px_rgba(0,0,0,0.55)]",
  panelSection: "space-y-4 p-4 sm:p-5 md:p-6",
  sectionDivider: "border-t border-white/[0.06]",
  viewerSection: "min-w-0",
  glass:
    "rounded-full border border-white/[0.1] bg-[#1a2230]/80 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl",
  heroTitle: "text-[22px] font-semibold tracking-tight text-[var(--anatomy-ink)] sm:text-[26px]",
  heroSubtitle: "text-[14px] leading-relaxed text-[var(--anatomy-ink-muted)]",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-400/80",
  sectionLabel: "text-[13px] font-semibold text-[var(--anatomy-ink)]",
  sectionHint: "text-[12px] text-[var(--anatomy-ink-muted)]",
  statPill:
    "inline-flex items-center rounded-full bg-white/[0.06] px-3 py-1.5 text-[12px] font-semibold text-[var(--anatomy-ink-muted)]",
  searchInput:
    "w-full rounded-[14px] border border-white/[0.08] bg-black/30 py-2.5 pl-10 pr-10 text-[15px] text-[var(--anatomy-ink)] outline-none ring-0 placeholder:text-[var(--anatomy-ink-muted)] focus:border-cyan-500/40 focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]",
  select:
    "w-full appearance-none rounded-[14px] border border-white/[0.08] bg-black/25 py-2.5 pl-3 pr-9 text-[15px] text-[var(--anatomy-ink)] outline-none focus:border-cyan-500/40 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]",
  insetGroup: "overflow-hidden rounded-[16px] bg-black/25",
  listItem:
    "flex w-full flex-col items-start gap-0.5 rounded-[12px] px-3 py-2.5 text-left text-[15px] transition active:scale-[0.99]",
  listItemSelected: "bg-cyan-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]",
  listItemHover: "hover:bg-white/[0.06]",
  chip:
    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition active:scale-[0.98]",
  chipIdle:
    "border border-white/[0.08] bg-white/[0.04] text-[var(--anatomy-ink)] hover:border-cyan-500/25 hover:bg-white/[0.08]",
  chipActive:
    "border-transparent bg-cyan-600 text-white shadow-[0_0_16px_rgba(34,211,238,0.3)]",
  segmentTrack: "inline-flex rounded-[12px] bg-black/30 p-0.5",
  segmentBtn:
    "rounded-[10px] px-3 py-1.5 text-[13px] font-medium text-[var(--anatomy-ink-muted)] transition",
  segmentBtnActive: "bg-white/[0.1] text-[var(--anatomy-ink)] shadow-sm",
  detailSection:
    "rounded-[18px] border border-white/[0.08] bg-[#1e2733] p-4",
  viewportShell:
    "relative w-full min-w-0 overflow-hidden bg-[#080b10]",
  viewportHeight:
    "h-[min(68vh,560px)] w-full lg:h-[min(76vh,720px)] xl:h-[min(80vh,860px)]",
  panelHeight:
    "max-h-[min(68vh,560px)] lg:max-h-[min(76vh,720px)] xl:max-h-[min(80vh,860px)]",
  emptyState:
    "flex h-full min-h-[240px] flex-col items-center justify-center border border-dashed border-white/[0.1] bg-black/20 p-8 text-center backdrop-blur-sm",
} as const;
