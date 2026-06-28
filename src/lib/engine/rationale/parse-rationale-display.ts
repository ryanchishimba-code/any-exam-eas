/**
 * Parse stored rationale text into UI-friendly sections.
 * Supports new ## markdown structure and legacy plain text.
 */
export type ParsedRationaleDisplay = {
  whyCorrectHeadline?: string;
  conceptBullets: string[];
  clinicalContext?: string;
  wrongOptions: Array<{ option: string; body: string }>;
  keyTakeaway?: string;
  memoryHook?: string;
  /** True when structured ## headers were found. */
  isStructured: boolean;
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

export function parseRationaleForDisplay(explanation: string): ParsedRationaleDisplay {
  const text = explanation?.trim() ?? "";
  const empty: ParsedRationaleDisplay = {
    conceptBullets: [],
    wrongOptions: [],
    isStructured: false,
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
  const takeawayBlock = extractSection(text, "## Key takeaway", []);

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

  return {
    whyCorrectHeadline: headline ? stripBold(headline) : undefined,
    conceptBullets: parseBullets(whyBlock),
    clinicalContext: inPractice,
    wrongOptions: parseWrongOptions(wrongBlock),
    keyTakeaway: keyTakeaway || undefined,
    memoryHook,
    isStructured: true,
  };
}
