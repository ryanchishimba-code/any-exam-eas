// @ts-nocheck — legacy AANP FNP module (retired)
import type { DistractorPattern } from "../types";

export const AANP_FNP_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    label: "Wrong first-line therapy",
    promptHint: "Plausible drug/class that is second-line or contraindicated for this patient.",
  },
  {
    label: "Incomplete diagnostic workup",
    promptHint: "Test that is reasonable but not the best NEXT step given presentation urgency.",
  },
  {
    label: "Scope or referral error",
    promptHint: "Action outside NP scope or delays necessary specialist/ED referral.",
  },
  {
    label: "Similar diagnosis trap",
    promptHint: "Condition in the same organ system with overlapping features but wrong key finding.",
  },
];
