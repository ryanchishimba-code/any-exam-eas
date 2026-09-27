import { USMLE_OFFICIAL_SOURCES } from "@/lib/exam-prep/usmle/official-content-model";
import type { ExamSeoKey } from "@/lib/seo/exam-config";

/** Official format facts already used on the standards page, with the public source. */
export const BOARD_FORMAT_FACTS: Record<
  ExamSeoKey,
  { fact: string; sourceLabel: string; href: string }
> = {
  nclex: {
    fact: "The NCLEX is computer-adaptive and includes Next Generation case studies. Timed practice forms on this site use NCSBN Client Needs weights. Published NGN items are written to the 2026 NCSBN test plan, with cited sources.",
    sourceLabel: "NCSBN test plans",
    href: "https://www.ncsbn.org/exams/testplans.page",
  },
  usmle: {
    fact: "USMLE Step 1, Step 2 CK, and Step 3 follow the NBME and FSMB content outlines. Items on this board are mapped to those outlines and pass the quality gate.",
    sourceLabel: "USMLE content outline",
    href: USMLE_OFFICIAL_SOURCES.contentOutline,
  },
  naplex: {
    fact: "NAPLEX practice exams use the NABP content outline domain weights.",
    sourceLabel: "NABP NAPLEX content outline",
    href: "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
  },
  pance: {
    fact: "PANCE practice follows the NCCPA content blueprint for task and organ-system areas.",
    sourceLabel: "NCCPA PANCE blueprint",
    href: "https://www.nccpa.net/pance-content-blueprint/",
  },
  "aanp-fnp": {
    fact: "AANP FNP practice uses the AANPCB domain and age-group weights.",
    sourceLabel: "AANPCB FNP",
    href: "https://www.aanpcert.org/certs/fnp",
  },
  "npte-pt": {
    fact: "NPTE-PT practice follows the FSBPT content outline.",
    sourceLabel: "FSBPT NPTE development",
    href: "https://www.fsbpt.org/FreeResources/NPTEDevelopment.aspx",
  },
};
