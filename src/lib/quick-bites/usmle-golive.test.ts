import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({ getCachedSession: async () => null }));

import { usmleQuickBitesGate } from "./usmle-access";
import {
  USMLE_QUICK_BITE_STEPS,
  loadUsmleGoLiveIds,
  loadUsmleQuickBites,
  usmleQuickBitesForGate,
  type UsmleQuickBite,
} from "./usmle-bites";
import { isUsmleQuickBitesReleased } from "./usmle-flags";

const FLAGS = ["NEXT_PUBLIC_USMLE_QUICK_BITES_PUBLIC", "USMLE_QUICK_BITES_PUBLIC"] as const;

function allBites(): UsmleQuickBite[] {
  return USMLE_QUICK_BITE_STEPS.flatMap((step) => loadUsmleQuickBites(step));
}

async function visibleToStudent(): Promise<UsmleQuickBite[]> {
  const gate = await usmleQuickBitesGate();
  return USMLE_QUICK_BITE_STEPS.flatMap((step) => usmleQuickBitesForGate(loadUsmleQuickBites(step), gate));
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("USMLE Quick Bites go-live allowlist", () => {
  it("lists 324 unique ids that all exist (120 Step 1, 117 Step 2 CK, 87 Step 3)", () => {
    const file = path.join(process.cwd(), "content", "usmle-quickbites", "golive-ids.json");
    const raw = JSON.parse(readFileSync(file, "utf8")) as { ids: string[] };
    expect(new Set(raw.ids).size).toBe(raw.ids.length);
    const ids = loadUsmleGoLiveIds();
    expect(ids.size).toBe(324);
    const known = new Set(allBites().map((bite) => bite.id));
    for (const id of ids) expect(known.has(id), id).toBe(true);
    const count = (prefix: string) => [...ids].filter((id) => id.startsWith(prefix)).length;
    expect(count("usmle-qb-s1-")).toBe(120);
    expect(count("usmle-qb-s2-")).toBe(117);
    expect(count("usmle-qb-s3-")).toBe(87);
  });

  it("shows students nothing while both flags are off", async () => {
    for (const flag of FLAGS) vi.stubEnv(flag, "");
    expect(isUsmleQuickBitesReleased()).toBe(false);
    expect(await usmleQuickBitesGate()).toBe("hidden");
    expect(await visibleToStudent()).toHaveLength(0);
  });

  for (const flag of FLAGS) {
    it(`keeps the 216 unlisted bites hidden when ${flag} is turned on`, async () => {
      for (const other of FLAGS) vi.stubEnv(other, "");
      vi.stubEnv(flag, "1");
      expect(await usmleQuickBitesGate()).toBe("open");
      const shown = await visibleToStudent();
      const allow = loadUsmleGoLiveIds();
      expect(shown).toHaveLength(324);
      expect(shown.every((bite) => allow.has(bite.id))).toBe(true);
      const hidden = allBites().filter((bite) => !shown.includes(bite));
      expect(hidden).toHaveLength(216);
      expect(hidden.some((bite) => allow.has(bite.id))).toBe(false);
    });
  }

  it("treats an unlisted id as hidden by default", () => {
    const sample = { ...loadUsmleQuickBites("step-1")[0], id: "usmle-qb-s1-999" };
    expect(usmleQuickBitesForGate([sample], "open")).toHaveLength(0);
    expect(usmleQuickBitesForGate([sample], "hidden")).toHaveLength(0);
  });
});
