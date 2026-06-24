"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  LayoutGrid,
  Layers,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { questionBankHref } from "@/lib/edtech/practice-links";
import {
  STUDY_HUB_PATH,
  TOP_500_DRUGS_PATH,
} from "@/lib/study-hub/config";
import { ROUTES, fullExamHref } from "@/lib/routes";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

type ModeItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  clinicalOnly?: boolean;
};

const MODE_ITEM_DEFS: Omit<ModeItem, "href">[] = [
  { id: "full-exam", label: "Full Exam", icon: Clock },
  { id: "question-bank", label: "Question Bank", icon: SlidersHorizontal },
  {
    id: "top-500",
    label: "Top 500 Drugs",
    icon: Layers,
    clinicalOnly: true,
  },
];

function StudyModeNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);

  const onStudyHub =
    pathname === STUDY_HUB_PATH || pathname.startsWith(`${STUDY_HUB_PATH}/`);
  const onAnalytics =
    pathname === ROUTES.analytics || pathname.startsWith(`${ROUTES.analytics}/`);

  const modeItems = useMemo((): ModeItem[] => {
    const fullExamLink = examSlug ? fullExamHref(examSlug) : ROUTES.fullExam;
    const bankLink = questionBankHref(examSlug ?? undefined);

    return MODE_ITEM_DEFS.filter((item) => !item.clinicalOnly || clinical).map((item) => {
      if (item.id === "full-exam") return { ...item, href: fullExamLink };
      if (item.id === "question-bank") return { ...item, href: bankLink };
      if (item.id === "top-500") return { ...item, href: TOP_500_DRUGS_PATH };
      return { ...item, href: STUDY_HUB_PATH };
    });
  }, [clinical, examSlug]);

  function isModeActive(id: string, href: string) {
    if (id === "full-exam") return pathname.startsWith(`${ROUTES.fullExam}/`);
    if (id === "top-500") return pathname.startsWith(TOP_500_DRUGS_PATH);
    if (id === "question-bank") {
      return (
        pathname === href ||
        pathname.startsWith(`${href.split("?")[0]}/`) ||
        (pathname.startsWith("/study/practice") && mode === "bank")
      );
    }
    return pathname === href;
  }

  return (
    <nav
      className="flex flex-wrap items-center gap-2 sm:gap-2.5"
      aria-label="Study Hub navigation"
    >
      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href={STUDY_HUB_PATH}
          aria-current={onStudyHub ? "page" : undefined}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition active:scale-[0.98]",
            onStudyHub
              ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-sm)]"
              : "border border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 text-[var(--color-accent)] ring-1 ring-inset ring-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/18"
          )}
        >
          {!onStudyHub ? (
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
          ) : (
            <LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
          )}
          Dashboard
        </Link>

        <Link
          href={ROUTES.analytics}
          aria-current={onAnalytics ? "page" : undefined}
          className={cn(
            studyUi.filterPill,
            "inline-flex items-center gap-1.5",
            onAnalytics ? studyUi.filterPillActive : studyUi.filterPillIdle
          )}
        >
          <BarChart3 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Analytics
        </Link>
      </div>

      <span
        className="hidden h-5 w-px shrink-0 bg-[var(--color-border)] sm:block"
        aria-hidden
      />

      <div className={cn(studyUi.chipRow, "min-w-0 flex-1")}>
        {modeItems.map(({ id, href, label, icon: Icon }) => {
          const active = isModeActive(id, href);
          return (
            <Link
              key={id}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                studyUi.filterPill,
                "inline-flex items-center gap-1.5",
                active ? studyUi.filterPillActive : studyUi.filterPillIdle
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function StudyModeNav({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div
          className={cn("h-10 animate-pulse rounded-full bg-[var(--color-surface)]", className)}
          aria-hidden
        />
      }
    >
      <div className={className}>
        <StudyModeNavInner />
      </div>
    </Suspense>
  );
}
