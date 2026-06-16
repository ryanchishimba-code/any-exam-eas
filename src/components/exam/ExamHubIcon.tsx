"use client";

import { Activity, Beaker, HeartPulse, Pill, Stethoscope, type LucideIcon } from "lucide-react";
import type { ExamSlug } from "@/lib/exams/catalog";

const ICONS: Record<ExamSlug, LucideIcon> = {
  nclex: Activity,
  usmle: Stethoscope,
  naplex: Pill,
  pance: HeartPulse,
  top500: Beaker,
};

export function ExamHubIcon({
  slug,
  className = "h-7 w-7",
}: {
  slug: ExamSlug;
  className?: string;
}) {
  const Icon = ICONS[slug];
  return <Icon className={className} aria-hidden />;
}
