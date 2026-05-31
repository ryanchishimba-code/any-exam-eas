"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, LogOut, Menu, Settings, User, X } from "lucide-react";
import { useState } from "react";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";
import { AvatarDropdown } from "@/components/navigation/AvatarDropdown";

const links = [
  { href: "/study", label: "Study" },
  { href: "/generate", label: "Exams" },
  { href: "/study/drugs300", label: "Top 300 Drugs" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

function navClass(active: boolean) {
  return active
    ? "font-semibold text-[var(--color-ink)] underline decoration-2 underline-offset-4 decoration-[var(--color-accent)]"
    : "text-[var(--color-ink)] opacity-80 hover:opacity-100 hover:underline hover:underline-offset-4";
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="apple-glass aee-nav fixed top-0 z-50 w-full dark:border-white/5">
      <nav
        className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-5 sm:px-6 md:h-[3.25rem]"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-[0.8125rem] font-semibold tracking-tight text-[var(--color-ink)] transition-opacity hover:opacity-80"
        >
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-6 lg:flex" role="list">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-xs transition-opacity duration-200 ${navClass(isActive(l.href))}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <EmployeeAccessLink className="hidden xl:inline text-xs opacity-80" />
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            {session?.user ? (
              <AvatarDropdown />
            ) : (
              <div className="flex items-center gap-3">
                <LoginModalTrigger className="text-xs font-medium text-[var(--color-ink)] opacity-80 transition-opacity hover:opacity-100">
                  Log in
                </LoginModalTrigger>
                <Link
                  href="/signup?plan=trial"
                  className="aee-nav-cta"
                >
                  Start free trial
                </Link>
              </div>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-2 lg:hidden">
          {session?.user && <AvatarDropdown />}
          <ThemeToggle />
          <button
            type="button"
            className="text-[var(--color-ink)] opacity-80"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="aee-mobile-nav border-t border-black/[0.04] bg-[rgba(251,251,253,0.98)] px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(0,0,0,0.98)] lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block py-2.5 text-sm ${navClass(isActive(l.href))}`}
              aria-current={isActive(l.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {!session?.user && (
            <>
              <LoginModalTrigger
                className="mt-2 block w-full py-2.5 text-left text-sm text-[var(--color-ink)]"
                onClick={() => setOpen(false)}
              >
                Log in
              </LoginModalTrigger>
              <Link
                href="/signup?plan=trial"
                className="aee-nav-cta mt-3 block py-3 text-center text-sm"
                onClick={() => setOpen(false)}
              >
                Start free trial
              </Link>
            </>
          )}
          {session?.user && (
            <div className="mt-3 space-y-1 border-t border-black/[0.06] pt-3 dark:border-white/10">
              <Link href="/dashboard" className="aee-mobile-nav-item" onClick={() => setOpen(false)}>
                <User className="h-4 w-4" aria-hidden /> Profile
              </Link>
              <Link href="/study/analytics" className="aee-mobile-nav-item" onClick={() => setOpen(false)}>
                <BarChart3 className="h-4 w-4" aria-hidden /> Progress &amp; Analytics
              </Link>
              <Link href="/dashboard" className="aee-mobile-nav-item" onClick={() => setOpen(false)}>
                <Settings className="h-4 w-4" aria-hidden /> Settings
              </Link>
              <button
                type="button"
                className="aee-mobile-nav-signout"
                onClick={() => {
                  setOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
              >
                <LogOut className="h-4 w-4" aria-hidden /> Sign out
              </button>
            </div>
          )}
          <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/10">
            <EmployeeAccessLink className="text-xs" />
          </div>
        </div>
      )}
    </header>
  );
}
