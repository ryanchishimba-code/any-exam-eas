/**
 * Pure planning for NAPLEX clean-up batch 4 key fixes.
 * Option text is never changed. Copy updates use only the approved rationale.
 */

export type OptionsPlan = {
  options: string;
  changed: boolean;
  distractorsRewritten: number;
  distractorsRemoved: number;
  clinicalRewritten: boolean;
  takeawayRewritten: boolean;
  listed: string[];
};

function section(text: string, start: string, ends: string[]): string {
  const from = text.indexOf(start);
  if (from < 0) return "";
  const body = text.slice(from + start.length);
  let endAt = body.length;
  for (const end of ends) {
    const at = body.indexOf(end);
    if (at >= 0 && at < endAt) endAt = at;
  }
  return body.slice(0, endAt).trim();
}

function optionForLabel(label: string, options: string[]): string | null {
  if (options.includes(label)) return label;
  const stripped = label.replace(/\.$/, "");
  const hits = options.filter((option) => option.replace(/\.$/, "") === stripped);
  return hits.length === 1 ? hits[0]! : null;
}

export function rationaleParts(explanation: string): {
  whyCorrect: string;
  wrong: Map<string, string>;
  takeaway: string;
} {
  const whyCorrect = section(explanation, "## Why this answer is correct", [
    "## Why the other options are wrong",
    "## Key takeaway",
  ]);
  const wrongBlock = section(explanation, "## Why the other options are wrong", ["## Key takeaway"]);
  const wrong = new Map<string, string>();
  for (const line of wrongBlock.split("\n")) {
    const match = line.match(/^•\s+\*\*(.+?)\*\*:\s*(.*)$/);
    if (!match) continue;
    wrong.set(match[1]!.trim(), match[2]!.trim());
  }
  let takeaway = section(explanation, "## Key takeaway", ["(Guideline:"]);
  takeaway = takeaway.replace(/\s+/g, " ").trim();
  return { whyCorrect, wrong, takeaway };
}

function lettersToTexts(options: string[], letters: string): string[] {
  return letters.split("").map((letter) => {
    const index = letter.charCodeAt(0) - 65;
    const text = options[index];
    if (!text) throw new Error(`letter ${letter} is outside the option list`);
    return text;
  });
}

export function answerFromLetters(options: string[], letters: string): string {
  const texts = lettersToTexts(options, letters);
  return texts.length === 1 ? texts[0]! : texts.join("|||");
}

export function lettersOfAnswer(options: string[], answer: string): string | null {
  const parts = answer.includes("|||")
    ? answer.split("|||").map((part) => part.trim()).filter(Boolean)
    : [answer.trim()];
  const letters: string[] = [];
  for (const part of parts) {
    const index = options.indexOf(part);
    if (index < 0 || index > 25) return null;
    letters.push(String.fromCharCode(65 + index));
  }
  return letters.join("");
}

export function planOptionsUpdate(input: {
  optionsJson: string;
  oldLetters: string;
  newLetters: string;
  explanation: string;
}): OptionsPlan {
  const parsed = JSON.parse(input.optionsJson) as Record<string, unknown>;
  if (!Array.isArray(parsed.options) || parsed.options.some((option) => typeof option !== "string")) {
    throw new Error("options JSON is missing a string options array");
  }
  const optionTexts = parsed.options as string[];
  const beforeOptions = JSON.stringify(optionTexts);
  const oldTexts = lettersToTexts(optionTexts, input.oldLetters);
  const newTexts = new Set(lettersToTexts(optionTexts, input.newLetters));
  const listed: string[] = [];
  const parts = rationaleParts(input.explanation);
  const whyCorrect = parts.whyCorrect;
  const takeaway = parts.takeaway;
  const wrong = new Map<string, string>();
  for (const [label, reason] of parts.wrong) {
    const option = optionForLabel(label, optionTexts);
    if (!option) {
      listed.push(`bullet-not-an-option:${label.slice(0, 80)}`);
      continue;
    }
    if (newTexts.has(option)) continue;
    wrong.set(option, reason);
  }
  let distractorsRewritten = 0;
  let distractorsRemoved = 0;
  let clinicalRewritten = false;
  let takeawayRewritten = false;

  if (parsed.distractorRationale && typeof parsed.distractorRationale === "object" && !Array.isArray(parsed.distractorRationale)) {
    const next = { ...(parsed.distractorRationale as Record<string, unknown>) };
    for (const label of Object.keys(next)) {
      if (newTexts.has(label)) {
        delete next[label];
        distractorsRemoved += 1;
        continue;
      }
      if (wrong.has(label)) {
        next[label] = wrong.get(label);
        distractorsRewritten += 1;
        continue;
      }
      const value = typeof next[label] === "string" ? next[label] : "";
      if (input.oldLetters !== input.newLetters && oldTexts.some((old) => old.length > 12 && value.includes(old.slice(0, 24)))) {
        listed.push(`distractor-still-teaches-old-key:${label.slice(0, 80)}`);
      }
    }
    for (const [label, reason] of wrong) {
      if (!(label in next)) {
        next[label] = reason;
        distractorsRewritten += 1;
      }
    }
    for (const old of oldTexts) {
      if (newTexts.has(old)) continue;
      if (!wrong.has(old) && !(old in next)) listed.push("old-key-without-distractor-bullet");
    }
    parsed.distractorRationale = next;
  } else if (wrong.size > 0) {
    listed.push("no-distractor-object");
  }

  if (typeof parsed.clinicalReasoning === "string" && parsed.clinicalReasoning.trim() && whyCorrect) {
    if (!input.explanation.includes(parsed.clinicalReasoning.trim())) {
      parsed.clinicalReasoning = whyCorrect;
      clinicalRewritten = true;
    }
  }

  if (Array.isArray(parsed.keyTakeaways) && parsed.keyTakeaways.length > 0 && takeaway) {
    const current = parsed.keyTakeaways.map((item) => String(item)).join(" ");
    if (!input.explanation.includes(current.trim())) {
      parsed.keyTakeaways = [takeaway];
      takeawayRewritten = true;
    }
  }

  if (JSON.stringify(parsed.options) !== beforeOptions) {
    throw new Error("option text changed");
  }
  const changed = distractorsRewritten > 0 || distractorsRemoved > 0 || clinicalRewritten || takeawayRewritten;
  return {
    options: changed ? JSON.stringify(parsed) : input.optionsJson,
    changed,
    distractorsRewritten,
    distractorsRemoved,
    clinicalRewritten,
    takeawayRewritten,
    listed,
  };
}
