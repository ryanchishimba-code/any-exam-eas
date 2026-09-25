import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  explanatoryRationaleSummary,
  rationaleAfterLead,
  selectRationaleLead,
  shortRationaleLead,
  shouldCollapseRationale,
  uniqueRationaleParts,
  wouldRenderLabelOnlySummary,
} from "./rationale-disclosure";

const CJMM_BOW_TIE = `Clinical Judgment (CJMM):
1. Recognize cues: watery diarrhea after antibiotics, fever, and leukocytosis.
2. Analyze cues: C. diff spores spread by contact, so alcohol gel does not clear them.
3. Take action: start contact precautions and soap-and-water hand hygiene before the next client.
Why other options are incorrect:
• Alcohol-based hand rub alone: Incorrect — spores require soap and water.`;

const NGN_CASE = `Clinical Judgment (CJMM): 1. Recognize cues: BP 118/72 mmHg, HR 88, RR 18, temp 100.8°F (38.2°C); watery diarrhea 6 times in 8 hours, abdominal cramping, WBC 14.2.
2. Analyze cues: the pattern fits a contact-spread spore infection, not a routine viral illness.
3. Prioritize hypotheses: transmission risk to the next client outranks routine documentation.
4. Generate solutions / Take action: gown and gloves, then soap-and-water hand hygiene.
Correct answer: Contact precautions and soap-and-water hand hygiene.`;

describe("rationale disclosure", () => {
  it("keeps a short rationale fully inline", () => {
    expect(shouldCollapseRationale(["ABCs take priority in acute assessment."])).toBe(false);
    expect(
      shouldCollapseRationale([
        "GDMT pillars reduce mortality in HFrEF; diuretics treat congestion only.",
      ])
    ).toBe(false);
  });

  it("collapses a long paragraph and a stack of short lines", () => {
    const long =
      "Airway comes before any other action. Later steps include documentation, calling the provider, and analgesia only after breathing is stable and the client is safe.";
    expect(shouldCollapseRationale([long])).toBe(true);
    expect(
      shouldCollapseRationale([
        "Check the airway.",
        "Support breathing.",
        "Then circulation.",
        "Document last.",
      ])
    ).toBe(true);
  });

  it("uses the principle line as the lead when one is present", () => {
    expect(
      selectRationaleLead({
        principle: "Airway before paperwork.",
        explanation: "A much longer explanation that walks through every distractor in detail and should not be the lead.",
      })
    ).toBe("Airway before paperwork.");
  });

  it("shortens a long explanation to the first sentence", () => {
    const explanation =
      "Protect the airway before routine tasks. Charting, calling the provider, and analgesia all wait until breathing is secure and the client is safe from immediate harm.";
    expect(shortRationaleLead(explanation)).toBe("Protect the airway before routine tasks.");
    expect(rationaleAfterLead(explanation, "Protect the airway before routine tasks.")).toMatch(
      /^Charting, calling the provider/
    );
  });

  it("uses the first explanatory sentence instead of a CJMM step label", () => {
    expect(shortRationaleLead("Clinical Judgment (CJMM): 1.")).toBe("");
    expect(selectRationaleLead({ explanation: "Clinical Judgment (CJMM): 1." })).toBe("");
    expect(shortRationaleLead(CJMM_BOW_TIE)).toBe(
      "watery diarrhea after antibiotics, fever, and leukocytosis."
    );
    expect(wouldRenderLabelOnlySummary(CJMM_BOW_TIE)).toBe(true);
    expect(wouldRenderLabelOnlySummary("Protect the airway before routine tasks. Charting waits.")).toBe(
      false
    );
  });

  it("keeps NGN and case rationales on the cue sentence, not the step number", () => {
    const lead = explanatoryRationaleSummary(NGN_CASE);
    expect(lead.toLowerCase()).not.toContain("clinical judgment");
    expect(lead).not.toMatch(/:\s*1\.?$/);
    expect(lead).toMatch(/watery diarrhea/i);
    expect(lead).toMatch(/100\.8/);
    expect(selectRationaleLead({ headline: "Clinical Judgment (CJMM): 1.", explanation: NGN_CASE })).toBe(
      lead
    );
  });

  it("skips a label-only principle and uses the explanation", () => {
    expect(
      selectRationaleLead({
        principle: "Recognize cues:",
        headline: "Clinical Judgment (CJMM): 1.",
        explanation: CJMM_BOW_TIE,
      })
    ).toBe("watery diarrhea after antibiotics, fever, and leukocytosis.");
  });

  it("does not measure text that is already inside the explanation", () => {
    const explanation = "Protect the airway before routine tasks. Charting waits.";
    expect(uniqueRationaleParts(explanation, ["Charting waits.", "Open RN — airway"])).toEqual([
      explanation,
      "Open RN — airway",
    ]);
  });
});

function collectCjmmExcerpts(root: string): string[] {
  const hits: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry === ".git" || entry === ".next") continue;
      const full = path.join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(ts|tsx|md|json|mjs)$/.test(entry)) continue;
      if (/\.test\.(ts|tsx)$/.test(entry)) continue;
      const text = readFileSync(full, "utf8");
      for (const match of text.matchAll(/Clinical Judgment \(CJMM\)[\s\S]{0,700}/g)) {
        hits.push(match[0]);
      }
    }
  };
  walk(root);
  return hits;
}

describe("rationale summary audit", () => {
  it("counts repo fixtures whose old picker was a label, and replaces each with a sentence", () => {
    const excerpts = [
      ...collectCjmmExcerpts(path.join(process.cwd(), "src")),
      ...collectCjmmExcerpts(path.join(process.cwd(), "content")),
    ];
    const labelOnly = excerpts.filter((text) => wouldRenderLabelOnlySummary(text));
    const stillLabel = labelOnly.filter((text) => {
      const next = explanatoryRationaleSummary(text);
      return next !== "" && wouldRenderLabelOnlySummary(next);
    });
    expect(
      stillLabel,
      `${labelOnly.length} fixture excerpts would have rendered a label-only summary`
    ).toEqual([]);
    // In-repo CJMM excerpts only. The published bank is not in this checkout.
    // Non-test source and content only. The published bank is not in this checkout.
    expect(labelOnly.length).toBe(2);
  });
});
