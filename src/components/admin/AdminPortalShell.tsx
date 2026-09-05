"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  MessageSquare,
  Headphones,
  LogOut,
  Menu,
  X,
  Shield,
  UserCog,
  FileText,
  ListChecks,
  Quote,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { signOutAndCleanup } from "@/lib/client/sign-out";
import { displayFirstLastInitial } from "@/lib/display-name";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics", label: "Traffic & analytics", icon: BarChart3 },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/questions", label: "Question bank", icon: ListChecks },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/social", label: "Social & community", icon: Share2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/employees", label: "Employees", icon: UserCog },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/support", label: "Customer Service", icon: Headphones },
];

function navLinkClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm dark:bg-indigo-500"
    : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50";
}

export function AdminPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-100">
          <Shield size={18} className="text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Admin Dashboard
          </p>
        </div>
        <p className="mt-3 truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
          {session?.user?.name
            ? displayFirstLastInitial(session.user.name, session.user.email)
            : "Administrator"}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-zinc-400">{session?.user?.email}</p>
        {(session?.user as { role?: string })?.role && (
          <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200">
            {(session?.user as { role?: string }).role?.replace("_", " ")}
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(active)}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t border-slate-200 pt-4 dark:border-zinc-800">
        <Link
          href="/"
          className="block px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Public site
        </Link>
        <Link
          href="/internal"
          className="block px-3 py-2 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Employee portal →
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            await signOutAndCleanup({ callbackUrl: "/admin/login" });
            setSigningOut(false);
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <LogOut size={16} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <div className="hidden md:block">{sidebar}</div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900 md:px-8">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-800 dark:text-zinc-200 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-100 md:text-base">
              Any Exam Easy · Admin
            </p>
            <div className="w-8 md:hidden" />
          </header>

          {mobileOpen && (
            <div className="border-b border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
              {sidebar}
            </div>
          )}

          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
