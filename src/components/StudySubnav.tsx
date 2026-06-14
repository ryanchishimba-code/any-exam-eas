"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import {
  QUESTION_BANK_PATH,
  STUDY_HUB_PATH,
  TIMED_EXAM_PATH,
  TOP_500_DRUGS_PATH,
  studyHubProgressHref,
} from "@/lib/study-hub/config";

const ALL_LINKS = [
  { href: STUDY_HUB_PATH, label: "Study Hub" },
  { href: TIMED_EXAM_PATH, label: "Timed Exam" },
  { href: QUESTION_BANK_PATH, label: "Question Bank" },
  { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs", clinicalOnly: true },
  { href: studyHubProgressHref(), label: "Progress" },
];

function StudySubnavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { examSlug } = useAppPreferences();
  const clinical = hasClinicalStudyTools(examSlug);

  const links = useMemo(
    () => ALL_LINKS.filter((l) => !("clinicalOnly" in l && l.clinicalOnly) || clinical),
    [clinical]
  );

  function isActive(href: string) {
    if (href === STUDY_HUB_PATH) {
      return pathname === STUDY_HUB_PATH || pathname.startsWith(`${STUDY_HUB_PATH}/`);
    }
    if (href === studyHubProgressHref()) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    if (href === TOP_500_DRUGS_PATH) return pathname.startsWith(TOP_500_DRUGS_PATH);
    if (href === TIMED_EXAM_PATH) {
      return pathname === href || pathname.startsWith(`${href}/`);
    }
    if (href === QUESTION_BANK_PATH) {
      return (
        pathname === href ||
        pathname.startsWith(`${href}/`) ||
        (pathname.startsWith("/study/practice") && mode === "bank")
      );
    }
    return pathname === href;
  }

  return (
    <nav className="apple-product-nav mt-6" aria-label="Study Hub navigation">
      {links.map((l) => (
        <Link key={l.href} href={l.href} data-active={isActive(l.href) ? "true" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export function StudySubnav() {
  return (
    <Suspense fallback={<nav className="apple-product-nav mt-6" aria-hidden />}>
      <StudySubnavInner />
    </Suspense>
  );
}
