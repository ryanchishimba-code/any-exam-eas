/** Legacy AANP FNP module (retired) */
import type { DistractorPattern } from "../types";

export const AANP_FNP_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    id: "wrong-first-line",
    label: "Wrong first-line therapy",
    description: "Second-line or contraindicated therapy that sounds plausible",
    promptHint: "Plausible drug/class that is second-line or contraindicated for this patient.",
  },
  {
    id: "incomplete-workup",
    label: "Incomplete diagnostic workup",
    description: "Reasonable test that is not the best next step",
    promptHint: "Test that is reasonable but not the best NEXT step given presentation urgency.",
  },
  {
    id: "scope-referral-error",
    label: "Scope or referral error",
    description: "Action outside NP scope or inappropriate referral delay",
    promptHint: "Action outside NP scope or delays necessary specialist/ED referral.",
  },
  {
    id: "similar-diagnosis-trap",
    label: "Similar diagnosis trap",
    description: "Overlapping condition with the wrong key finding",
    promptHint: "Condition in the same organ system with overlapping features but wrong key finding.",
  },
];
