"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { MARKETING_DISCLAIMER } from "@/lib/site";
import { useUserAccess } from "@/lib/client/use-user-access";

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/disclaimer", label: "Disclaimers" },
];

export function Footer() {
  const { status } = useSession();
  const { hasPremiumAccess, loading } = useUserAccess();
  const isAuthed = status === "authenticated";
  const showPremiumLinks = !loading && hasPremiumAccess;

  const productLinks = showPremiumLinks
    ? [
        { href: "/studygub", label: "StudyGub" },
        { href: "/study/practice?field=nursing", label: "NCLEX bank" },
        { href: "/study/practice?field=usmle-step-1", label: "USMLE bank" },
        { href: "/study/practice?field=pharmacy", label: "NAPLEX bank" },
        { href: "/study/drugs300", label: "Top 500 Drugs" },
      ]
    : [
        { href: "/studygub", label: "StudyGub" },
        { href: "/pricing", label: "Pricing" },
      ];

  const accountLinks = isAuthed
    ? [
        { href: "/studygub", label: "StudyGub" },
        { href: "/feedback", label: "Feedback" },
      ]
    : [
        { href: "/login", label: "Log in" },
        { href: "/signup", label: "Sign up" },
        { href: "/feedback", label: "Feedback" },
      ];

  return (
    <footer className="apple-footer border-t border-black/[0.08] py-8" role="contentinfo">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Copyright © {new Date().getFullYear()} Any Exam Easy. All rights reserved.
            </p>
          </div>
          <nav aria-label="Product links">
            <p className="mb-2 font-medium text-[var(--color-ink)]">Product</p>
            <ul className="space-y-2" role="list">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--color-ink-muted)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Account links">
            <p className="mb-2 font-medium text-[var(--color-ink)]">Account</p>
            <ul className="space-y-2" role="list">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--color-ink-muted)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <p className="mb-2 font-medium text-[var(--color-ink)]">Legal</p>
            <ul className="space-y-2" role="list">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--color-ink-muted)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 border-t border-black/[0.06] pt-6">
          <p className="text-xs text-[var(--color-ink-muted)]">
            For users 18+. Not affiliated with accrediting bodies or licensure boards.{" "}
            {MARKETING_DISCLAIMER}
          </p>
        </div>
      </div>
    </footer>
  );
}
