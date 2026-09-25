"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTrialWelcome } from "@/components/auth/TrialWelcomeHost";
import { useUserAccess } from "@/lib/client/use-user-access";
import { CONVERSION_EVENTS, trackConversion } from "@/lib/analytics";
import { firstLoginTourSteps, visibleTourSteps } from "@/lib/onboarding/first-login-tour";
import {
  FIRST_LOGIN_TOUR_ID,
  isFirstLoginTourEligible,
  TOUR_REPLAY_EVENT,
} from "@/lib/onboarding/tour-record";
import {
  clearTourReplay,
  isTourAnchorVisible,
  isTourBlockedByOverlay,
  peekTourReplay,
  persistTourStatus,
  readLocalTourSeen,
  tourViewport,
  writeLocalTourSeen,
} from "@/lib/onboarding/tour-client";
import { ProductTour, type TourCompleteVia, type TourDismissVia } from "@/components/onboarding/ProductTour";

const SHOW_DELAY_MS = 800;
const TARGET_WAIT_MS = 8000;

export function FirstLoginTour({
  boardName,
  seen,
  attemptCount,
}: {
  boardName: string;
  seen: boolean;
  attemptCount: number | null;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { status } = useSession();
  const welcome = useTrialWelcome();
  const access = useUserAccess();
  const [ready, setReady] = useState(false);
  const [localSeen, setLocalSeen] = useState(false);
  const [replay, setReplay] = useState(false);
  const [open, setOpen] = useState(false);
  const opened = useRef(false);
  const startedAt = useRef(0);

  useEffect(() => {
    setLocalSeen(readLocalTourSeen());
    // Peek, don't clear. Desktop dashboard content can remount while the
    // shell streams in; consuming the flag on the first mount drops replay.
    setReplay(peekTourReplay());
    setReady(true);
    const onReplay = () => {
      opened.current = false;
      setReplay(peekTourReplay());
      setOpen(false);
    };
    window.addEventListener(TOUR_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(TOUR_REPLAY_EVENT, onReplay);
  }, []);

  const eligible = isFirstLoginTourEligible({
    seen: seen || localSeen,
    attemptCount,
    examSelected: true,
    pathname,
    replay,
    signedIn: status === "authenticated",
  });

  const steps = useMemo(() => firstLoginTourSteps(boardName), [boardName]);
  const [shownSteps, setShownSteps] = useState(steps);

  const track = useCallback(
    (name: (typeof CONVERSION_EVENTS)[keyof typeof CONVERSION_EVENTS], properties: Record<string, unknown>) => {
      trackConversion(name, properties as never);
    },
    []
  );

  useEffect(() => {
    if (!ready || !eligible || !welcome.resolved || welcome.active) return;
    let cancelled = false;
    let timer = 0;
    const started = Date.now();

    const giveUp = () => {
      if (replay) clearTourReplay();
    };

    const tryOpen = () => {
      if (cancelled || opened.current) return;
      if (isTourBlockedByOverlay() || !isTourAnchorVisible("today")) {
        if (Date.now() - started > TARGET_WAIT_MS + SHOW_DELAY_MS) {
          giveUp();
          return;
        }
        timer = window.setTimeout(tryOpen, 200);
        return;
      }
      const viewport = tourViewport();
      const visible = visibleTourSteps(steps, viewport, isTourAnchorVisible);
      if (visible.length === 0) {
        if (Date.now() - started > TARGET_WAIT_MS + SHOW_DELAY_MS) {
          giveUp();
          return;
        }
        timer = window.setTimeout(tryOpen, 200);
        return;
      }
      for (const step of steps) {
        if (!visible.some((item) => item.id === step.id)) {
          track(CONVERSION_EVENTS.TOUR_STEP_SKIPPED, { step_id: step.id });
        }
      }
      opened.current = true;
      setShownSteps(visible);
      setOpen(true);
      startedAt.current = Date.now();
      if (replay) clearTourReplay();
      if (!replay) {
        writeLocalTourSeen("shown");
        void persistTourStatus({
          tour: FIRST_LOGIN_TOUR_ID,
          status: "shown",
          step: 0,
          device: viewport,
        });
        track(CONVERSION_EVENTS.TOUR_SHOWN, {
          tour: FIRST_LOGIN_TOUR_ID,
          board: boardName,
          device: viewport,
          trial: access.status === "trialing",
        });
      }
    };

    timer = window.setTimeout(tryOpen, SHOW_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    ready,
    eligible,
    welcome.resolved,
    welcome.active,
    steps,
    replay,
    boardName,
    access.status,
    track,
  ]);

  const persistEnd = useCallback(
    (status: "completed" | "skipped", step: number) => {
      if (replay) return;
      const viewport = tourViewport();
      writeLocalTourSeen(status);
      void persistTourStatus({
        tour: FIRST_LOGIN_TOUR_ID,
        status,
        step,
        device: viewport,
      });
    },
    [replay]
  );

  const onDismiss = useCallback(
    (via: TourDismissVia, stepIndex: number, stepId: string) => {
      setOpen(false);
      persistEnd("skipped", stepIndex);
      track(CONVERSION_EVENTS.TOUR_DISMISSED, { at_step: stepIndex + 1, via, step_id: stepId });
    },
    [persistEnd, track]
  );

  const onComplete = useCallback(
    (via: TourCompleteVia, stepIndex: number) => {
      setOpen(false);
      persistEnd("completed", stepIndex);
      track(CONVERSION_EVENTS.TOUR_COMPLETED, {
        via,
        duration_ms: Math.max(0, Date.now() - startedAt.current),
      });
      if (via === "target_click") return;
      const start = document.querySelector<HTMLElement>("[data-tour='today-start']");
      if (start instanceof HTMLAnchorElement) {
        const href = start.getAttribute("href");
        if (href) router.push(href);
        return;
      }
      if (start instanceof HTMLButtonElement && !start.disabled) start.click();
    },
    [persistEnd, router, track]
  );

  const onStepViewed = useCallback(
    (stepId: string, stepIndex: number, total: number) => {
      track(CONVERSION_EVENTS.TOUR_STEP_VIEWED, {
        step_id: stepId,
        step_index: stepIndex + 1,
        total_steps: total,
      });
    },
    [track]
  );

  const onStepMissing = useCallback(
    (stepId: string) => {
      track(CONVERSION_EVENTS.TOUR_STEP_SKIPPED, { step_id: stepId });
    },
    [track]
  );

  return (
    <ProductTour
      steps={shownSteps}
      open={open}
      onDismiss={onDismiss}
      onComplete={onComplete}
      onStepViewed={onStepViewed}
      onStepMissing={onStepMissing}
    />
  );
}

export { TOUR_REPLAY_EVENT };
