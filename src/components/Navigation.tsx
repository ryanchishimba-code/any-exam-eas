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
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Any Exam Easy
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-xs text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/signup"
              className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white"
            >
              Start free trial
            </Link>
          </li>
        </ul>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="mt-2 block text-sm font-medium text-[var(--color-accent)]"
            onClick={() => setOpen(false)}
          >
            Start free trial
          </Link>
        </div>
      )}
    </header>
  );
}
