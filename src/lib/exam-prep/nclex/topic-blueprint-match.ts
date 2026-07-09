/**
 * Content-based matching for NCLEX Study Hub blueprint topics.
 * Used when DB blueprintTopic tags are missing or sparse.
 */
import type { BankItem } from "@/lib/question-bank";
import { NCLEX_2026_TOPIC_KEYWORDS } from "./blueprint-topics-2026";
import { inferNclexBlueprint } from "./infer-blueprint-topic";

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

/** Study Hub blueprint slugs → vignette/stem keyword patterns. */
const STUDY_HUB_BLUEPRINT_KEYWORDS: { slug: string; pattern: RegExp }[] = [
  { slug: "prioritization", pattern: /\bpriorit|\bsee first|\bhighest priority|\bwhich client|\bunstable|\bABC/i },
  {
    slug: "ethical-principles",
    pattern: /\bautonomy|\bbeneficence|\bnonmaleficence|\bjustice|\bethical dilemma/i,
  },
  {
    slug: "informed-consent-advance-directives",
    pattern: /\binformed consent|\badvance directive|\bliving will|\bDNR|\bpower of attorney|\bPOA/i,
  },
  {
    slug: "legal-aspects",
    pattern: /\bnegligence|\bmalpractice|\bmandatory report|\bHIPAA|\blegal/i,
  },
  {
    slug: "quality-improvement",
    pattern: /\broot cause|\bincident report|\bquality improvement|\bnear miss|\b sentinel event/i,
  },
  {
    slug: "continuity-case-management",
    pattern: /\bcase manager|\bcontinuity of care|\bdischarge planning|\bhome health referral/i,
  },
  {
    slug: "leadership-conflict-resolution",
    pattern: /\bconflict resolution|\bchain of command|\bcharge nurse|\bleadership/i,
  },
  {
    slug: "standard-precautions-hand-hygiene",
    pattern: /\bhand hygiene|\bhand washing|\bstandard precaution|\balcohol-based hand|\bhand rub|\bsoap and water/i,
  },
  {
    slug: "transmission-based-precautions",
    pattern: /\bairborne precaution|\bdroplet precaution|\bcontact precaution|\bnegative pressure|\bN95|\bisolation precaution/i,
  },
  { slug: "ppe-donning-doffing", pattern: /\bPPE|\bdonning|\bdoffing|\bgown.*glove|\bN95/i },
  {
    slug: "isolation-transport",
    pattern: /\bisolation room|\btransport.*(?:infect|isolation)|\bnegative-pressure room/i,
  },
  { slug: "surgical-asepsis", pattern: /\bsterile field|\bsurgical asepsis|\bsterile technique/i },
  {
    slug: "hai-prevention",
    pattern: /\bCAUTI|\bCLABSI|\bVAP|\bhospital-acquired|\bcentral line.*bundle/i,
  },
  {
    slug: "immunization-schedules",
    pattern: /\bimmuniz|\bvaccin|\bMMR|\bDTaP|\bhepatitis B vaccine|\bvaricella vaccine/i,
  },
  {
    slug: "health-screening",
    pattern: /\bhealth screening|\bmammogram|\bcolonoscopy screening|\bPap smear|\bscreening guideline/i,
  },
  {
    slug: "prenatal-fetal-development",
    pattern: /\bprenatal|\bgestational age|\bfetal development|\btrimester|\balpha-fetoprotein|\bquickening|\bfundal height/i,
  },
  {
    slug: "labor-fetal-monitoring",
    pattern: /\blabor|\bcontractions|\bfetal heart rate|\bFHR|\bcervical dilation|\bmonitoring strip|\bROM|\bamniotic fluid/i,
  },
  {
    slug: "postpartum-bubble-he",
    pattern:
      /\bBUBBLE-HE\b|\bboggy uterus|\blochia|\bpostpartum|\bfundal massage|\bpostpartum hemorrhage|\bPPH\b|\bendometritis/i,
  },
  {
    slug: "newborn-apgar-reflexes",
    pattern:
      /\bAPGAR|\bmoro reflex|\bnewborn assessment|\bnewborn care|\bneonatal transition|\bthermoregulation|\bcircumcision|\bVitamin K|\bwell-baby|\bneonatal|\bjaundice|\bphototherapy|\bbreastfeeding|\bheel stick/i,
  },
  {
    slug: "pediatric-milestones",
    pattern: /\bDenver|\bdevelopmental milestone|\bfontanel|\btoddler|\bpreschool|\bschool-age child|\b8-month-old|\b5-year-old/i,
  },
  { slug: "erikson-stages", pattern: /\bErikson|\btrust vs mistrust|\bidentity vs role/i },
  { slug: "piaget-cognitive", pattern: /\bPiaget|\bconcrete operational|\bpreoperational|\bsensorimotor/i },
  {
    slug: "therapeutic-communication",
    pattern: /\btherapeutic communication|\bactive listening|\bopen-ended|\bnon-therapeutic/i,
  },
  {
    slug: "anxiety-crisis-intervention",
    pattern: /\banxiety|\bcrisis intervention|\bpanic attack|\bacute stress/i,
  },
  {
    slug: "mood-psychotic-disorders",
    pattern: /\bdepression|\bbipolar|\bschizophren|\bpsychotic|\bmania|\bflat affect/i,
  },
  { slug: "suicide-risk", pattern: /\bsuicid|\bself-harm|\bsuicidal ideation|\bsafety contract/i },
  {
    slug: "substance-use-withdrawal",
    pattern: /\bwithdrawal|\bsubstance use|\bCIWA|\bintoxication|\bopioid use disorder|\balcohol withdrawal/i,
  },
  { slug: "pain-management", pattern: /\bpain scale|\bpain management|\bnonpharmacologic pain|\bPCA pump/i },
  { slug: "adls-positioning", pattern: /\bADL|\bpositioning|\bturning schedule|\bambulation assist/i },
  {
    slug: "medication-error-prevention",
    pattern: /\bmedication error|\bfive rights|\bright patient|\bhigh-alert|\blook-alike|\bsound-alike/i,
  },
  {
    slug: "cardiovascular-meds",
    pattern: /\blisinopril|\bmetoprolol|\bamlodipine|\bwarfarin|\bheparin|\bdigoxin|\banticoagulant|\bACE inhibitor/i,
  },
  {
    slug: "anti-infectives",
    pattern: /\bantibiotic|\bvancomycin|\bpiperacillin|\bazithromycin|\banti-infective|\bantimicrobial/i,
  },
  {
    slug: "psychotropics",
    pattern: /\bsertraline|\bfluoxetine|\bhaloperidol|\brisperidone|\blithium|\bantidepressant|\bantipsychotic/i,
  },
  {
    slug: "iv-fluids-electrolytes",
    pattern: /\bIV fluid|\bnormal saline|\bLactated Ringer|\bbolus|\belectrolyte replacement|\bKCl/i,
  },
  {
    slug: "diagnostic-tests",
    pattern: /\bEKG|\bECG|\bchest X-ray|\bultrasound|\bdiagnostic test|\bcolonoscopy|\bbronchoscopy/i,
  },
  {
    slug: "pre-post-procedure",
    pattern: /\bpreoperative|\bpostoperative|\bNPO|\bprocedure consent|\bangiograph|\bcolonoscopy prep/i,
  },
  {
    slug: "postoperative-monitoring",
    pattern: /\bpostoperative day|\bPOD \d|\bpost-op|\bwound dehiscence|\bincision/i,
  },
  {
    slug: "vital-sign-trending",
    pattern: /\bvital sign|\btrending|\btachycardia|\bbradycardia|\borthostatic|\bblood pressure.*(?:drop|rise)/i,
  },
  {
    slug: "fluid-balance-io",
    pattern: /\bI&O|\bintake and output|\bfluid balance|\bdaily weight|\bedema|\bfluid overload|\bdehydration/i,
  },
  {
    slug: "chemotherapy-side-effects",
    pattern:
      /\bchemotherapy|\bneutropenic(?:\s+fever)?|\bnadir|\banticancer|\bextravasation|\bmucositis|\boncology clinic|\bANC\b|\babsolute neutrophil/i,
  },
  { slug: "ng-feeding-tube", pattern: /\bNG tube|\bnasogastric|\bfeeding tube|\benteral feeding/i },
  {
    slug: "cardiac-emergencies",
    pattern: /\bmyocardial infarction|\bSTEMI|\bNSTEMI|\bheart failure|\bdysrhythm|\bchest pain.*diaphoresis|\bhypertensive crisis/i,
  },
  {
    slug: "respiratory-emergencies",
    pattern: /\basthma|\bCOPD|\bpneumonia|\bpulmonary embol|\bchest tube|\brespiratory distress|\bhypoxemia/i,
  },
  {
    slug: "neurological-emergencies",
    pattern: /\bstroke|\bCVA|\bseizure|\bincreased ICP|\bmeningitis|\bneurologic|\bfacial droop/i,
  },
  {
    slug: "renal-urinary",
    pattern: /\bAKI|\bacute kidney|\bCKD|\bdialysis|\brenal failure|\bBUN|\bcreatinine|\burinary retention|\bfluid overload|\bdaily weight/i,
  },
  {
    slug: "gi-disorders",
    pattern: /\bGI bleed|\bpancreatitis|\bliver failure|\bIBD|\bCrohn|\bulcerative colitis|\bascites|\bmelena|\bhematemesis|\bhepatic encephalopathy|\bowel obstruction/i,
  },
  {
    slug: "endocrine-emergencies",
    pattern: /\bDKA|\bHHNS|\bdiabetic keto|\bhypoglycemia|\bhyperglycemia|\bthyroid storm|\badrenal crisis|\binsulin/i,
  },
  {
    slug: "hematology-oncology",
    pattern:
      /\bsickle cell|\bvaso-occlusive|\bleukemia|\bthrombocytopenia|\bneutropenia|\btumor lysis|\boncologic emergency|\bplatelet(?:s| count)?\b|\bANC\b|\babsolute neutrophil|\bpacked red blood|\bPRBC|\btransfusion reaction|\bbone marrow|\bsevere anemia|\bhemoglobin\s*(?:of\s*)?\d|\bHgb\s*\d/i,
  },
  { slug: "musculoskeletal", pattern: /\bfracture|\bcompartment syndrome|\bosteoporosis|\bjoint replacement|\bcast care/i },
  {
    slug: "shock-sepsis",
    pattern: /\bsepsis|\bseptic shock|\bSIRS|\bhypovolemic shock|\bcardiogenic shock|\blactic acid.*(?:>|elevated)/i,
  },
];

