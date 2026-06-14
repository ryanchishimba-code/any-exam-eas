/** High-yield pharmacology buckets for Top 500 filtering & progress. */
export const DRUG_CLASSES = [
  { id: "all", label: "All Drugs", shortLabel: "All", color: "#0d9488" },
  { id: "cardiovascular", label: "Cardiovascular", shortLabel: "CV", color: "#dc2626" },
  { id: "endocrine", label: "Endocrine & Metabolic", shortLabel: "Endocrine", color: "#7c3aed" },
  { id: "antibiotics", label: "Antibiotics & Antimicrobials", shortLabel: "Antibiotics", color: "#2563eb" },
  { id: "cns-psych", label: "CNS & Psychiatric", shortLabel: "CNS/Psych", color: "#db2777" },
  { id: "respiratory", label: "Respiratory & Allergy", shortLabel: "Respiratory", color: "#0891b2" },
  { id: "gastrointestinal", label: "Gastrointestinal", shortLabel: "GI", color: "#ca8a04" },
  { id: "pain-inflammation", label: "Pain & Inflammation", shortLabel: "Pain/Inflam", color: "#ea580c" },
  { id: "immunologic-other", label: "Immunologic & Other", shortLabel: "Other", color: "#64748b" },
] as const;

export type DrugClassId = (typeof DRUG_CLASSES)[number]["id"];

export function getDrugClassMeta(id: DrugClassId) {
  return DRUG_CLASSES.find((c) => c.id === id) ?? DRUG_CLASSES[0];
}

export function classifyDrug(therapeuticClass: string): Exclude<DrugClassId, "all"> {
  const t = therapeuticClass.toLowerCase();

  if (
    /\b(antibiotic|antiviral|antifungal|antimicrobial|cephalosporin|penicillin|fluoroquinolone|macrolide|tetracycline|nitroimidazole|aminoglycoside|rifamycin|lincosamide|oxazolidinone|antiseptic|antiprotozoal|urinary antiseptic)\b/.test(
      t
    )
  ) {
    return "antibiotics";
  }

  if (
    /\b(insulin|glucagon|biguanide|sulfonylurea|sglt2|glp-1|gip|dpp-4|thiazolidinedione|meglitinide|thyroid|hormone|estrogen|progesterone|contraceptive|androgen|diabetes|vitamin d|bisphosphonate|serm|ppar|incretin|meglitinide|impdh)\b/.test(
      t
    )
  ) {
    return "endocrine";
  }

  if (
    /\b(ace inhibitor|arb|beta|calcium channel|diuretic|statin|anticoagul|antiplatelet|factor x|thrombin|nitrate|antiarrhythmic|cardiac glycoside|vasodilator|fibrate|cholesterol|lipid|arni|doac|heparin|warfarin|aldosterone|potassium-sparing|thiazide|loop diuretic|p2y12|pd-5|phosphate binder)\b/.test(
      t
    )
  ) {
    return "cardiovascular";
  }

  if (
    /\b(inhaled|bronchodilator|saba|laba|ics|leukotriene|respiratory|pulmonary|nicotine|decongestant|antihistamine|mast cell|ocular.*allerg|allergic rhinitis)\b/.test(
      t
    )
  ) {
    return "respiratory";
  }

  if (
    /\b(ssri|snri|antidepressant|antipsychotic|benzodiazepine|antiepileptic|anticonvulsant|opioid|stimulant|mood stabilizer|barbiturate|anxiolytic|hypnotic|z-drug|gabapentinoid|ndri|tca|dopamine agonist|nmda|acetylcholinesterase|muscle relaxant|local anesthetic|anesthetic|wakefulness|sari)\b/.test(
      t
    )
  ) {
    return "cns-psych";
  }

  if (
    /\b(proton pump|ppi|h2|antiemetic|laxative|antidiarrheal|prokinetic|5-ht3|mesalamine|mucosal|antispasmodic|bowel|nk1|anticholinergic antispasmodic)\b/.test(
      t
    )
  ) {
    return "gastrointestinal";
  }

  if (
    /\b(nsaid|analgesic|anti-inflammatory|corticosteroid|systemic corticosteroid|dmard|immunosuppressant|opioid agonist|combination.*opioid|weak opioid|potent opioid|antifoam|colchicine)\b/.test(
      t
    )
  ) {
    return "pain-inflammation";
  }

  return "immunologic-other";
}

export function drugMatchesClass(
  therapeuticClass: string,
  classId: DrugClassId
): boolean {
  if (classId === "all") return true;
  return classifyDrug(therapeuticClass) === classId;
}
