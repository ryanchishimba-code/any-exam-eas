import type { ExamQuestion } from "../../ai";
import type { ExamGenerationContext } from "../../subjects/types";
import { normalizeFieldId } from "../../subjects/field-ids";
import { getDrugById, TOP_500_DRUGS } from "../../drugs300/catalog";
import { searchDrugs } from "../../drugs300/search";

/** Structured drug data required for NAPLEX / NCLEX pharmacology items. */
export type PharmDrugProfile = {
  generic: string;
  /** One or more common brand/trade names */
  brandNames: string[];
  therapeuticClass: string;
  /** Primary indication / condition treated */
  indication: string;
  /** Key signs/symptoms the drug addresses (condition presentation) */
  conditionSymptoms: string[];
  /** Etiology or pathophysiology of the condition being treated */
  conditionEtiology: string;
  majorSideEffects: string[];
  monitoring: string[];
  /** NCLEX: nursing actions, teaching, rights of administration (optional) */
  nursingConsiderations?: string[];
};

export const PHARM_DRUG_PROFILE_JSON = `
"drugProfile": {
  "generic": string (required — generic drug name),
  "brandNames": string[] (required — 1+ common brand names, e.g. ["Lipitor", "Atorvaliq"]),
  "therapeuticClass": string (required — pharmacologic/therapeutic class),
  "indication": string (required — primary condition treated),
  "conditionSymptoms": string[] (required — 2–5 key signs/symptoms the drug treats),
  "conditionEtiology": string (required — etiology/pathophysiology of the condition),
  "majorSideEffects": string[] (required — 2–5 high-yield adverse effects),
  "monitoring": string[] (required — labs, vitals, or assessments to monitor),
  "nursingConsiderations": string[] (optional — NCLEX nursing actions/teaching/delegation)
}`;

const PHARM_SUBJECT_IDS = new Set([
  "pharmacology-nursing",
  "pharmacology",
  "pharmacokinetics",
  "cardiovascular-rx",
  "infectious-disease-rx",
  "endocrine-rx",
  "cns-rx",
  "oncology-rx",
]);

export function isPharmDrugContext(ctx: ExamGenerationContext): boolean {
  const fieldId = normalizeFieldId(ctx.fieldId);
  if (fieldId === "pharmacy") return true;
  if (fieldId === "nursing") {
    if (ctx.subjectId && PHARM_SUBJECT_IDS.has(ctx.subjectId)) return true;
    if (/pharm|drug|medication|insulin|warfarin|antibiotic|naplex|therap/i.test(ctx.topic)) {
      return true;
    }
  }
  return false;
}

/** True when every question in the set should include a complete drugProfile. */
export function requiresDrugProfileOnEveryQuestion(ctx: ExamGenerationContext): boolean {
  const fieldId = normalizeFieldId(ctx.fieldId);
  if (fieldId === "pharmacy") return true;
  if (fieldId === "nursing" && ctx.subjectId === "pharmacology-nursing") return true;
  return false;
}

export function isDrugCenteredQuestion(q: ExamQuestion): boolean {
  const text = `${q.vignette ?? ""} ${q.question} ${q.tags?.join(" ") ?? ""}`;
  return (
    Boolean(q.drugProfile?.generic) ||
    /drug|medication|dose|prescri|pharm|tablet|capsule|infusion|insulin|warfarin|antibiotic|inhibitor|agonist|antagonist/i.test(
      text
    )
  );
}

export function buildPharmDrugRequirementsBlock(ctx: ExamGenerationContext): string {
  if (!isPharmDrugContext(ctx)) return "";

  const fieldId = normalizeFieldId(ctx.fieldId);
  const everyItem = requiresDrugProfileOnEveryQuestion(ctx);
  const examLabel = fieldId === "pharmacy" ? "NAPLEX" : "NCLEX NGN pharmacology";

  const naplexBlock =
    fieldId === "pharmacy"
      ? `
NAPLEX DRUG ITEM RULES:
- ≥85% of items must center on a specific drug from the Top 300/500 high-yield list.
- Stems: therapeutic selection, interaction, dosing, counseling, adverse effect recognition, monitoring.
- drugProfile is MANDATORY on every pharmacology item — populate ALL fields from the schema.
- Rationale must cite: generic + class + why this drug fits the patient's signs/symptoms and etiology.`
      : "";

  const nclexBlock =
    fieldId === "nursing"
      ? `
NCLEX PHARMACOLOGY DRUG RULES:
- Focus on nursing scope: administration, monitoring, teaching, adverse effect recognition, priority actions.
- drugProfile required on every item when subject is Pharmacological Therapies (and on any drug-centered stem).
- Include nursingConsiderations: rights of administration, when to hold medication, patient teaching, when to notify provider.
- Distractors: wrong timing/route, missed assessment before giving med, inadequate monitoring, contraindicated nursing action.`
      : "";

  return `
PHARMACOLOGY DRUG PROFILE REQUIREMENTS (${examLabel}):
${everyItem ? "- EVERY question in this set MUST include a complete drugProfile object." : "- Include drugProfile on every item where a drug is central to the stem (medications, dosing, interactions, teaching, adverse effects)."}
- Align with Top 300/500 high-yield drugs when possible (anticoagulants, antidiabetics, antibiotics, antihypertensives, opioids, insulin, statins, PPIs, inhalers, psychotropics).
- drugProfile fields are NOT optional when included — populate generic, brandNames, therapeuticClass, indication, conditionSymptoms, conditionEtiology, majorSideEffects, monitoring.
- conditionSymptoms: what the patient presents with that the drug treats (e.g., "chest pain", "BP 168/94", "blood glucose 312 mg/dL").
- conditionEtiology: underlying cause/mechanism (e.g., "H. pylori infection", "insulin resistance with hepatic gluconeogenesis", "atrial fibrillation with stasis").
- explanation MUST reference drugProfile fields: link generic name, class, treated symptoms, and monitoring to the correct answer.
- distractorRationale for wrong options should cite drug-class confusion, wrong indication, missed monitoring, or nursing scope errors.
${naplexBlock}
${nclexBlock}
Schema:
${PHARM_DRUG_PROFILE_JSON}`;
}

