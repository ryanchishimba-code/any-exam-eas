"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Pill,
  Stethoscope,
} from "lucide-react";

export const premiumFeatures = [
  {
    href: "/study/practice?field=nursing",
    label: "Start NCLEX Practice",
    description: "NGN cases, SATA & prioritization",
    icon: ClipboardList,
    accent: "#5856d6",
  },
  {
    href: "/study/practice?field=usmle-step-1",
    label: "Start USMLE Step 1",
    description: "Basic sciences & mechanisms",
    icon: Stethoscope,
    accent: "#0071e3",
  },
  {
    href: "/study/practice?field=usmle-step-2",
    label: "Start USMLE Step 2",
    description: "Clinical vignettes & management",
    icon: Stethoscope,
    accent: "#0a84ff",
  },
  {
    href: "/study/practice?field=pharmacy",
    label: "Start NAPLEX Practice",
    description: "Calculations & therapeutics",
    icon: ClipboardList,
    accent: "#34c759",
  },
  {
    href: "/study/drugs300",
    label: "Top 500 Drugs Mastery",
    description: "Pharm flashcards by drug class",
    icon: Pill,
    accent: "#0d9488",
  },
  {
    href: "/study/analytics",
    label: "Progress & Analytics",
    description: "Streaks, trends & weak areas",
    icon: BarChart3,
    accent: "#ff9500",
  },
] as const;

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
  if (variant === "bar") {
    return (
      <nav
        className={`aee-feature-shortcuts aee-feature-shortcuts--bar ${className}`.trim()}
        aria-label="Quick access"
      >
        {premiumFeatures.map(({ href, label, icon: Icon }) => (
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
      {premiumFeatures.map(({ href, label, description, icon: Icon, accent }) => (
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
