/**
 * Curated OER and exam-style source registry for hybrid retrieval bias.
 * Tavily queries use these domains + labels to surface high-quality question patterns.
 */
import { normalizeFieldId } from "../subjects/field-ids";
export type CuratedSource = {
  id: string;
  label: string;
  domains: string[];
  searchTerms: string[];
  fields: string[];
  sourceType: "oer" | "exam_focus" | "case_study";
};

export const CURATED_SOURCES: CuratedSource[] = [
  {
    id: "open-rn",
    label: "Open RN Project",
    domains: ["openrn.com", "openstax.org"],
    searchTerms: ["Open RN nursing textbook NCLEX", "Open RN clinical judgment"],
    fields: ["nursing"],
    sourceType: "oer",
  },
  {
    id: "maryland-ngn",
    label: "Maryland NextGen NCLEX Test Bank",
    domains: ["maryland.gov", "mbon.maryland.gov", "ncsbn.org"],
    searchTerms: [
      "Maryland NextGen NCLEX test bank case study",
      "NGN unfolding case NCLEX Maryland",
      "Next Generation NCLEX stand-alone items",
    ],
    fields: ["nursing"],
    sourceType: "case_study",
  },
  {
    id: "nurseslabs",
    label: "Nurseslabs",
    domains: ["nurseslabs.com"],
    searchTerms: ["Nurseslabs NCLEX practice questions prioritization"],
    fields: ["nursing"],
    sourceType: "exam_focus",
  },
  {
    id: "openstax-nursing",
    label: "OpenStax Nursing",
    domains: ["openstax.org"],
    searchTerms: ["OpenStax nursing fundamentals pharmacology"],
    fields: ["nursing"],
    sourceType: "oer",
  },
  {
    id: "naplex-oer",
    label: "Pharmacy OER",
    domains: ["openstax.org", "pharmacylibrary.com", "nih.gov"],
    searchTerms: ["NAPLEX pharmacology clinical case", "pharmacy calculations OER"],
    fields: ["pharmacy"],
    sourceType: "oer",
  },
  {
    id: "usmle-step-1",
    label: "USMLE Step 1 style",
    domains: ["nih.gov", "ncbi.nlm.nih.gov", "openstax.org", "libretexts.org"],
    searchTerms: ["USMLE Step 1 basic science vignette", "pathophysiology board review OER"],
    fields: ["usmle-step-1"],
    sourceType: "case_study",
  },
  {
    id: "usmle-step-2",
    label: "USMLE Step 2 CK style",
    domains: ["nih.gov", "ncbi.nlm.nih.gov", "openstax.org", "libretexts.org"],
    searchTerms: ["USMLE Step 2 clinical vignette", "medical diagnosis case OER"],
    fields: ["usmle-step-2"],
    sourceType: "case_study",
  },
];

export function getCuratedSourcesForField(fieldId: string): CuratedSource[] {
  const id = normalizeFieldId(fieldId);
  return CURATED_SOURCES.filter((s) => s.fields.includes(id));
}

export function buildCuratedSearchQueries(
  fieldId: string,
  topic: string,
  subjectLabel?: string
): string[] {
  const scope = subjectLabel ?? topic;
  const curated = getCuratedSourcesForField(fieldId);
  const queries: string[] = [];

  for (const src of curated) {
    for (const term of src.searchTerms.slice(0, 2)) {
      queries.push(`${term} ${scope}`);
    }
  }

  return queries.slice(0, 6);
}
