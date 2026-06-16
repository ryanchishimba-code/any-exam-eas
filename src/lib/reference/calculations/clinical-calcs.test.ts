import { describe, expect, it } from "vitest";
import {
  bodyMassIndex,
  bodySurfaceArea,
  bsaDose,
  dosageByWeight,
  dripRateGttPerMin,
  infusionTimeHours,
  ivFlowRateFromMinutes,
  ivFlowRateMlPerHour,
  metricConversion,
} from "./clinical-calcs";

describe("clinical-calcs", () => {
  it("computes BMI in metric units", () => {
    const result = bodyMassIndex("metric", 70, 175);
    expect(result.result).toBeCloseTo(22.9, 1);
    expect(result.resultUnit).toBe("kg/m²");
    expect(result.steps.length).toBeGreaterThan(2);
  });

  it("computes BMI in imperial units", () => {
    const metric = bodyMassIndex("metric", 70, 175);
    const imperial = bodyMassIndex("imperial", 154, 69);
    expect(imperial.result).toBeCloseTo(metric.result, 0);
  });

  it("computes weight-based dose", () => {
    const result = dosageByWeight(10, 75);
    expect(result.result).toBe(750);
    expect(result.resultUnit).toBe("mg");
  });

  it("computes IV flow rate from hours", () => {
    const result = ivFlowRateMlPerHour(1000, 8);
    expect(result.result).toBe(125);
  });

  it("computes IV flow rate from minutes", () => {
    const result = ivFlowRateFromMinutes(500, 30);
    expect(result.result).toBe(1000);
  });

  it("computes drip rate", () => {
    const result = dripRateGttPerMin(100, 15, 60);
    expect(result.result).toBe(25);
  });

  it("computes infusion time", () => {
    const result = infusionTimeHours(500, 125);
    expect(result.result).toBe(4);
    expect(result.interpretation).toContain("240");
  });

  it("computes BSA with Mosteller formula", () => {
    const result = bodySurfaceArea(170, 70, "mosteller");
    expect(result.result).toBeCloseTo(1.82, 1);
  });

  it("computes BSA dose from mg/m²", () => {
    const result = bsaDose(50, 170, 70);
    expect(result.result).toBeCloseTo(91, 0);
    expect(result.interpretation).toContain("m²");
  });

  it("converts kg to lb", () => {
    const result = metricConversion("kg-lb", 10, false);
    expect(result.result).toBeCloseTo(22.05, 1);
    expect(result.resultUnit).toBe("lb");
  });

  it("converts mL to L", () => {
    const result = metricConversion("ml-l", 500, true);
    expect(result.result).toBe(0.5);
    expect(result.resultUnit).toBe("L");
  });

  it("converts mcg to mg", () => {
    const result = metricConversion("mcg-mg", 250, true);
    expect(result.result).toBe(0.25);
  });
});
