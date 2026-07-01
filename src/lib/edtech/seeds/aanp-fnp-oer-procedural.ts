/**
 * Open-source AANP FNP procedural items — public-domain primary care scenarios
 * aligned to AANPCB 2024+ domains (Assess / Diagnose / Plan / Evaluate).
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { aanpFnpVignette } from "@/lib/exam-prep/aanp-fnp-seed-factory";
import type {
  AanpFnpClinicalSystemId,
  AanpFnpDomainId,
  AanpFnpPatientAgeGroupId,
} from "@/lib/exam-prep/aanp-fnp/types";

const OER_TAGS = ["open-source", "oer-aanp-fnp", "aanp-fnp-procedural", "physician-educator"] as const;

const USPSTF = { label: "USPSTF Screening Recommendations", url: "https://www.uspreventiveservicestaskforce.org" };
const ADA = { label: "ADA Standards of Care in Diabetes", url: "https://diabetes.org" };
const AHA = { label: "AHA/ACC Hypertension Guideline", url: "https://www.heart.org" };
const CDC = { label: "CDC Clinical Guidelines", url: "https://www.cdc.gov" };
const AAP = { label: "AAP Bright Futures", url: "https://brightfutures.aap.org" };

function push(
  items: EnrichedBankItem[],
  seen: Set<string>,
  item: EnrichedBankItem
): void {
  const key = `${item.vignette}|${item.question}|${item.correctAnswer}`;
  if (seen.has(key)) return;
  seen.add(key);
  items.push(item);
}

function assessScreening(items: EnrichedBankItem[], seen: Set<string>): void {
  for (let age = 50; age <= 75; age += 5) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "womens-health",
        `A ${age}-year-old woman with no personal history of breast cancer presents for a wellness visit. She has no palpable masses on clinical breast exam. She asks whether she needs imaging today. Family history is negative for BRCA mutations. BMI 27. BP 122/76 mm Hg.`,
        "Which screening approach is most appropriate per current guidelines?",
        [
          "Start biennial mammography now",
          "Defer all breast screening until age 65",
          "Order breast MRI for all average-risk women at this age",
          "Screen only if she develops a palpable mass",
        ],
        "Start biennial mammography now",
        `USPSTF recommends biennial mammography for women 50–74 at average risk. At ${age}, initiating mammography is appropriate. MRI is for high-risk patients, not average risk. Clinical exam alone is insufficient for population screening.`,
        {
          blueprintDomain: "assess",
          clinicalSystem: "womens-health",
          patientAgeGroup: age < 65 ? "middle-adult" : "older-adult",
          blueprintTopic: "cancer screening",
          difficulty: 3,
          references: [USPSTF],
          tags: [...OER_TAGS, "screening", "breast"],
        }
      )
    );
  }

  for (let age = 40; age <= 49; age += 3) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "womens-health",
        `A ${age}-year-old woman with average breast cancer risk presents for preventive care. She has no breast symptoms and no BRCA mutation history. BMI 26. She asks about mammography timing.`,
        "Which recommendation is most appropriate?",
        [
          "Offer shared decision-making about initiating biennial mammography",
          "Defer all breast imaging until age 65",
          "Start annual MRI for average-risk women",
          "Mammography is contraindicated before age 50",
        ],
        "Offer shared decision-making about initiating biennial mammography",
        `For women 40–49 at average risk, USPSTF supports individualized decisions about mammography. At ${age}, shared decision-making is appropriate rather than deferring until 65 or using MRI without high-risk criteria.`,
        {
          blueprintDomain: "assess",
          clinicalSystem: "womens-health",
          patientAgeGroup: "middle-adult",
          blueprintTopic: "cancer screening",
          difficulty: 3,
          references: [USPSTF],
          tags: [...OER_TAGS, "screening", "breast"],
        }
      )
    );
  }
}

function assessPediatric(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const months of [2, 4, 6, 9, 12, 15, 18]) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "pediatrics",
        `A ${months}-month-old infant presents for a well-child visit. Growth is tracking along the 50th percentile. Parent reports normal feeding, sleeping, and social smiling. No fever or irritability. Temp 36.9°C. Exam shows age-appropriate milestones.`,
        "Which intervention is priority at this visit per Bright Futures?",
        [
          "Administer age-appropriate vaccines per CDC schedule",
          "Order screening colonoscopy",
          "Start daily low-dose aspirin for primary prevention",
          "Defer all immunizations until school entry",
        ],
        "Administer age-appropriate vaccines per CDC schedule",
        `Well-child visits at ${months} months include immunizations per the CDC/AAP schedule unless medically contraindicated. Colonoscopy and aspirin are not pediatric primary prevention at this age. Deferring vaccines contradicts evidence-based preventive care.`,
        {
          blueprintDomain: "assess",
          clinicalSystem: "pediatrics",
          patientAgeGroup: months <= 12 ? "infant" : "toddler",
          blueprintTopic: "well-child",
          difficulty: 2,
          references: [AAP, CDC],
          tags: [...OER_TAGS, "immunization"],
        }
      )
    );
  }
}

function diagnoseEndocrine(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const a1c of [6.8, 7.2, 7.8, 8.4, 9.1]) {
    for (const age of [28, 35, 42, 49]) {
      push(
        items,
        seen,
        aanpFnpVignette(
          "endocrine",
          `A ${age}-year-old patient with BMI 33 presents with polyuria, polydipsia, and fatigue for 3 weeks. Random glucose is 248 mg/dL. A1c is ${a1c}%. No ketones on urinalysis. BP 138/86 mm Hg. No known diabetes history.`,
          "What is the most likely diagnosis?",
          [
            "Type 2 diabetes mellitus",
            "Type 1 diabetes requiring immediate insulin only",
            "Diabetes insipidus",
            "Normal stress hyperglycemia requiring no follow-up",
          ],
          "Type 2 diabetes mellitus",
          `Classic hyperglycemic symptoms with A1c ${a1c}% and BMI 33 strongly suggest type 2 diabetes in an adult. Absence of ketones and adult onset make type 1 less likely initially. Diabetes insipidus presents with dilute urine, not marked hyperglycemia. This requires formal diagnosis and treatment planning.`,
          {
            blueprintDomain: "diagnose",
            clinicalSystem: "endocrine",
            patientAgeGroup: "young-adult",
            blueprintTopic: "diabetes",
            difficulty: 3,
            references: [ADA],
            tags: [...OER_TAGS, "diabetes"],
          }
        )
      );
    }
  }
}

function diagnoseCardiovascular(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const sbp of [148, 158, 168, 178]) {
    const stage = sbp >= 160 ? "Stage 2 hypertension" : "Stage 1 hypertension";
    push(
      items,
      seen,
      aanpFnpVignette(
        "cardiovascular",
        `A 58-year-old patient has three office BP readings averaging ${sbp}/${sbp - 20} mm Hg on properly sized cuff measurements taken 1 week apart. No chest pain, headache, or acute symptoms. BMP and urinalysis are normal. BMI 29. Takes no antihypertensives.`,
        "What is the most appropriate diagnosis?",
        [
          stage,
          "Hypertensive emergency",
          "White coat hypertension only — no further evaluation needed",
          "Orthostatic hypotension",
        ],
        stage,
        `Repeated office readings ≥${sbp} mm Hg systolic meet ACC/AHA criteria for ${stage.toLowerCase()} when confirmed on separate visits. This is not an emergency without end-organ symptoms. White coat effect requires out-of-office confirmation but does not exclude treatment when sustained elevation is documented.`,
        {
          blueprintDomain: "diagnose",
          clinicalSystem: "cardiovascular",
          patientAgeGroup: "middle-adult",
          blueprintTopic: "hypertension",
          difficulty: 3,
          references: [AHA],
          tags: [...OER_TAGS, "hypertension"],
        }
      )
    );
  }
}

function planInfectious(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const day of [1, 2, 3, 5, 7]) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "infectious-disease",
        `A 24-year-old sexually active patient presents with dysuria, urinary frequency, and suprapubic tenderness for ${day} day(s). Temp 37.6°C. UA shows positive leukocyte esterase and nitrites. Pregnancy test is negative. No flank pain or CVA tenderness. No recent antibiotic use.`,
        "What is the most appropriate initial management?",
        [
          "Empiric antibiotics for uncomplicated cystitis per local guidelines",
          "Immediate hospitalization for IV antibiotics",
          "No treatment — repeat culture in 2 weeks",
          "Fluoroquinolone for 14 days without culture in all patients",
        ],
        "Empiric antibiotics for uncomplicated cystitis per local guidelines",
        `Uncomplicated cystitis in a nonpregnant young woman warrants empiric therapy guided by local resistance patterns (often nitrofurantoin or TMP-SMX when appropriate). IV therapy and admission are for pyelonephritis or systemic illness. Routine 14-day fluoroquinolones are not first-line due to resistance and adverse effects.`,
        {
          blueprintDomain: "plan",
          clinicalSystem: "infectious-disease",
          patientAgeGroup: "young-adult",
          blueprintTopic: "UTI",
          difficulty: 3,
          references: [CDC],
          tags: [...OER_TAGS, "UTI"],
        }
      )
    );
  }
}

function planPsychiatry(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const age of [16, 17]) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "psychiatry-behavioral",
        `A ${age}-year-old adolescent reports 3 weeks of depressed mood, anhedonia, poor sleep, and declining school performance. PHQ-9 score is 16. Denies current suicidal plan but endorses passive death wishes. Lives with supportive parents. No substance use on screening.`,
        "What is the most appropriate initial plan?",
        [
          "Safety assessment, psychotherapy referral, and consider SSRI with close follow-up",
          "Discharge without follow-up because there is no active plan",
          "Benzodiazepine monotherapy for sleep",
          "Defer all treatment until adulthood",
        ],
        "Safety assessment, psychotherapy referral, and consider SSRI with close follow-up",
        `Moderately severe depression (PHQ-9 16) in an adolescent requires suicide risk assessment, evidence-based therapy, and often SSRI therapy with monitoring per AACAP guidance. Passive ideation still warrants safety planning. Benzodiazepines are not depression monotherapy. Age-appropriate treatment cannot be deferred.`,
        {
          blueprintDomain: "plan",
          clinicalSystem: "psychiatry-behavioral",
          patientAgeGroup: "adolescent",
          blueprintTopic: "depression",
          difficulty: 4,
          references: [CDC],
          tags: [...OER_TAGS, "mental-health"],
        }
      )
    );
  }
}

function evaluateGeriatrics(items: EnrichedBankItem[], seen: Set<string>): void {
  for (const age of [72, 78, 84, 90]) {
    push(
      items,
      seen,
      aanpFnpVignette(
        "geriatrics",
        `An ${age}-year-old patient started lisinopril 10 mg daily 2 weeks ago for hypertension. Today BP is 102/58 mm Hg (was 158/92 at initiation). Reports dizziness when standing. Creatinine stable. No edema or cough.`,
        "What is the best evaluation and management step?",
        [
          "Assess for orthostatic hypotension, reduce or hold lisinopril, and recheck BP in 1 week",
          "Double the lisinopril dose to maintain target BP",
          "Add a thiazide diuretic immediately",
          "No change — dizziness is expected in older adults",
        ],
        "Assess for orthostatic hypotension, reduce or hold lisinopril, and recheck BP in 1 week",
        `Symptomatic hypotension after ACE inhibitor initiation in an older adult requires medication adjustment and orthostatic vitals — not intensification of therapy. Diuretics could worsen hypotension. Dizziness is not benign when linked to antihypertensive overtreatment.`,
        {
          blueprintDomain: "evaluate",
          clinicalSystem: "geriatrics",
          patientAgeGroup: "older-adult",
          blueprintTopic: "medication monitoring",
          difficulty: 3,
          references: [AHA],
          tags: [...OER_TAGS, "geriatrics"],
        }
      )
    );
  }
}

function expandedPrimaryCare(items: EnrichedBankItem[], seen: Set<string>): void {
  const templates: Array<{
    domain: AanpFnpDomainId;
    system: AanpFnpClinicalSystemId;
    age: AanpFnpPatientAgeGroupId;
    topic: string;
    vignette: (n: number) => string;
    stem: string;
    correct: string;
    wrong: [string, string, string];
    explanation: string;
    ref: typeof USPSTF;
  }> = [
    {
      domain: "assess",
      system: "pulmonary",
      age: "middle-adult",
      topic: "tobacco screening",
      vignette: (n) =>
        `A 48-year-old patient smokes ${10 + (n % 5)} cigarettes daily for ${15 + (n % 10)} years and wants to quit. BMI 26. No chronic lung disease on exam. SpO₂ 98% on room air.`,
      stem: "Which assessment and intervention is priority?",
      correct: "Document pack-year history and offer FDA-approved cessation pharmacotherapy plus counseling",
      wrong: [
        "Defer cessation counseling until pack-years exceed 30",
        "Recommend cutting to 1 cigarette daily without follow-up",
        "Order annual low-dose CT before discussing quit strategies",
      ],
      explanation:
        "Every tobacco user should receive cessation counseling; pharmacotherapy improves quit rates. Cutting without a plan is insufficient. LDCT screening follows age/smoking criteria but does not replace cessation intervention.",
      ref: USPSTF,
    },
    {
      domain: "diagnose",
      system: "pulmonary",
      age: "older-adult",
      topic: "COPD",
      vignette: (n) =>
        `A ${68 + (n % 8)}-year-old former smoker presents with progressive dyspnea and chronic productive cough. Spirometry shows FEV1/FVC 0.62 and FEV1 58% predicted after bronchodilator.`,
      stem: "What is the most likely diagnosis?",
      correct: "Moderate COPD (GOLD stage 2)",
      wrong: [
        "Asthma only — no bronchodilator response possible in COPD",
        "Normal aging — no diagnosis indicated",
        "Pulmonary embolism as the primary explanation",
      ],
      explanation:
        "Post-bronchodilator FEV1/FVC <0.70 with FEV1 50–79% predicted defines moderate COPD. Asthma may coexist but spirometry pattern here is obstructive and persistent. PE presents acutely, not with chronic productive cough over years.",
      ref: CDC,
    },
    {
      domain: "plan",
      system: "endocrine",
      age: "middle-adult",
      topic: "hypothyroid",
      vignette: (n) =>
        `A 50-year-old woman reports fatigue, weight gain, and constipation. TSH is ${4.5 + (n % 3) * 2} mIU/L (elevated) with low-normal free T4. Anti-TPO antibodies positive. No cardiac history.`,
      stem: "What is the most appropriate management?",
      correct: "Start levothyroxine with dose titration based on repeat TSH in 6–8 weeks",
      wrong: [
        "Observe without treatment until TSH exceeds 20",
        "Start liothyronine monotherapy as first-line",
        "Order thyroidectomy referral immediately",
      ],
      explanation:
        "Overt hypothyroidism with symptoms warrants levothyroxine replacement with TSH monitoring. Observation is for subclinical mild cases per shared decision-making. T3 monotherapy is not standard first-line. Surgery is not indicated for uncomplicated autoimmune hypothyroidism.",
      ref: ADA,
    },
    {
      domain: "evaluate",
      system: "womens-health",
      age: "young-adult",
      topic: "contraception follow-up",
      vignette: (n) =>
        `A 26-year-old started combined oral contraceptives 6 weeks ago for dysmenorrhea. She reports new daily headaches and BP ${132 + (n % 6)}/84 mm Hg today (baseline 118/72). No visual changes or leg swelling.`,
      stem: "What is the best next step?",
      correct: "Discontinue combined estrogen-progestin pill and switch to progestin-only or nonhormonal method",
      wrong: [
        "Increase estrogen dose to stabilize headaches",
        "Continue current pill and recheck in 6 months",
        "Add NSAIDs only without addressing blood pressure change",
      ],
      explanation:
        "New headaches and rising BP after COC initiation may indicate estrogen-related adverse effects; stop combined method and choose an alternative. Increasing estrogen would worsen risk. Delayed follow-up ignores potential hypertensive effect.",
      ref: CDC,
    },
  ];

  for (let n = 0; n < 80; n++) {
    for (const t of templates) {
      push(
        items,
        seen,
        aanpFnpVignette(
          t.system,
          t.vignette(n),
          t.stem,
          [t.correct, t.wrong[0], t.wrong[1], t.wrong[2]],
          t.correct,
          t.explanation,
          {
            blueprintDomain: t.domain,
            clinicalSystem: t.system,
            patientAgeGroup: t.age,
            blueprintTopic: t.topic,
            difficulty: 3,
            references: [t.ref],
            tags: [...OER_TAGS, t.topic],
          }
        )
      );
    }
  }
}

/** Generate open-source AANP FNP items for hybrid-gate insertion. */
export function generateAanpFnpOerProcedural(maxItems = 1500): EnrichedBankItem[] {
  const items: EnrichedBankItem[] = [];
  const seen = new Set<string>();

  assessScreening(items, seen);
  assessPediatric(items, seen);
  diagnoseEndocrine(items, seen);
  diagnoseCardiovascular(items, seen);
  planInfectious(items, seen);
  planPsychiatry(items, seen);
  evaluateGeriatrics(items, seen);
  expandedPrimaryCare(items, seen);

  return items.slice(0, maxItems);
}