/** Slugs that should reject obvious off-topic vignettes. */
const BLUEPRINT_EXCLUSIONS: Partial<Record<string, RegExp>> = {
  "pediatric-milestones": /postmenopausal|menopause|hip fracture|medical-surgical unit.*(?:6\d|7\d|8\d)[- ]?year/i,
  "immunization-schedules": /postmenopausal|menopause|hip fracture|myocardial infarction/i,
  "postpartum-bubble-he": /\b(?:6\d|7\d|8\d)[- ]?year[- ]?old|\bmedical-surgical unit/i,
  "newborn-apgar-reflexes": /\b(?:1[8-9]|[2-9]\d)[- ]?year[- ]?old|\bmedical-surgical/i,
  "prenatal-fetal-development": /\b(?:6\d|7\d|8\d)[- ]?year[- ]?old|\bmedical-surgical unit/i,
  "cardiac-emergencies": /\bpediatric emergency|\b8-month-old|\bnewborn/i,
  "neurological-emergencies": /\bprenatal|\bimmuniz|\bTdap|\blisinopril|\bhip fracture|\bpneumonia|\bCOPD|\bheart failure|\bpressure injur/i,
  "gi-disorders": /\bpsychiatric|\bdepression|\bmetformin|\bprenatal|\bimmuniz|\btuberculosis/i,
  "renal-urinary": /\binsulin glargine|\bhyperglycemia(?!.*kidney)/i,
  "endocrine-emergencies": /\bpostmenopausal|\bhip fracture/i,
  "fluid-balance-io": /\bSTART triage|\bmass casualty|\bethical principles/i,
  "shock-sepsis": /\bErikson|\bPiaget|\bimmunization schedule/i,
  "therapeutic-communication": /\bdrip rate|\bmg\/kg|\bParkland formula/i,
  "chemotherapy-side-effects":
    /\bhemoglobin A1c|\bHbA1c|\bprenatal vitamin|\bcolonoscopy prep|\bSTART triage/i,
  "hematology-oncology":
    /\bhemoglobin A1c|\bHbA1c|\bprenatal vitamin|\bdiabetic foot|\bgestation|\btrimester|\bfirst prenatal/i,
};

