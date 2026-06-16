import { describe, expect, it } from "vitest";
import { MEMORY_CARDS } from "@/lib/reference/seeds";
import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";
import { attachAanpFnpStudyLinks, resolveAanpFnpStudyLinks } from "./study-links";

const aanpCardIds = new Set(
  MEMORY_CARDS.filter((c) => c.examSlug === "aanp-fnp").map((c) => c.id)
);

describe("resolveAanpFnpStudyLinks", () => {
  it("maps STEMI diagnose items to ACS module and fnp cards", () => {
    const links = resolveAanpFnpStudyLinks({
      blueprintDomain: "diagnose",
      clinicalSystem: "cardiovascular",
      blueprintTopic: "ACS STEMI",
      patientAgeGroup: "middle-adult",
    });
    expect(links.reviewModuleSlug).toBe("acute-coronary-syndrome");
    expect(links.memoryCardIds?.length).toBeGreaterThan(0);
    for (const id of links.memoryCardIds ?? []) {
      expect(aanpCardIds.has(id)).toBe(true);
    }
  });

  it("maps assess domain screening to assess module", () => {
    const links = resolveAanpFnpStudyLinks({
      blueprintDomain: "assess",
      clinicalSystem: "womens-health",
      blueprintTopic: "screening",
      patientAgeGroup: "middle-adult",
    });
    expect(links.reviewModuleSlug).toBe("aanp-assess-domain");
    expect(links.memoryCardIds?.length).toBeGreaterThan(0);
  });

  it("maps febrile neonate to pediatrics module", () => {
    const links = resolveAanpFnpStudyLinks({
      blueprintDomain: "diagnose",
      clinicalSystem: "pediatrics",
      blueprintTopic: "febrile infant",
      patientAgeGroup: "newborn",
    });
    expect(links.reviewModuleSlug).toBe("aanp-pediatrics-high-yield");
    expect(links.memoryCardIds?.some((id) => id.startsWith("fnp-"))).toBe(true);
  });

  it("caps memory cards at four ids", () => {
    const links = resolveAanpFnpStudyLinks({
      blueprintDomain: "plan",
      clinicalSystem: "infectious-disease",
      blueprintTopic: "UTI antibiotic CAP pneumonia",
      patientAgeGroup: "older-adult",
    });
    expect((links.memoryCardIds ?? []).length).toBeLessThanOrEqual(4);
  });

  it("review module slugs resolve to registered content", () => {
    const links = resolveAanpFnpStudyLinks({
      blueprintDomain: "evaluate",
      clinicalSystem: "endocrine",
      blueprintTopic: "diabetes monitoring A1c",
      patientAgeGroup: "middle-adult",
    });
    if (links.reviewModuleSlug) {
      expect(REVIEW_MODULE_CONTENT_BY_SLUG[links.reviewModuleSlug]).toBeDefined();
    }
  });
});

describe("attachAanpFnpStudyLinks", () => {
  it("inherits seed payload links for variants", () => {
    const payload = attachAanpFnpStudyLinks(
      { blueprintDomain: "assess" },
      {
        blueprintDomain: "assess",
        clinicalSystem: "cardiovascular",
        blueprintTopic: "screening",
      },
      {
        reviewModuleSlug: "aanp-assess-domain",
        memoryCardIds: ["fnp-assess-screening-uspstf", "fnp-hypertension-first-line"],
      }
    );
    expect(payload.reviewModuleSlug).toBe("aanp-assess-domain");
    expect(payload.memoryCardIds).toEqual(["fnp-assess-screening-uspstf", "fnp-hypertension-first-line"]);
  });

  it("filters non-aanp card ids from inherited payload", () => {
    const payload = attachAanpFnpStudyLinks(
      {},
      { blueprintDomain: "plan", clinicalSystem: "cardiovascular", blueprintTopic: "HTN" },
      { memoryCardIds: ["pance-hypertension-first-line", "fnp-hypertension-first-line"] }
    );
    expect(payload.memoryCardIds).toEqual(["fnp-hypertension-first-line"]);
  });
});
