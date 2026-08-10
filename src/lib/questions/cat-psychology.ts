/**
 * Test-day psychology copy for NCLEX practice CAT (not Pearson VUE).
 * Shared by launcher briefing and in-exam tips.
 */
import {
  CAT_MAX_QUESTIONS,
  CAT_MIN_QUESTIONS,
  type CatSessionState,
} from "./cat-engine";
import { catStopReasonLabel } from "./cat-select";

export const CAT_PRACTICE_DISCLAIMER =
  "Practice simulation only — not Pearson VUE scoring or pass/fail.";

export type CatBriefingBullet = {
  title: string;
  body: string;
};

/** Pre-start briefing shown when CAT-style adaptive is enabled. */
export function catLauncherBriefing(): CatBriefingBullet[] {
  return [
    {
      title: "Variable length",
      body: `Sessions run ${CAT_MIN_QUESTIONS}–${CAT_MAX_QUESTIONS} questions. The bank adapts difficulty as you go — you will not always hit the maximum.`,
    },
    {
      title: "How it can stop",
      body: `After ${CAT_MIN_QUESTIONS} items, practice may end early when your pattern looks stable (confidence stop), or it continues to ${CAT_MAX_QUESTIONS} if needed.`,
    },
    {
      title: "Breaks",
      body: "Real NCLEX builds in optional breaks. Here, use Pause anytime — the timer stops while you step away. Breaks are self-managed.",
    },
    {
      title: "What this is not",
      body: CAT_PRACTICE_DISCLAIMER,
    },
  ];
}

/** Short in-exam tip under the question chrome. */
export function catInExamTip(): string {
  return `Practice CAT · ${CAT_MIN_QUESTIONS}–${CAT_MAX_QUESTIONS}Q · Pause for breaks · ${CAT_PRACTICE_DISCLAIMER}`;
}

/** One-line pause dialog body when CAT mode is on. */
export function catPauseDialogBody(): string {
  return "Timer stops while paused. On test day, breaks are optional and self-managed — use this Pause the same way. This is practice only, not Pearson VUE.";
}

/** Human-readable stop summary for review / analytics. */
export function catSessionStopSummary(state: CatSessionState): string {
  const label = catStopReasonLabel(state.stopReason);
  if (label) return `${label} after ${state.questionNumber} questions.`;
  return `Practice CAT ended after ${state.questionNumber} questions.`;
}
