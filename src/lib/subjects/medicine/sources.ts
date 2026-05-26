import type { SourcePreferences } from "../types";

export const MEDICINE_SOURCE_PREFERENCES: SourcePreferences = {
  oerDomains: [
    "openstax.org",
    "med.libretexts.org",
    "nih.gov",
    "ncbi.nlm.nih.gov",
    "cdc.gov",
  ],
  preferredSourceTypes: ["oer", "government", "textbook"],
  searchQueryHints: ["USMLE", "clinical", "pathophysiology", "board review"],
};
