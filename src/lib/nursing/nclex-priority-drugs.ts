/**
 * NCLEX-priority drug filters over the existing Top 509 catalog.
 * Used to overweight the drug rail / Today priming for nursing.
 */

/** Slug fragments / class keywords matched against Top 509 drug slugs and names. */
export const NCLEX_PRIORITY_DRUG_KEYWORDS: string[] = [
  "insulin",
  "heparin",
  "enoxaparin",
  "warfarin",
  "apixaban",
  "rivaroxaban",
  "dabigatran",
  "digoxin",
  "metoprolol",
  "atenolol",
  "propranolol",
  "carvedilol",
  "lisinopril",
  "enalapril",
  "losartan",
  "valsartan",
  "nitroglycerin",
  "amiodarone",
  "furosemide",
  "hydrochlorothiazide",
  "spironolactone",
  "morphine",
  "fentanyl",
  "oxycodone",
  "hydromorphone",
  "naloxone",
  "vancomycin",
  "gentamicin",
  "penicillin",
  "amoxicillin",
  "ceftriaxone",
  "azithromycin",
  "albuterol",
  "prednisone",
  "methylprednisolone",
  "lithium",
  "sertraline",
  "fluoxetine",
  "paroxetine",
  "phenelzine",
  "haloperidol",
  "olanzapine",
  "risperidone",
  "oxytocin",
  "magnesium-sulfate",
  "mag-sulfate",
  "terbutaline",
  "epinephrine",
  "atropine",
  "adenosine",
  "flumazenil",
  "glucagon",
];

export function isNclexPriorityDrug(slugOrName: string): boolean {
  const hay = slugOrName.toLowerCase().replace(/[_\s]+/g, "-");
  return NCLEX_PRIORITY_DRUG_KEYWORDS.some(
    (kw) => hay.includes(kw) || hay.includes(kw.replace(/-/g, ""))
  );
}

/** Filter a list of { slug, name? } to NCLEX-priority drugs; preserves order. */
export function filterNclexPriorityDrugs<T extends { slug: string; name?: string }>(
  drugs: T[]
): T[] {
  return drugs.filter(
    (d) => isNclexPriorityDrug(d.slug) || (d.name ? isNclexPriorityDrug(d.name) : false)
  );
}
