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

function gradedValue(value: number, rule: NumericGradeRule): number {
  return rule.kind === "round" ? roundHalfAwayFromZero(value, rule.places) : value;
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
  const rule = numericGradeRule(instruction);
  const graded = gradedValue(student, rule);
  const min = gradedValue(key.min, rule);
  const max = gradedValue(key.max, rule);
  const scale = Math.max(1, Math.abs(graded), Math.abs(min), Math.abs(max));
  const epsilon = 1e-9 * scale;
  return graded >= min - epsilon && graded <= max + epsilon;
}
