import { describe, expect, it } from "vitest";
import {
  groupOpenRemediationLoops,
  matchCatalogDrug,
  REMEDIATION_MASTERY_RULE,
  resolveRelatedDrug,
  resolveStudyGuideSection,
} from "./remediation-loop";

describe("resolveStudyGuideSection", () => {
  it("links an NCLEX subject to its study-guide chapter", () => {
    const guide = resolveStudyGuideSection("nclex", ["management-of-care"]);
    expect(guide?.chapterSlug).toBe("management-of-care");
    expect(guide?.href).toBe("/nclex/study-guide/management-of-care");
  });

  it("follows the NCLEX primary topic when the subject is not a chapter slug", () => {
    const guide = resolveStudyGuideSection("nclex", ["safety-infection"]);
    expect(guide?.href).toBe("/nclex/study-guide/fundamentals-safety");
  });

  it("links NAPLEX and AANP subjects through the shared chapter map", () => {
    expect(resolveStudyGuideSection("naplex", ["cardiovascular-rx"])?.href).toBe(
      "/naplex/study-guide/cardiology"
    );
    expect(resolveStudyGuideSection("aanp-fnp", ["cardiovascular"])?.href).toBe(
      "/aanp-fnp/study-guide/cardiology"
    );
  });

  it("omits a guide link for boards that do not ship a study guide", () => {
    expect(resolveStudyGuideSection("usmle", ["acute-coronary-syndrome"])).toBeNull();
    expect(resolveStudyGuideSection("pance", ["cardiovascular"])).toBeNull();
    expect(resolveStudyGuideSection("npte-pt", ["musculoskeletal"])).toBeNull();
  });
});

describe("resolveRelatedDrug", () => {
  it("uses the topic catalog drug for NCLEX pharmacology", () => {
    const drug = resolveRelatedDrug({
      examSlug: "nclex",
      topicKeys: ["pharmacology-nursing"],
    });
    expect(drug?.kind).toBe("drug");
    expect(drug?.href).toContain("drug=");
  });

  it("uses the same catalog for USMLE topics", () => {
    const drug = resolveRelatedDrug({
      examSlug: "usmle",
      topicKeys: ["acute-coronary-syndrome"],
    });
    expect(drug?.id).toBe("aspirin");
    expect(drug?.href).toContain("aspirin");
  });

  it("matches a labeled drug mention to a catalog id", () => {
    expect(matchCatalogDrug("Insulin glargine (Lantus)")?.id).toBe("insulin-glargine");
  });
});

describe("groupOpenRemediationLoops", () => {
  it("keeps a miss open until a later correct attempt on that item", () => {
    const summary = groupOpenRemediationLoops({
      examSlug: "nclex",
      fieldId: "nursing",
      attempts: [
        { bankItemId: "a", questionKey: "a", correct: false, subjectId: "management-of-care" },
        { bankItemId: "b", questionKey: "b", correct: false, subjectId: "management-of-care" },
        { bankItemId: "b", questionKey: "b", correct: true, subjectId: "management-of-care" },
        { bankItemId: "c", questionKey: "c", correct: false, subjectId: "pharmacology-nursing" },
      ],
    });

    expect(summary.totalOpen).toBe(2);
    expect(summary.loops.map((loop) => loop.id).sort()).toEqual([
      "management-of-care",
      "pharmacology-nursing",
    ]);
    const care = summary.loops.find((loop) => loop.id === "management-of-care");
    expect(care?.openCount).toBe(1);
    expect(care?.guide?.href).toBe("/nclex/study-guide/management-of-care");
    expect(care?.retestHref).toContain("style=review_incorrect");
    expect(care?.retestHref).toContain("subjectId=management-of-care");
    const pharm = summary.loops.find((loop) => loop.id === "pharmacology-nursing");
    expect(pharm?.drug?.kind).toBe("drug");
  });

  it("does not invent a guide chapter for PANCE misses", () => {
    const summary = groupOpenRemediationLoops({
      examSlug: "pance",
      fieldId: "pance",
      attempts: [
        { bankItemId: "p1", questionKey: "p1", correct: false, subjectId: "cardiovascular" },
      ],
    });
    expect(summary.loops[0]?.guide).toBeNull();
    expect(summary.loops[0]?.retestHref).toContain("style=review_incorrect");
  });

  it("documents mastery as a later correct attempt", () => {
    expect(REMEDIATION_MASTERY_RULE).toMatch(/later/i);
    expect(REMEDIATION_MASTERY_RULE).toMatch(/no separate mark-mastered/i);
  });
});
