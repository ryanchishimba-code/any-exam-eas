import type { DistractorPattern } from "../types";

export const MPJE_DISTRACTOR_PATTERNS: DistractorPattern[] = [
  {
    id: "wrong-jurisdiction",
    label: "Wrong jurisdiction",
    description: "Applies federal law when state governs or vice versa",
    promptHint: "Distractors that misattribute authority between federal and state pharmacy law.",
  },
  {
    id: "scope-violation",
    label: "Scope of practice violation",
    description: "Technician or unlicensed person performing pharmacist duty",
    promptHint: "Options allowing unsupervised technician final verification or pharmacist-only acts.",
  },
  {
    id: "cs-violation",
    label: "Controlled substance violation",
    description: "Ignores DEA schedule-specific rules",
    promptHint: "Unlimited C-II refills, missing PDMP, delayed theft reporting.",
  },
  {
    id: "privacy-breach",
    label: "HIPAA/privacy breach",
    description: "Improper PHI disclosure",
    promptHint: "Sharing records without authorization or legal exception.",
  },
  {
    id: "dispensing-shortcut",
    label: "Illegal dispensing shortcut",
    description: "Skips required verification steps",
    promptHint: "Dispense without validating prescription elements or DUR.",
  },
];
