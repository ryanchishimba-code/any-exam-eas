import Link from "next/link";
import { MARKETING_DISCLAIMER } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/study", label: "Study hub" },
      { href: "/generate", label: "Exam generator" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
      { href: "/feedback", label: "Feedback" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/disclaimer", label: "Disclaimers" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="apple-footer border-t border-black/[0.08] py-8"
      role="contentinfo"
    >
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Copyright © {new Date().getFullYear()} Any Exam Easy. All rights reserved.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <p className="mb-2 font-medium text-[var(--color-ink)]">{col.title}</p>
              <ul className="space-y-2" role="list">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[var(--color-ink-muted)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
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
