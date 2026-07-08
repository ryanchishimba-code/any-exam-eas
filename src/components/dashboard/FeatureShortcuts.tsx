"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Pill,
  Stethoscope,
} from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { questionBankHref } from "@/lib/edtech/practice-links-core";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

type FeatureItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof ClipboardList;
  accent: string;
};

const EXAM_ACCENTS: Partial<Record<ExamSlug, string>> = {
  nclex: "#5856d6",
  usmle: "#0a84ff",
  naplex: "#34c759",
  pance: "#ff6482",
  "aanp-fnp": "#af52de",
  "npte-pt": "#32ade6",
};

function practiceFeatureForExam(examSlug: ExamSlug): FeatureItem {
  const exam = EXAM_CATALOG[examSlug];
  return {
    href: questionBankHref(examSlug),
    label: `Start ${exam.shortName} Practice`,
    description: exam.description.split(",")[0] ?? exam.description,
    icon: examSlug === "usmle" ? Stethoscope : ClipboardList,
    accent: EXAM_ACCENTS[examSlug] ?? "#5856d6",
  };
}

const SHARED_FEATURES: FeatureItem[] = [
  {
    href: "/study/drugs300",
    label: "Top 500 Drugs Mastery",
    description: "Pharm flashcards by drug class",
    icon: Pill,
    accent: "#0d9488",
  },
  {
    href: "/analytics",
    label: "Progress & Analytics",
    description: "Streaks, trends & weak areas",
    icon: BarChart3,
    accent: "#ff9500",
  },
];

/** @deprecated Prefer exam-aware shortcuts via useAppPreferences; kept for marketing fallbacks. */
export const premiumFeatures = [
  practiceFeatureForExam("nclex"),
  practiceFeatureForExam("usmle"),
  practiceFeatureForExam("naplex"),
  ...SHARED_FEATURES,
] as const;

function featuresForUser(examSlug: ExamSlug | null, prefLoading: boolean): FeatureItem[] {
  if (examSlug) {
    return [practiceFeatureForExam(examSlug), ...SHARED_FEATURES];
  }
  if (prefLoading) return [];
  return [
    {
      href: ROUTES.selectExam,
      label: "Choose your exam",
      description: "Pick NCLEX, USMLE, NAPLEX, and more",
      icon: ClipboardList,
      accent: "#5856d6",
    },
    ...SHARED_FEATURES,
  ];
}

type FeatureShortcutsProps = {
  variant?: "bar" | "cards" | "grid";
  className?: string;
  onNavigate?: () => void;
};

export function FeatureShortcuts({
  variant = "grid",
  className = "",
  onNavigate,
}: FeatureShortcutsProps) {
  const { examSlug, loading: prefLoading } = useAppPreferences();
  const features = useMemo(
    () => featuresForUser(examSlug, prefLoading),
    [examSlug, prefLoading]
  );

  if (features.length === 0) return null;

  if (variant === "bar") {
    return (
      <nav
        className={`aee-feature-shortcuts aee-feature-shortcuts--bar ${className}`.trim()}
        aria-label="Quick access"
      >
        {features.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="aee-feature-shortcut-pill" onClick={onNavigate}>
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            {label.replace("Start ", "").replace(" Mastery", "")}
          </Link>
        ))}
      </nav>
    );
  }

  const cardClass =
    variant === "grid"
      ? "aee-feature-shortcuts aee-feature-shortcuts--grid"
      : "aee-feature-shortcuts aee-feature-shortcuts--cards";

  return (
    <div className={`${cardClass} ${className}`.trim()}>
      {features.map(({ href, label, description, icon: Icon, accent }) => (
        <Link
          key={href}
          href={href}
          className="aee-feature-shortcut-card"
          onClick={onNavigate}
          style={{ "--feature-accent": accent } as CSSProperties}
        >
          <span className="aee-feature-shortcut-card-icon" aria-hidden>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="aee-feature-shortcut-card-label">{label}</span>
            <span className="aee-feature-shortcut-card-desc">{description}</span>
          </span>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </Link>
      ))}
    </div>
  );
}
