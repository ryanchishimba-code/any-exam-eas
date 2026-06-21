"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MARKETING_DISCLAIMER } from "@/lib/site";
import { LEGAL_ENTITY } from "@/lib/legal";
import { useUserAccess } from "@/lib/client/use-user-access";
import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import { SiteBottomBar } from "@/components/layout/SiteBottomBar";

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
        { href: ROUTES.pricing, label: "Pricing" },
      ];

  const accountLinks = isAuthed
    ? [
        { href: ROUTES.practiceHub, label: "Practice Hub" },
        { href: ROUTES.analytics, label: "Analytics" },
        { href: ROUTES.feedback, label: "Feedback" },
      ]
    : [
        { href: ROUTES.auth.login, label: "Log in" },
        { href: ROUTES.auth.signup, label: "Sign up" },
        { href: ROUTES.feedback, label: "Feedback" },
      ];

  return (
    <footer
      className="apple-footer border-t border-black/[0.08] py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] dark:border-white/[0.08]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[980px] px-5 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <BrandLogo href={ROUTES.home} variant="footer" />
            <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {MARKETING_DISCLAIMER}
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
