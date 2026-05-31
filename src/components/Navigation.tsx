"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LoginModalTrigger } from "@/components/auth/LoginModalTrigger";

const links = [
  { href: "/study", label: "Study" },
  { href: "/generate", label: "Exams" },
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
    <header className="apple-glass fixed top-0 z-50 w-full dark:border-white/5">
      <nav
        className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-6 md:h-12"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-[0.8125rem] font-semibold tracking-tight text-[var(--color-ink)] transition-opacity hover:opacity-80"
        >
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-7 md:flex" role="list">
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
            <EmployeeAccessLink className="hidden lg:inline text-xs opacity-80" />
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="text-xs text-[var(--color-ink)] opacity-80 transition-opacity hover:opacity-100"
              >
                Account
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <LoginModalTrigger className="text-xs font-medium text-[var(--color-ink)] opacity-80 transition-opacity hover:opacity-100">
                  Log in
                </LoginModalTrigger>
                <Link
                  href="/signup?plan=trial"
                  className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(13,148,136,0.35)] transition-opacity hover:opacity-90"
                >
                  Sign up free
                </Link>
              </div>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-[var(--color-ink)] opacity-80"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/[0.04] bg-[rgba(251,251,253,0.98)] px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(0,0,0,0.98)] md:hidden">
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
          {session?.user ? (
            <Link
              href="/dashboard"
              className="mt-2 block py-2.5 text-sm text-[var(--color-ink)]"
              onClick={() => setOpen(false)}
            >
              Account
            </Link>
          ) : (
            <LoginModalTrigger
              className="mt-2 block w-full py-2.5 text-left text-sm text-[var(--color-ink)]"
              onClick={() => setOpen(false)}
            >
              Log in
            </LoginModalTrigger>
          )}
          {!session?.user && (
            <Link
              href="/signup?plan=trial"
              className="mt-3 block rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Sign up free
            </Link>
          )}
          <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/10">
            <EmployeeAccessLink className="text-xs" />
          </div>
        </div>
      )}
    </header>
  );
}
