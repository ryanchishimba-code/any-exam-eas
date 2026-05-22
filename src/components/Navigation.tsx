"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/generate", label: "Generate" },
  { href: "/learn", label: "Learn" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="apple-glass fixed top-0 z-50 w-full">
      <nav className="mx-auto flex h-11 max-w-[980px] items-center justify-between px-6 md:h-12">
        <Link
          href="/"
          className="text-[0.9375rem] font-semibold tracking-tight text-[var(--color-ink)] transition-opacity hover:opacity-70"
        >
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-xs text-[var(--color-ink-muted)] transition-colors duration-200 hover:text-[var(--color-ink)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[var(--color-accent-hover)] hover:shadow-[0_2px_10px_rgba(0,113,227,0.35)]"
            >
              Start free trial
            </Link>
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
              className="block py-2.5 text-[0.9375rem] text-[var(--color-ink)]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="mt-3 inline-block text-[0.9375rem] font-medium text-[var(--color-accent)]"
            onClick={() => setOpen(false)}
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  );
}
