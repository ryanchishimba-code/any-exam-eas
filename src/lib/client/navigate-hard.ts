/** Hard navigation — use after creating an exam session when soft router.push can stall. */
export function navigateHard(href: string): void {
  if (typeof window === "undefined") return;
  window.location.assign(href);
}
