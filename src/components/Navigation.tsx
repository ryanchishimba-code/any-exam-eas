"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/study", label: "Study" },
  { href: "/generate", label: "Exams" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

function navClass(active: boolean) {
  return active
    ? "text-[var(--color-ink)] opacity-100"
    : "text-[var(--color-ink)] opacity-80 hover:opacity-100";
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
      <nav className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-6 md:h-12">
        <Link
          href="/"
          className="text-[0.8125rem] font-normal tracking-tight text-[var(--color-ink)] opacity-90 transition-opacity hover:opacity-100"
        >
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-xs transition-opacity duration-200 ${navClass(isActive(l.href))}`}
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
              <Link
                href="/signup"
                className="text-xs text-[var(--color-accent)] transition-opacity hover:opacity-80"
              >
                Sign up
              </Link>
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
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={session?.user ? "/dashboard" : "/signup"}
            className="mt-2 block py-2.5 text-sm text-[var(--color-accent)]"
            onClick={() => setOpen(false)}
          >
            {session?.user ? "Account" : "Sign up"}
          </Link>
          <div className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/10">
            <EmployeeAccessLink className="text-xs" />
          </div>
        </div>
      )}
    </header>
  );
}
