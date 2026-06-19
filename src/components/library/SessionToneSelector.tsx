"use client";

import { motion } from "framer-motion";
import {
  SESSION_TONES,
  SESSION_TONE_ORDER,
  useSessionTone,
} from "@/lib/library/session-tone";
import { useLibraryMotion } from "@/lib/library/use-library-motion";
import { cn } from "@/lib/utils";

/**
 * Compact Session Tone selector — an Apple-style segmented control.
 *
 * The active "pill" slides between options using a shared layout animation
 * (springy, natural). Switching tone only changes the Library's language, never
 * its layout. Falls back to a static highlight under reduced-motion.
 */
export function SessionToneSelector() {
  const { toneId, setTone } = useSessionTone();
  const { reduce, spring } = useLibraryMotion();

  return (
    <div
      role="radiogroup"
      aria-label="Session tone"
      className="relative inline-flex items-center gap-0.5 rounded-full border border-black/[0.05] bg-black/[0.035] p-0.5 backdrop-blur-sm"
    >
      {SESSION_TONE_ORDER.map((id) => {
        const tone = SESSION_TONES[id];
        const active = id === toneId;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            title={`${tone.label} — ${tone.description}`}
            onClick={() => setTone(id)}
            className={cn(
              "relative rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors duration-200",
              active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            {active ? (
              reduce ? (
                <span className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]" />
              ) : (
                <motion.span
                  layoutId="session-tone-pill"
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-white shadow-[var(--shadow-apple-sm)]"
                />
              )
            ) : null}
            <span className="relative z-10">{tone.short}</span>
          </button>
        );
      })}
    </div>
  );
}
