/**
 * Parse stored rationale text into UI-friendly sections.
 * Supports expert ## sections, structured headers, and legacy plain text.
 */
import type { ExpertStructuredRationale } from "./expert-rationale-types";
export type ParsedRationaleDisplay = {
  whyCorrectHeadline?: string;
  conceptBullets: string[];
  clinicalContext?: string;
  wrongOptions: Array<{ option: string; body: string }>;
  keyTakeaway?: string;
  memoryHook?: string;
  /** True when structured ## headers were found. */
  isStructured: boolean;
  /** Expert-tier sections (from JSON or parsed markdown). */
  stepByStepReasoning: string[];
  clinicalPearl?: string;
  pharmacologyTieIn?: string;
  highYieldFacts: string[];
  commonPitfalls: string[];
  nextStepInCare?: string;
  testTakingTip?: string;
  realWorldApplication?: string;
  layeredDepth?: { basic: string; intermediate: string; advanced: string };
  visualCues: Array<{ label: string; description: string }>;
  visualBlocks: import("./visual-rationale-types").VisualRationaleBlock[];
  crossReferences: Array<{ exam: string; topic: string; note: string }>;
  isExpert: boolean;
  /** Full text fallback for legacy items. */
  legacyBody?: string;
};

function stripBold(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

function extractSection(text: string, header: string, nextHeaders: string[]): string {
  const start = text.indexOf(header);
  if (start < 0) return "";
  const after = text.slice(start + header.length);
  let end = after.length;
  for (const next of nextHeaders) {
    const idx = after.indexOf(next);
    if (idx >= 0 && idx < end) end = idx;
  }
  return after.slice(0, end).trim();
}

function parseBullets(block: string): string[] {
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("•") || l.startsWith("-"))
    .map((l) => l.replace(/^[•-]\s*/, "").trim())
    .filter(Boolean);
}

function parseWrongOptions(block: string): Array<{ option: string; body: string }> {
  const chunks = block.split(/\n(?=\*\*)/).filter(Boolean);
  const results: Array<{ option: string; body: string }> = [];

  for (const chunk of chunks) {
    const optionMatch = chunk.match(/^\*\*(.+?)\*\*/);
    if (!optionMatch) continue;
    const option = stripBold(optionMatch[1]!);
    const body = chunk.slice(optionMatch[0].length).trim();
    if (option && body) results.push({ option, body });
  }

  if (results.length === 0 && block.includes("•")) {
    for (const line of block.split("\n")) {
      const m = line.match(/^•\s*(.+?):\s*(.+)$/);
      if (m) results.push({ option: m[1]!.trim(), body: m[2]!.trim() });
    }
  }

  return results;
}

function parseNumberedSteps(block: string): string[] {
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^\d+\./.test(l))
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

function parseSimpleSection(block: string): string {
  return block.replace(/\*\*/g, "").trim();
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v ?? "")).filter(Boolean) : [];
}

/** Build display model from persisted expert JSON (preferred over markdown parse). */
export function parseExpertRationaleForDisplay(
  expert: ExpertStructuredRationale
): ParsedRationaleDisplay {
  const base = parseRationaleForDisplay(
    assembleExpertMarkdownHeadersOnly(expert)
  );
  return {
    ...base,
    // Partial generationMeta payloads are common — never leave arrays undefined for UI `.length`.
    stepByStepReasoning: asStringArray(expert.stepByStepReasoning),
    clinicalPearl: expert.clinicalPearl,
    pharmacologyTieIn: expert.pharmacologyTieIn,
    highYieldFacts: asStringArray(expert.highYieldFacts),
    commonPitfalls: asStringArray(expert.commonPitfalls),
    nextStepInCare: expert.nextStepInCare,
    testTakingTip: expert.testTakingTip,
    realWorldApplication: expert.realWorldApplication,
    layeredDepth: expert.layeredDepth,
    visualCues: Array.isArray(expert.visualCues) ? expert.visualCues : [],
    visualBlocks: Array.isArray(expert.visualBlocks) ? expert.visualBlocks : [],
    crossReferences: Array.isArray(expert.crossReferences) ? expert.crossReferences : [],
    isExpert: true,
    isStructured: true,
  };
}

