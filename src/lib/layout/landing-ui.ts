/** Theme-aware tokens for marketing / landing surfaces. */
export const landingUi = {
  section: "aee-landing-section border-b border-[var(--color-border)] bg-[var(--color-bg)]",
  sectionAlt: "aee-landing-section border-b border-[var(--color-border)] bg-[var(--color-surface)]",
  compactSection:
    "aee-landing-compact-section border-b border-[var(--color-border)] bg-[var(--color-bg)]",
  compactSectionAlt:
    "aee-landing-compact-section border-b border-[var(--color-border)] bg-[var(--color-surface)]",
  sectionCompact:
    "aee-landing-section-compact border-b border-[var(--color-border)] bg-[var(--color-bg)]",
  title: "font-bold tracking-tight text-[var(--color-ink)]",
  titleLg: "text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl",
  titleMd: "text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl",
  body: "text-sm leading-relaxed text-[var(--color-ink-muted)]",
  caption: "text-xs text-[var(--color-ink-muted)]",
  eyebrow: "text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-accent)]",
  card: "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]",
  cardMuted: "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
  statCard:
    "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 px-3 py-3 text-center backdrop-blur-sm",
  statCardLg: "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 px-4 py-3 text-center backdrop-blur-sm",
  chip: "rounded-lg bg-[var(--color-surface)] ring-1 ring-[var(--color-border)]",
  divider: "border-[var(--color-border)]",
  linkMuted: "text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]",
} as const;