export function buildDrugCatalogReferenceBlock(ctx: ExamGenerationContext): string {
  if (!isPharmDrugContext(ctx)) return "";

  const query = [ctx.topic, ctx.subject?.label, ctx.subject?.keywords?.slice(0, 3).join(" ")]
    .filter(Boolean)
    .join(" ");

  let hits = searchDrugs(query, undefined, 10);
  if (hits.length === 0) {
    hits = TOP_500_DRUGS.slice(0, 10).map((d) => ({
      id: d.id,
      rank: d.rank,
      generic: d.generic,
      brand: d.brand,
      therapeuticClass: d.therapeuticClass,
      drugClassLabel: d.therapeuticClass,
      drugClassColor: "",
      score: 0,
    }));
  }

  const lines = hits.map((hit) => {
    const drug = getDrugById(hit.id);
    if (!drug) return "";
    const brands = drug.brand
      .split(/[,/]+/)
      .map((b) => b.trim())
      .filter(Boolean)
      .join(", ");
    return `- ${drug.generic} (${brands}) | Class: ${drug.therapeuticClass} | Indications: ${drug.indications} | Major ADRs: ${drug.sideEffects}`;
  });

  return `
TOP 300/500 DRUG REFERENCE (use for accurate drugProfile — prefer these high-yield agents):
${lines.filter(Boolean).join("\n")}`;
}

type LegacyDrugProfile = NonNullable<ExamQuestion["drugProfile"]> & {
  brand?: string;
  drugClass?: string;
};

export function normalizeDrugProfile(
  raw: LegacyDrugProfile | undefined
): PharmDrugProfile | undefined {
  if (!raw?.generic?.trim()) return undefined;

  const brandNames =
    raw.brandNames && raw.brandNames.length > 0
      ? raw.brandNames
      : raw.brand
        ? raw.brand
            .split(/[,/]+/)
            .map((b) => b.trim())
            .filter(Boolean)
        : [];

  const therapeuticClass = raw.therapeuticClass ?? raw.drugClass ?? "";
  const conditionSymptoms =
    raw.conditionSymptoms && raw.conditionSymptoms.length > 0
      ? raw.conditionSymptoms
      : raw.indication
        ? [raw.indication]
        : [];

  return {
    generic: raw.generic.trim(),
    brandNames,
    therapeuticClass: therapeuticClass.trim(),
    indication: raw.indication?.trim() ?? "",
    conditionSymptoms,
    conditionEtiology: raw.conditionEtiology?.trim() ?? "",
    majorSideEffects: raw.majorSideEffects ?? [],
    monitoring: raw.monitoring ?? [],
    nursingConsiderations: raw.nursingConsiderations,
  };
}

export function isDrugProfileComplete(profile: PharmDrugProfile | undefined): boolean {
  if (!profile) return false;
  return (
    profile.generic.length > 0 &&
    profile.brandNames.length > 0 &&
    profile.therapeuticClass.length > 0 &&
    profile.indication.length > 0 &&
    profile.conditionSymptoms.length >= 1 &&
    profile.conditionEtiology.length > 10 &&
    profile.majorSideEffects.length >= 1 &&
    profile.monitoring.length >= 1
  );
}

export function scoreDrugProfileCompleteness(q: ExamQuestion): number {
  const profile = normalizeDrugProfile(q.drugProfile);
  if (!profile) return isDrugCenteredQuestion(q) ? -0.1 : 0;

  let score = 0;
  if (profile.generic) score += 0.02;
  if (profile.brandNames.length > 0) score += 0.02;
  if (profile.therapeuticClass) score += 0.02;
  if (profile.indication) score += 0.02;
  if (profile.conditionSymptoms.length >= 2) score += 0.03;
  if (profile.conditionEtiology.length > 15) score += 0.03;
  if (profile.majorSideEffects.length >= 2) score += 0.03;
  if (profile.monitoring.length >= 1) score += 0.03;
  if (profile.nursingConsiderations?.length) score += 0.02;

  const explanation = q.explanation.toLowerCase();
  if (explanation.includes(profile.generic.toLowerCase())) score += 0.02;

  return score;
}

export function formatDrugProfileForExplanation(profile: PharmDrugProfile): string {
  const brands = profile.brandNames.join(", ");
  const symptoms = profile.conditionSymptoms.join("; ");
  const adrs = profile.majorSideEffects.join("; ");
  const monitoring = profile.monitoring.join("; ");
  const nursing = profile.nursingConsiderations?.length
    ? `\nNursing considerations: ${profile.nursingConsiderations.join("; ")}.`
    : "";

  return (
    `Drug profile — ${profile.generic} (${brands}), ${profile.therapeuticClass}. ` +
    `Treats ${profile.indication} (presenting as: ${symptoms}; etiology: ${profile.conditionEtiology}). ` +
    `Monitor: ${monitoring}. Major adverse effects: ${adrs}.${nursing}`
  );
}
