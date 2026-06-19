"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { firstName } from "@/lib/client/returning-user";
import { useSessionTone } from "@/lib/library/session-tone";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { libUi } from "@/lib/library/library-ui";
import { cn } from "@/lib/utils";

type Props = {
  /** Raw display name from the session; first name is derived for the greeting. */
  userName?: string | null;
  /** Current study streak in days (drives the personalized note). */
  streakDays: number;
  /** The single, obvious primary action — start a quick study session. */
  primaryHref: string;
};

/**
 * Section 1 — a short, personal greeting plus one large, unmistakable primary
 * action. Generous spacing and a single accent keep it calm and obvious.
 */
export function LibraryWelcome({ userName, streakDays, primaryHref }: Props) {
  const { copy } = useSessionTone();
  const { spring, tap } = useLibraryMotion();
  const name = firstName(userName);

  return (
    <section
      aria-labelledby="library-welcome-heading"
      className={cn(
        libUi.panel,
        "p-6 sm:p-8"
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0">
          {streakDays > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[12px] font-semibold text-amber-900">
              <Flame className="h-3.5 w-3.5 text-amber-600" aria-hidden />
              {copy.streakNote(streakDays)}
            </span>
          ) : null}
          <h1
            id="library-welcome-heading"
            className={cn(libUi.title, "mt-2.5 text-balance")}
          >
            {copy.greeting(name)}
          </h1>
          <p className={cn(libUi.subtitle, "mt-1.5 max-w-md")}>
            {streakDays > 0
              ? "Pick up where you left off, or jump into a quick set."
              : copy.quickStartHint}
          </p>
        </div>

        {/* Large, obvious primary action with a natural press-in. */}
        <motion.div whileTap={tap} transition={spring} className="shrink-0">
          <Link
            href={primaryHref}
            className={cn(
              "group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-6 py-4 text-[15px] font-semibold text-white shadow-[var(--shadow-apple-btn)] transition-[opacity,box-shadow]",
              "hover:opacity-95 sm:w-auto"
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {copy.quickStartLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
