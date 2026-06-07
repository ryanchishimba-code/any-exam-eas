/** Lightweight confetti burst for first exam selection — respects reduced motion. */
export async function fireExamSelectionConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const confetti = (await import("canvas-confetti")).default;
  const count = 120;
  const defaults = { origin: { y: 0.65 }, zIndex: 9999 };

  confetti({ ...defaults, particleCount: count * 0.4, spread: 60, startVelocity: 42 });
  confetti({ ...defaults, particleCount: count * 0.3, spread: 100, scalar: 0.9 });
  confetti({
    ...defaults,
    particleCount: count * 0.3,
    spread: 120,
    scalar: 0.75,
    colors: ["#14b8a6", "#0ea5e9", "#6366f1", "#f59e0b"],
  });
}
