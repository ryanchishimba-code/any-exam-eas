"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  STUDY_HUB_EXAM_BANKS,
  STUDY_HUB_PATH,
  TOP_500_DRUGS_PATH,
  questionBankHref,
  studyHubProgressHref,
} from "@/lib/study-hub/config";

const links = [
  { href: STUDY_HUB_PATH, label: "Study Hub" },
  ...STUDY_HUB_EXAM_BANKS.map((exam) => ({
    href: questionBankHref(exam.fieldId),
    label: exam.label,
  })),
  { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs" },
  { href: studyHubProgressHref(), label: "Progress" },
];

function StudySubnavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(href: string) {
    if (href === STUDY_HUB_PATH || href === studyHubProgressHref()) {
      return pathname === STUDY_HUB_PATH;
    }
    if (href === TOP_500_DRUGS_PATH) return pathname.startsWith(TOP_500_DRUGS_PATH);
    if (href.startsWith("/study/practice")) {
      const field = new URL(href, "http://local").searchParams.get("field");
      if (field && pathname.startsWith("/study/practice")) {
        return searchParams.get("field") === field;
      }
      return pathname.startsWith("/study/practice");
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
