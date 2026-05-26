"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { EmployeeAccessLink } from "@/components/EmployeeAccessLink";

const links = [
  { href: "/study", label: "Study" },
  { href: "/learn", label: "Flashcards" },
  { href: "/generate", label: "Exams" },
  { href: "/progress", label: "Progress" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

function navClass(active: boolean) {
  return active
    ? "text-[var(--color-ink)] font-medium"
    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]";
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
    <header className="apple-glass fixed top-0 z-50 w-full">
      <nav className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-6 md:h-12">
        <Link
          href="/"
          className="text-[0.9375rem] font-semibold tracking-tight text-[var(--color-ink)] transition-opacity hover:opacity-70"
        >
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-xs transition-colors duration-200 ${navClass(isActive(l.href))}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <EmployeeAccessLink className="hidden lg:inline" />
          </li>
          <li>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-full border border-black/[0.08] px-4 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-black/[0.14]"
              >
                Account
              </Link>
            ) : (
              <Link
                href="/signup"
                className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[var(--color-accent-hover)] hover:shadow-[0_2px_10px_rgba(0,113,227,0.35)]"
              >
                Sign up
              </Link>
            )}
          </li>
        </ul>

        <button
          type="button"
          className="text-[var(--color-ink)] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/[0.04] bg-[rgba(251,251,253,0.95)] px-6 py-5 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block py-2.5 text-[0.9375rem] ${navClass(isActive(l.href))}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={session?.user ? "/dashboard" : "/signup"}
            className="mt-3 inline-block text-[0.9375rem] font-medium text-[var(--color-accent)]"
            onClick={() => setOpen(false)}
          >
            {session?.user ? "Account" : "Sign up"}
          </Link>
          <div className="mt-4 border-t border-black/[0.06] pt-4">
            <EmployeeAccessLink className="text-[0.875rem]" />
          </div>
        </div>
      )}
    </header>
  );
}
