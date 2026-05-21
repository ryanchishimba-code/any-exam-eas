"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/generate", label: "Generate" },
  { href: "/learn", label: "Learn" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--color-ink)]"
        >
          Any Exam Easy
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
          >
            Dashboard
          </Link>
          <Button href="/signup" variant="primary" className="!px-4 !py-2 text-xs">
            Start free trial
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
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
          <Link href="/dashboard" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <div className="pt-3">
            <Button href="/signup" className="w-full">
              Start free trial
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
