"use client";

import { useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QueryClientContext } from "@tanstack/react-query";
import {
  broadcastExamSwitch,
  clearExamTransientClientState,
  prepareClientForExamSwitch,
} from "@/lib/client/exam-switch-reset";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { questionBankHref } from "@/lib/edtech/practice-links-core";
import type { StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { ROUTES, fullExamHref } from "@/lib/routes";

/**
 * A study-guide URL names a book. It does not change the saved primary exam.
 * Nav stays on that exam until the learner confirms the switch.
 */
export function CrossBoardStudyGuideBanner({ guideExam }: { guideExam: StudyGuideExam }) {
  const router = useRouter();
  const queryClient = useContext(QueryClientContext);
  const { examSlug, loading, setExamSlug } = useAppPreferences();
  const [pending, startTransition] = useTransition();

  if (loading || !examSlug || examSlug === guideExam) return null;

  const guideName = EXAM_CATALOG[guideExam].shortName;

  function onSwitch() {
    const saved = examSlug;
    if (!saved || saved === guideExam) return;
    setExamSlug(guideExam);
    router.prefetch(ROUTES.dashboard);
    router.prefetch(questionBankHref(guideExam));
    router.prefetch(fullExamHref(guideExam));
    startTransition(async () => {
      // Dynamic so the study-guide reader does not load the server-action module on render.
      const { switchExamPreference } = await import("@/lib/edtech/actions");
      const result = await switchExamPreference(guideExam);
      if (!result.ok) {
        setExamSlug(saved);
        return;
      }
      if (queryClient) {
        prepareClientForExamSwitch(queryClient, guideExam);
      } else {
        clearExamTransientClientState();
        broadcastExamSwitch(guideExam);
      }
      router.refresh();
    });
  }

  return (
    <div
      role="status"
      className="flex shrink-0 items-center justify-between gap-3 border-b border-[#2ec4b6]/20 bg-[#123044] px-4 py-3 text-[15px] font-medium leading-snug tracking-tight text-white/90 sm:px-5"
    >
      <p className="min-w-0">
        You&apos;re viewing the {guideName} guide. Switch to {guideName}?
      </p>
      <button
        type="button"
        onClick={onSwitch}
        disabled={pending}
        className="inline-flex min-h-9 min-w-[5.5rem] shrink-0 items-center justify-center rounded-full bg-[#2ec4b6] px-3.5 text-[13px] font-semibold tracking-tight text-[#06221e] transition hover:bg-[#5ed9cc] disabled:opacity-60"
      >
        {pending ? "Switching…" : "Switch"}
      </button>
    </div>
  );
}
