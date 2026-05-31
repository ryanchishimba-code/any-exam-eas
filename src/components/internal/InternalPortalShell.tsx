"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOutAndCleanup } from "@/lib/client/sign-out";

const navItems = [
  { href: "/internal", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/internal/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/internal/questions", label: "Questions", icon: HelpCircle },
  { href: "/internal/users", label: "Users", icon: Users },
  { href: "/internal/feedback", label: "Feedback", icon: MessageSquare },
];

function navLinkClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-lg bg-black/[0.06] px-3 py-2.5 text-sm font-medium text-[var(--color-ink)]"
    : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)]";
}

export function InternalPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebar = (
  <aside className="flex h-full w-56 shrink-0 flex-col border-r border-black/[0.06] bg-[var(--color-surface-elevated)] p-4">
      <div className="mb-6 px-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-black/45">
          Employee portal
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-[var(--color-ink)]">
          {session?.user?.name ?? "Staff"}
        </p>
        <p className="truncate text-xs text-black/50">{session?.user?.email}</p>
        {(session?.user as { role?: string })?.role && (
          <span className="mt-2 inline-block rounded-full bg-black/[0.06] px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-black/60">
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

      <div className="mt-auto space-y-2 border-t border-black/[0.06] pt-4">
        <Link
          href="/dashboard"
          className="block px-3 py-2 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
        >
          ← Student dashboard
        </Link>
        <button
          type="button"
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            await signOutAndCleanup({ callbackUrl: "/" });
            setSigningOut(false);
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)] disabled:opacity-60"
        >
          <LogOut size={16} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="apple-page min-h-screen">
      <div className="mx-auto flex min-h-[calc(100vh-var(--page-top))] max-w-7xl">
        <div className="hidden md:block">{sidebar}</div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 md:px-8">
            <button
              type="button"
              className="rounded-lg p-2 text-[var(--color-ink)] md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <p className="text-sm font-medium text-[var(--color-ink)] md:text-base">
              Any Exam Easy · Internal
            </p>
            <div className="w-10 md:hidden" />
          </header>

          {mobileOpen && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/20"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              />
              <div className="relative z-50 h-full w-64 shadow-xl">{sidebar}</div>
            </div>
          )}

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
