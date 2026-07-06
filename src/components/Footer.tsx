"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MARKETING_DISCLAIMER } from "@/lib/site";
import { LEGAL_ENTITY, TRADEMARK_NOTICE } from "@/lib/legal";
import { useUserAccess } from "@/lib/client/use-user-access";
import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";

const MARKETING_EXAM_LINKS = [
  { href: examMarketingPath("nclex"), label: "NCLEX prep" },
  { href: examMarketingPath("usmle"), label: "USMLE prep" },
  { href: examMarketingPath("naplex"), label: "NAPLEX prep" },
  { href: examMarketingPath("pance"), label: "PANCE prep" },
  { href: examMarketingPath("aanp-fnp"), label: "AANP FNP prep" },
  { href: examMarketingPath("npte-pt"), label: "NPTE prep" },
];

const STUDY_GUIDE_LINKS = [
  { href: "/compare", label: "Compare vs competitors" },
  { href: "/resources/uworld-alternative-multi-exam-prep-2026", label: "UWorld alternative guide" },
  { href: "/resources/nclex-vs-uworld-comparison-2026", label: "NCLEX vs UWorld" },
  { href: "/resources/nclex-vs-archer-comparison-2026", label: "NCLEX vs Archer" },
  { href: "/resources/naplex-vs-rxprep-comparison-2026", label: "NAPLEX vs RxPrep" },
];

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
        { href: ROUTES.practiceHub, label: "Practice Hub" },
        ...EXAM_NAV_ITEMS.map((e) => ({ href: e.href, label: e.label })),
        { href: ROUTES.drugs300, label: "Top 500 Drugs" },
      ]
    : [
        { href: ROUTES.practiceHub, label: "Practice Hub" },
        { href: ROUTES.toolkit, label: "Toolkit" },
        { href: ROUTES.pricing, label: "Pricing" },
        { href: "/about", label: "About" },
        ...MARKETING_EXAM_LINKS.slice(0, 3),
      ];

  const accountLinks = [
    ...(isAuthed
      ? [
          { href: ROUTES.practiceHub, label: "Practice Hub" },
          { href: ROUTES.analytics, label: "Analytics" },
          { href: ROUTES.feedback, label: "Feedback" },
        ]
      : [
          { href: ROUTES.auth.login, label: "Log in" },
          { href: ROUTES.auth.signup, label: "Sign up" },
          { href: ROUTES.feedback, label: "Feedback" },
        ]),
    { href: ROUTES.admin.login, label: "Admin login" },
  ];

  return (
    <footer
      className="apple-footer border-t border-black/[0.08] py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] dark:border-white/[0.08]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[980px] px-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-1">
            <BrandLogo href={ROUTES.home} variant="footer" />
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {MARKETING_DISCLAIMER}
            </p>
            <p className="mt-3 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
              {TRADEMARK_NOTICE}
            </p>
            <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
              © {new Date().getFullYear()} {LEGAL_ENTITY.productName}
            </p>
            <p className="mt-1 text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
              A product of {LEGAL_ENTITY.companyName}
            </p>
          </div>
          <nav aria-label="Product links">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
              Exams
            </p>
            <ul className="space-y-2" role="list">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Account links">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
              Account
            </p>
            <ul className="space-y-2" role="list">
              {accountLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Study guide links">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
              Study guides
            </p>
            <ul className="space-y-2" role="list">
              {STUDY_GUIDE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.toolkit}
                  className="text-sm font-semibold text-[var(--color-accent)] transition hover:underline"
                >
                  All guides →
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Legal links">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
              Legal
            </p>
            <ul className="space-y-2" role="list">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <SiteBottomBar className="mt-8" />
      </div>
    </footer>
  );
}
