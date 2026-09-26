/**
 * Two-value constructed responses.
 *
 * Some stems ask for two numbers (mg/day and mL/dose) while the renderer
 * had one box. When the stored key already contains both numbers, show two
 * boxes and score both. When the stem asks for two and the key has one,
 * the item cannot be scored without inventing an answer, so it is excluded.
 * Stored stems and keys are not edited.
 */

import { numericGradeRule, parseNumericEntry, roundHalfAwayFromZero } from "./numeric-grade";

export type NumericSlot = {
  label: string;
  min: number;
  max: number;
};

export type DualNumericPlan =
  | { mode: "single" }
  | { mode: "dual"; slots: [NumericSlot, NumericSlot] }
  | { mode: "unscorable" };

const ASK =
  /\b(?:calculate|how many|how much|what is|using alligation)\b/i;

/** Stem (not the vignette) asks the student for two quantities. */
export function stemAsksForTwoQuantities(stem: string): boolean {
  const text = stem.trim();
  if (!ASK.test(text) || !/\band\b/i.test(text)) return false;
  const dailyAndDose =
    /daily dose/i.test(text) && /(per dose|per administration|each dose|volume)/i.test(text);
  const mgAndMl = /milligrams?/i.test(text) && /milliliters?/i.test(text);
  const volumes = /volumes of/i.test(text);
  const doseAndVolume = /\bdose\b/i.test(text) && /\bvolume\b/i.test(text);
  return dailyAndDose || mgAndMl || volumes || doseAndVolume;
}

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function splitAnswerParts(key: string): string[] | null {
  const trimmed = key.trim();
  if (!trimmed) return null;
  const semi = trimmed.split(";").map((part) => part.trim()).filter(Boolean);
  if (semi.length === 2) return semi;
  if (semi.length > 2) return null;
  const andParts = trimmed.split(/\band\b/i).map((part) => part.trim()).filter(Boolean);
  if (andParts.length === 2 && andParts.every(hasNumber)) return andParts;
  const comma = trimmed.split(",").map((part) => part.trim()).filter(Boolean);
  if (comma.length === 2 && comma.every(hasNumber)) return comma;
  return null;
}

function labelFrom(part: string, numberText: string): string {
  const label = part
    .replace(numberText, " ")
    .replace(/[:]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,–-]+|[\s,–-]+$/g, "")
    .trim();
  if (label.length < 2) return "Answer";
  return label.slice(0, 80);
}

function parseSlot(part: string): NumericSlot | null {
  const range = part.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (range) {
    const min = Number(range[1]);
    const max = Number(range[2]);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return null;
    return { label: labelFrom(part, range[0]), min, max };
  }
  const nums = part.match(/\d+(?:\.\d+)?/g) ?? [];
  if (nums.length !== 1) return null;
  const value = Number(nums[0]);
  if (!Number.isFinite(value)) return null;
  return { label: labelFrom(part, nums[0]!), min: value, max: value };
}

export function planDualNumericAnswer(stem: string, key: string): DualNumericPlan {
  if (!stemAsksForTwoQuantities(stem)) return { mode: "single" };
  const parts = splitAnswerParts(key);
  if (!parts) return { mode: "unscorable" };
  const first = parseSlot(parts[0]!);
  const second = parseSlot(parts[1]!);
  if (!first || !second) return { mode: "unscorable" };
  return { mode: "dual", slots: [first, second] };
}

export function isUnscorableDualNumeric(stem: string, key: string): boolean {
  return planDualNumericAnswer(stem, key).mode === "unscorable";
}

export function numericValueInSlot(raw: string, slot: NumericSlot, instruction = ""): boolean {
  const value = parseNumericEntry(raw);
  if (value == null) return false;
  const rule = numericGradeRule(instruction);
  const graded = rule.kind === "round" ? roundHalfAwayFromZero(value, rule.places) : value;
  const scale = Math.max(1, Math.abs(slot.min), Math.abs(slot.max), Math.abs(graded));
  const epsilon = 1e-9 * scale;
  return graded >= slot.min - epsilon && graded <= slot.max + epsilon;
}

/**
 * SQL mirror for constructed responses whose stem asks for two quantities
 * and whose key has no second number. Two-number keys stay eligible.
 */
export const DUAL_NUMERIC_UNSCORABLE_SQL = `
OR (
  "itemType" IN ('constructed_response', 'calculation')
  AND (
    (question ~* 'daily dose' AND question ~* '(per dose|per administration|each dose)')
    OR (question ~* 'milligrams' AND question ~* 'milliliters' AND question ~* '\\mand\\M')
    OR question ~* 'volumes of'
  )
  AND "correctAnswer" !~ ';'
  AND "correctAnswer" !~* '\\mand\\M'
  AND "correctAnswer" !~ ','
)`;
