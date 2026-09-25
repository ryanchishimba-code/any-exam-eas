"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  anchorForStep,
  spotlightAnchors,
  type TourStepDef,
  type TourViewport,
} from "@/lib/onboarding/first-login-tour";
import {
  findVisibleTourAnchor,
  isTourAnchorVisible,
  measureTourHole,
  scrollTourAnchorIntoView,
  tourScrollOffsetPx,
  tourViewport,
  type TourHole,
} from "@/lib/onboarding/tour-client";

export type TourDismissVia = "skip" | "close" | "esc";
export type TourCompleteVia = "cta" | "next" | "target_click";

type ProductTourProps = {
  steps: TourStepDef[];
  open: boolean;
  onDismiss: (via: TourDismissVia, stepIndex: number, stepId: string) => void;
  onComplete: (via: TourCompleteVia, stepIndex: number) => void;
  onStepViewed: (stepId: string, stepIndex: number, total: number) => void;
  onStepMissing: (stepId: string) => void;
  /** Preview/screenshots: open on this step and do not auto-skip it. */
  initialStep?: number;
  freeze?: boolean;
};

function sameHoles(a: TourHole[], b: TourHole[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((hole, i) => {
    const other = b[i];
    if (!other) return false;
    return (
      Math.round(hole.x) === Math.round(other.x) &&
      Math.round(hole.y) === Math.round(other.y) &&
      Math.round(hole.width) === Math.round(other.width) &&
      Math.round(hole.height) === Math.round(other.height)
    );
  });
}

function pointInHole(x: number, y: number, hole: TourHole): boolean {
  return x >= hole.x && x <= hole.x + hole.width && y >= hole.y && y <= hole.y + hole.height;
}

function focusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute("disabled"));
}

