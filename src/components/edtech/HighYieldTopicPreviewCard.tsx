"use client";

import {
  Activity,
  ArrowRight,
  Bone,
  BookOpen,
  CheckCircle2,
  Droplets,
  Heart,
  Pill,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Wind,
  Zap,
} from "lucide-react";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { cn } from "@/lib/utils";

// ─── Category → Icon mapping ────────────────────────────────────────────────

type IconComponent = typeof Sparkles;

/**
 * Maps category keyword substrings (lowercased) to icons.
 * Ordered from most-specific to most-general — first match wins.
 * Covers all six board exams: NCLEX, USMLE, NAPLEX, PANCE, AANP-FNP, NPTE-PT.
 */
const CATEGORY_ICON_MAP: Array<[string[], IconComponent]> = [
  // Cardiopulmonary (NPTE-PT combined category) checked before individual systems
  [["cardiopulm"], Heart],
  // Cardiovascular
  [["cardiovasc", "cardiac", "heart", "vascular", "arrhyth", "hypertens"], Heart],
  // Pulmonary / Respiratory
  [["pulm", "respir", "lung", "breath", "airway", "asthma", "copd"], Wind],
  // Pharmacy calculations (NAPLEX)
  [["calculat"], Pill],
  // Pharmacology / Drug therapy ("therapeut" intentionally excluded — caught by MSK/PT group below)
  [["pharm", "drug", "medic", "pharmacother", "drug class"], Pill],
  // Neurology / Psychiatry / Mental health
  [["neuro", "psych", "mental", "cognit", "seizure", "stroke", "brain", "behav"], Zap],
  // Renal / Genitourinary / Fluids
  [["renal", "kidney", "nephr", "electro", "fluid", "urin", "genitourin"], Droplets],
  // GI / Nutrition
  [["gi ", "gi&", "gastro", "bowel", "liver", "hepat", "digest", "intestin", "nutrition"], Activity],
  // Hematology / Oncology
  [["hemat", "blood", "coag", "anemia", "oncol", "cancer"], Droplets],
  // Infectious Disease / Immunology / Safety
  [["infect", "micro", "immun", "antibio", "antimicr", "sepsis", "precaution", "public health"], Shield],
  // Safety / Error prevention
  [["safety", "error", "prevention", "protection"], Shield],
  // MSK / Physical therapy
  // MSK / Physical therapy modalities (NPTE-PT) — "therapeutic modal" catches Therapeutic Modalities
  [["msk", "muscul", "ortho", "bone", "fracture", "spine", "joint", "therapeutic modal"], Bone],
  // Neuromuscular (NPTE-PT)
  [["neuromuscul"], Zap],
  // OB / Gynecology / Pediatrics / Reproductive / Geriatrics
  // OB / Gynecology / Pediatrics / Geriatrics — bare "ob" key catches the standalone "OB" category
  [["ob", "obstet", "gynec", "pregnan", "reprod", "maternal", "pediatr", "child", "neonat", "geriatr"], Heart],
  // Endocrine / Metabolic
  [["endocr", "diabetes", "thyroid", "adrenal", "hormone", "metabol"], Activity],
  // AANP-FNP process domains (Assess / Diagnose / Plan / Evaluate) → Stethoscope
  [["assess", "diagnos", "plan (", "evaluat", "management", "med-surg", "physiolog", "clinical judg", "priority", "triage", "decision"], Stethoscope],
  // Foundations / Basics
  [["foundation", "basic", "systems", "general"], BookOpen],
  // Professional practice / Ethics / Public health (not matched above)
  [["profess", "ethics", "practice", "public"], Sparkles],
];

function getCategoryIcon(category: string, hasModule: boolean): IconComponent {
  if (hasModule) return BookOpen;
  const lower = category.toLowerCase();
  for (const [keys, Icon] of CATEGORY_ICON_MAP) {
    if (keys.some((k) => lower.includes(k))) return Icon;
  }
  return Sparkles;
}

// ─── Mastery dots ────────────────────────────────────────────────────────────

const MAX_DOTS = 5;

function MasteryDots({ count }: { count: number }) {
  const filled = Math.min(MAX_DOTS, count);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={count === 0 ? "Not started" : `Reviewed ${count} time${count === 1 ? "" : "s"}`}
      title={count === 0 ? "Not started" : `${count}× reviewed`}
    >
      {Array.from({ length: MAX_DOTS }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition",
            i < filled ? "bg-teal-500" : "bg-slate-200"
          )}
        />
      ))}
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

export function HighYieldTopicPreviewCard({
  topic,
  progress,
  examSlug: _examSlug,
  onViewSummary,
}: {
  topic: HighYieldTopic;
  progress?: TopicProgressMap[string];
  examSlug: ExamSlug;
  onViewSummary: () => void;
}) {
  const reviewCount = progress?.reviewCount ?? 0;
  const reviewed = reviewCount > 0;

  const CategoryIcon = getCategoryIcon(topic.category, Boolean(topic.reviewModule));

  // Best single-sentence insight to surface on the card face
  const insight: string | null = topic.mustKnowFacts[0] ?? topic.pearls[0] ?? null;

  return (
    <button
      type="button"
      onClick={onViewSummary}
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-[18px] border bg-[var(--color-surface-elevated)] text-left",
        "shadow-[var(--shadow-apple-sm)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-apple-md)] hover:border-[var(--color-accent)]/30",
        reviewed
          ? "border-teal-200/60 bg-gradient-to-b from-teal-50/25 to-[var(--color-surface-elevated)]"
          : "border-[var(--color-border)]"
      )}
    >
      {/* ── Top row: icon + badges + reviewed pill ── */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
            reviewed
              ? "bg-teal-100 text-teal-700"
              : "bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
          )}
        >
          <CategoryIcon className="h-5 w-5" aria-hidden />
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            {topic.category}
          </span>
          {topic.reviewModule && (
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700">
              Textbook
            </span>
          )}
        </div>

        {reviewed && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            {reviewCount}×
          </span>
        )}
      </div>

      {/* ── Title ── */}
      <div className="px-5 pb-3">
        <h3
          className={cn(
            "text-[17px] font-semibold leading-snug text-[var(--color-ink)] transition",
            "group-hover:text-[var(--color-accent)]"
          )}
        >
          {topic.title}
        </h3>
      </div>

      {/* ── Clinical pearl or overview ── */}
      {insight ? (
        <div className="mx-5 mb-4 rounded-xl bg-amber-50/80 px-3.5 py-2.5 ring-1 ring-inset ring-amber-100">
          <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-amber-900">
            <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden />
            <span className="line-clamp-2">{insight}</span>
          </p>
        </div>
      ) : (
        <p className="px-5 pb-4 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {topic.overview}
        </p>
      )}

      {/* ── Footer: mastery + CTA ── */}
      <div className="mt-auto border-t border-[var(--color-border)] px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <MasteryDots count={reviewCount} />
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition",
              "bg-[var(--color-accent)] text-white shadow-sm",
              "group-hover:opacity-90 group-hover:shadow-[var(--shadow-apple-btn)]"
            )}
          >
            {topic.reviewModule ? (
              <>
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Open Module
              </>
            ) : (
              <>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                Start Practice
              </>
            )}
          </span>
        </div>
      </div>
    </button>
  );
}