const KEYWORD_BY_SLUG = new Map<string, RegExp>();

for (const entry of [...NCLEX_2026_TOPIC_KEYWORDS, ...STUDY_HUB_BLUEPRINT_KEYWORDS]) {
  KEYWORD_BY_SLUG.set(entry.slug, entry.pattern);
}

/** Infer slug aliases that map to official 2026 blueprint slugs. */
const INFERRED_SLUG_ALIASES: Record<string, string[]> = {
  sepsis: ["shock-sepsis"],
  "pediatric-asthma-exacerbation": ["respiratory-emergencies", "pediatric-milestones"],
  hypokalemia: ["fluid-balance-io", "critical-lab-values"],
  hyperkalemia: ["fluid-balance-io", "critical-lab-values"],
  "heart-failure-exacerbation": ["cardiac-emergencies"],
  pneumonia: ["respiratory-emergencies"],
  "diabetic-ketoacidosis": ["endocrine-emergencies"],
  hypoglycemia: ["endocrine-emergencies"],
  hyperglycemia: ["endocrine-emergencies"],
  "acute-coronary-syndrome": ["cardiac-emergencies"],
  "acute-stroke": ["neurological-emergencies"],
  "opioid-overdose": ["interactions-antidotes", "endocrine-emergencies"],
  "labor-assessment": ["labor-fetal-monitoring"],
  "decreased-fetal-movement": ["prenatal-fetal-development", "labor-fetal-monitoring"],
  "postpartum-hemorrhage": ["postpartum-bubble-he"],
  "postpartum-hemorrhage-prioritization": ["postpartum-bubble-he"],
  "preeclampsia-severe-features": ["prenatal-fetal-development", "labor-fetal-monitoring"],
  "newborn-transition": ["newborn-apgar-reflexes"],
  "neonatal-jaundice": ["newborn-apgar-reflexes"],
  "tuberculosis-airborne-precautions": ["transmission-based-precautions"],
  "airborne-infection-precautions": ["transmission-based-precautions"],
  "droplet-precautions": ["transmission-based-precautions"],
  "contact-precautions": ["transmission-based-precautions"],
};

