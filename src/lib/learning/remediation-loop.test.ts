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
    expect(drug?.id).toBe("insulin-glargine");
    expect(drug?.href).toContain("path=safety");
    expect(drug?.href).toContain("exam=nclex");
    expect(drug?.href).toContain("drug=insulin-glargine");
    expect(drug?.safetyPathHref).toBeUndefined();
  });

  it("keeps a non-path drug as its own card and still offers the safety path", () => {
    const drug = resolveRelatedDrug({
      examSlug: "usmle",
      topicKeys: ["acute-coronary-syndrome"],
    });
    expect(drug?.id).toBe("aspirin");
    expect(drug?.href).toContain("aspirin");
    expect(drug?.href).not.toContain("path=safety");
    expect(drug?.safetyPathHref).toContain("path=safety");
    expect(drug?.safetyPathHref).toContain("exam=usmle");
  });

  it("opens a named high-alert drug on the safety path", () => {
    const drug = resolveRelatedDrug({
      examSlug: "nclex",
      topicKeys: ["management-of-care"],
      explicit: ["Warfarin"],
    });
    expect(drug?.id).toBe("warfarin");
    expect(drug?.href).toContain("path=safety");
    expect(drug?.href).toContain("drug=warfarin");
  });

  it("matches a labeled drug mention to a catalog id", () => {
    expect(matchCatalogDrug("Insulin glargine (Lantus)")?.id).toBe("insulin-glargine");
  });
});

describe("groupOpenRemediationLoops", () => {
  it("keeps a one-time correct in the open count as pending re-proof", () => {
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

    expect(summary.totalOpen).toBe(3);
    expect(summary.pendingReproof).toBe(1);
    expect(summary.loops.map((loop) => loop.id).sort()).toEqual([
      "management-of-care",
      "pharmacology-nursing",
    ]);
    const care = summary.loops.find((loop) => loop.id === "management-of-care");
    expect(care?.openCount).toBe(2);
    expect(care?.pendingCount).toBe(1);
    expect(care?.guide?.href).toBe("/nclex/study-guide/management-of-care");
    expect(care?.retestHref).toContain("style=review_incorrect");
    expect(care?.retestHref).toContain("subjectId=management-of-care");
    const pharm = summary.loops.find((loop) => loop.id === "pharmacology-nursing");
    expect(pharm?.drug?.kind).toBe("drug");
  });

  it("drops an item from the open count after spaced re-proof", () => {
    const t0 = Date.parse("2026-09-01T15:00:00.000Z");
    const day = 24 * 60 * 60 * 1000;
    const summary = groupOpenRemediationLoops({
      examSlug: "nclex",
      fieldId: "nursing",
      now: t0 + day + 1000,
      attempts: [
        {
          bankItemId: "b",
          correct: false,
          subjectId: "management-of-care",
          createdAt: t0,
          sessionId: "s1",
        },
        {
          bankItemId: "b",
          correct: true,
          subjectId: "management-of-care",
          createdAt: t0 + 1000,
          sessionId: "s2",
        },
        {
          bankItemId: "b",
          correct: true,
          subjectId: "management-of-care",
          createdAt: t0 + day + 1000,
          sessionId: "s3",
        },
      ],
    });
    expect(summary.totalOpen).toBe(0);
    expect(summary.loops).toEqual([]);
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

  it("explains spaced re-proof and mark mastered in student language", () => {
    expect(REMEDIATION_MASTERY_RULE).toMatch(/pending re-proof/i);
    expect(REMEDIATION_MASTERY_RULE).toMatch(/1 day or 20 other questions/i);
    expect(REMEDIATION_MASTERY_RULE).toMatch(/mark it mastered/i);
  });
});
