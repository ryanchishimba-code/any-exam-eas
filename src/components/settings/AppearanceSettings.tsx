"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";

export function AppearanceSettings() {
 const { resolved } = useTheme();

 return (
 <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
 <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
 Appearance
 </h2>
 <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
 Choose light or dark mode, or match your device. Currently showing{" "}
 <span className="font-semibold text-[var(--color-ink)]">{resolved}</span>{" "}
 for easier reading in your environment.
 </p>
 <div className="mt-4">
 <ThemeToggle variant="settings" />
 </div>
 </section>
 );
}
