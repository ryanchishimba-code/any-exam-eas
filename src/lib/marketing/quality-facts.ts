import { sqlQuery } from "@/lib/db";
import { USMLE_OFFICIAL_SOURCES } from "@/lib/exam-prep/usmle/official-content-model";
import { AANP_FNP_BLUEPRINT_SOURCE } from "@/lib/exam-prep/aanp-fnp/types";
import { NAPLEX_OUTLINE_SOURCE } from "@/lib/exam-prep/naplex/content-outline";
import { NPTE_PT_BLUEPRINT_SOURCE } from "@/lib/exam-prep/npte-pt/types";

/** Editorial page date. Bump when the standards copy changes. */
export const QUALITY_PAGE_UPDATED = "September 27, 2026";

export const OFFICIAL_TEST_PLANS = [
  {
    board: "NCLEX",
    detail: "NCSBN NCLEX-RN Test Plan — Client Needs categories and the Clinical Judgment Measurement Model.",
    href: "https://www.ncsbn.org/exams/testplans.page",
  },
  {
    board: "NAPLEX",
    detail: NAPLEX_OUTLINE_SOURCE,
    href: "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
  },
  {
    board: "USMLE Step 1",
    detail: "NBME and FSMB content outline and specifications.",
    href: USMLE_OFFICIAL_SOURCES.step1,
  },
  {
    board: "USMLE Step 2 CK",
    detail: "NBME and FSMB content outline and specifications.",
    href: USMLE_OFFICIAL_SOURCES.step2,
  },
  {
    board: "USMLE Step 3",
    detail: "NBME and FSMB content outline and specifications.",
    href: USMLE_OFFICIAL_SOURCES.step3,
  },
  {
    board: "AANP FNP",
    detail: AANP_FNP_BLUEPRINT_SOURCE,
    href: "https://www.aanpcert.org/certs/fnp",
  },
  {
    board: "PANCE",
    detail: "NCCPA PANCE content blueprint — task areas and organ systems.",
    href: "https://www.nccpa.net/pance-content-blueprint/",
  },
  {
    board: "NPTE-PT",
    detail: NPTE_PT_BLUEPRINT_SOURCE,
    href: "https://www.fsbpt.org/FreeResources/NPTEDevelopment.aspx",
  },
] as const;

export type QualityFacts = {
  live: boolean;
  /** NCLEX rows hidden from students with studentEligibility status suppressed. */
  suppressedNursing: number | null;
  publishedNgnItems: number | null;
  publishedNgnCases: number | null;
};

/** Public description of published NGN items. No per-item review claim. */
export const NGN_PUBLISHED_DESCRIPTION =
  "They are written to the 2026 NCSBN test plan, with cited sources.";

const EMPTY_FACTS: QualityFacts = {
  live: false,
  suppressedNursing: null,
  publishedNgnItems: null,
  publishedNgnCases: null,
};

type FactRow = {
  suppressed_nursing: number;
  ngn_items: number;
  ngn_cases: number;
};

export async function getQualityFacts(): Promise<QualityFacts> {
  try {
    const rows = await sqlQuery<FactRow[]>(
      `
      SELECT
        (
          SELECT COUNT(*)::int
          FROM "QuestionBankItem"
          WHERE "fieldId" = 'nursing'
            AND COALESCE(curation_meta #>> '{studentEligibility,status}', '') = 'suppressed'
        ) AS suppressed_nursing,
        (SELECT COUNT(*)::int FROM ngn_item WHERE status = 'published') AS ngn_items,
        (SELECT COUNT(*)::int FROM ngn_case WHERE status = 'published') AS ngn_cases
      `,
      []
    );
    const row = rows[0];
    if (!row) return EMPTY_FACTS;
    return {
      live: true,
      suppressedNursing: Number(row.suppressed_nursing),
      publishedNgnItems: Number(row.ngn_items),
      publishedNgnCases: Number(row.ngn_cases),
    };
  } catch {
    return EMPTY_FACTS;
  }
}
