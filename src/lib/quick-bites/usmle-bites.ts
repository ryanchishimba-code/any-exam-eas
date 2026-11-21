import { readFileSync } from "node:fs";
import path from "node:path";
import type { UsmleQuickBite, UsmleQuickBiteStep } from "@/lib/quick-bites/usmle-bite-shared";

/**
 * USMLE Quick Bites. One library, three Steps.
 * Content stays in content/usmle-quickbites and is hidden until a flag is on.
 * The homepage and the /usmle board page do not import this module.
 * Client components import usmle-bite-shared instead of this file.
 */

export {
  USMLE_QUICK_BITE_STEPS,
  USMLE_QUICK_BITE_STEP_CHOICES,
  isUsmleQuickBiteStep,
  usmleQuickBiteGroups,
  usmleQuickBiteHref,
  usmleQuickBiteStepFromQuery,
} from "@/lib/quick-bites/usmle-bite-shared";
export type {
  UsmleQuickBite,
  UsmleQuickBiteSource,
  UsmleQuickBiteStep,
  UsmleQuickBiteStepChoice,
} from "@/lib/quick-bites/usmle-bite-shared";

const STEP_FILE: Record<UsmleQuickBiteStep, string> = {
  "step-1": "step-1/bites.json",
  "step-2-ck": "step-2/bites.json",
  "step-3": "step-3/bites.json",
};

/** Full-library counts from content/usmle-quickbites/PLAN.md. */
export const USMLE_QUICK_BITE_QUOTAS: Record<UsmleQuickBiteStep, Record<string, number>> = {
  "step-1": {
    "human-development": 3,
    "blood-lymph-immune": 20,
    "behavioral-nervous": 20,
    "msk-skin": 14,
    cardiovascular: 16,
    "respiratory-renal": 27,
    gastrointestinal: 12,
    "reproductive-endocrine": 27,
    multisystem: 18,
    "biostats-epi": 11,
    "social-sciences": 12,
  },
  "step-2-ck": {
    "human-development": 5,
    "blood-lymph-immune": 13,
    "behavioral-nervous": 24,
    "msk-skin": 13,
    cardiovascular: 18,
    "respiratory-renal": 31,
    gastrointestinal: 13,
    "reproductive-endocrine": 19,
    multisystem: 10,
    "biostats-epi": 9,
    "social-sciences": 25,
  },
  "step-3": {
    "human-development": 4,
    "blood-lymph-immune": 14,
    "behavioral-nervous": 21,
    "msk-skin": 12,
    cardiovascular: 21,
    "respiratory-renal": 23,
    gastrointestinal: 13,
    "reproductive-endocrine": 19,
    multisystem: 14,
    "biostats-epi": 18,
    "social-sciences": 21,
  },
};

const cache = new Map<UsmleQuickBiteStep, UsmleQuickBite[]>();

function contentRoot(): string {
  return path.join(process.cwd(), "content", "usmle-quickbites");
}

export function loadUsmleQuickBites(step: UsmleQuickBiteStep): UsmleQuickBite[] {
  const hit = cache.get(step);
  if (hit) return hit;
  const file = path.join(contentRoot(), STEP_FILE[step]);
  const parsed = JSON.parse(readFileSync(file, "utf8")) as UsmleQuickBite[];
  cache.set(step, parsed);
  return parsed;
}

export function quotaTotal(step: UsmleQuickBiteStep): number {
  return Object.values(USMLE_QUICK_BITE_QUOTAS[step]).reduce((sum, count) => sum + count, 0);
}

/**
 * Go-live allowlist (content/usmle-quickbites/golive-ids.json).
 * Hidden by default: a bite whose id is not listed is never shown to students,
 * even after a release flag is turned on. A missing or unreadable file means
 * nothing is listed, so nothing is shown.
 */
export type UsmleQuickBitesVisibility = "open" | "preview" | "hidden";

let goLiveCache: ReadonlySet<string> | null = null;

export function loadUsmleGoLiveIds(): ReadonlySet<string> {
  if (goLiveCache) return goLiveCache;
  let ids: string[] = [];
  try {
    const file = path.join(contentRoot(), "golive-ids.json");
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { ids?: unknown };
    if (Array.isArray(parsed.ids)) ids = parsed.ids.filter((id): id is string => typeof id === "string");
  } catch {
    ids = [];
  }
  goLiveCache = new Set(ids);
  return goLiveCache;
}

export function isUsmleQuickBiteGoLive(id: string): boolean {
  return loadUsmleGoLiveIds().has(id);
}

/**
 * Bites a viewer may see. "open" (a release flag is on) shows only allowlisted
 * ids. "preview" (admin, flags off) shows every bite. "hidden" shows none.
 */
export function usmleQuickBitesForGate(
  bites: readonly UsmleQuickBite[],
  gate: UsmleQuickBitesVisibility,
): UsmleQuickBite[] {
  if (gate === "hidden") return [];
  if (gate === "preview") return [...bites];
  const allow = loadUsmleGoLiveIds();
  return bites.filter((bite) => allow.has(bite.id));
}
