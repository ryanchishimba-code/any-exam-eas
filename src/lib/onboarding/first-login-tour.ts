export type TourStepId = "today" | "bank" | "study-guide" | "readiness";
export type TourViewport = "mobile" | "desktop";

export type TourStepDef = {
  id: TourStepId;
  title: string;
  body: string;
  /** `data-tour` id on desktop, and on mobile when `mobileAnchor` is omitted. */
  anchor: string;
  /** Bottom-bar target on narrow viewports. */
  mobileAnchor?: string;
  /** Desktop-only extra spotlight (Review incorrect next to Question Bank). */
  extraAnchors?: string[];
  final?: boolean;
};

export function firstLoginTourSteps(boardName: string): TourStepDef[] {
  const board = boardName.trim() || "your board";
  return [
    {
      id: "today",
      title: "Start here every day",
      body: `A short ${board} set is waiting: new questions, plus anything you missed.`,
      anchor: "today",
    },
    {
      id: "bank",
      title: "Practice by topic, then fix misses",
      body: `Every ${board} question you miss lands in Review incorrect, with a short rationale and Show more when you want depth.`,
      anchor: "bank",
      extraAnchors: ["review-incorrect"],
    },
    {
      id: "study-guide",
      title: "Your study guide, built in",
      body: `Read a ${board} chapter, highlight, and add notes — your place is saved.`,
      anchor: "study-guide",
    },
    {
      id: "readiness",
      title: "See when you're ready",
      body: `Coverage, recent accuracy, and cleared misses show when you're ready for a ${board} Full Exam.`,
      anchor: "readiness",
      mobileAnchor: "stats",
      final: true,
    },
  ];
}

export function anchorForStep(step: TourStepDef, viewport: TourViewport): string {
  if (viewport === "mobile" && step.mobileAnchor) return step.mobileAnchor;
  return step.anchor;
}

export function spotlightAnchors(step: TourStepDef, viewport: TourViewport): string[] {
  const primary = anchorForStep(step, viewport);
  if (viewport === "desktop" && step.extraAnchors?.length) {
    return [primary, ...step.extraAnchors];
  }
  return [primary];
}

/**
 * Drop steps whose target is not on screen. Study guide is the usual skip:
 * boards without a book, and phones when the guide link is not in view.
 */
export function visibleTourSteps(
  steps: TourStepDef[],
  viewport: TourViewport,
  isVisible: (anchor: string) => boolean
): TourStepDef[] {
  return steps.filter((step) => spotlightAnchors(step, viewport).some((anchor) => isVisible(anchor)));
}
