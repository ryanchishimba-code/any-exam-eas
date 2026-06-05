"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardList,
  LayoutDashboard,
  Layers,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prep/nclex", label: "Question Bank", icon: BookOpen },
  { href: "/study/drugs300", label: "Flashcards", icon: Layers },
  { href: "/exam/nclex", label: "Practice Exams", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/generate", label: "AI Engine", icon: Brain },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <nav className="sticky top-24 space-y-1 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href.split("/").slice(0, 2).join("/")));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
