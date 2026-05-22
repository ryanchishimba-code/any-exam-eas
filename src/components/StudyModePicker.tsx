"use client";

import Link from "next/link";
import { BookOpen, Layers } from "lucide-react";

export type StudyFormat = "flashcards" | "exam";

const modes: {
  id: StudyFormat;
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
}[] = [
  {
    id: "flashcards",
    title: "Flashcards",
    description: "Flip through term → definition tiles in a learning quilt. Great for memorization.",
    href: "/learn",
    icon: Layers,
  },
  {
    id: "exam",
    title: "Exam questions",
    description: "Full multiple-choice practice exams with scoring, explanations, and check-your-work flow.",
    href: "/generate",
    icon: BookOpen,
  },
];

export function StudyModePicker({
  active,
  compact = false,
}: {
  active?: StudyFormat;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => {
          const isActive = active === m.id;
          return (
            <Link
              key={m.id}
              href={m.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--color-accent)] text-white"
                  : "border border-black/[0.08] bg-white text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m.title}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = active === m.id;
        return (
          <Link
            key={m.id}
            href={m.href}
            className={`apple-card apple-card-hover block p-6 transition ${
              isActive ? "ring-2 ring-[var(--color-accent)]" : ""
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
              <Icon className="text-[var(--color-accent)]" size={22} strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {m.description}
            </p>
            <p className="mt-4 text-sm font-medium text-[var(--color-accent)]">
              {isActive ? "Current mode" : "Start →"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
