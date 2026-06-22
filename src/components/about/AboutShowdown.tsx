"use client";

/**
 * AboutShowdown — the "Showdown" section of the About page.
 *
 * Two premium Recharts visuals that make the value story obvious:
 *  1. Bar chart — annual cost to prep ALL six boards: our real Basic/Pro
 *     prices vs. buying six premium single-exam QBanks.
 *  2. Radar chart — a feature/value comparison where AnyExamEasy clearly
 *     covers the most ground.
 *
 * Honesty note (matches CostComparisonChart): the ONLY competitor figure the
 * site asserts is the publicly advertised "$200–400+ per exam" range. The bar
 * chart is derived from that range × 6 boards vs. our REAL annual prices — no
 * invented per-competitor numbers. The radar is an explicitly labeled
 * self-assessment of capabilities. A disclaimer is rendered below.
 */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TIER_ANNUAL_USD } from "@/lib/subscription-tiers";

// ── Honest pricing inputs ──────────────────────────────────────────────────
const EXAM_COUNT = 6;
const PER_EXAM_LOW = 200; // publicly advertised per-exam range
const PER_EXAM_HIGH = 400;
const COMPETITOR_LOW = PER_EXAM_LOW * EXAM_COUNT; // $1,200
const COMPETITOR_HIGH = PER_EXAM_HIGH * EXAM_COUNT; // $2,400
const COMPETITOR_MID = Math.round((COMPETITOR_LOW + COMPETITOR_HIGH) / 2); // $1,800
const SAVINGS_HIGH = COMPETITOR_HIGH - TIER_ANNUAL_USD.pro; // up to ~$2,051
const PRICING_YEAR = new Date().getFullYear();

const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

// Brand-safe chart colors (read well on light AND dark elevated surfaces).
const TEAL = "#14b8a6";
const TEAL_SOFT = "#2dd4bf";
const SLATE = "#94a3b8";

type CostBar = { name: string; cost: number; label: string; highlight: boolean };

const COST_DATA: CostBar[] = [
  { name: "AnyExamEasy Pro", cost: TIER_ANNUAL_USD.pro, label: `${usd(TIER_ANNUAL_USD.pro)}/yr`, highlight: true },
  { name: "AnyExamEasy Basic", cost: TIER_ANNUAL_USD.basic, label: `${usd(TIER_ANNUAL_USD.basic)}/yr`, highlight: true },
  {
    name: "6 single-exam QBanks",
    cost: COMPETITOR_MID,
    label: `${usd(COMPETITOR_LOW)}–${usd(COMPETITOR_HIGH)}+/yr`,
    highlight: false,
  },
];

type RadarRow = { axis: string; AnyExamEasy: number; "Typical premium QBank": number };

const RADAR_DATA: RadarRow[] = [
  { axis: "Smart Pricing", AnyExamEasy: 10, "Typical premium QBank": 4 },
  { axis: "Multi-Exam Coverage", AnyExamEasy: 10, "Typical premium QBank": 3 },
  { axis: "Drug & Pearl Depth", AnyExamEasy: 9, "Typical premium QBank": 6 },
  { axis: "Expert Curation", AnyExamEasy: 9, "Typical premium QBank": 7 },
  { axis: "AI Personalization", AnyExamEasy: 9, "Typical premium QBank": 6 },
  { axis: "Long-Term Reference", AnyExamEasy: 10, "Typical premium QBank": 4 },
];

const tooltipStyle = {
  background: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  color: "var(--color-ink)",
  fontSize: 13,
  boxShadow: "var(--shadow-apple-md)",
} as const;

/** Card wrapper shared by both charts. */
function ChartCard({
  eyebrow,
  title,
  subtitle,
  badge,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-md)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">{subtitle}</p>
        </div>
        {badge ? (
          <span className="inline-flex items-center rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-bold text-[var(--color-accent)]">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function AboutShowdown() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Bar chart: cost to prep all six boards ─────────────────────── */}
      <ChartCard
        eyebrow="The math"
        title="One plan vs. six subscriptions"
        subtitle="Annual cost to prep for all six boards."
        badge={`Save up to ${usd(SAVINGS_HIGH)}/yr*`}
      >
        {/* text color drives currentColor used by axis ticks */}
        <div className="h-[260px] w-full text-[var(--color-ink-muted)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COST_DATA}
              layout="vertical"
              margin={{ top: 4, right: 64, bottom: 4, left: 8 }}
              barCategoryGap={18}
            >
              <CartesianGrid horizontal={false} stroke="currentColor" strokeOpacity={0.12} />
              <XAxis
                type="number"
                domain={[0, COMPETITOR_HIGH]}
                tickFormatter={(v) => usd(Number(v))}
                tick={{ fill: "currentColor", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fill: "currentColor", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                contentStyle={tooltipStyle}
                formatter={(_value, _name, entry) => [
                  (entry?.payload as CostBar)?.label ?? usd(Number(_value)),
                  "All 6 boards",
                ]}
              />
              <Bar dataKey="cost" radius={[6, 6, 6, 6]} isAnimationActive>
                {COST_DATA.map((row) => (
                  <Cell key={row.name} fill={row.highlight ? TEAL : SLATE} />
                ))}
                <LabelList
                  dataKey="label"
                  position="right"
                  style={{ fill: "var(--color-ink)", fontSize: 12, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--color-ink)]">
          Six licensing exams, one subscription — for less than a single per-exam bank.
        </p>
      </ChartCard>

      {/* ── Radar chart: feature/value coverage ────────────────────────── */}
      <ChartCard
        eyebrow="The whole picture"
        title="Value coverage, side by side"
        subtitle="Where the plan actually earns its keep."
        badge="Clear winner"
      >
        <div className="h-[260px] w-full text-[var(--color-ink-muted)]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA} outerRadius="72%">
              <PolarGrid stroke="currentColor" strokeOpacity={0.18} />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: "currentColor", fontSize: 10.5 }}
              />
              <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
              <Radar
                name="Typical premium QBank"
                dataKey="Typical premium QBank"
                stroke={SLATE}
                fill={SLATE}
                fillOpacity={0.25}
              />
              <Radar
                name="AnyExamEasy"
                dataKey="AnyExamEasy"
                stroke={TEAL}
                fill={TEAL}
                fillOpacity={0.45}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2 font-bold text-[var(--color-ink)]">
            <span className="h-3 w-3 rounded-sm" style={{ background: TEAL }} aria-hidden />
            AnyExamEasy
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-[var(--color-ink-muted)]">
            <span className="h-3 w-3 rounded-sm" style={{ background: SLATE }} aria-hidden />
            Typical premium QBank
          </span>
        </div>
      </ChartCard>

      {/* ── Shared disclaimer (legal-safe, mirrors CostComparisonChart) ── */}
      <p className="text-[11px] leading-relaxed text-[var(--color-ink-muted)] lg:col-span-2">
        *Illustrative comparison for general information only — an estimate, not a quote.
        Per-exam question-bank pricing reflects publicly advertised ranges ($200–400+ per board)
        as of {PRICING_YEAR} and varies by provider, promotion, and length; actual savings depend
        on which and how many exams you buy. AnyExamEasy figures are current annual plan prices.
        The radar reflects our own assessment of platform capabilities. All product names and
        brands are property of their respective owners; AnyExamEasy is independent and not
        affiliated with, endorsed by, or sponsored by any other provider.
      </p>
    </div>
  );
}
