import type { NgnPatient } from "@/lib/assessment/types";

/** Completed months that mean "under 1 year". 12 months is age 1. */
const MIN_AGE_MONTHS = 1;
const MAX_AGE_MONTHS = 11;

type AgeSource = Pick<NgnPatient, "age" | "ageMonths">;

function underOneYear(age: number): boolean {
  return typeof age === "number" && Number.isFinite(age) && age < 1;
}

/** Usable month count for an infant. Anything else is ignored. */
export function infantAgeMonths(patient: AgeSource): number | null {
  if (!underOneYear(patient.age)) return null;
  const months = patient.ageMonths;
  if (typeof months !== "number" || !Number.isInteger(months)) return null;
  if (months < MIN_AGE_MONTHS || months > MAX_AGE_MONTHS) return null;
  return months;
}

/**
 * Hyphenated age for a vignette.
 * Adults stay "N-year-old". Infants with months are "N-month-old".
 * An infant without months returns "" so callers never write "0-year-old".
 */
export function patientAgePhrase(patient: AgeSource): string {
  const months = infantAgeMonths(patient);
  if (months != null) return `${months}-month-old`;
  if (underOneYear(patient.age)) return "";
  if (typeof patient.age !== "number" || !Number.isInteger(patient.age)) return "";
  return `${patient.age}-year-old`;
}

/** Header age token. Adults keep "N years". Infants use the month phrase or nothing. */
export function patientHeaderAge(patient: AgeSource): string {
  const months = infantAgeMonths(patient);
  if (months != null) return `${months}-month-old`;
  if (underOneYear(patient.age)) return "";
  if (typeof patient.age !== "number" || !Number.isInteger(patient.age)) return "";
  return `${patient.age} years`;
}

function sexLabel(sex: string): string {
  if (!sex) return "";
  return sex.charAt(0).toUpperCase() + sex.slice(1);
}

/** Client header line. Same segments as before: age, sex, weight. */
export function formatPatientDemographics(
  patient: Pick<NgnPatient, "age" | "ageMonths" | "sex" | "weightKg">
): string {
  return [patientHeaderAge(patient), sexLabel(patient.sex), `${patient.weightKg} kg`].filter(Boolean).join(" · ");
}

/** "Name, N-year-old sex. History" — or plain "Name, sex." when months are unknown. */
export function formatCasePatientLine(
  patient: Pick<NgnPatient, "displayName" | "age" | "ageMonths" | "sex" | "history">
): string {
  const age = patientAgePhrase(patient);
  const descriptor = [age, patient.sex.trim()].filter(Boolean).join(" ");
  const named = descriptor ? `${patient.displayName}, ${descriptor}.` : `${patient.displayName}.`;
  return `${named} ${patient.history ?? ""}`.trim();
}
