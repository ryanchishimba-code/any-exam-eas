/**
 * Shared constructed-response grader.
 *
 * Exam scoring and instant feedback both use this so they cannot disagree.
 * Tolerance comes from the item's own rounding instruction. With no
 * instruction, the parsed numbers must match. A slash is a fraction, never
 * a digit concatenation ("1/2" is one half, not 12).
 */

export type NumericGradeRule =
  | { kind: "exact" }
  | { kind: "round"; places: number };

const DECIMAL_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
};

const UNIT_TAIL = /\s*(?:[a-zA-Zμµ%][a-zA-Zμµ%0-9./%-]*|°[a-zA-Z]*)\s*$/u;

const NUMBER = String.raw`[+-]?(?:\d+(?:\.\d*)?|\.\d+)`;

export function numericGradeRule(instruction: string): NumericGradeRule {
  const text = instruction.toLowerCase();
  const decimal = text.match(
    /round(?:ed|ing)?\s+(?:your\s+answer\s+)?to\s+(?:the\s+)?(?:nearest\s+)?(one|two|three|four|\d)\s+decimal/
  );
  if (decimal) {
    const places = DECIMAL_WORDS[decimal[1]!] ?? Number(decimal[1]);
    if (Number.isInteger(places) && places >= 0 && places <= 6) {
      return { kind: "round", places };
    }
  }
  if (/nearest\s+thousandth/.test(text)) return { kind: "round", places: 3 };
  if (/nearest\s+hundredth/.test(text)) return { kind: "round", places: 2 };
  if (/nearest\s+tenth/.test(text)) return { kind: "round", places: 1 };
  if (/nearest\s+whole/.test(text) || /whole\s+number/.test(text)) {
    return { kind: "round", places: 0 };
  }
  return { kind: "exact" };
}

/** Half away from zero, stable for values like 1.005. */
export function roundHalfAwayFromZero(value: number, places: number): number {
  const factor = 10 ** places;
  const scaled = Number((value * factor).toFixed(8));
  const rounded = Math.sign(scaled) * Math.round(Math.abs(scaled));
  return rounded / factor;
}

function stripThousands(text: string): string {
  return text.replace(/(\d),(?=\d{3}(?:\D|$))/g, "$1");
}

/**
 * Parse one numeric entry.
 * Returns null for empty, malformed, or multi-slash text so "1/2" cannot
 * become 12 and "1/2/3" cannot become 123.
 */
export function parseNumericEntry(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const text = stripThousands(trimmed);
  const withoutUnit = text.replace(UNIT_TAIL, "").trim();
  const core = withoutUnit.length > 0 ? withoutUnit : text;

  const mixed = core.match(new RegExp(`^(${NUMBER})\\s+(${NUMBER})\\s*/\\s*(${NUMBER})$`));
  if (mixed) {
    const whole = Number(mixed[1]);
    const numerator = Number(mixed[2]);
    const denominator = Number(mixed[3]);
    if (!Number.isFinite(denominator) || denominator === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return whole + sign * (numerator / denominator);
  }

  const fraction = core.match(new RegExp(`^(${NUMBER})\\s*/\\s*(${NUMBER})$`));
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (!Number.isFinite(denominator) || denominator === 0) return null;
    return Number(fraction[1]) / denominator;
  }

  if (core.includes("/")) return null;

  if (!new RegExp(`^${NUMBER}$`).test(core)) return null;
  const value = Number(core);
  return Number.isFinite(value) ? value : null;
}

export type NumericSpan = { min: number; max: number };

/** A point value, or an inclusive a-b range. Null when the text is not numeric. */
export function parseNumericSpan(raw: string): NumericSpan | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const text = stripThousands(trimmed);
  const withoutUnit = text.replace(UNIT_TAIL, "").trim();
  const core = withoutUnit.length > 0 ? withoutUnit : text;
  const range = core.match(new RegExp(`^(${NUMBER})\\s*[-–]\\s*(${NUMBER})$`));
  if (range) {
    const min = Number(range[1]);
    const max = Number(range[2]);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return null;
    return { min, max };
  }
  const point = parseNumericEntry(raw);
  if (point == null) return null;
  return { min: point, max: point };
}

