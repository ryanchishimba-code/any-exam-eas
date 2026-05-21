/**
 * Proprietary-free / open educational resource (OER) domains.
 * Used to bias search toward openly licensed textbook material.
 */
export const GLOBAL_OER_DOMAINS = [
  "openstax.org",
  "libretexts.org",
  "bio.libretexts.org",
  "chem.libretexts.org",
  "med.libretexts.org",
  "eng.libretexts.org",
  "math.libretexts.org",
  "phys.libretexts.org",
  "biz.libretexts.org",
  "socialsci.libretexts.org",
  "wikibooks.org",
  "wikiversity.org",
  "courses.lumenlearning.com",
  "cnx.org",
  "ck12.org",
  "nap.edu",
  "nih.gov",
  "ncbi.nlm.nih.gov",
  "cdc.gov",
  "medlineplus.gov",
];

export function mergeOerDomains(fieldDomains: string[]): string[] {
  return [...new Set([...fieldDomains, ...GLOBAL_OER_DOMAINS])].slice(0, 20);
}
