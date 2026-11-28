import { TRIAL_DAYS } from "@/lib/billing-config";
import { landingTrialHrefForExam } from "@/lib/landing/trial-href";
import { freePracticeHref } from "@/lib/marketing/free-practice/paths";
import { DAILY_VITALS_BOARDS, type DailyVitalsBoard } from "@/lib/daily-vitals/types";

export const EDUCATIONAL_LINE = "For educational use only. Not medical advice.";

const MARKS: Record<DailyVitalsBoard, { label: string; notice: string }> = {
  nclex: {
    label: "NCLEX®",
    notice: "NCLEX® is a registered trademark of NCSBN. Not affiliated with or endorsed by NCSBN.",
  },
  naplex: {
    label: "NAPLEX®",
    notice: "NAPLEX® is a registered trademark of NABP. Not affiliated with or endorsed by NABP.",
  },
  pance: {
    label: "PANCE®",
    notice: "PANCE® is a registered trademark of NCCPA. Not affiliated with or endorsed by NCCPA.",
  },
  "aanp-fnp": {
    label: "AANP FNP",
    notice:
      "AANP® is a trademark of the American Association of Nurse Practitioners. Not affiliated with or endorsed by AANP.",
  },
};

export function isDailyVitalsBoard(value: string): value is DailyVitalsBoard {
  return (DAILY_VITALS_BOARDS as readonly string[]).includes(value);
}

export function boardMark(board: DailyVitalsBoard): { label: string; notice: string } {
  return MARKS[board];
}

export function legalLinesFor(board: DailyVitalsBoard): string[] {
  return [EDUCATIONAL_LINE, boardMark(board).notice];
}

export function practiceHref(board: DailyVitalsBoard): string {
  return freePracticeHref(board);
}

export function trialHref(board: DailyVitalsBoard): string {
  return landingTrialHrefForExam(board);
}

export function trialNote(): string {
  return `${TRIAL_DAYS}-day free trial · No card needed`;
}
