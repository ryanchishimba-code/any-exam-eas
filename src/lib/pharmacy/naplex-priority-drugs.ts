/**
 * NAPLEX-priority drug filters over the existing Top 509 catalog.
 * When exam = NAPLEX, Today and the drug rail overweight these classes.
 */

export const NAPLEX_PRIORITY_DRUG_KEYWORDS: string[] = [
  // Anticoagulants
  "warfarin",
  "heparin",
  "enoxaparin",
  "apixaban",
  "rivaroxaban",
  "dabigatran",
  "edoxaban",
  "argatroban",
  "bivalirudin",
  "protamine",
  "andexanet",
  "idarucizumab",
  "vitamin-k",
  "phytonadione",
  // Antimicrobials + stewardship
  "vancomycin",
  "gentamicin",
  "tobramycin",
  "amikacin",
  "piperacillin",
  "tazobactam",
  "ceftriaxone",
  "cefepime",
  "meropenem",
  "ertapenem",
  "linezolid",
  "daptomycin",
  "azithromycin",
  "ciprofloxacin",
  "levofloxacin",
  "metronidazole",
  "tmp-smx",
  "sulfamethoxazole",
  "penicillin",
  "amoxicillin",
  "clavulanate",
  // Insulin / DM
  "insulin",
  "metformin",
  "glipizide",
  "glimepiride",
  "sitagliptin",
  "empagliflozin",
  "dapagliflozin",
  "canagliflozin",
  "liraglutide",
  "semaglutide",
  "dulaglutide",
  "glucagon",
  // HF / ACS
  "sacubitril",
  "valsartan",
  "carvedilol",
  "metoprolol",
  "bisoprolol",
  "spironolactone",
  "eplerenone",
  "furosemide",
  "bumetanide",
  "torsemide",
  "digoxin",
  "nitroglycerin",
  "clopidogrel",
  "ticagrelor",
  "prasugrel",
  "aspirin",
  "atorvastatin",
  "rosuvastatin",
  // Asthma / COPD
  "albuterol",
  "levalbuterol",
  "ipratropium",
  "tiotropium",
  "fluticasone",
  "budesonide",
  "montelukast",
  "theophylline",
  // Psych + lithium
  "lithium",
  "sertraline",
  "fluoxetine",
  "escitalopram",
  "venlafaxine",
  "bupropion",
  "haloperidol",
  "olanzapine",
  "risperidone",
  "quetiapine",
  "aripiprazole",
  "clozapine",
  "lorazepam",
  "alprazolam",
  "diazepam",
  // Chemo supportive
  "ondansetron",
  "granisetron",
  "aprepitant",
  "filgrastim",
  "pegfilgrastim",
  "epoetin",
  "darbepoetin",
  "allopurinol",
  "rasburicase",
  "mesna",
  "leucovorin",
  // Immunosuppressants
  "tacrolimus",
  "cyclosporine",
  "mycophenolate",
  "sirolimus",
  "azathioprine",
  "methotrexate",
  // Opioids
  "morphine",
  "oxycodone",
  "hydrocodone",
  "fentanyl",
  "hydromorphone",
  "methadone",
  "naloxone",
  "buprenorphine",
  // Antiepileptics
  "phenytoin",
  "carbamazepine",
  "valpro",
  "levetiracetam",
  "lamotrigine",
  "gabapentin",
  "pregabalin",
  // HIV / HCV
  "tenofovir",
  "emtricitabine",
  "efavirenz",
  "dolutegravir",
  "bictegravir",
  "ritonavir",
  "sofosbuvir",
  "ledipasvir",
  "glecaprevir",
  // Vaccines / high-alert
  "heparin",
  "potassium",
  "concentrated",
  "chemotherapy",
  "cisplatin",
  "doxorubicin",
  "cyclophosphamide",
  "vincristine",
];

export function isNaplexPriorityDrug(slugOrName: string): boolean {
  const hay = slugOrName.toLowerCase().replace(/[_\s]+/g, "-");
  return NAPLEX_PRIORITY_DRUG_KEYWORDS.some(
    (kw) => hay.includes(kw) || hay.includes(kw.replace(/-/g, ""))
  );
}

export function filterNaplexPriorityDrugs<T extends { slug: string; name?: string }>(
  drugs: T[]
): T[] {
  return drugs.filter(
    (d) =>
      isNaplexPriorityDrug(d.slug) ||
      (d.name ? isNaplexPriorityDrug(d.name) : false)
  );
}
