"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ExamCardProps = {
  slug: ExamSlug;
  index: number;
  disabled?: boolean;
  selected?: boolean;
  onSelect: (slug: ExamSlug) => void;
};

export function ExamCard({
  slug,
  index,
  disabled,
  selected,
  onSelect,
}: ExamCardProps) {
  const reduceMotion = useReducedMotion();
  const exam = EXAM_CATALOG[slug];
  const theme = EXAM_SELECTION_THEMES[slug];
  const Icon = theme.icon;
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      window.setTimeout(() => setRipple(null), 600);
    }
    onSelect(slug);
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <button
        ref={cardRef}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-pressed={selected}
        aria-label={`Select ${exam.name}`}
        className={cn(
          "group relative h-full w-full overflow-hidden rounded-3xl border border-white/10 text-left shadow-xl transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          "disabled:cursor-wait disabled:opacity-80",
          "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl",
          theme.glow,
          selected && "ring-2 ring-white/90 ring-offset-2 ring-offset-transparent scale-[0.98]"
        )}
      >
        {/* Gradient face — swap gradient classes in exam-selection-theme.ts */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            theme.gradient
          )}
          aria-hidden
        />

        {/* Inner glow on hover */}
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

        {ripple ? (
          <span
            className="pointer-events-none absolute h-4 w-4 animate-ping rounded-full bg-white/40"
            style={{ left: ripple.x - 8, top: ripple.y - 8 }}
            aria-hidden
          />
        ) : null}

        <div className="relative flex h-full min-h-[280px] flex-col p-6 sm:min-h-[300px] sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                theme.iconBg
              )}
            >
              <Icon className={cn("h-8 w-8", theme.iconColor)} aria-hidden />
            </div>
            <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              {exam.shortName}
            </span>
          </div>

          <div className="mt-6 flex-1">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {exam.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
              {theme.tagline}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {theme.stats.map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-white/20 bg-black/10 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm"
              >
                {stat}
              </span>
            ))}
          </div>

          {slug === "pance" ? (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-100/90">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              NCCPA blueprint roadmap across 15 medical content categories
            </p>
          ) : null}

          <div className="mt-6">
            <span
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all",
                "group-hover:gap-3",
                theme.ctaClass,
                selected && "animate-pulse"
              )}
            >
              {selected ? "Starting…" : "Start Prepping"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