function inferredMatchesBlueprint(inferredSlug: string, allowed: Set<string>): boolean {
  if (allowed.has(inferredSlug)) return true;
  const aliases = INFERRED_SLUG_ALIASES[inferredSlug];
  return aliases?.some((slug) => allowed.has(slug)) ?? false;
}

function hasPregnancyContext(text: string): boolean {
  return /\bpregnan|\bgestation|\bfetal|\blabor|\bpostpartum|\bnewborn|\bneonat|\btrimester|\bOB\b|\bL&D|\blabor and delivery/i.test(
    text
  );
}

const PREGNANCY_BLUEPRINT_SLUGS = new Set([
  "prenatal-fetal-development",
  "labor-fetal-monitoring",
  "postpartum-bubble-he",
  "newborn-apgar-reflexes",
]);

/** True when item content aligns with a Study Hub blueprint slug. */
export function matchesNclexBlueprintTopic(item: BankItem, blueprintSlug: string): boolean {
  const text = itemText(item);
  const exclusion = BLUEPRINT_EXCLUSIONS[blueprintSlug];
  if (exclusion?.test(text)) return false;

  if (PREGNANCY_BLUEPRINT_SLUGS.has(blueprintSlug) && !hasPregnancyContext(text)) {
    return false;
  }

  const pattern = KEYWORD_BY_SLUG.get(blueprintSlug);
  const contentMatch = pattern ? pattern.test(text) : false;

  let inferredMatch = false;
  const inferred = inferNclexBlueprint(item).blueprintTopic;
  if (inferred) {
    const allowed = new Set([blueprintSlug]);
    inferredMatch = inferredMatchesBlueprint(inferred, allowed);
  }

  return contentMatch || inferredMatch;
}

/** Keep items matching any allowed blueprint slug (tag or content). */
export function filterItemsForNclexBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;
  const allowed = new Set(blueprintTopics);

  return items.filter((item) => {
    const topic = item.blueprintTopic?.trim();
    if (topic && allowed.has(topic)) return true;
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((slug) => matchesNclexBlueprintTopic(item, slug));
  });
}

export function countBlueprintTopicMatches(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean }
): number {
  return filterItemsForNclexBlueprintTopics(items, blueprintTopics, opts).length;
}
