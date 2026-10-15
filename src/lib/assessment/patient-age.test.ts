import { describe, expect, it } from "vitest";
import {
  formatCasePatientLine,
  formatPatientDemographics,
  infantAgeMonths,
  patientAgePhrase,
  patientHeaderAge,
} from "./patient-age";

describe("infant patient age", () => {
  it("renders N-month-old for an infant and never 0-year-old", () => {
    const infant = {
      displayName: "Mateo Herrera",
      age: 0,
      ageMonths: 4,
      sex: "male",
      weightKg: 6.2,
      history: "Term 4-month-old boy (born at 39 weeks).",
    };
    expect(infantAgeMonths(infant)).toBe(4);
    expect(patientAgePhrase(infant)).toBe("4-month-old");
    expect(patientHeaderAge(infant)).toBe("4-month-old");
    expect(formatPatientDemographics(infant)).toBe("4-month-old · Male · 6.2 kg");
    const line = formatCasePatientLine(infant);
    expect(line).toBe("Mateo Herrera, 4-month-old male. Term 4-month-old boy (born at 39 weeks).");
    expect(line).not.toMatch(/0-year-old|0 years/);
    expect(formatPatientDemographics(infant)).not.toMatch(/0-year-old|0 years/);
  });

  it("falls back to plain wording when an infant has no month count", () => {
    const newborn = {
      displayName: "Baby Boy Nguyen",
      age: 0,
      sex: "male",
      weightKg: 4.4,
      history: "Term male born at 39 weeks by cesarean birth.",
    };
    expect(patientAgePhrase(newborn)).toBe("");
    expect(patientHeaderAge(newborn)).toBe("");
    expect(formatPatientDemographics(newborn)).toBe("Male · 4.4 kg");
    expect(formatCasePatientLine(newborn)).toBe(
      "Baby Boy Nguyen, male. Term male born at 39 weeks by cesarean birth."
    );
    expect(formatCasePatientLine(newborn)).not.toMatch(/0-year-old|0 years/);
    expect(formatPatientDemographics({ ...newborn, ageMonths: 0 })).not.toMatch(/0-year-old|0 years|0-month-old/);
    expect(formatPatientDemographics({ ...newborn, ageMonths: 12 })).toBe("Male · 4.4 kg");
    expect(patientAgePhrase({ age: 0, ageMonths: 4.5 })).toBe("");
  });

  it("keeps the adult year wording", () => {
    const adult = { displayName: "Alex", age: 44, sex: "female", weightKg: 70, history: "Vomiting" };
    expect(patientAgePhrase(adult)).toBe("44-year-old");
    expect(formatPatientDemographics(adult)).toBe("44 years · Female · 70 kg");
    expect(formatCasePatientLine(adult)).toBe("Alex, 44-year-old female. Vomiting");
    expect(patientAgePhrase({ age: 1, ageMonths: 4 })).toBe("1-year-old");
    expect(patientHeaderAge({ age: 1 })).toBe("1 years");
    expect(patientAgePhrase({ age: 0, ageMonths: 1 })).toBe("1-month-old");
  });
});
