import { describe, expect, it } from "vitest";
import { assembleExpertRationale } from "./assemble-expert-rationale";
import {
  parseExpertRationaleForDisplay,
  parseRationaleForDisplay,
} from "./parse-rationale-display";
import type { ExpertStructuredRationale } from "./expert-rationale-types";

const SAMPLE: ExpertStructuredRationale = {
  whyCorrect: {
    headline:
      "Contact precautions with dedicated equipment and soap-and-water hand hygiene are required for suspected *C. difficile*.",
    conceptBreakdown: [
      "**Spores** survive alcohol-based hand rub",
      "**Contact transmission** — not droplet or airborne",
      "Antibiotic-associated diarrhea + fever + leukocytosis fits **CDI**",
    ],
    clinicalContext:
      "On the unit, place the client on contact precautions immediately and use soap-and-water before and after care.",
  },
  stepByStepReasoning: [
    "Recognize cues: watery diarrhea after clindamycin, fever 100.8°F, WBC 14,000.",
    "Analyze: antibiotic disruption of flora → *C. diff* overgrowth with spore transmission.",
    "Prioritize: infection control to break transmission before routine comfort tasks.",
    "Act: contact precautions, dedicated equipment, soap-and-water hand hygiene.",
  ],
  whyIncorrect: [
    {
      option: "Use alcohol-based hand rub alone without soap and water after caring for this client",
      misconception: "Students assume all hand hygiene is equivalent.",
      correction: "Alcohol does not reliably kill *C. diff* spores; soap and water is required.",
      conceptLink: "Contact precautions for spore-forming organisms.",
    },
    {
      option: "Place the client on droplet precautions only and reuse non-critical equipment without cleaning between clients",
      misconception: "Confusing GI spread with respiratory droplet transmission.",
      correction: "CDI spreads via contact with spores on surfaces and hands, not droplets.",
      conceptLink: "Match precaution type to organism transmission.",
    },
    {
      option: "Keep the client in a negative-pressure room with airborne precautions for all visitors without PPE",
      misconception: "Over-isolating when contact precautions suffice.",
      correction: "Airborne isolation is for pathogens like TB/measles, not *C. diff*.",
      conceptLink: "Avoid over- and under-isolation on NCLEX.",
    },
  ],
  clinicalPearl: "Keep a dedicated commode when possible — spores contaminate the environment quickly.",
  pharmacologyTieIn:
    "Clindamycin suppresses normal gut flora, allowing *C. diff* overgrowth; notify provider and expect oral vancomycin or fidaxomicin for confirmed CDI.",
  highYieldFacts: [
    "Contact precautions + soap-and-water for *C. diff*",
    "Oral vancomycin/fidaxomicin — not IV vancomycin for CDI",
    "Fulminant disease: hypotension, ileus, toxic megacolon → escalate",
  ],
  commonPitfalls: ["Choosing droplet over contact precautions", "Using alcohol gel alone"],
  nextStepInCare: "Monitor stool frequency, WBC trend, and hydration; educate on contact isolation.",
  testTakingTip:
    "When infection control conflicts with comfort or efficiency, infection control wins on NCLEX.",
  realWorldApplication:
    "Report worsening abdominal pain, distention, or hypotension — may signal fulminant colitis.",
  layeredDepth: {
    basic: "*C. diff* = contact precautions + soap-and-water.",
    intermediate: "Spores survive alcohol; antibiotics disrupt protective flora.",
    advanced: "Fulminant CDI may need colectomy; avoid antiperistaltics.",
  },
  visualCues: [{ label: "Contact Precautions Sign", description: "PPE: gown + gloves; dedicated equipment icon" }],
  crossReferences: [{ exam: "NAPLEX", topic: "CDI treatment", note: "Oral vancomycin vs fidaxomicin stewardship" }],
  keyTakeaway: "Antibiotic-associated diarrhea with fever → think *C. diff* → contact precautions and soap-and-water.",
  memoryHook: "**Spores soap, not gel** — *C. diff* needs contact + soap-and-water.",
};

describe("expert rationale assembly", () => {
  it("assembles markdown with expert sections", () => {
    const out = assembleExpertRationale(SAMPLE);
    expect(out.explanation).toContain("## Step-by-step reasoning");
    expect(out.explanation).toContain("## Clinical pearl");
    expect(out.explanation).toContain("## Pharmacology tie-in");
    expect(out.explanation).toContain("## High-yield facts");
    expect(out.expert).toBe(SAMPLE);
  });

  it("parses expert JSON for UI display", () => {
    const assembled = assembleExpertRationale(SAMPLE);
    const parsed = parseExpertRationaleForDisplay(SAMPLE);
    expect(parsed.isExpert).toBe(true);
    expect(parsed.stepByStepReasoning.length).toBeGreaterThanOrEqual(3);
    expect(parsed.pharmacologyTieIn).toContain("Clindamycin");
    expect(parsed.wrongOptions.length).toBe(3);
    expect(assembled.concisePreview).toContain("Contact precautions");
  });

  it("tolerates partial expert JSON without crashing UI array access", () => {
    const partial = {
      whyCorrect: { headline: "Prioritize airway first." },
      keyTakeaway: "Airway before comfort.",
    } as ExpertStructuredRationale;
    const parsed = parseExpertRationaleForDisplay(partial);
    expect(parsed.isExpert).toBe(true);
    expect(parsed.stepByStepReasoning).toEqual([]);
    expect(parsed.highYieldFacts).toEqual([]);
    expect(parsed.commonPitfalls).toEqual([]);
    expect(parsed.wrongOptions).toEqual([]);
    expect(parsed.visualCues).toEqual([]);
    expect(parsed.visualBlocks).toEqual([]);
    expect(parsed.crossReferences).toEqual([]);
    expect(parsed.stepByStepReasoning.length).toBe(0);
  });

  it("includes visualBlocks when parsing structured markdown explanations", () => {
    const parsed = parseRationaleForDisplay(`## Why this answer is correct
Airway first.

## Why the other options are wrong
**Call family first**
• Trap: prioritizes comfort over safety
• Why it fails here: airway is the immediate threat
• Remember: ABCs

## Key takeaway
**Protect the airway before secondary tasks.**
`);
    expect(parsed.isStructured).toBe(true);
    expect(Array.isArray(parsed.visualBlocks)).toBe(true);
    expect(parsed.visualBlocks.length).toBe(0);
  });
});
