"use client";

import { useReducedMotion, type Transition, type Variants } from "framer-motion";

/**
 * Apple-style motion primitives for the Library.
 *
 * Two transitions cover everything we need:
 *  - `APPLE_SPRING`  → tactile hover/tap/selection (natural, slightly springy)
 *  - `APPLE_EASE`    → calm reveals and layout shifts (gentle ease-out curve)
 *
 * All motion is funneled through `useLibraryMotion()` so we can disable it
 * cleanly when the user prefers reduced motion.
 */
export const APPLE_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

export const APPLE_EASE: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const revealContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: APPLE_EASE },
};

export type LibraryMotion = {
  /** Whether motion is suppressed (reduced-motion preference). */
  reduce: boolean;
  /** Stagger container props — spread onto a wrapping `motion` element. */
  container: {
    variants: Variants;
    initial: string | false;
    animate: string;
  };
  /** Child reveal props — spread onto each `motion` child. */
  item: { variants: Variants };
  /** Subtle press-in for buttons/cards. */
  tap: { scale: number } | undefined;
  /** Subtle lift on hover for interactive surfaces. */
  hover: { y: number; scale: number } | undefined;
  spring: Transition;
  ease: Transition;
};

export function useLibraryMotion(): LibraryMotion {
  const reduce = useReducedMotion() ?? false;

  return {
    reduce,
    container: {
      variants: revealContainer,
      initial: reduce ? false : "hidden",
      animate: "show",
    },
    item: { variants: reduce ? {} : revealItem },
    tap: reduce ? undefined : { scale: 0.985 },
    hover: reduce ? undefined : { y: -2, scale: 1.01 },
    spring: APPLE_SPRING,
    ease: APPLE_EASE,
  };
}
