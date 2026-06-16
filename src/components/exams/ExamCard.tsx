"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  title: string;
  description: string;
  stat: string;
  icon: LucideIcon;
  accentClass: string;
  iconClass?: string;
  onClick?: () => void;
  selected?: boolean;
  asButton?: boolean;
};

export function ExamCard({
  href,
  title,
  description,
  stat,
  icon: Icon,
  accentClass,
  iconClass = "text-indigo-700",
  onClick,
  selected,
  asButton,
}: Props) {
  const inner = (
    <>
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm ring-1 ring-black/[0.04]">
        <Icon className={cn("h-5 w-5", iconClass)} strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{title}</h3>
        <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)] ring-1 ring-black/[0.04]">
          {stat}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
        Open
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </>
  );

  const className = cn(
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm transition-shadow",
    "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
    accentClass,
    selected && "ring-2 ring-[var(--color-accent)] ring-offset-2"
  );

  if (asButton) {
    return (
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={className}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
      <Link href={href} className={className}>
        {inner}
      </Link>
    </motion.div>
  );
}
