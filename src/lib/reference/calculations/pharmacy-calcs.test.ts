import { describe, expect, it } from "vitest";
import {
  cockcroftGaultCrCl,
  idealBodyWeightKg,
  roundCrClForExam,
  vancomycinIntervalFromCrCl,
  vancomycinLoadingDose,
  vancomycinMonitoringFromTrough,
} from "./pharmacy-calcs";

describe("pharmacy-calcs", () => {
  it("matches NAPLEX vancomycin CrCl case (70 y/o man, 75 kg, SCr 2.4)", () => {
    const result = cockcroftGaultCrCl({
      age: 70,
      sex: "male",
      scrMgDl: 2.4,
      actualWeightKg: 75,
    });
    expect(roundCrClForExam(result.crClMlMin)).toBe(30);
  });

  it("applies female factor to Cockcroft-Gault", () => {
    const male = cockcroftGaultCrCl({
      age: 65,
      sex: "male",
      scrMgDl: 1.2,
      actualWeightKg: 80,
    });
    const female = cockcroftGaultCrCl({
      age: 65,
      sex: "female",
      scrMgDl: 1.2,
      actualWeightKg: 80,
    });
    expect(female.crClMlMin).toBeCloseTo(male.crClMlMin * 0.85, 1);
  });

  it("uses adjusted body weight when obese", () => {
    const ibw = idealBodyWeightKg(68, "male");
    const result = cockcroftGaultCrCl({
      age: 55,
      sex: "male",
      scrMgDl: 1.4,
      actualWeightKg: 120,
      heightInches: 68,
    });
    expect(result.adjustedBodyWeightKg).toBeDefined();
    expect(result.weightUsedKg).toBeLessThan(120);
    expect(result.weightUsedKg).toBeGreaterThan(ibw);
  });

  it("caps vancomycin loading at 3 g", () => {
    const result = vancomycinLoadingDose(150, true);
    expect(result.doseMg).toBe(3000);
    expect(result.capped).toBe(true);
  });

  it("suggests extended interval at low CrCl", () => {
    expect(vancomycinIntervalFromCrCl(25).intervalLabel).toBe("q24–48 h");
    expect(vancomycinIntervalFromCrCl(55).intervalLabel).toBe("q8–12 h");
  });

  it("flags AUC target from trough estimate", () => {
    const inRange = vancomycinMonitoringFromTrough(40);
    expect(inRange.estimatedAuc).toBe(480);
    expect(inRange.aucInTarget).toBe(true);
  });
});
