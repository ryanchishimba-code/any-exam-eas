/**
 * Client-safe USMLE Rapid Review Card types and library helpers.
 * Do not import node:fs here. The browser library imports this file.
 */

import { USMLE_QUICK_BITES_PATH } from "@/lib/quick-bites/usmle-flags";

export const USMLE_QUICK_BITE_STEPS = ["step-1", "step-2-ck", "step-3"] as const;
export type UsmleQuickBiteStep = (typeof USMLE_QUICK_BITE_STEPS)[number];

export type UsmleQuickBiteSource = {
  name: string;
  year: string;
  url: string;
  says: string;
  more?: { name: string; url: string }[];
};

export type UsmleQuickBite = {
  id: string;
  step: UsmleQuickBiteStep;
  number: number;
  system: string;
  group: string;
  title: string;
  read: string;
  /** Free sample once the library is released. Hidden preview shows every bite. */
  open: boolean;
  lead: string;
  lines: string[];
  miss: string;
  diagram: string | null;
  diagramAlt: string | null;
  source: UsmleQuickBiteSource;
};

export type UsmleQuickBiteStepChoice = {
  id: UsmleQuickBiteStep;
  label: string;
  query: string;
};

export const USMLE_QUICK_BITE_STEP_CHOICES: readonly UsmleQuickBiteStepChoice[] = [
  { id: "step-1", label: "Step 1", query: "1" },
  { id: "step-2-ck", label: "Step 2 CK", query: "2ck" },
  { id: "step-3", label: "Step 3", query: "3" },
];

export function isUsmleQuickBiteStep(value: string | null | undefined): value is UsmleQuickBiteStep {
  return Boolean(value && (USMLE_QUICK_BITE_STEPS as readonly string[]).includes(value));
}

export function usmleQuickBiteStepFromQuery(step: string | undefined | null): UsmleQuickBiteStep {
  const match = USMLE_QUICK_BITE_STEP_CHOICES.find((item) => item.query === (step ?? "").trim());
  return match?.id ?? "step-1";
}

export function usmleQuickBiteHref(step: UsmleQuickBiteStep): string {
  const choice = USMLE_QUICK_BITE_STEP_CHOICES.find((item) => item.id === step);
  if (!choice || choice.query === "1") return USMLE_QUICK_BITES_PATH;
  return `${USMLE_QUICK_BITES_PATH}?step=${choice.query}`;
}

export function usmleQuickBiteGroups(bites: UsmleQuickBite[]): { title: string; bites: UsmleQuickBite[] }[] {
  const groups: { title: string; bites: UsmleQuickBite[] }[] = [];
  for (const bite of bites) {
    const last = groups[groups.length - 1];
    if (!last || last.title !== bite.group) groups.push({ title: bite.group, bites: [bite] });
    else last.bites.push(bite);
  }
  return groups;
}
