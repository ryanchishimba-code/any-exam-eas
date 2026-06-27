"use client";

import {
  Activity,
  BookOpen,
  Bone,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Heart,
  Pill,
  Shield,
  Sparkles,
  Stethoscope,
  Wind,
  Zap,
} from "lucide-react";
import type { ExamSlug, HighYieldTopic, TopicProgressMap } from "@/types/edtech";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type IconComponent = typeof Sparkles;

const CATEGORY_ICON_MAP: Array<[string[], IconComponent]> = [
  [["cardiopulm"], Heart],
  [["cardiovasc", "cardiac", "heart", "vascular", "arrhyth", "hypertens"], Heart],
  [["pulm", "respir", "lung", "breath", "airway", "asthma", "copd"], Wind],
  [["calculat"], Pill],
  [["pharm", "drug", "medic", "pharmacother", "drug class"], Pill],
  [["neuro", "psych", "mental", "cognit", "seizure", "stroke", "brain", "behav"], Zap],
  [["renal", "kidney", "nephr", "electro", "fluid", "urin", "genitourin"], Droplets],
  [["gi ", "gi&", "gastro", "bowel", "liver", "hepat", "digest", "intestin", "nutrition"], Activity],
  [["hemat", "blood", "coag", "anemia", "oncol", "cancer"], Droplets],
  [["infect", "micro", "immun", "antibio", "antimicr", "sepsis", "precaution", "public health"], Shield],
  [["safety", "error", "prevention", "protection"], Shield],
  [["msk", "muscul", "ortho", "bone", "fracture", "spine", "joint", "therapeutic modal"], Bone],
  [["neuromuscul"], Zap],
  [["ob", "obstet", "gynec", "pregnan", "reprod", "maternal", "pediatr", "child", "neonat", "geriatr"], Heart],
  [["endocr", "diabetes", "thyroid", "adrenal", "hormone", "metabol"], Activity],
  [["assess", "diagnos", "plan (", "evaluat", "management", "med-surg", "physiolog", "clinical judg", "priority", "triage", "decision"], Stethoscope],
  [["foundation", "basic", "systems", "general", "step 1", "step 3"], BookOpen],
  [["profess", "ethics", "practice", "public", "biostat", "ccs"], Sparkles],
];

function getCategoryIcon(category: string, hasModule: boolean): IconComponent {
  if (hasModule) return BookOpen;
  const lower = category.toLowerCase();
  for (const [keys, Icon] of CATEGORY_ICON_MAP) {
    if (keys.some((k) => lower.includes(k))) return Icon;
  }
  return Sparkles;
}

export function HighYieldTopicPreviewCard({
  topic,
  progress,
  examSlug: _examSlug,
  onViewSummary,
  compact = false,
}: {
  topic: HighYieldTopic;
  progress?: TopicProgressMap[string];
  examSlug: ExamSlug;
  onViewSummary: () => void;
  compact?: boolean;
}) {
  const reviewCount = progress?.reviewCount ?? 0;
  const reviewed = reviewCount > 0;
  const CategoryIcon = getCategoryIcon(topic.category, Boolean(topic.reviewModule));
  const insight = topic.mustKnowFacts[0] ?? topic.pearls[0] ?? topic.overview;

  return (
    <button
      type="button"
      onClick={onViewSummary}
      className={cn(studyUi.listRow, "group w-full gap-3.5")}
    >
      <span
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          reviewed
            ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            : "bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
        )}
      >
        <CategoryIcon className="h-[18px] w-[18px]" aria-hidden />
      </span>

      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-1.5">
          {!compact ? (
            <span className={studyUi.eyebrow}>{topic.category}</span>
          ) : null}
          {topic.reviewModule ? (
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
              Module
            </span>
          ) : null}
          {reviewed ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              {reviewCount}×
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[15px] font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
          {topic.title}
        </p>
        <p className={cn(studyUi.sectionHint, "mt-0.5 line-clamp-1")}>{insight}</p>
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)]/40 transition group-hover:text-[var(--color-accent)]"
        aria-hidden
      />
    </button>
  );
}
