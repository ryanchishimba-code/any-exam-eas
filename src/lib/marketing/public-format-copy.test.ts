import { describe, expect, it } from "vitest";
import { EXAM_SEO_CONFIG } from "@/lib/seo/exam-config";
import {
  advertisesHiddenFormat,
  offeredFormatFlags,
  presentPublicExamSeo,
  scrubPublicFormatCopy,
} from "./public-format-copy";

const nclexEmpty = { mcq: 5596, ngn: 0, case: 0 };
const nclexServed = { mcq: 100, ngn: 12, case: 6 };
const usmleCases = { mcq: 8000, ngn: 0, case: 175 };

describe("public format copy", () => {
  it("does not treat patient vignettes as the case-study format", () => {
    const offered = offeredFormatFlags(nclexEmpty);
    expect(advertisesHiddenFormat("Patient case vignettes and case-based pharmacotherapy.", offered)).toBe(
      false
    );
    expect(advertisesHiddenFormat("Calculations, compounding, and cases.", offered)).toBe(false);
    expect(scrubPublicFormatCopy("Patient case vignettes.", nclexEmpty)).toBe("Patient case vignettes.");
  });

  it("drops NCLEX NGN claims while the bank has none and restores them when items exist", () => {
    const hidden = presentPublicExamSeo(EXAM_SEO_CONFIG.nclex, nclexEmpty);
    expect(hidden.metaDescription).not.toMatch(/\bNGN\b/);
    expect(hidden.heroSubline).not.toMatch(/\bNGN\b|next generation/i);
    expect(hidden.features.map((feature) => feature.title)).not.toContain("NGN-ready question formats");
    expect(hidden.faqs.map((faq) => faq.question).join(" ")).not.toMatch(/\bNGN\b/);
    expect(hidden.keywords).not.toContain("NGN NCLEX questions");
    expect(hidden.features.length).toBeGreaterThan(0);
    expect(hidden.faqs.length).toBeGreaterThan(0);

    const served = presentPublicExamSeo(EXAM_SEO_CONFIG.nclex, nclexServed);
    expect(served.features.map((feature) => feature.title)).toContain("NGN-ready question formats");
    expect(served.faqs.map((faq) => faq.question)).toContain(
      "Does AnyExamEasy include NCLEX NGN question types?"
    );
    expect(served.metaDescription).toMatch(/\bNGN\b/);
  });

  it("keeps USMLE CCS copy while cases are served and removes it when they are not", () => {
    const served = presentPublicExamSeo(EXAM_SEO_CONFIG.usmle, usmleCases);
    expect(served.heroSubline).toMatch(/CCS-style cases/);
    const hidden = presentPublicExamSeo(EXAM_SEO_CONFIG.usmle, { mcq: 8000, ngn: 0, case: 0 });
    expect(hidden.heroSubline).not.toMatch(/CCS/);
    expect(hidden.features[0]?.detail).not.toMatch(/CCS/);
  });

  it("hides claims when inventory is unknown", () => {
    expect(scrubPublicFormatCopy("NGN formats on NCLEX", null)).toBeNull();
    expect(scrubPublicFormatCopy("NGN vignettes and clinical judgment — try a free sample, then keep going.", null)).toBe(
      "Clinical judgment and prioritization — try a free sample, then keep going."
    );
  });
});
