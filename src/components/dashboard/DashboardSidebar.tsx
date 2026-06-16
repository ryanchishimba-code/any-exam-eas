"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, LayoutGrid, Layers } from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { cn } from "@/lib/utils";
import {
  STUDY_HUB_EXAM_BANKS,
  STUDY_HUB_PATH,
  TOP_500_DRUGS_PATH,
  questionBankHref,
  studyHubProgressHref,
} from "@/lib/study-hub/config";

const BASE_NAV = [
  { href: STUDY_HUB_PATH, label: "Study Hub", icon: LayoutGrid },
  ...STUDY_HUB_EXAM_BANKS.map((exam) => ({
    href: questionBankHref(exam.fieldId),
    label: exam.label,
    icon: BookOpen,
  })),
  { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs", icon: Layers, clinicalOnly: true },
  { href: studyHubProgressHref(), label: "Progress", icon: BarChart3 },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);

  const nav = useMemo(
    () => BASE_NAV.filter((item) => !("clinicalOnly" in item && item.clinicalOnly) || clinical),
    [clinical]
  );

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href.startsWith("/study/practice") && pathname.startsWith("/study/practice")) ||
            (href === STUDY_HUB_PATH && pathname === STUDY_HUB_PATH);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
