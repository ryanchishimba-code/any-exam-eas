import { describe, expect, it } from "vitest";
import {
  BOARDS_REVIEWED_BY_PROCESS,
  BOARD_PROCESS_LINE,
  CLINICAL_REVIEWERS,
  clinicalReviewerForExam,
  clinicalReviewerPersonNodes,
} from "@/lib/marketing/company";
import { NGN_PUBLISHED_DESCRIPTION } from "@/lib/marketing/quality-facts";
import { EXAM_SEO_KEYS } from "@/lib/seo/exam-config";

describe("CLINICAL_REVIEWERS", () => {
  it("names the two approved reviewers and no one else", () => {
    expect(CLINICAL_REVIEWERS.map((reviewer) => reviewer.displayName)).toEqual([
      "Ryan Chishimba, PharmD",
      "Ileen Chishimba, RN",
    ]);
  });

  it("scopes pharmacy to NAPLEX and nursing to NCLEX", () => {
    expect(clinicalReviewerForExam("naplex")?.displayName).toBe("Ryan Chishimba, PharmD");
    expect(clinicalReviewerForExam("nclex")?.displayName).toBe("Ileen Chishimba, RN");
    for (const key of ["usmle", "pance", "npte-pt", "aanp-fnp"] as const) {
      expect(clinicalReviewerForExam(key)).toBeNull();
    }
    expect(EXAM_SEO_KEYS.filter((key) => clinicalReviewerForExam(key)).sort()).toEqual([
      "naplex",
      "nclex",
    ]);
  });

  it("keeps bios to credential and role, with no other-board expertise", () => {
    const bios = CLINICAL_REVIEWERS.map((reviewer) => `${reviewer.role} ${reviewer.jobTitle}`).join(
      " ",
    );
    expect(bios).not.toMatch(/USMLE|PANCE|NPTE|AANP|years|University|employed/i);
    expect(CLINICAL_REVIEWERS[0]?.role).toContain("NAPLEX and pharmacology");
    expect(CLINICAL_REVIEWERS[1]?.role).toBe(
      "Leads nursing content review (NCLEX-RN/PN). This is an ongoing role.",
    );
    expect(`${CLINICAL_REVIEWERS[1]?.role} ${CLINICAL_REVIEWERS[1]?.jobTitle}`).not.toMatch(/NGN/);
    expect(NGN_PUBLISHED_DESCRIPTION).toBe(
      "They are written to the 2026 NCSBN test plan, with cited sources.",
    );
    expect(NGN_PUBLISHED_DESCRIPTION).not.toMatch(/RN|Ileen|reviewed/i);
    expect(BOARDS_REVIEWED_BY_PROCESS).toMatch(/official content outline/);
    expect(BOARDS_REVIEWED_BY_PROCESS).toMatch(/quality gate/);
    expect(BOARD_PROCESS_LINE).not.toMatch(/Chishimba/);
  });

  it("emits Person JSON-LD with jobTitle only", () => {
    const nodes = clinicalReviewerPersonNodes();
    expect(nodes).toHaveLength(2);
    for (const node of nodes) {
      expect(Object.keys(node).sort()).toEqual(["@type", "jobTitle", "name"]);
      expect(node["@type"]).toBe("Person");
      expect(node.jobTitle.length).toBeGreaterThan(0);
    }
    expect(nodes.map((node) => node.name)).toEqual([
      "Ryan Chishimba, PharmD",
      "Ileen Chishimba, RN",
    ]);
  });
});
