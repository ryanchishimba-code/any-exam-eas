/** Shared Apple-style surface tokens for Full Exam UI. */
export const feUi = {
  page: "full-exam-ui",
  pageBg: "min-h-screen bg-[#f5f5f7]",
  pageShell:
    "rounded-[28px] border border-black/[0.04] bg-gradient-to-b from-[#f5f5f7] to-[#eef0f4] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelInner: "space-y-5 p-4 sm:p-5 md:p-6",
  questionPanel:
    "rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-[var(--shadow-apple-sm)] sm:p-7",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] leading-relaxed text-[var(--color-ink-muted)]",
  segmentTrack: "inline-flex w-full rounded-[14px] bg-black/[0.05] p-1",
  segmentBtn:
    "flex-1 rounded-[11px] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-ink-muted)] transition-all duration-200",
  segmentBtnActive: "bg-white text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]",
  lengthCard:
    "rounded-[18px] border border-black/[0.06] bg-white p-4 text-left shadow-[var(--shadow-apple-sm)] transition active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)]",
  lengthCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/25",
  insetGroup: "overflow-hidden rounded-[16px] bg-black/[0.03]",
  previewRow: "flex items-center justify-between py-2.5 text-[14px]",
  previewLabel: "text-[var(--color-ink-muted)]",
  previewValue: "font-semibold tabular-nums text-[var(--color-ink)]",
  startBtn:
    "flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
  glassHeader:
    "sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70",
  glassFooter:
    "fixed inset-x-0 bottom-0 z-[70] border-t border-black/[0.06] bg-white/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl",
  footerBtn:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-black/[0.08] bg-white px-4 py-2.5 text-[13px] font-semibold text-[var(--color-ink)] transition hover:bg-black/[0.02] disabled:opacity-40",
  footerBtnPrimary:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
  footerBtnDark:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90",
  qNavBtn:
    "relative flex h-8 w-full items-center justify-center rounded-[10px] text-[11px] font-semibold tabular-nums transition active:scale-[0.97]",
  qNavCurrent: "bg-[var(--color-accent)] text-white shadow-sm",
  qNavAnswered: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/15",
  qNavEmpty: "bg-black/[0.04] text-[var(--color-ink-muted)] hover:bg-black/[0.06]",
  timerPill:
    "fixed z-[90] select-none rounded-full border border-white/60 bg-white/90 px-4 py-2 shadow-[var(--shadow-apple-md)] backdrop-blur-xl",
  modal:
    "relative w-full max-w-[22rem] rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[var(--shadow-apple-lg)]",
  modalOverlay: "absolute inset-0 bg-black/40 backdrop-blur-sm",
  scoreRing:
    "mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-[var(--color-accent)]/20 bg-white shadow-[var(--shadow-apple-sm)]",
  chipRow:
    "flex flex-wrap gap-2",
} as const;
