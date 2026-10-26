"use client";

export function AppearanceSettings() {
 return (
 <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
 <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
 Appearance
 </h2>
 <p className="mt-2 text-sm text-[var(--color-ink)]">
 Light theme. Text, forms, and the menu stay in these colors at night and when the device is in dark mode.
 </p>
 </section>
 );
}
