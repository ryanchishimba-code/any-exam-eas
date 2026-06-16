"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import type { ThemeMode } from "@/lib/theme/config";
import { cn } from "@/lib/utils";

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
 { mode: "light", label: "Light", icon: Sun },
 { mode: "dark", label: "Dark", icon: Moon },
 { mode: "system", label: "System", icon: Monitor },
];

type Props = {
 variant?: "icon" | "segmented" | "settings";
 className?: string;
};

export function ThemeToggle({ variant = "icon", className }: Props) {
 const { mode, setMode } = useTheme();

 if (variant === "segmented" || variant === "settings") {
 return (
 <div
 className={cn(
 variant === "settings" ? "grid gap-2 sm:grid-cols-3" : "inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1",
 className
 )}
 role="group"
 aria-label="Appearance"
 >
 {OPTIONS.map(({ mode: option, label, icon: Icon }) => {
 const active = mode === option;
 return (
 <button
 key={option}
 type="button"
 onClick={() => setMode(option)}
 aria-pressed={active}
 className={cn(
 variant === "settings"
 ? "flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition"
 : "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
 active
 ? variant === "settings"
 ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
 : "bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-sm"
 : variant === "settings"
 ? "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)]/25"
 : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
 )}
 >
 <Icon className={variant === "settings" ? "h-5 w-5" : "h-3.5 w-3.5"} aria-hidden />
 {label}
 </button>
 );
 })}
 </div>
 );
 }

 const cycle: ThemeMode[] = ["light", "dark", "system"];
 const currentIndex = cycle.indexOf(mode);
 const next = cycle[(currentIndex + 1) % cycle.length]!;
 const CurrentIcon =
 mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;

 return (
 <button
 type="button"
 onClick={() => setMode(next)}
 className={cn(
 "inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]",
 className
 )}
 aria-label={`Appearance: ${mode}. Switch to ${next}.`}
 title={`Theme: ${mode}`}
 >
 <CurrentIcon className="h-4 w-4" aria-hidden />
 </button>
 );
}
