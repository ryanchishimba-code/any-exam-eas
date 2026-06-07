/**
 * Unified design tokens for Any Exam Easy.
 * Use these in new components for consistent premium feel.
 */
export const design = {
  radius: {
    card: "rounded-3xl",
    button: "rounded-xl",
    pill: "rounded-full",
  },
  shadow: {
    card: "shadow-sm hover:shadow-lg",
    cardHover: "hover:shadow-xl hover:shadow-teal-500/10",
  },
  motion: {
    spring: { type: "spring" as const, damping: 28, stiffness: 320 },
    stagger: 0.08,
  },
  accent: {
    gradient: "bg-gradient-to-br from-teal-600 to-cyan-700",
    text: "text-teal-600 dark:text-teal-400",
    ring: "focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2",
  },
} as const;
