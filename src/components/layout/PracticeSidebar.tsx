"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, LayoutGrid, Zap } from "lucide-react";
import { EXAM_NAV_ITEMS, ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const MODES = [
  { href: ROUTES.practiceHub, label: "Study Hub", icon: LayoutGrid, exact: true },
  { href: "/study/practice?mode=bank", label: "Question bank", icon: BookOpen },
  { href: "/study/practice?mode=timed", label: "Timed exam", icon: Clock },
  { href: "/study/analytics", label: "Analytics", icon: Zap },
] as const;

function linkClass(active: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    active
      ? "bg-indigo-600 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  );
}

export function PracticeSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href.split("?")[0]!);
  }

  return (
    <aside
      className="hidden w-56 shrink-0 lg:block"
      aria-label="Practice navigation"
    >
      <nav className="sticky top-[calc(var(--nav-height)+1rem)] space-y-6">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Practice
          </p>
          <ul className="space-y-0.5" role="list">
            {MODES.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={linkClass(isActive(m.href, "exact" in m && m.exact))}
                  aria-current={isActive(m.href, "exact" in m && m.exact) ? "page" : undefined}
                >
                  <m.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Exams
          </p>
          <ul className="space-y-0.5" role="list">
            {EXAM_NAV_ITEMS.map((exam) => (
              <li key={exam.slug}>
                <Link
                  href={exam.href}
                  className={linkClass(pathname.startsWith(`/exams/${exam.slug}`) || pathname.startsWith(`/practice/${exam.slug}`))}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" aria-hidden />
                  {exam.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