export function ProductTour({
  steps,
  open,
  onDismiss,
  onComplete,
  onStepViewed,
  onStepMissing,
  initialStep = 0,
  freeze = false,
}: ProductTourProps) {
  const titleId = useId();
  const bodyId = useId();
  const liveId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const missingFired = useRef(new Set<string>());
  const scrolledFor = useRef<string | null>(null);
  const [index, setIndex] = useState(initialStep);
  const [holes, setHoles] = useState<TourHole[]>([]);
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState<TourViewport>("desktop");

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const sync = () => setViewport(tourViewport());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [open]);

  useEffect(() => {
    if (open) setIndex(Math.min(initialStep, Math.max(0, steps.length - 1)));
  }, [open, initialStep, steps.length]);

  const step = steps[index] ?? null;
  const sheet = viewport === "mobile";

  useLayoutEffect(() => {
    if (!open) {
      scrolledFor.current = null;
      return;
    }
    if (!step) return;
    if (scrolledFor.current === step.id) return;
    const el = findVisibleTourAnchor(anchorForStep(step, tourViewport()));
    if (!el) return;
    scrolledFor.current = step.id;
    scrollTourAnchorIntoView(el);
  }, [open, step]);

  useLayoutEffect(() => {
    if (!open || !step) return;

    const apply = () => {
      const ids = spotlightAnchors(step, tourViewport());
      const anchors: HTMLElement[] = [];
      for (const id of ids) {
        const el = findVisibleTourAnchor(id);
        if (el) anchors.push(el);
      }
      const sheetTop =
        tourViewport() === "mobile" && dialogRef.current?.classList.contains("is-sheet")
          ? dialogRef.current.getBoundingClientRect().top
          : null;
      const bottomInset = sheetTop == null ? 0 : Math.max(0, window.innerHeight - sheetTop + 12);
      const next: TourHole[] = anchors.map((el) => measureTourHole(el, 8, bottomInset));
      if (next.length === 0) {
        if (freeze) {
          setHoles([]);
          return;
        }
        if (!missingFired.current.has(step.id)) {
          missingFired.current.add(step.id);
          onStepMissing(step.id);
        }
        const later = steps.slice(index + 1).findIndex((candidate) =>
          spotlightAnchors(candidate, tourViewport()).some((id) => isTourAnchorVisible(id))
        );
        if (later >= 0) {
          setIndex(index + 1 + later);
          return;
        }
        if (index > 0) {
          onComplete("next", index);
        } else {
          onDismiss("skip", index, step.id);
        }
        return;
      }
      setHoles((prev) => (sameHoles(prev, next) ? prev : next));
    };

    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("scroll", apply, true);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("scroll", apply, true);
    };
  }, [open, step, index, steps, freeze, onComplete, onDismiss, onStepMissing]);

  useEffect(() => {
    if (!open || !step || holes.length === 0) return;
    onStepViewed(step.id, index, steps.length);
  }, [open, step, index, steps.length, holes.length, onStepViewed]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = dialogRef.current;
    const primary = node?.querySelector<HTMLElement>("[data-tour-primary='true']");
    (primary ?? node)?.focus();
    return () => {
      const current = steps[index];
      const target = current
        ? findVisibleTourAnchor(anchorForStep(current, tourViewport()))
        : null;
      (target ?? previousFocus.current)?.focus?.();
    };
    // Restore focus when the tour closes, not on every step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !step) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss("esc", index, step.id);
        return;
      }
      if (event.key === "ArrowRight" || (event.key === "Enter" && event.target === dialogRef.current)) {
        event.preventDefault();
        goForward();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const items = focusable(dialogRef.current);
      if (items.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function goBack() {
    if (index > 0) setIndex(index - 1);
  }

  function goForward() {
    if (!step) return;
    if (step.final || index >= steps.length - 1) {
      onComplete(step.final ? "cta" : "next", index);
      return;
    }
    setIndex(index + 1);
  }

  function onScrimClick(event: ReactMouseEvent<HTMLDivElement>) {
    const inside = holes.some((hole) => pointInHole(event.clientX, event.clientY, hole));
    if (!inside) return;
    const scrim = scrimRef.current;
    if (scrim) scrim.style.pointerEvents = "none";
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (scrim) scrim.style.pointerEvents = "auto";
    onComplete("target_click", index);
    if (target instanceof HTMLElement) target.click();
  }

  if (!open || !mounted || !step || typeof document === "undefined") return null;

  const cardStyle: CSSProperties | undefined = sheet
    ? undefined
    : placeCard(holes);

  return createPortal(
    <div className="aee-tour study-home-accent">
      <svg className="aee-tour-mask" aria-hidden="true">
        <defs>
          <mask id="aee-tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {holes.map((hole, holeIndex) => (
              <rect
                key={`${step.id}-${holeIndex}`}
                x={hole.x}
                y={hole.y}
                width={hole.width}
                height={hole.height}
                rx={12}
                fill="black"
              />
            ))}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(10, 37, 64, 0.42)" mask="url(#aee-tour-spotlight)" />
      </svg>
      <div ref={scrimRef} className="aee-tour-scrim" onClick={onScrimClick} />
      <div
        ref={dialogRef}
        className={sheet ? "aee-tour-card is-sheet" : "aee-tour-card"}
        style={cardStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        data-tour-dialog="true"
        data-tour-step={step.id}
        tabIndex={-1}
        onTouchStart={(event) => {
          touchX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchX.current == null) return;
          const dx = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
          touchX.current = null;
          if (dx <= -48) goForward();
          else if (dx >= 48) goBack();
        }}
      >
        <button type="button" className="aee-tour-close" aria-label="Close tour" onClick={() => onDismiss("close", index, step.id)}>
          <X className="h-4 w-4" aria-hidden />
        </button>
        <p className="aee-tour-kicker" id={liveId} aria-live="polite">
          Step {index + 1} of {steps.length}
        </p>
        <h2 id={titleId} className="aee-tour-title">
          {step.title}
        </h2>
        <p id={bodyId} className="aee-tour-body">
          {step.body}
        </p>
        <ol className="aee-tour-dots" aria-hidden="true">
          {steps.map((item, dot) => (
            <li key={item.id} className={dot === index ? "is-current" : undefined} />
          ))}
        </ol>
        <div className="aee-tour-actions">
          {index > 0 ? (
            <button type="button" className="aee-tour-back" onClick={goBack}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="aee-tour-skip" onClick={() => onDismiss("skip", index, step.id)}>
            Skip tour
          </button>
          <button type="button" className="aee-tour-primary" data-tour-primary="true" onClick={goForward}>
            {step.final || index >= steps.length - 1 ? "Start today's set" : "Next"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function placeCard(holes: TourHole[]): CSSProperties | undefined {
  const primary = holes[0];
  if (!primary || typeof window === "undefined") return undefined;
  const width = Math.min(360, window.innerWidth - 32);
  const estimated = 248;
  const margin = 16;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const left = Math.min(Math.max(margin, primary.x), maxLeft);
  let top = primary.y + primary.height + 14;
  if (top + estimated > window.innerHeight - margin) {
    const header = tourScrollOffsetPx();
    const attached = Math.max(header, primary.y + 12);
    top =
      attached + estimated > window.innerHeight - margin
        ? Math.max(header, window.innerHeight - estimated - margin)
        : attached;
  }
  const maxTop = Math.max(margin, window.innerHeight - estimated - margin);
  top = Math.min(Math.max(margin, top), maxTop);
  return { top, left, width };
}
