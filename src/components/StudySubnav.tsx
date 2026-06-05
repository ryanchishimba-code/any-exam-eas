"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  STUDYGUB_EXAM_BANKS,
  STUDYGUB_PATH,
  TOP_500_DRUGS_PATH,
  questionBankHref,
} from "@/lib/studygub/config";

const links = [
  { href: STUDYGUB_PATH, label: "StudyGub" },
  ...STUDYGUB_EXAM_BANKS.map((exam) => ({
    href: questionBankHref(exam.fieldId),
    label: exam.label,
  })),
  { href: TOP_500_DRUGS_PATH, label: "Top 500 Drugs" },
];

function StudySubnavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function isActive(href: string) {
    if (href === STUDYGUB_PATH) return pathname === STUDYGUB_PATH;
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
    <nav className="apple-product-nav mt-6" aria-label="StudyGub navigation">
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
