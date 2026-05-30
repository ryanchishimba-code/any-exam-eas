import Link from "next/link";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";

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
    <footer className="apple-footer border-t border-black/[0.08] py-8 dark:border-white/[0.08]">
      <div className="mx-auto max-w-[980px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Copyright © {new Date().getFullYear()} Any Exam Easy. All rights reserved.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-2 text-[var(--color-ink)]">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[var(--color-ink-muted)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-black/[0.06] pt-6 dark:border-white/[0.08] sm:flex-row sm:items-center sm:justify-between">
          <EmployeeAccessLink className="text-xs" />
          <p className="text-xs text-[var(--color-ink-muted)]">
            For users 18+. Not affiliated with accrediting bodies or licensure boards.
          </p>
        </div>
      </div>
    </footer>
  );
}
