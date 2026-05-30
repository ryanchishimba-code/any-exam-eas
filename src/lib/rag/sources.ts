/**
 * Curated OER and exam-style source registry for hybrid retrieval bias.
 * Tavily queries use these domains + labels to surface high-quality question patterns.
 */
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
    id: "inbde",
    label: "Dentistry board prep",
    domains: ["ada.org", "openstax.org"],
    searchTerms: ["INBDE dental case-based questions", "dental pharmacology board"],
    fields: ["dentistry"],
    sourceType: "exam_focus",
  },
  {
    id: "usmle",
    label: "Medicine / USMLE style",
    domains: ["nih.gov", "ncbi.nlm.nih.gov", "openstax.org", "libretexts.org"],
    searchTerms: ["USMLE Step clinical vignette", "medical diagnosis case OER"],
    fields: ["medicine"],
    sourceType: "case_study",
  },
  {
    id: "sat-digital",
    label: "Digital SAT",
    domains: ["collegeboard.org", "openstax.org", "khanacademy.org"],
    searchTerms: ["Digital SAT reading writing math practice", "SAT evidence-based questions"],
    fields: ["sat"],
    sourceType: "exam_focus",
  },
];

export function getCuratedSourcesForField(fieldId: string): CuratedSource[] {
  const id = fieldId.toLowerCase();
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
      queries.push(`${scope} ${term}`);
    }
  }

  return queries.slice(0, 8);
}
