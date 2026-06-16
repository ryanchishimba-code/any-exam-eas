/** Shared Apple-style surface tokens for Full Exam UI — theme-aware. */
export const feUi = {
  page: "full-exam-ui",
  pageBg: "min-h-screen bg-[var(--color-bg)]",
  pageShell:
    "rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 sm:p-1.5",
  panel:
    "overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)] backdrop-blur-xl",
  panelInner: "space-y-5 p-4 sm:p-5 md:p-6",
  questionPanel:
    "rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] sm:p-7",
  eyebrow:
    "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]",
  title: "text-[28px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[32px]",
  subtitle: "text-[15px] leading-relaxed text-[var(--color-ink-muted)]",
  sectionTitle: "text-[15px] font-semibold tracking-tight text-[var(--color-ink)]",
  sectionHint: "text-[13px] leading-relaxed text-[var(--color-ink-muted)]",
  segmentTrack:
    "inline-flex w-full rounded-[14px] bg-[var(--color-surface)] p-1",
  segmentBtn:
    "flex-1 rounded-[11px] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-ink-muted)] transition-all duration-200",
  segmentBtnActive:
    "bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)]",
  lengthCard:
    "rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-left shadow-[var(--shadow-apple-sm)] transition active:scale-[0.99] hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)]",
  lengthCardActive:
    "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 ring-1 ring-[var(--color-accent)]/25",
  insetGroup: "overflow-hidden rounded-[16px] bg-[var(--color-surface)]",
  previewRow: "flex items-center justify-between py-2.5 text-[14px]",
  previewLabel: "text-[var(--color-ink-muted)]",
  previewValue: "font-semibold tabular-nums text-[var(--color-ink)]",
  startBtn:
    "flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
  glassHeader:
    "sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 backdrop-blur-xl",
  glassFooter:
    "fixed inset-x-0 bottom-0 z-[70] border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl",
  footerBtn:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface)] disabled:opacity-40",
  footerBtnPrimary:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] disabled:opacity-50",
  footerBtnDark:
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition hover:opacity-90",
  qNavBtn:
    "relative flex h-8 w-full items-center justify-center rounded-[10px] text-[11px] font-semibold tabular-nums transition active:scale-[0.97]",
  qNavCurrent: "bg-[var(--color-accent)] text-white shadow-sm",
  qNavAnswered:
    "bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/15",
  qNavEmpty:
    "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-elevated)]",
  timerPill:
    "fixed z-[90] select-none rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 px-4 py-2 shadow-[var(--shadow-apple-md)] backdrop-blur-xl",
  modal:
    "relative w-full max-w-[22rem] rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-lg)]",
  modalOverlay: "absolute inset-0 bg-black/40 backdrop-blur-sm",
  scoreRing:
    "mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-[var(--color-accent)]/20 bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]",
  chipRow: "flex flex-wrap gap-2",
} as const;
