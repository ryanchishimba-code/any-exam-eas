"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, FileText, Layers, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Visual theme for a card (reuses the exam-selection theme tokens). */
export type ExamOptionTheme = {
  gradient: string;
  glow: string;
  orb: string;
  iconBg: string;
  iconColor: string;
  ctaClass: string;
};

export type ExamOptionCardProps = {
  /** Destination when the user picks this option. */
  href: string;
  /** Stagger order for the entrance animation. */
  index: number;
  /** Small label pill, e.g. "Step 1". */
  eyebrow: string;
  /** Card title, e.g. "USMLE Step 1". */
  title: string;
  description: string;
  /** Live count of practiceable questions (0 → shown as loading). */
  questionCount: number;
  /** Recommended simulation length, in minutes. */
  durationMin: number;
  difficulty: string;
  /** Optional accent badge, e.g. "Recommended" or "Largest bank". */
  badge?: string;
  theme: ExamOptionTheme;
  icon: LucideIcon;
};

function formatDuration(min: number): string {
  if (min >= 60) {
    const hours = Math.round((min / 60) * 10) / 10;
    return `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr sim`;
  }
  return `${min} min sim`;
}

/**
 * A premium, gradient exam-option card. Reusable across exam families — pass
 * the live `questionCount` and a theme. The whole card is a single large,
 * thumb-friendly tap target that proceeds to practice.
 */
export function ExamOptionCard({
  href,
  index,
  eyebrow,
  title,
  description,
  questionCount,
  durationMin,
  difficulty,
  badge,
  theme,
  icon: Icon,
}: ExamOptionCardProps) {
  const reduceMotion = useReducedMotion();
  const [pending, setPending] = useState(false);

  const countLabel =
    questionCount > 0 ? `${questionCount.toLocaleString("en-US")} questions` : "Bank loading…";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={href}
        onClick={() => setPending(true)}
        aria-label={`Practice ${title} — ${countLabel}`}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 text-left shadow-xl transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl",
          theme.glow
        )}
      >
        {/* Gradient face */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", theme.gradient)} aria-hidden />
        {/* Hover sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.18), transparent 70%)",
          }}
          aria-hidden
        />
        {/* Decorative orb */}
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-110",
            theme.orb
          )}
          aria-hidden
        />

        <div className="relative flex h-full min-h-[260px] flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                theme.iconBg
              )}
            >
              <Icon className={cn("h-7 w-7", theme.iconColor)} aria-hidden />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                {eyebrow}
              </span>
              {badge ? (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                  {badge}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{description}</p>
          </div>

          {/* Key stats — count is the hero metric. */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              {countLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {formatDuration(durationMin)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              {difficulty}
            </span>
          </div>

          <div className="mt-6">
            <span
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all group-hover:gap-3",
                theme.ctaClass,
                pending && "animate-pulse"
              )}
            >
              {pending ? "Starting…" : "Start practice"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
