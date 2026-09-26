import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { PilotDocument } from "@/lib/assessment/types";
import { errorCount, validatePilotDocument } from "@/lib/assessment/validators/ngn";

function loadPilot(): PilotDocument {
  return JSON.parse(readFileSync("content/ngn-pilot/pilot-items.json", "utf8")) as PilotDocument;
}

describe("NGN validators", () => {
  it("accepts all 70 pilot items with 0 errors", () => {
    const doc = loadPilot();
    const issues = validatePilotDocument(doc);
    const errors = issues.filter((issue) => issue.level === "error");
    expect(errorCount(issues), errors.map((issue) => `${issue.path}: ${issue.message}`).join("\n")).toBe(0);
    expect(doc.cases.flatMap((caseDoc) => caseDoc.items).length + doc.standalone.length).toBe(70);
  });

  it("rejects a bow-tie with 3 action keys", () => {
    const doc = loadPilot();
    const bowtie = doc.standalone.find((item) => item.id === "B01");
    expect(bowtie).toBeTruthy();
    const actions = bowtie?.payload.actions as { keys: string[] };
    actions.keys = ["a1", "a2", "a3"];
    const errors = validatePilotDocument(doc).filter((issue) => issue.level === "error");
    expect(errors.some((issue) => issue.path.includes("B01") && /2 keys/.test(issue.message))).toBe(true);
  });

  it("rejects a case whose step 6 reuses an earlier timepoint", () => {
    const doc = loadPilot();
    const caseDoc = doc.cases[0];
    expect(caseDoc).toBeTruthy();
    const last = caseDoc?.items[5];
    if (last) last.timepoint = caseDoc?.items[0]?.timepoint ?? last.timepoint;
    const errors = validatePilotDocument(doc).filter((issue) => issue.level === "error");
    expect(errors.some((issue) => /new timepoint/.test(issue.message))).toBe(true);
  });

  it("rejects a reference that is not in the registry", () => {
    const doc = loadPilot();
    doc.standalone[0]?.references.push({ src: "NOT_A_SOURCE", locator: "nowhere" });
    const errors = validatePilotDocument(doc).filter((issue) => issue.level === "error");
    expect(errors.some((issue) => /NOT_A_SOURCE/.test(issue.message))).toBe(true);
  });
});
