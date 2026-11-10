"use client";

import { useId, useState } from "react";
import { Info } from "lucide-react";
import type { ReadinessCriterion } from "@/lib/learning/exam-day-plan";
import type { DifficultyMix } from "@/lib/learning/served-bank-stats";
import { cn } from "@/lib/utils";

export type GoalTrendPoint = { label?: string; accuracy: number | null };

export type GoalDomainBar = {
  id: string;
  label: string;
  weightPct: number;
  answeredPct: number;
  served: number;
  seen: number;
  gap?: boolean;
};

const GAUGE_LABEL: Record<string, string> = {
  coverage: "Coverage",
  recent_accuracy: "Accuracy",
  remediation: "Review",
};

const GAUGE_STROKE: Record<string, string> = {
  coverage: "var(--color-accent)",
  recent_accuracy: "var(--db-ready-strong, var(--color-accent))",
  remediation: "var(--db-ready-review, #d97706)",
};

function words(label: string, max = 6): string {
  const parts = label.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, max).join(" ");
}

function InfoTip({ label, text }: { label: string; text: string }) {
  const tipId = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="grid h-6 w-6 place-items-center rounded-full text-[var(--color-ink-muted)] outline-none ring-[var(--color-accent)] hover:text-[var(--color-ink)] focus-visible:ring-2"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open ? (
        <span
          id={tipId}
          role="tooltip"
          className="absolute right-0 top-7 z-20 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated,var(--color-surface))] px-3 py-2 text-left text-[12px] leading-snug text-[var(--color-ink)] shadow-[var(--shadow-apple-sm,0_8px_24px_rgba(0,0,0,0.12))]"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}

function RadialGauge({
  label,
  pct,
  stroke,
  hint,
}: {
  label: string;
  pct: number;
  stroke: string;
  hint: string;
}) {
  const size = 72;
  const width = 6;
  const radius = (size - width) / 2;
  const circ = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const offset = circ - (clamped / 100) * circ;
  return (
    <figure className="flex min-w-0 flex-col items-center gap-2" data-practice-gauge={label}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={`${label} ${clamped} percent. ${hint}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--db-ready-track, color-mix(in srgb, var(--color-border) 70%, transparent))"
            strokeWidth={width}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={width}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
          {clamped}
        </span>
      </div>
      <figcaption className="flex items-center gap-0.5">
        <span className="text-[12px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{label}</span>
        <InfoTip label={`About ${label}`} text={hint} />
      </figcaption>
    </figure>
  );
}

function Sparkline({ points }: { points: GoalTrendPoint[] }) {
  const width = 320;
  const height = 64;
  const pad = 4;
  const usable = points.length > 0 ? points : [{ accuracy: 0 }];
  const step = usable.length > 1 ? (width - pad * 2) / (usable.length - 1) : 0;
  const coords = usable.map((point, index) => {
    const value = point.accuracy == null ? 0 : Math.max(0, Math.min(100, point.accuracy));
    const x = pad + index * step;
    const y = pad + (1 - value / 100) * (height - pad * 2);
    return { x, y, value, label: point.label ?? "" };
  });
  const line = coords.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1]!.x.toFixed(1)},${height - pad} L${coords[0]!.x.toFixed(1)},${height - pad} Z`;
  const windowLabel = points.length > 14 ? "30-day trend" : "14-day trend";
  return (
    <figure className="mt-6" data-practice-chart="trend">
      <figcaption className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{windowLabel}</span>
        <InfoTip label="About the trend" text="Daily accuracy. Empty days stay on the baseline." />
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full" role="img" aria-label={`${windowLabel}. ${coords.length} days.`}>
        <path d={area} fill="var(--color-accent)" opacity="0.16" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="motion-safe:transition-opacity motion-safe:duration-500"
        />
      </svg>
    </figure>
  );
}

function DomainBars({
  domains,
  outlineDepthPct = null,
}: {
  domains: GoalDomainBar[];
  outlineDepthPct?: number | null;
}) {
  const maxWeight = Math.max(...domains.map((domain) => domain.weightPct), 1);
  return (
    <figure className="mt-6" data-practice-chart="domains">
      <figcaption className="mb-3 flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
          Outline depth{outlineDepthPct != null ? ` ${outlineDepthPct}%` : ""}
        </span>
        <InfoTip
          label="About outline depth"
          text="Bar width is how much the exam emphasizes the area. Fill is answered questions versus questions currently served."
        />
      </figcaption>
      <ul className="space-y-3">
        {domains.map((domain) => {
          const track = Math.max(18, Math.round((domain.weightPct / maxWeight) * 100));
          const fill = Math.max(0, Math.min(100, Math.round(domain.answeredPct)));
          return (
            <li key={domain.id}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="min-w-0 text-[13px] font-medium text-[var(--color-ink)]" title={domain.label}>
                  {domain.label}
                  {domain.gap ? <span className="ml-1.5 text-[11px] font-semibold text-[var(--color-accent)]">Gap</span> : null}
                </p>
                <p className="shrink-0 text-[12px] tabular-nums text-[var(--color-ink-muted)]">{fill}%</p>
              </div>
              <div className="h-2.5 w-full">
                <div
                  className="h-full overflow-hidden rounded-full bg-[var(--db-ready-track,color-mix(in_srgb,var(--color-border)_65%,transparent))] motion-safe:transition-[width] motion-safe:duration-500"
                  style={{ width: `${track}%` }}
                  role="img"
                  aria-label={`${domain.label}. ${domain.seen} of ${domain.served} served. Outline weight ${domain.weightPct} percent.`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] motion-safe:transition-[width] motion-safe:duration-700"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

function DifficultyBar({ mix }: { mix: DifficultyMix }) {
  const total = mix.easy + mix.mid + mix.hard + mix.unrated;
  if (total <= 0) return null;
  const parts = [
    { key: "easy", label: "Easy", count: mix.easy, className: "bg-[color-mix(in_srgb,var(--color-accent)_42%,var(--color-border))]" },
    { key: "mid", label: "Mid", count: mix.mid, className: "bg-[var(--color-accent)]" },
    { key: "hard", label: "Hard", count: mix.hard, className: "bg-[var(--db-ready-review,#d97706)]" },
    { key: "unrated", label: "Unrated", count: mix.unrated, className: "bg-[var(--color-border)]" },
  ].filter((part) => part.count > 0);
  return (
    <figure className="mt-6" data-practice-chart="difficulty">
      <figcaption className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">Difficulty mix</span>
        <InfoTip
          label="About difficulty"
          text="Served questions by stored difficulty. Unrated items use the average weight in the score."
        />
      </figcaption>
      <div
        className="flex h-3 overflow-hidden rounded-full bg-[var(--db-ready-track,color-mix(in_srgb,var(--color-border)_65%,transparent))]"
        role="img"
        aria-label={`Difficulty mix. Easy ${mix.easy}, mid ${mix.mid}, hard ${mix.hard}, unrated ${mix.unrated}.`}
      >
        {parts.map((part) => (
          <div
            key={part.key}
            className={cn("h-full motion-safe:transition-[width] motion-safe:duration-700", part.className)}
            style={{ width: `${(part.count / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {parts.map((part) => (
          <li key={part.key} className="text-[11px] font-medium text-[var(--color-ink-muted)]">
            <span className={cn("mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle", part.className)} />
            {part.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function PracticeGoalsCharts({
  criteria,
  trend = [],
  domains = [],
  difficultyMix = null,
}: {
  criteria: ReadinessCriterion[];
  trend?: GoalTrendPoint[];
  domains?: GoalDomainBar[];
  difficultyMix?: DifficultyMix | null;
}) {
  const gauges = criteria.filter((row) => row.id !== "exam_sim");
  const outlineDepthPct = gauges.find((row) => row.id === "coverage")?.progressPct ?? null;
  return (
    <div className="pt-4">
      <div className="grid grid-cols-3 gap-2">
        {gauges.map((row) => (
          <RadialGauge
            key={row.id}
            label={GAUGE_LABEL[row.id] ?? words(row.label, 2)}
            pct={row.progressPct ?? 0}
            stroke={GAUGE_STROKE[row.id] ?? "var(--color-accent)"}
            hint={row.nextStep || row.detail}
          />
        ))}
      </div>
      {trend.length > 0 ? <Sparkline points={trend.slice(-30)} /> : null}
      {domains.length > 0 ? <DomainBars domains={domains} outlineDepthPct={outlineDepthPct} /> : null}
      {difficultyMix ? <DifficultyBar mix={difficultyMix} /> : null}
    </div>
  );
}
