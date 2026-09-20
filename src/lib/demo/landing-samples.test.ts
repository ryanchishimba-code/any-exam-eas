import { describe, expect, it } from "vitest";
import { getLandingMcqSample, LANDING_MCQ_SAMPLES } from "./landing-samples";
import type { ExamSlug } from "@/types/edtech";

const PAID_BOARDS: ExamSlug[] = ["naplex", "aanp-fnp", "usmle"];

describe("landing MCQ samples", () => {
  it("ships real option text for paid-traffic boards", () => {
    for (const exam of PAID_BOARDS) {
      const sample = getLandingMcqSample(exam);
      expect(sample.examSlug).toBe(exam);
      expect(sample.stem.trim().length).toBeGreaterThan(20);
      expect(sample.options).toHaveLength(4);
      for (const opt of sample.options) {
        expect(typeof opt).toBe("string");
        expect(opt.trim().length).toBeGreaterThan(8);
      }
      expect(sample.options).toContain(sample.correct);
      expect(sample.rationale.trim().length).toBeGreaterThan(20);
    }
  });

  it("keeps options as plain strings so the hero widget can render them", () => {
    for (const sample of LANDING_MCQ_SAMPLES) {
      expect(Array.isArray(sample.options)).toBe(true);
      expect(sample.options.every((opt) => typeof opt === "string")).toBe(true);
    }
  });
});
