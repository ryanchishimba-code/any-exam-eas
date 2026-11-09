import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { reviewGeneratedItem, stemFamilyFingerprint } from "./generated-item-gate";

type PilotItem = {
  id: string;
  fieldId: string;
  stepLevel: string;
  outlineWeight: number;
  difficulty: number;
  examTakeaway: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  citation: string | null;
};

function load(name: string): PilotItem[] {
  const path = resolve(process.cwd(), "content/usmle-3000-plan", name);
  return JSON.parse(readFileSync(path, "utf8")) as PilotItem[];
}

const items = [
  ...load("pilot-step1.json"),
  ...load("pilot-step2.json"),
  ...load("pilot-step3.json"),
];

describe("USMLE 3,000-solid pilot", () => {
  it("has 20 inactive-draft items for each Step", () => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.fieldId, (counts.get(item.fieldId) ?? 0) + 1);
    expect(counts.get("usmle-step-1")).toBe(20);
    expect(counts.get("usmle-step-2")).toBe(20);
    expect(counts.get("usmle-step-3")).toBe(20);
  });

  it("passes the generated-item gate and does not repeat a stem family", () => {
    const seen = new Set<string>();
    const failures: string[] = [];
    for (const item of items) {
      const fingerprint = stemFamilyFingerprint(item.scenario, item.question);
      const result = reviewGeneratedItem(item, seen);
      if (!result.activate) failures.push(`${item.id}: ${result.failures.join("; ")}`);
      seen.add(fingerprint);
    }
    expect(failures).toEqual([]);
    expect(seen.size).toBe(items.length);
  });
});