/** Decimal places written on the key. "333" is 0, "9.20" is 2. */
export function keyDecimalPlaces(keyRaw: string): number {
  const matches = keyRaw.match(/\d+\.\d+/g);
  if (!matches || matches.length === 0) return 0;
  return Math.max(...matches.map((token) => token.split(".")[1]!.length));
}

/**
 * Exact keys also accept a value that rounds to the key's precision,
 * or that sits within 0.5% of the key. An explicit rounding instruction
 * still uses only that rule.
 */
export function numericValuesMatch(
  student: number,
  min: number,
  max: number,
  instruction: string,
  keyRaw: string
): boolean {
  const rule = numericGradeRule(instruction);
  const scale = Math.max(1, Math.abs(student), Math.abs(min), Math.abs(max));
  const epsilon = 1e-9 * scale;
  if (rule.kind === "round") {
    const graded = roundHalfAwayFromZero(student, rule.places);
    const lo = roundHalfAwayFromZero(min, rule.places);
    const hi = roundHalfAwayFromZero(max, rule.places);
    return graded >= lo - epsilon && graded <= hi + epsilon;
  }
  if (student >= min - epsilon && student <= max + epsilon) return true;
  const rounded = roundHalfAwayFromZero(student, keyDecimalPlaces(keyRaw));
  if (rounded >= min - epsilon && rounded <= max + epsilon) return true;
  const anchor = student < min ? min : max;
  const denom = Math.max(Math.abs(anchor), 1e-9);
  return Math.abs(student - anchor) / denom <= 0.005;
}

const UNIT_WORDS = "mg/mL|mcg/mL|mL/hr|mg|mcg|mL|tablets?|capsules?|gtt|mEq|%";

/** Unit chip for a numeric box. A stem that asks for tablets does not keep a stored "mg". */
export function numericAnswerUnit(stem: string, key: string, stored?: string): string {
  const ask = stem.toLowerCase();
  if (/how many tablets/.test(ask)) return "tablets";
  if (/how many capsules/.test(ask)) return "capsules";
  if (/how many (?:ml|milliliters)/.test(ask)) return "mL";
  if (/how many (?:drops|gtt)/.test(ask)) return "gtt";
  if (/mg\s*\/\s*ml|concentration in mg/.test(ask)) return "mg/mL";
  if (/ml\s*\/\s*hr|infusion rate|drops per minute/.test(ask)) return "mL/hr";
  if (/how many milligrams|dose in mg|milligrams of/.test(ask)) return "mg";
  const storedUnit = (stored ?? "").trim();
  if (storedUnit && !(/^mg$/i.test(storedUnit) && /tablet/.test(ask))) {
    if (new RegExp(storedUnit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(stem)) return storedUnit;
  }
  const fromKey = key.match(new RegExp(`\\d(?:\\.\\d+)?\\s*(${UNIT_WORDS})\\s*$`, "i"));
  if (!fromKey) return "";
  const unit = fromKey[1]!;
  if (/^tablets?$/i.test(unit)) return "tablets";
  if (/^capsules?$/i.test(unit)) return "capsules";
  return unit;
}

/** Shown when the stem never says how to round a numeric key. */
export function numericRoundingNote(stem: string, key: string): string | null {
  if (numericGradeRule(stem).kind === "round") return null;
  if (parseNumericSpan(key) == null) return null;
  const places = keyDecimalPlaces(key);
  if (places <= 0) return "Round to the nearest whole number.";
  if (places === 1) return "Round to the nearest tenth.";
  if (places === 2) return "Round to the nearest hundredth.";
  return `Round to ${places} decimal places.`;
}

/**
 * True when the entry matches the key under the item's rounding rule.
 * Null when neither side is numeric, so the caller can fall back to text.
 * False when only one side is numeric.
 */
export function gradeNumericAnswer(
  studentRaw: string,
  keyRaw: string,
  instruction: string
): boolean | null {
  const student = parseNumericEntry(studentRaw);
  const key = parseNumericSpan(keyRaw);
  if (student == null && key == null) return null;
  if (student == null || key == null) return false;
  return numericValuesMatch(student, key.min, key.max, instruction, keyRaw);
}
