/**
 * USMLE Step 3 v3 — 20 CCS prompts, 6 abstracts, 6 drug-ad items.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import {
  usmleAbstract,
  usmleCcs,
  usmleDrugAd,
  type UsmleStepLevel,
} from "./usmle-seed-factory";

const S3 = "step3" as UsmleStepLevel;
const CR = "usmle-clinical-reasoning" as const;
const BIO = "usmle-biostats" as const;
const NBME = { label: "USMLE Step 3 CCS / NBME-style management prioritization" };

export const USMLE_STEP3_V3: EnrichedBankItem[] = [
  // ── Abstracts (6) ────────────────────────────────────────────────────────
  usmleAbstract(
    "biostatistics",
    {
      title: "Non-inferiority trial of direct oral anticoagulant vs warfarin in AF",
      source: "Lancet — randomized, open-label, non-inferiority design",
      body: `Primary hypothesis: DOAC is non-inferior to warfarin for stroke prevention (margin Δ=1.5% absolute). Result: event rate 1.2% vs 1.4%; upper bound of 95% CI for difference = 0.9% (< margin). Secondary superiority endpoint p=0.42. Conclusion: Non-inferiority met; superiority not demonstrated.`,
    },
    "Most accurate interpretation?",
    [
      "Non-inferiority demonstrated; superiority claim not supported",
      "Superiority of DOAC proven because primary p<0.05",
      "Trial proves DOAC is always safer than warfarin",
      "Open-label design eliminates performance bias entirely",
    ],
    "Non-inferiority demonstrated; superiority claim not supported",
    "Non-inferiority uses a prespecified margin; meeting it does not imply superiority.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "biostatistics", tags: ["v3"], references: [NBME] }
  ),
  usmleAbstract(
    "biostatistics",
    {
      title: "Meta-analysis of statins and all-cause mortality after MI",
      source: "Cochrane review — 18 RCTs, n=45,000",
      body: `Pooled RR 0.88 (95% CI 0.82–0.94) for mortality. Heterogeneity I²=42%. Funnel plot asymmetry noted; small-study effects suspected. Sensitivity analysis excluding open-label trials: RR 0.91 (0.84–0.99).`,
    },
    "Greatest concern when applying this meta-analysis?",
    [
      "Publication bias and small-study effects may inflate benefit",
      "I²=42% proves all studies are invalid",
      "Pooled RR below 1 proves causation in every subgroup",
      "Cochrane reviews never include open-label trials",
    ],
    "Publication bias and small-study effects may inflate benefit",
    "Funnel asymmetry raises suspicion of missing negative trials; interpret pooled estimates cautiously.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "epidemiology", tags: ["v3"], references: [NBME] }
  ),
  usmleAbstract(
    "biostatistics",
    {
      title: "Phase I dose-escalation study of novel oncology agent",
      source: "JCO — 3+3 design, n=24, advanced solid tumors",
      body: `Primary endpoint: dose-limiting toxicity in cycle 1. MTD defined at cohort receiving 200 mg with 2/6 DLTs. No tumor response endpoints powered. Pharmacokinetics linear across cohorts.`,
    },
    "What can this trial appropriately support?",
    [
      "Selection of MTD for subsequent phase II efficacy studies",
      "Definitive proof of survival benefit vs standard care",
      "Immediate FDA approval for first-line use",
      "Generalizability to all tumor types without further study",
    ],
    "Selection of MTD for subsequent phase II efficacy studies",
    "Phase I establishes safety and dosing; efficacy requires later-phase trials.",
    { stepLevel: S3, blueprintDomain: BIO, tags: ["v3"], references: [NBME] }
  ),
  usmleAbstract(
    "internal-medicine",
    {
      title: "Prospective cohort: BMI and incident diabetes over 10 years",
      source: "Ann Intern Med — n=8,200 adults without diabetes at baseline",
      body: `Adjusted HR for diabetes per 5 kg/m² BMI increase = 1.65 (95% CI 1.48–1.84). Competing risk of death handled with subdistribution hazards. Limitation: single baseline BMI measurement.`,
    },
    "Compared with a case-control study of the same exposure, this design primarily reduces:",
    [
      "Recall bias regarding exposure",
      "Need for any confounding control",
      "Incidence measurement entirely",
      "Ethics board review",
    ],
    "Recall bias regarding exposure",
    "Prospective cohorts ascertain exposure before outcome, reducing recall bias common in retrospective designs.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "epidemiology", tags: ["v3"], references: [NBME] }
  ),
  usmleAbstract(
    "biostatistics",
    {
      title: "Crossover RCT of two antihypertensives with washout period",
      source: "Hypertension — randomized, double-blind, two-period crossover",
      body: `Each patient receives drug A then B (randomized order) with 4-week washout. Primary outcome: mean 24h ambulatory BP. Carryover effect tested and not significant. Period effect p=0.03.`,
    },
    "If carryover had been significant, best analytic approach?",
    [
      "Use first-period data only or parallel design; crossover assumptions violated",
      "Ignore and pool both periods regardless",
      "Report only the second period for all patients",
      "Switch to case-control analysis",
    ],
    "Use first-period data only or parallel design; crossover assumptions violated",
    "Significant carryover violates washout assumptions — first-period or parallel designs are preferred.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "biostatistics", tags: ["v3"], references: [NBME] }
  ),
  usmleAbstract(
    "biostatistics",
    {
      title: "Intention-to-treat vs per-protocol analysis in smoking cessation trial",
      source: "NEJM — n=1,100 randomized to counseling + varenicline vs counseling alone",
      body: `ITT quit rate at 12 months: 28% vs 18% (p<0.01). Per-protocol (medication adherence >80%): 35% vs 19%. High crossover to open-label varenicline in control arm.`,
    },
    "Which analysis best preserves randomization benefits for policy decisions?",
    [
      "Intention-to-treat",
      "Per-protocol only",
      "As-treated excluding all crossovers",
      "Post-hoc completers analysis",
    ],
    "Intention-to-treat",
    "ITT reflects real-world effectiveness including non-adherence and crossover; per-protocol can exaggerate efficacy.",
    { stepLevel: S3, blueprintDomain: BIO, tags: ["v3"], references: [NBME] }
  ),

  // ── Drug ads (6) ─────────────────────────────────────────────────────────
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Warfarin sodium tablets",
      headline: "Vitamin K antagonist for thromboembolism prevention",
      indications: "AF, VTE treatment/prevention, mechanical heart valves (with aspirin in selected valves)",
      warnings: "BLACK BOX: bleeding risk. Contraindicated in pregnancy. Narrow therapeutic index — monitor INR.",
    },
    "28-year-old with mechanical mitral valve, INR 2.0, reports missed doses and wants to switch to a DOAC. Advice?",
    [
      "Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up",
      "Switch to rivaroxaban immediately",
      "Stop anticoagulation until INR normalized",
      "Add aspirin and stop warfarin",
    ],
    "Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up",
    "Current guidelines mandate warfarin for most mechanical mitral valves; DOACs are not appropriate substitutes.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "cardiovascular", tags: ["v3"], references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Amiodarone 200 mg tablets",
      headline: "Class III antiarrhythmic for recurrent ventricular arrhythmias and AF",
      indications: "Life-threatening ventricular arrhythmias; AF rhythm control when alternatives fail",
      warnings: "Pulmonary toxicity, hepatotoxicity, thyroid dysfunction, corneal deposits, QT prolongation. Baseline PFTs, LFTs, TSH recommended.",
    },
    "Patient started 3 months ago now has fatigue, weight gain, and TSH 12. Next step?",
    [
      "Evaluate amiodarone-induced hypothyroidism; consider dose change or alternative per cardiology",
      "Increase amiodarone for better rhythm control",
      "Ignore TSH if rhythm controlled",
      "Start high-dose levothyroxine without stopping drug",
    ],
    "Evaluate amiodarone-induced hypothyroidism; consider dose change or alternative per cardiology",
    "Amiodarone commonly affects thyroid function — monitor TSH and manage per endocrine/cardiology guidance.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "endocrine", tags: ["v3"], references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Clopidogrel 75 mg",
      headline: "P2Y12 inhibitor for ACS and post-stent antiplatelet therapy",
      indications: "Recent MI, stroke, PAD; dual antiplatelet with aspirin after PCI",
      warnings: "Reduced efficacy in CYP2C19 poor metabolizers. Increased bleeding with anticoagulants. TTP reported.",
    },
    "Post-PCI patient on DAPT has recurrent stent thrombosis; genotyping shows CYP2C19 *2/*2. Best adjustment?",
    [
      "Switch to prasugrel or ticagrelor if no contraindications",
      "Continue clopidogrel at double dose indefinitely without discussion",
      "Stop all antiplatelet agents",
      "Add warfarin and stop aspirin",
    ],
    "Switch to prasugrel or ticagrelor if no contraindications",
    "Poor CYP2C19 metabolizers have reduced clopidogrel activation — consider alternative P2Y12 inhibitors.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "cardiovascular", tags: ["v3"], references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Adalimumab (TNF-α inhibitor)",
      headline: "Biologic DMARD for moderate–severe rheumatoid arthritis",
      indications: "RA after methotrexate failure; psoriasis, IBD per labeling",
      warnings: "Serious infections including TB reactivation. Screen for latent TB and hepatitis B before starting. Malignancy risk discussed.",
    },
    "RA patient with positive QuantiFERON, no symptoms, needs biologic. Plan?",
    [
      "Treat latent TB per guidelines, then start biologic with infection monitoring",
      "Start biologic immediately without TB therapy",
      "Biologics contraindicated with any positive QuantiFERON",
      "Use live vaccine booster same day as first injection",
    ],
    "Treat latent TB per guidelines, then start biologic with infection monitoring",
    "TNF inhibitors require latent TB screening and treatment before initiation to reduce reactivation risk.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "rheumatology", tags: ["v3"], references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Isotretinoin capsules",
      headline: "Oral retinoid for severe recalcitrant nodular acne",
      indications: "Severe nodular acne unresponsive to systemic antibiotics and topical therapy",
      warnings: "iPLEDGE REMS: teratogenic — two forms of contraception required. Hypertriglyceridemia, mood symptoms, dry mucosa.",
    },
    "22-year-old woman with severe acne requests isotretinoin; wants pregnancy in 6 months. Counseling?",
    [
      "Delay pregnancy ≥1 month after course; enroll in iPLEDGE; monthly pregnancy tests",
      "Start now; pregnancy safe after 2 weeks",
      "No contraception needed if using barrier method only",
      "Isotretinoin safe in all trimesters",
    ],
    "Delay pregnancy ≥1 month after course; enroll in iPLEDGE; monthly pregnancy tests",
    "Isotretinoin is highly teratogenic — REMS program mandates contraception and pregnancy prevention counseling.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "dermatology", tags: ["v3"], references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Lisinopril 10 mg",
      headline: "ACE inhibitor for hypertension and HFrEF",
      indications: "HTN, HFrEF, post-MI LV dysfunction, diabetic nephropathy",
      warnings: "Contraindicated in pregnancy — fetal renal toxicity. Monitor K+ and creatinine. Angioedema risk.",
    },
    "8 weeks pregnant on lisinopril for chronic HTN. Immediate action?",
    [
      "Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral",
      "Continue — BP control paramount",
      "Add ARB for synergy",
      "Double dose until delivery",
    ],
    "Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral",
    "ACE inhibitors/ARBs are contraindicated in pregnancy due to fetal harm — substitute safe agents urgently.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "obstetrics", tags: ["v3"], references: [NBME] }
  ),

  // ── CCS prompts (20) ─────────────────────────────────────────────────────
  usmleCcs(
    "cardiology",
    {
      setting: "ED CCS — chest pain",
      presentation: "58 y/o man, 90 min crushing chest pain, ST elevation II, III, aVF; BP 98/60",
      vitals: "HR 52, RR 18, SpO2 97%",
      timeline: "0 min — STEMI inferior wall; decide reperfusion strategy",
    },
    "Best immediate management?",
    [
      "Activate PCI if <120 min door-to-balloon; otherwise fibrinolysis if no contraindication; aspirin, P2Y12, anticoagulation",
      "Discharge with stress test in 4 weeks",
      "IV beta-blocker bolus regardless of hemodynamics",
      "Wait for troponin peak before any intervention",
    ],
    "Activate PCI if <120 min door-to-balloon; otherwise fibrinolysis if no contraindication; aspirin, P2Y12, anticoagulation",
    "Inferior STEMI with bradycardia needs urgent reperfusion per ACC/AHA timelines and hemodynamic caution with beta-blockers.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "cardiovascular", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "endocrinology",
    {
      setting: "ED — hyperglycemia",
      presentation: "32 y/o T1DM, vomiting, Kussmaul respirations, glucose 520, pH 7.18, K+ 5.8",
      vitals: "BP 102/64, HR 118",
      timeline: "Suspected DKA — initiate protocol",
    },
    "First hour priorities?",
    [
      "IV fluids, insulin infusion after K+ confirmed >3.3, electrolyte monitoring, search trigger",
      "Subcutaneous insulin only and oral rehydration",
      "Immediate bicarbonate for all acidosis",
      "Hold insulin until glucose <250",
    ],
    "IV fluids, insulin infusion after K+ confirmed >3.3, electrolyte monitoring, search trigger",
    "DKA requires volume resuscitation and insulin with careful potassium management before insulin if K+ low.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "endocrine", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "neurology",
    {
      setting: "ED — acute neuro deficit",
      presentation: "67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal",
      vitals: "BP 178/96, HR 88",
      timeline: "Ischemic stroke evaluation — tPA window",
    },
    "Next step if no contraindications?",
    [
      "IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol",
      "Aspirin only and discharge",
      "Immediate carotid endarterectomy in ED",
      "MRI before any treatment regardless of delay",
    ],
    "IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol",
    "Eligible acute ischemic stroke within window warrants thrombolysis after hemorrhage excluded on CT.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "neurology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "gastroenterology",
    {
      setting: "Inpatient — GI bleed",
      presentation: "54 y/o with melena, Hgb 7.2, BP 92/58 after 1 L crystalloid; anticoagulated for AF",
      vitals: "HR 112, RR 20",
      timeline: "Unstable upper GI bleed — resuscitation phase",
    },
    "Management sequence?",
    [
      "Large-bore IV access, transfuse to Hgb ~7–8 if symptomatic, PPI IV, NPO, urgent GI consult/EGD; reverse anticoag if life-threatening",
      "Oral iron and outpatient colonoscopy",
      "Immediate discharge on PPI",
      "Platelet transfusion for all anticoagulated patients routinely",
    ],
    "Large-bore IV access, transfuse to Hgb ~7–8 if symptomatic, PPI IV, NPO, urgent GI consult/EGD; reverse anticoag if life-threatening",
    "Unstable GI bleed requires resuscitation, PPI, early endoscopy, and individualized anticoagulant reversal.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "gastroenterology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "pulmonology",
    {
      setting: "ED — community-acquired pneumonia",
      presentation: "71 y/o with fever, productive cough, RR 28, confusion; CURB-65 score 4",
      vitals: "BP 88/54, SpO2 89% RA",
      timeline: "Severe CAP — disposition and antibiotics",
    },
    "Best plan?",
    [
      "Admit/ICU consideration, empiric IV antibiotics per local guidelines, O2, cultures if severe",
      "Oral azithromycin outpatient",
      "Chest CT only without antibiotics",
      "Observation at home with pulse ox",
    ],
    "Admit/ICU consideration, empiric IV antibiotics per local guidelines, O2, cultures if severe",
    "High CURB-65 and hypoxemia indicate severe CAP requiring inpatient/ICU care and prompt antibiotics.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "respiratory", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "surgery",
    {
      setting: "ED — abdominal pain",
      presentation: "19 y/o with RLQ pain, fever, WBC 15k, CT shows appendiceal dilation with periappendiceal fat stranding",
      vitals: "HR 102, BP 118/72",
      timeline: "Acute appendicitis — surgical planning",
    },
    "Next step?",
    [
      "NPO, IV fluids, antibiotics, general surgery consult for appendectomy (laparoscopic preferred if uncomplicated)",
      "Discharge on oral analgesics",
      "Colonoscopy first",
      "Observation for 2 weeks",
    ],
    "NPO, IV fluids, antibiotics, general surgery consult for appendectomy (laparoscopic preferred if uncomplicated)",
    "Imaging-confirmed acute appendicitis warrants surgical evaluation and perioperative antibiotics.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "surgery", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "obstetrics",
    {
      setting: "ED — early pregnancy",
      presentation: "26 y/o, 6 weeks GA by dates, pelvic pain, β-hCG 3,200, TVUS no IUP, adnexal mass with free fluid",
      vitals: "BP 110/70, HR 108",
      timeline: "Suspected ectopic — stabilize and treat",
    },
    "Management?",
    [
      "Ob/Gyn consult; methotrexate if stable/unruptured criteria met, otherwise surgical management",
      "Expectant management without follow-up",
      "Dilation and curettage only",
      "Discharge with repeat β-hCG in 4 weeks only",
    ],
    "Ob/Gyn consult; methotrexate if stable/unruptured criteria met, otherwise surgical management",
    "Ectopic pregnancy requires specialist management — medical vs surgical based on stability and criteria.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "obstetrics", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "obstetrics",
    {
      setting: "Urgent care — pelvic pain",
      presentation: "22 y/o sexually active, fever, cervical motion tenderness, mucopurulent discharge",
      vitals: "T 38.3°C, HR 96",
      timeline: "Suspected PID — treat and prevent sequelae",
    },
    "Appropriate management?",
    [
      "Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy",
      "Antibiotics only if culture positive",
      "IUD must be removed in all cases before antibiotics",
      "Single-dose fluconazole",
    ],
    "Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy",
    "PID warrants empiric coverage per CDC guidelines; severity guides inpatient vs outpatient therapy.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "obstetrics", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "pediatrics",
    {
      setting: "Newborn nursery day 3",
      presentation: "Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs",
      vitals: "Stable; feeding well",
      timeline: "Hyperbilirubinemia — phototherapy threshold",
    },
    "Next step per nomogram?",
    [
      "Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors",
      "Exchange transfusion now for all bilirubin >15",
      "Discharge without follow-up",
      "Stop breastfeeding permanently",
    ],
    "Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors",
    "Phototherapy thresholds depend on age and risk; monitor and treat per AAP hyperbilirubinemia guidelines.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "pediatrics", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "pediatrics",
    {
      setting: "Pediatric clinic — injury pattern",
      presentation: "2 y/o with multiple bruises in different stages, deferential delay, no plausible mechanism from caregiver",
      vitals: "Stable",
      timeline: "Child safety evaluation",
    },
    "Mandatory next step?",
    [
      "Report to child protective services per state law; document; full trauma survey; consider skeletal survey",
      "Schedule routine follow-up without reporting",
      "Confront caregiver alone and discharge",
      "Ignore unless fracture present",
    ],
    "Report to child protective services per state law; document; full trauma survey; consider skeletal survey",
    "Clinicians must report reasonable suspicion of abuse; parallel medical evaluation for occult injury.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "pediatrics", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "nephrology",
    {
      setting: "ED — electrolyte emergency",
      presentation: "64 y/o CKD on ACEi, K+ 6.8, peaked T waves on ECG, creatinine 3.4",
      vitals: "BP 148/88, HR 58",
      timeline: "Hyperkalemia with ECG changes",
    },
    "Immediate treatment?",
    [
      "IV calcium gluconate for membrane stabilization, insulin/dextrose and albuterol, kayexalate or dialysis if refractory; hold ACEi",
      "Oral potassium binder only and discharge",
      "IV normal saline bolus alone",
      "Immediate parathyroidectomy",
    ],
    "IV calcium gluconate for membrane stabilization, insulin/dextrose and albuterol, kayexalate or dialysis if refractory; hold ACEi",
    "ECG changes from hyperkalemia are an emergency — stabilize myocardium then lower K+ with shift/removal strategies.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "nephrology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "ophthalmology",
    {
      setting: "ED — eye pain",
      presentation: "55 y/o with acute severe eye pain, halos, mid-dilated pupil, hazy cornea; IOP 48 mmHg",
      vitals: "BP 168/92",
      timeline: "Acute angle-closure glaucoma",
    },
    "Initial management?",
    [
      "Topical timolol, apraclonidine, pilocarpine after IOP lowered, IV acetazolamide, urgent ophthalmology consult",
      "Oral antibiotics",
      "Patch eye and follow up in 1 month",
      "Topical steroid monotherapy",
    ],
    "Topical timolol, apraclonidine, pilocarpine after IOP lowered, IV acetazolamide, urgent ophthalmology consult",
    "Acute angle closure needs rapid IOP reduction with multimodal therapy and specialist involvement.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "ophthalmology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "endocrinology",
    {
      setting: "Inpatient — thyroid storm",
      presentation: "40 y/o with known Graves, fever 39.5°C, AF with RVR, agitation, bilirubin elevated after URI",
      vitals: "HR 148, BP 140/70",
      timeline: "Thyrotoxic crisis — multi-drug protocol",
    },
    "Treatment bundle?",
    [
      "Propranolol, thionamide (PTU/MMI), iodine after thionamide, glucocorticoids, cooling, treat precipitant",
      "Levothyroxine loading",
      "Radioactive iodine immediate in acute storm",
      "Observation only",
    ],
    "Propranolol, thionamide (PTU/MMI), iodine after thionamide, glucocorticoids, cooling, treat precipitant",
    "Thyroid storm requires beta-blockade, thionamides, iodine (timing matters), steroids, and supportive care.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "endocrine", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "infectious-disease",
    {
      setting: "ED — meningismus",
      presentation: "19 y/o college student, fever, neck stiffness, petechial rash; LP deferred due to instability",
      vitals: "BP 86/50, HR 130",
      timeline: "Suspected bacterial meningitis — time-critical antibiotics",
    },
    "Best approach?",
    [
      "Empiric IV ceftriaxone + vancomycin (add ampicillin if elderly/list risk) immediately after blood cultures; resuscitate; LP when safe",
      "Wait for LP before any antibiotic",
      "Oral amoxicillin outpatient",
      "MRI brain before antibiotics always",
    ],
    "Empiric IV ceftriaxone + vancomycin (add ampicillin if elderly/list risk) immediately after blood cultures; resuscitate; LP when safe",
    "Do not delay antibiotics in suspected bacterial meningitis — empiric coverage after cultures if possible.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "infectious-disease", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "hematology",
    {
      setting: "Outpatient CCS — leg swelling",
      presentation: "48 y/o post long flight, unilateral calf swelling and pain; Wells score moderate; no bleed history",
      vitals: "Stable",
      timeline: "Suspected proximal DVT — anticoagulation",
    },
    "Next step?",
    [
      "Compression ultrasound; if positive start DOAC/warfarin per guidelines; counsel on duration and bleeding precautions",
      "D-dimer only and no imaging if elevated",
      "Aspirin monotherapy for DVT",
      "Thrombolysis for all distal DVT outpatient",
    ],
    "Compression ultrasound; if positive start DOAC/warfarin per guidelines; counsel on duration and bleeding precautions",
    "Moderate suspicion warrants imaging; confirmed DVT requires therapeutic anticoagulation.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "hematology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "pulmonology",
    {
      setting: "ED — COPD flare",
      presentation: "68 y/o severe COPD, increased dyspnea, purulent sputum, pH 7.32, pCO2 58 on baseline O2",
      vitals: "RR 26, SpO2 88% on home O2",
      timeline: "Acute hypercapnic exacerbation",
    },
    "Management?",
    [
      "Controlled O2 to target 88–92%, bronchodilators, systemic steroids, antibiotics if infectious trigger, consider NIV; admit",
      "High-flow 100% O2 indefinitely",
      "Sedation to reduce respiratory drive immediately",
      "Discharge without steroids",
    ],
    "Controlled O2 to target 88–92%, bronchodilators, systemic steroids, antibiotics if infectious trigger, consider NIV; admit",
    "COPD exacerbation with hypercapnia needs cautious oxygen, bronchodilators, steroids, and NIV when indicated.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "respiratory", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "endocrinology",
    {
      setting: "Outpatient CCS — diabetic foot",
      presentation: "62 y/o T2DM, plantar ulcer with probing to bone, no fever, pedal pulses diminished",
      vitals: "Afebrile",
      timeline: "Diabetic foot infection — Wagner grade 3",
    },
    "Best plan?",
    [
      "Urgent podiatry/orthopedic/vascular eval; empiric antibiotics covering gram-positives and anaerobes; offload; glycemic control; likely surgical debridement",
      "Topical antibiotic cream only",
      "Immediate below-knee amputation without evaluation",
      "Ignore without fever",
    ],
    "Urgent podiatry/orthopedic/vascular eval; empiric antibiotics covering gram-positives and anaerobes; offload; glycemic control; likely surgical debridement",
    "Deep ulcer with bone involvement (osteomyelitis risk) needs multidisciplinary care and antibiotics ± surgery.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "endocrine", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "nephrology",
    {
      setting: "Pre-procedure CCS",
      presentation: "70 y/o CKD stage 3b scheduled for contrast CT for PE rule-out; eGFR 38",
      vitals: "Stable",
      timeline: "Contrast-associated AKI prevention",
    },
    "Risk reduction strategy?",
    [
      "IV isotonic saline before/after contrast; avoid nephrotoxins; monitor creatinine; use lowest contrast volume",
      "NPO and no fluids to avoid volume overload",
      "Prophylactic high-dose NSAIDs",
      "Cancel all imaging forever",
    ],
    "IV isotonic saline before/after contrast; avoid nephrotoxins; monitor creatinine; use lowest contrast volume",
    "Peri-procedural IV hydration is standard prophylaxis for contrast nephropathy in at-risk CKD patients.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "nephrology", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "psychiatry",
    {
      setting: "Inpatient medicine — alcohol withdrawal",
      presentation: "51 y/o admitted for pneumonia; heavy alcohol use; tremor, diaphoresis, CIWA 18",
      vitals: "HR 118, BP 162/94",
      timeline: "Moderate–severe withdrawal — benzodiazepine protocol",
    },
    "Treatment?",
    [
      "Symptom-triggered benzodiazepines per CIWA; thiamine/folate; monitor electrolytes; seizure precautions",
      "Phenobarbital only without monitoring",
      "Beta-blocker monotherapy to mask symptoms",
      "Discharge if CIWA >15",
    ],
    "Symptom-triggered benzodiazepines per CIWA; thiamine/folate; monitor electrolytes; seizure precautions",
    "Alcohol withdrawal with high CIWA requires benzodiazepine dosing with monitoring and thiamine supplementation.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "psychiatry", tags: ["v3"], references: [NBME] }
  ),
  usmleCcs(
    "infectious-disease",
    {
      setting: "Hospital day 5 CCS",
      presentation: "IVDU with fever, new murmur, embolic rash, blood cultures pending; TEE ordered",
      vitals: "HR 104, BP 102/60",
      timeline: "Suspected infective endocarditis",
    },
    "Empiric management while awaiting cultures?",
    [
      "Start IV vancomycin + gentamicin (or ceftriaxone per risk) after cultures; consult ID/cardiology; evaluate for complications",
      "Oral amoxicillin only",
      "Antibiotics only after positive culture always",
      "Immediate valve replacement without antibiotics",
    ],
    "Start IV vancomycin + gentamicin (or ceftriaxone per risk) after cultures; consult ID/cardiology; evaluate for complications",
    "Suspected endocarditis warrants cultures then empiric IV therapy tailored to risk profile without undue delay.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "infectious-disease", tags: ["v3"], references: [NBME] }
  ),
];
