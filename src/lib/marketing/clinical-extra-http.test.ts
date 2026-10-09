import { describe, expect, it } from "vitest";
import { clinicalExtraFromCatalogRows } from "@/lib/marketing/clinical-extra-http";

describe("clinicalExtraFromCatalogRows", () => {
  it("counts published standalones and drops a case with a draft step", () => {
    const extra = clinicalExtraFromCatalogRows({
      items: [
        {
          id: "bow",
          version: 1,
          status: "published",
          caseId: null,
          caseVersion: null,
          caseStep: null,
          itemType: "bowtie",
        },
        {
          id: "trend",
          version: 1,
          status: "draft",
          caseId: null,
          caseVersion: null,
          caseStep: null,
          itemType: "trend",
        },
        {
          id: "trend",
          version: 2,
          status: "published",
          caseId: null,
          caseVersion: null,
          caseStep: null,
          itemType: "trend",
        },
        {
          id: "s1",
          version: 1,
          status: "published",
          caseId: "c1",
          caseVersion: 1,
          caseStep: 1,
          itemType: "mcq",
        },
        {
          id: "s2",
          version: 1,
          status: "published",
          caseId: "c1",
          caseVersion: 1,
          caseStep: 2,
          itemType: "mcq",
        },
        {
          id: "s2",
          version: 2,
          status: "draft",
          caseId: "c1",
          caseVersion: 1,
          caseStep: 2,
          itemType: "mcq",
        },
        {
          id: "ok1",
          version: 1,
          status: "published",
          caseId: "c2",
          caseVersion: 1,
          caseStep: 1,
          itemType: "mcq",
        },
      ],
      cases: [
        { id: "c1", version: 1, status: "published" },
        { id: "c2", version: 1, status: "published" },
      ],
    });

    expect(extra).toEqual({ standaloneNgn: 2, caseStudies: 1, caseItems: 1 });
  });
});