/** Minimal markdown for reusing base parser on expert JSON. */
function assembleExpertMarkdownHeadersOnly(expert: ExpertStructuredRationale): string {
  const whyIncorrect = Array.isArray(expert.whyIncorrect) ? expert.whyIncorrect : [];
  const conceptBreakdown = asStringArray(expert.whyCorrect?.conceptBreakdown);
  const wrongSection = whyIncorrect
    .map(
      (e) =>
        `**${e.option}**\n• Trap: ${e.misconception}\n• Why it fails here: ${e.correction}\n• Remember: ${e.conceptLink}`
    )
    .join("\n\n");

  return [
    "## Why this answer is correct",
    expert.whyCorrect?.headline,
    ...conceptBreakdown.map((b) => `• ${b}`),
    expert.whyCorrect?.clinicalContext
      ? `**In practice:** ${expert.whyCorrect.clinicalContext}`
      : "",
    "## Why the other options are wrong",
    wrongSection,
    "## Key takeaway",
    expert.keyTakeaway ? `**${expert.keyTakeaway}**` : "",
    expert.memoryHook ? `**Memory hook:** ${expert.memoryHook}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function parseRationaleForDisplay(
  explanation: string,
  expertJson?: ExpertStructuredRationale
): ParsedRationaleDisplay {
  if (expertJson) return parseExpertRationaleForDisplay(expertJson);

  const text = explanation?.trim() ?? "";
  const empty: ParsedRationaleDisplay = {
    conceptBullets: [],
    wrongOptions: [],
    stepByStepReasoning: [],
    highYieldFacts: [],
    commonPitfalls: [],
    visualCues: [],
    visualBlocks: [],
    crossReferences: [],
    isStructured: false,
    isExpert: false,
    legacyBody: text || undefined,
  };

  if (!text) return empty;

  const hasStructure = text.includes("## Why this answer is correct");
  if (!hasStructure) return empty;

  const whyBlock = extractSection(text, "## Why this answer is correct", [
    "## Why the other options are wrong",
    "## Key takeaway",
  ]);
  const wrongBlock = extractSection(text, "## Why the other options are wrong", [
    "## Key takeaway",
  ]);
  const takeawayBlock = extractSection(text, "## Key takeaway", [
    "## Step-by-step reasoning",
    "## Clinical pearl",
  ]);
  const stepsBlock = extractSection(text, "## Step-by-step reasoning", [
    "## Clinical pearl",
    "## Pharmacology tie-in",
    "## Why the other options are wrong",
  ]);
  const pearlBlock = extractSection(text, "## Clinical pearl", [
    "## Pharmacology tie-in",
    "## High-yield facts",
  ]);
  const pharmBlock = extractSection(text, "## Pharmacology tie-in", ["## High-yield facts"]);
  const hyBlock = extractSection(text, "## High-yield facts", ["## Common pitfalls"]);
  const pitfallBlock = extractSection(text, "## Common pitfalls", ["## Next step in care"]);
  const nextBlock = extractSection(text, "## Next step in care", ["## Test-taking tip"]);
  const tipBlock = extractSection(text, "## Test-taking tip", [
    "## Real-world nursing application",
  ]);
  const rwBlock = extractSection(text, "## Real-world nursing application", [
    "## Layered depth",
  ]);
  const layeredBlock = extractSection(text, "## Layered depth", ["## Visual cues"]);
  const visualBlock = extractSection(text, "## Visual cues", ["## Related topics"]);
  const xrefBlock = extractSection(text, "## Related topics", []);

  const lines = whyBlock.split("\n").map((l) => l.trim()).filter(Boolean);
  const headline = lines.find((l) => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("**In practice"));
  const inPractice = whyBlock.match(/\*\*In practice:\*\*\s*(.+)/i)?.[1]?.trim();

  let keyTakeaway = takeawayBlock.replace(/\*\*/g, "").trim();
  let memoryHook: string | undefined;
  const hookMatch = takeawayBlock.match(/\*\*Memory hook:\*\*\s*(.+)/i);
  if (hookMatch) {
    memoryHook = hookMatch[1]!.trim();
    keyTakeaway = keyTakeaway.replace(/\*\*Memory hook:\*\*[\s\S]*/i, "").replace(/\*\*/g, "").trim();
  }

  let layeredDepth: ParsedRationaleDisplay["layeredDepth"];
  const basicM = layeredBlock.match(/\*\*Basic:\*\*\s*(.+)/i);
  const intM = layeredBlock.match(/\*\*Intermediate:\*\*\s*(.+)/i);
  const advM = layeredBlock.match(/\*\*Advanced:\*\*\s*(.+)/i);
  if (basicM && intM && advM) {
    layeredDepth = {
      basic: basicM[1]!.trim(),
      intermediate: intM[1]!.trim(),
      advanced: advM[1]!.trim(),
    };
  }

  const visualCues: ParsedRationaleDisplay["visualCues"] = [];
  for (const line of visualBlock.split("\n")) {
    const m = line.match(/^•\s*\*\*(.+?):\*\*\s*(.+)$/);
    if (m) visualCues.push({ label: m[1]!.trim(), description: m[2]!.trim() });
  }

  const crossReferences: ParsedRationaleDisplay["crossReferences"] = [];
  for (const line of xrefBlock.split("\n")) {
    const m = line.match(/^•\s*\*\*(.+?)\s*—\s*(.+?):\*\*\s*(.+)$/);
    if (m) crossReferences.push({ exam: m[1]!.trim(), topic: m[2]!.trim(), note: m[3]!.trim() });
  }

  const isExpert = Boolean(
    stepsBlock ||
      pearlBlock ||
      pharmBlock ||
      hyBlock ||
      tipBlock ||
      rwBlock
  );

  return {
    whyCorrectHeadline: headline ? stripBold(headline) : undefined,
    conceptBullets: parseBullets(whyBlock),
    clinicalContext: inPractice,
    wrongOptions: parseWrongOptions(wrongBlock),
    keyTakeaway: keyTakeaway || undefined,
    memoryHook,
    stepByStepReasoning: parseNumberedSteps(stepsBlock),
    clinicalPearl: pearlBlock ? parseSimpleSection(pearlBlock) : undefined,
    pharmacologyTieIn: pharmBlock ? parseSimpleSection(pharmBlock) : undefined,
    highYieldFacts: parseBullets(hyBlock),
    commonPitfalls: parseBullets(pitfallBlock),
    nextStepInCare: nextBlock ? parseSimpleSection(nextBlock) : undefined,
    testTakingTip: tipBlock ? parseSimpleSection(tipBlock) : undefined,
    realWorldApplication: rwBlock ? parseSimpleSection(rwBlock) : undefined,
    layeredDepth,
    visualCues,
    crossReferences,
    isStructured: true,
    isExpert,
  };
}
