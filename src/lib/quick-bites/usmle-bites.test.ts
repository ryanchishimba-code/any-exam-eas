import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  USMLE_QUICK_BITE_QUOTAS,
  USMLE_QUICK_BITE_STEPS,
  loadUsmleQuickBites,
  quotaTotal,
  type UsmleQuickBite,
  type UsmleQuickBiteStep,
} from "./usmle-bites";

const BUILTIN_DIAGRAMS = new Set([
  "acid-base",
  "diuretics",
  "hypoxemia",
  "murmurs",
  "steroid-blocks",
  "cycle",
  "hypersensitivity",
  "shock",
  "gram-cocci",
  "two-by-two",
  "stroke-window",
  "gdmt",
  "gold-abe",
  "screening",
]);

function knownDiagrams(): Set<string> {
  const file = path.join(process.cwd(), "content", "usmle-quickbites", "diagrams.json");
  const catalog = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  return new Set([...BUILTIN_DIAGRAMS, ...Object.keys(catalog)]);
}

function words(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function jaccard(a: string, b: string): number {
  const left = new Set(words(a));
  const right = new Set(words(b));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const word of left) if (right.has(word)) shared += 1;
  return shared / (left.size + right.size - shared);
}

function feedClaims(): string[] {
  const root = path.join(process.cwd(), "content", "usmle-feed");
  const claims: string[] = [];
  for (const step of ["step-1", "step-2", "step-3"]) {
    const file = path.join(root, step, "cards", "cards.json");
    const cards = JSON.parse(readFileSync(file, "utf8")) as {
      front: string;
      bottom: string;
    }[];
    for (const card of cards) claims.push(`${card.front} ${card.bottom}`);
  }
  return claims;
}

function guideText(): string {
  const root = path.join(process.cwd(), "content", "usmle-study-guide");
  const parts: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, name.name);
      if (name.isDirectory()) walk(full);
      else if (name.name.endsWith(".md")) parts.push(readFileSync(full, "utf8").toLowerCase());
    }
  };
  walk(root);
  return parts.join("\n");
}

function bankText(): string {
  const root = path.join(process.cwd(), "src", "lib", "edtech", "seeds");
  const parts: string[] = [];
  for (const name of readdirSync(root)) {
    if (!name.includes("usmle") || !name.endsWith(".ts")) continue;
    parts.push(readFileSync(path.join(root, name), "utf8").toLowerCase());
  }
  return parts.join("\n");
}

describe("USMLE Quick Bites library", () => {
  const bites = USMLE_QUICK_BITE_STEPS.flatMap((step) => loadUsmleQuickBites(step));
  const claims = feedClaims();
  const guides = guideText();
  const bank = bankText();

  it("matches the plan count for every system", () => {
    for (const step of USMLE_QUICK_BITE_STEPS) {
      const rows = loadUsmleQuickBites(step);
      expect(rows).toHaveLength(quotaTotal(step));
      const counts: Record<string, number> = {};
      for (const bite of rows) counts[bite.system] = (counts[bite.system] ?? 0) + 1;
      expect(counts).toEqual(USMLE_QUICK_BITE_QUOTAS[step]);
    }
  });

  it("keeps every bite scannable, cited, and unique", () => {
    const ids = new Set<string>();
    const leads = new Set<string>();
    const failures: string[] = [];
    for (const bite of bites) {
      if (ids.has(bite.id)) failures.push(`${bite.id} duplicate id`);
      ids.add(bite.id);
      const leadKey = bite.lead.toLowerCase();
      if (leads.has(leadKey)) failures.push(`${bite.id} duplicate lead`);
      leads.add(leadKey);
      failures.push(...problems(bite, claims, guides, bank));
    }
    expect(failures).toEqual([]);
  });

  it("does not add a sidebar link or a homepage hook while the flag is off", () => {
    const sidebar = readFileSync(
      path.join(process.cwd(), "src/components/app/AppSidebar.tsx"),
      "utf8"
    );
    expect(sidebar).toContain("isUsmleQuickBitesPublic()");
    const home = readFileSync(
      path.join(process.cwd(), "src/app/(marketing)/(with-flagship)/page.tsx"),
      "utf8"
    );
    const board = readFileSync(path.join(process.cwd(), "src/app/usmle/page.tsx"), "utf8");
    expect(home).not.toContain("usmle-quick");
    expect(board).not.toContain("quick-bites");
  });
});

function problems(
  bite: UsmleQuickBite,
  claims: string[],
  guides: string,
  bank: string
): string[] {
  const failures: string[] = [];
  if (bite.lines.length < 3 || bite.lines.length > 5) failures.push(`${bite.id} line count`);
  if (bite.lead.length < 40) failures.push(`${bite.id} lead too short`);
  if (!bite.miss || bite.miss.length < 20) failures.push(`${bite.id} missing the usual miss`);
  if (!/^https:\/\//.test(bite.source.url)) failures.push(`${bite.id} source url`);
  if (!/^\d{4}$/.test(bite.source.year)) failures.push(`${bite.id} source year`);
  if (bite.source.says.length < 40) failures.push(`${bite.id} source says`);
  if (bite.diagram && !knownDiagrams().has(bite.diagram)) failures.push(`${bite.id} unknown diagram`);
  if (bite.diagram && !bite.diagramAlt) failures.push(`${bite.id} diagram alt`);
  const lead = bite.lead.toLowerCase();
  if (guides.includes(lead)) failures.push(`${bite.id} copies a study-guide sentence`);
  if (bank.includes(lead)) failures.push(`${bite.id} copies a bank seed`);
  const crowded = claims.filter((claim) => jaccard(bite.lead, claim) >= 0.5);
  if (crowded.length > 0) failures.push(`${bite.id} overlaps a feed card`);
  const note = /this pass|not restated|text checked|not confirmed|point for this bite|older acg edition/i;
  const visible = [bite.lead, ...bite.lines, bite.miss, bite.source.says].join(" ");
  if (note.test(visible)) failures.push(`${bite.id} internal note`);
  const saysKey = bite.source.says.trim().toLowerCase();
  if ([bite.lead, ...bite.lines].some((part) => part.trim().toLowerCase() === saysKey)) {
    failures.push(`${bite.id} says copies a line`);
  }
  for (let i = 0; i < bite.lines.length; i += 1) {
    for (let j = i + 1; j < bite.lines.length; j += 1) {
      if (jaccard(bite.lines[i], bite.lines[j]) >= 0.5) {
        failures.push(`${bite.id} duplicate line`);
      }
    }
  }
  const head = `${bite.title} ${bite.lead}`;
  if (/compartment/i.test(head) && /mesenteric|soft abdomen|embolus/i.test(bite.lines.join(" "))) {
    failures.push(`${bite.id} topic mismatch`);
  }
  if (/hepatitis b/i.test(head) && /integrase|thymidine analog/i.test(bite.lines.join(" "))) {
    failures.push(`${bite.id} topic mismatch`);
  }
  return failures;
}

export function auditStep(step: UsmleQuickBiteStep): string[] {
  return loadUsmleQuickBites(step).flatMap((bite) =>
    problems(bite, feedClaims(), guideText(), bankText())
  );
}
