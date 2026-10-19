/**
 * Question of the Day — curated public pack (not live bank IDs).
 * The calendar day is America/Chicago so share URLs roll at midnight Central,
 * not at 7 PM when UTC midnight arrives. Do not import this module from a
 * client component — the answer key is in this file.
 */

import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import {
  dayIndexFromIso,
  type QotdItem,
} from "@/lib/demo/qotd-public";

export {
  dayIndexFromIso,
  examMarketingHref,
  formatQotdDisplayDate,
  parseQotdDate,
  qotdAbsoluteUrl,
  qotdEntityId,
  qotdPath,
  qotdShareCaption,
  todayIsoCentral,
  toPublicQotd,
} from "@/lib/demo/qotd-public";
export type { QotdItem, QotdPublicItem } from "@/lib/demo/qotd-public";

export function isQotdExamSlug(slug: string): slug is ExamSlug {
  return (EXAM_SLUGS as string[]).includes(slug);
}

function accent(exam: ExamSlug): string {
  const map: Record<ExamSlug, string> = {
    nclex: EXAM_ACCENTS.nclex,
    usmle: EXAM_ACCENTS.usmle,
    naplex: EXAM_ACCENTS.naplex,
    pance: EXAM_ACCENTS.pance,
    "aanp-fnp": EXAM_ACCENTS.aanpFnp,
    "npte-pt": EXAM_ACCENTS.nptePt,
  };
  return map[exam];
}

function item(
  examSlug: ExamSlug,
  id: string,
  stem: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  rationale: string,
  sources: readonly string[] = []
): QotdItem {
  const correct = options[correctIndex]!;
  return {
    id: `${examSlug}-${id}`,
    examSlug,
    examLabel: EXAM_CATALOG[examSlug].shortName,
    examColor: accent(examSlug),
    stem,
    options: [...options],
    correctIndex,
    correct,
    rationale,
    sources: [...sources],
  };
}

/** Seven curated items per exam. Selection is the Chicago day index mod 7. */
export const QOTD_BY_EXAM: Record<ExamSlug, QotdItem[]> = {
  nclex: [
    item(
      "nclex",
      "01",
      "A nurse assesses a client with fever 38.9°C (102°F), absolute neutrophil count 320/mm³, and a tunneled central line. Which action is the priority?",
      [
        "Apply a warm compress and recheck the insertion site in two hours",
        "Obtain blood cultures and start empiric broad-spectrum antibiotics",
        "Encourage oral fluids, rest, and acetaminophen at home",
        "Document the fever and repeat the vital signs in four hours",
      ],
      1,
      "B — Obtain blood cultures and start empiric broad-spectrum antibiotics. A temperature of 38.9°C (102°F) with an ANC of 320/mm³ (<500) is febrile neutropenia, and the tunneled central line is a likely source. Draw blood cultures (peripheral and from each line lumen), then give the first antibiotic dose within 1 hour. A delays care and a warm compress does not treat a possible bloodstream infection. C sends a high-risk patient home without antibiotics. D (documenting and rechecking in 4 hours) delays urgent treatment.",
      [
        "https://www.idsociety.org/practice-guideline/fever-and-neutropenia-in-adults-with-cancer/",
        "https://ascopubs.org/doi/10.1200/JOP.18.00016",
      ]
    ),
    item(
      "nclex",
      "02",
      "A client receiving IV morphine is difficult to arouse, with RR 7/min and SpO₂ 86% on room air. What is the nurse's first action?",
      [
        "Increase the morphine rate to treat residual pain",
        "Coach deep breathing, then chart and reassess in one hour",
        "Stop the opioid, stimulate and support ventilation with oxygen, and give naloxone per protocol",
        "Give an antiemetic and reassess sedation in 30 minutes",
      ],
      2,
      "C — Stop the opioid, stimulate and support ventilation with oxygen, and give naloxone per protocol. A client who is difficult to arouse, with RR 7/min and SpO₂ 86% on room air, has opioid-induced respiratory depression. Stop the morphine, stimulate the client, support the airway and breathing with oxygen, call for help, and give naloxone per protocol. ASPMN advises starting at ≤0.05 mg IV (many protocols dilute 0.4 mg to 10 mL and give 0.04 mg every 2 minutes). The label titrates 0.1–0.2 mg IV every 2–3 minutes. Titrate to adequate breathing, not full arousal, and monitor for re-sedation because naloxone can wear off before morphine. A (raising the morphine rate) deepens the respiratory depression. B (coaching, charting, reassessing in an hour) delays rescue. D (an antiemetic) ignores the airway and breathing problem.",
      [
        "https://www.aspmn.org/position_statements_and_guidel.php",
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=48137634-91d7-41e3-b54b-e4321d69668a",
      ]
    ),
    item(
      "nclex",
      "03",
      "Which finding after a new ACE inhibitor prescription requires the most urgent follow-up?",
      [
        "A mild dry cough for the past two days",
        "Blood pressure of 128/78 mm Hg at this visit",
        "Serum potassium of 4.2 mEq/L on today’s draw",
        "Lip and tongue swelling since the first dose",
      ],
      3,
      "D — Lip and tongue swelling since the first dose. This is ACE inhibitor angioedema, which can block the airway. Stop the drug and get emergency care. A (a mild dry cough) is a common, non-urgent ACE inhibitor effect that should be reported, but it is not an emergency. B (128/78 mm Hg) is an expected, acceptable response. C (K⁺ 4.2 mEq/L) is normal; hyperkalemia is the concern with ACE inhibitors.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=29ef155f-59f1-4c3f-8323-3d278f5bcbcb",
      ]
    ),
    item(
      "nclex",
      "04",
      "A postoperative client reports sudden shortness of breath and sharp chest pain. SpO₂ drops to 90%. Priority action?",
      [
        "Sit the client up, apply oxygen, and notify the provider",
        "Walk the client in the hall to check for atelectasis",
        "Give PRN acetaminophen and reassess the pain later",
        "Chart the complaint and continue vital signs every four hours",
      ],
      0,
      "A — Sit the client up, apply oxygen, and notify the provider. Sudden shortness of breath with sharp chest pain and SpO₂ 90% after surgery suggests pulmonary embolism. Position the client upright, give oxygen, and escalate right away (rapid response or provider). B (walking the client) raises oxygen demand and could dislodge more clot. C (PRN acetaminophen) treats the pain but not the cause. D (charting and checking vitals every 4 hours) delays an emergency response.",
      [
        "https://openstax.org/books/medical-surgical-nursing/pages/27-3-hospitalized-postoperative-patient",
        "https://ncbi.nlm.nih.gov/books/NBK560551/",
      ]
    ),
    item(
      "nclex",
      "05",
      "A client with type 1 diabetes is NPO for surgery. Capillary glucose is 58 mg/dL and the client is diaphoretic. Best action?",
      [
        "Give the scheduled morning insulin before the case",
        "Treat the low glucose and notify the surgical team",
        "Hold treatment until the procedure is finished",
        "Send a full breakfast tray despite the NPO order",
      ],
      1,
      "B — Treat the low glucose and notify the surgical team. A capillary glucose of 58 mg/dL with diaphoresis is symptomatic hypoglycemia. Because the client is NPO, treat per the hospital protocol (IV dextrose or glucagon), recheck in 15 minutes, and notify the surgical team. A (scheduled insulin) would lower the glucose further. C (waiting until after the case) risks seizure or loss of consciousness. D (a full breakfast tray) violates the NPO order when protocol treatment is available.",
      [
        "https://diabetesjournals.org/care/article/49/Supplement_1/S339/163925/16-Diabetes-Care-in-the-Hospital-Standards-of-Care",
      ]
    ),
    item(
      "nclex",
      "06",
      "Which task is appropriate to delegate to a trained UAP for a stable medical-surgical client?",
      [
        "Titrate the heparin infusion using the aPTT",
        "Teach insulin self-injection for the first time",
        "Help with bathing and record intake and output",
        "Assess a new surgical wound for infection",
      ],
      2,
      "C — Help with bathing and record intake and output. For a stable client, ADLs and I&O measurement are routine tasks with predictable outcomes that can be delegated to a trained UAP. A (titrating heparin by aPTT) requires nursing judgment and medication administration. B (first-time insulin teaching) is initial teaching, which is an RN responsibility. D (assessing a new surgical wound) is assessment and cannot be delegated.",
      [
        "https://www.ncsbn.org/public-files/NCSBN_Delegation_Guidelines.pdf",
        "https://www.ncbi.nlm.nih.gov/books/NBK610432/",
      ]
    ),
    item(
      "nclex",
      "07",
      "A client on warfarin has INR 5.8 and no active bleeding. Which order should the nurse question?",
      [
        "Hold tonight’s warfarin and notify the provider",
        "Recheck the INR before the next scheduled dose",
        "Review bleeding precautions and inspect for new bruising",
        "Administer an additional warfarin dose tonight",
      ],
      3,
      "D — Administer an additional warfarin dose tonight. An INR of 5.8 without bleeding is supratherapeutic. Giving more warfarin raises the bleeding risk, so the nurse should question this order. A (hold the dose and notify the provider), B (recheck the INR), and C (bleeding precautions and checking for bruising) are all appropriate; routine vitamin K is not needed at INR 4.5–10 without bleeding.",
      [
        "https://journal.chestnet.org/article/S0012-3692(12)60122-6/fulltext",
      ]
    ),
  ],
  usmle: [
    item(
      "usmle",
      "01",
      "A 58-year-old man with type 2 diabetes presents with crushing substernal chest pain for 45 minutes. ECG shows ST elevation in V2–V4. Next best step?",
      [
        "Order serial troponins and observe without reperfusion",
        "Activate PCI and give aspirin plus a P2Y12 inhibitor",
        "Schedule a treadmill stress test for the next day",
        "Start IV heparin alone and discharge if the pain stops",
      ],
      1,
      "B — Activate PCI and give aspirin plus a P2Y12 inhibitor. Ongoing crushing chest pain with ST elevation in V2–V4 is an anterior STEMI. It needs emergency reperfusion: primary PCI (door-to-device ≤90 min) plus aspirin and a P2Y12 inhibitor (ticagrelor or prasugrel preferred). A (serial troponins without reperfusion) delays treatment of a STEMI that is already diagnosed. C (stress testing) is contraindicated in an acute MI. D (heparin alone, then discharge) leaves the occluded artery untreated.",
      [
        "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001309",
        "https://www.jacc.org/doi/10.1016/j.jacc.2025.04.002",
      ]
    ),
    item(
      "usmle",
      "02",
      "A 24-year-old with sore throat develops fever, muffled “hot potato” voice, and trismus. Exam shows a swollen tonsil with uvular deviation. Most likely diagnosis?",
      [
        "Viral pharyngitis without a deep-space infection",
        "Infectious mononucleosis with tonsillar hypertrophy",
        "Peritonsillar abscess",
        "Retropharyngeal abscess behind the pharynx",
      ],
      2,
      "C — Peritonsillar abscess. Sore throat followed by fever, a muffled \"hot potato\" voice, trismus, and a swollen tonsil with the uvula pushed away from it is classic for peritonsillar abscess. A (viral pharyngitis) does not cause trismus or uvular deviation. B (mononucleosis) causes symmetric tonsillar enlargement, usually without trismus. D (retropharyngeal abscess) is mostly a disease of young children, with neck stiffness and posterior pharyngeal bulging rather than uvular deviation.",
      [
        "https://www.ncbi.nlm.nih.gov/sites/books/NBK519520/",
      ]
    ),
    item(
      "usmle",
      "03",
      "A 67-year-old with AF on warfarin starts amiodarone for rhythm control. Which lab change is most expected if dosing is not adjusted?",
      [
        "A falling INR, so the warfarin dose should be increased",
        "No INR change, because these two drugs do not interact",
        "A stable INR for months, with TSH the only lab to follow",
        "A rising INR because amiodarone slows warfarin clearance",
      ],
      3,
      "D — A rising INR because amiodarone slows warfarin clearance. Amiodarone inhibits CYP2C9 (and CYP3A4/1A2), so warfarin levels rise and the INR increases within days to weeks. The label advises cutting the warfarin dose by one-third to one-half and checking the INR closely. A has the direction wrong. B is false because the interaction is well documented. C is wrong because the INR changes early; TSH monitoring is needed too, but it does not replace INR checks.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2eceb4d5-0c47-49c3-8263-46f689388efe",
      ]
    ),
    item(
      "usmle",
      "04",
      "A toddler has a barking cough, hoarseness, and stridor at rest. Best initial therapy for moderate croup?",
      [
        "Dexamethasone now, plus nebulized epinephrine",
        "Humidified mist or a cool-mist tent as the main treatment",
        "A course of oral azithromycin for viral croup",
        "Immediate intubation before any medication trial",
      ],
      0,
      "A — Dexamethasone now, plus nebulized epinephrine. Stridor at rest means at least moderate croup. Give a single dose of dexamethasone (0.15–0.6 mg/kg) for every severity, and add nebulized epinephrine for moderate to severe croup, observing 2–4 hours afterward. B: humidified air or mist tents do not help and are not recommended. C: croup is viral, so antibiotics have no role. D: intubation is only for impending respiratory failure after medical therapy fails.",
      [
        "https://cps.ca/en/documents/position/acute-management-of-croup",
      ]
    ),
    item(
      "usmle",
      "05",
      "A 45-year-old with long-standing GERD has progressive dysphagia to solids. Endoscopy shows a distal esophageal stricture. Which chronic exposure is most associated?",
      [
        "One self-limited episode of viral esophagitis",
        "Longstanding acid injury from years of untreated reflux",
        "Bisphosphonate tablets swallowed with little water",
        "Earlier chest radiation without a reflux history",
      ],
      1,
      "B — Longstanding acid injury from years of untreated reflux. Chronic acid exposure inflames and scars the distal esophagus, causing a peptic stricture with slowly progressive dysphagia to solids. Treatment is dilation plus continuous PPI therapy. A: a single self-limited viral esophagitis does not cause a fibrotic stricture. C: pill esophagitis from bisphosphonates usually affects the mid-esophagus and is not a chronic GERD exposure. D: radiation strictures need prior chest radiation, and this patient has a reflux history instead.",
      [
        "https://journals.lww.com/ajg/fulltext/2022/01000/acg_clinical_guideline_for_the_diagnosis_and.14.aspx",
      ]
    ),
    item(
      "usmle",
      "06",
      "A patient with CKD stage 4 has phosphate 6.8 mg/dL and rising PTH. First-line dietary and medical focus?",
      [
        "Phosphate supplements to match the elevated PTH",
        "Parathyroidectomy before a trial of phosphate control",
        "Phosphate binders with meals and a low-phosphate diet",
        "Calcitriol alone while dairy intake stays high",
      ],
      2,
      "C — Phosphate binders with meals and a low-phosphate diet. Hyperphosphatemia (6.8 mg/dL) drives secondary hyperparathyroidism in CKD stage 4. KDIGO advises lowering phosphate toward normal with dietary restriction and binders taken with meals. A (phosphate supplements) would worsen it. B: parathyroidectomy is reserved for severe hyperparathyroidism that does not respond to medical therapy. D: calcitriol is not routine in non-dialysis CKD G4, raises phosphate, and does nothing about the high dairy (phosphate) intake.",
      [
        "https://kdigo.org/guidelines/ckd-mbd/",
        "https://kdigo.org/wp-content/uploads/2017/02/2017-KDIGO-CKD-MBD-GL-Update.pdf",
      ]
    ),
    item(
      "usmle",
      "07",
      "A 30-year-old develops ascending paralysis after a diarrheal illness. CSF shows albuminocytologic dissociation. Most likely diagnosis?",
      [
        "Myasthenic crisis without a preceding illness",
        "Foodborne botulism from preformed toxin",
        "Acute cervical spinal cord compression",
        "Post-infectious Guillain–Barré syndrome",
      ],
      3,
      "D — Post-infectious Guillain–Barré syndrome. Ascending weakness after a diarrheal illness (classically Campylobacter jejuni) with high CSF protein and a normal cell count (albuminocytologic dissociation) is GBS. A: myasthenic crisis causes fatigable bulbar and respiratory weakness with normal CSF. B: botulism causes descending paralysis with early cranial nerve signs. C: cord compression causes a sensory level, upper motor neuron signs, and bladder dysfunction, not this CSF pattern.",
      [
        "https://www.ninds.nih.gov/health-information/disorders/guillain-barre-syndrome",
      ]
    ),
  ],
  naplex: [
    item(
      "naplex",
      "01",
      "A prescription calls for 240 mL of a 2.5% w/v solution. The pharmacy stocks a 10% w/v concentrate. How many milliliters of concentrate and diluent are needed?",
      [
        "24 mL concentrate + 216 mL diluent",
        "60 mL concentrate + 180 mL diluent",
        "120 mL concentrate + 120 mL diluent",
        "240 mL concentrate, no diluent",
      ],
      1,
      "B — 60 mL concentrate + 180 mL diluent. 240 mL × 2.5 g/100 mL = 6 g. 6 g ÷ 10 g/100 mL = 60 mL of concentrate. Add diluent to 240 mL (180 mL). Check: C1V1 = C2V2, 10% × 60 = 2.5% × 240. A (24 mL) gives 2.4 g, a 1% solution. C (120 mL) gives a 5% solution. D (240 mL) is the undiluted 10% stock.",
      [
        "https://nabp.pharmacy/wp-content/uploads/2024/09/NAPLEX-Content-Outline.pdf",
      ]
    ),
    item(
      "naplex",
      "02",
      "A patient on warfarin asks about starting a new St. John’s wort supplement. Best counseling point?",
      [
        "It can be taken with warfarin without extra INR checks",
        "The interaction concern is with antibiotics, not warfarin",
        "Do not start it; enzyme induction can lower the INR",
        "Expect the INR to rise, and reduce the warfarin dose now",
      ],
      2,
      "C — Do not start it; enzyme induction can lower the INR. St. John's wort induces CYP3A4, CYP2C9, and P-gp, which speeds warfarin clearance, lowers the INR, and raises clot risk. Stopping it later can then push the INR up. A is wrong because the interaction is significant. B is wrong because the main concern is warfarin. D has the direction reversed.",
      [
        "https://www.nccih.nih.gov/health/st-johns-wort",
      ]
    ),
    item(
      "naplex",
      "03",
      "An adult with MRSA bacteremia and stable renal function is started on IV vancomycin. Which monitoring plan matches the 2020 ASHP/IDSA consensus?",
      [
        "Target a trough of 15–20 mg/L as the efficacy goal",
        "Follow peak levels only and do not estimate the daily AUC",
        "Skip concentration monitoring on a standard every-12-hour dose",
        "Use AUC-guided dosing with an AUC/MIC target of 400–600",
      ],
      3,
      "D — Use AUC-guided dosing with an AUC/MIC target of 400–600. For serious MRSA infections, the 2020 ASHP/IDSA/PIDS/SIDP consensus recommends AUC-guided dosing with a target AUC/MIC of 400–600 (assuming a broth-microdilution MIC of 1 mg/L), estimated with Bayesian software or two levels. A: trough-only monitoring with a 15–20 mg/L target is no longer recommended and raises nephrotoxicity. B: peak-only monitoring does not estimate exposure. C: monitoring is still required for serious MRSA infection.",
      [
        "https://www.idsociety.org/practice-guideline/vancomycin/",
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC7358040/",
      ]
    ),
    item(
      "naplex",
      "04",
      "A 16-kg child is prescribed amoxicillin 25 mg/kg/day divided every 12 hours for 10 days. The suspension is 400 mg/5 mL. What volume per dose?",
      [
        "Give 2.5 mL (200 mg) with each dose",
        "5 mL (400 mg) per dose",
        "10 mL (800 mg) with each dose",
        "1 mL (80 mg) per dose",
      ],
      0,
      "A — Give 2.5 mL (200 mg) with each dose. 16 kg × 25 mg/kg/day = 400 mg/day ÷ 2 = 200 mg per dose. 400 mg/5 mL = 80 mg/mL, and 200 ÷ 80 = 2.5 mL. B (5 mL, 400 mg) is the whole daily dose given twice. C (10 mL, 800 mg) is 4 times too much. D (1 mL, 80 mg) is too little.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b18eca1d-0133-4266-829b-9a0bd925c4f2",
      ]
    ),
    item(
      "naplex",
      "05",
      "Which inhaler counseling point is most important for a new fluticasone/salmeterol Diskus?",
      [
        "Reserve this inhaler for sudden asthma symptoms only",
        "Rinse the mouth after use; this is not a rescue inhaler",
        "Shake it before every dose, the same way you shake an MDI",
        "Prime it with test sprays into the air before each dose",
      ],
      1,
      "B — Rinse the mouth after use; this is not a rescue inhaler. Rinsing and spitting after each dose lowers the risk of oral candidiasis from the fluticasone. Salmeterol is a long-acting maintenance bronchodilator, so sudden symptoms need a rescue inhaler. A is wrong because it is not for sudden symptoms. C: a Diskus is a dry-powder inhaler and is not shaken. D: a Diskus is not primed; slide the lever once to load each dose.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/medguide.cfm?setid=17dd0a86-8161-4aa9-9b90-a23d81b38164",
      ]
    ),
    item(
      "naplex",
      "06",
      "A prescription is written for “metformin 500 mg BID with meals” (immediate-release tablets). Which counseling statement is best?",
      [
        "Take every dose on an empty stomach so more drug is absorbed",
        "Take two tablets at the next meal if you miss a dose",
        "Take it with food and report lactic acidosis warning signs",
        "Stop the medicine after a single episode of mild diarrhea",
      ],
      2,
      "C — Take it with food and report lactic acidosis warning signs. Taking IR metformin with meals reduces GI upset. The boxed warning covers lactic acidosis: report malaise, muscle pain, trouble breathing, unusual sleepiness, or abdominal pain. A worsens GI effects. B: do not double up on a missed dose. D: mild GI upset is common at the start and usually passes.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53e950f5-c58f-78e3-e063-6294a90a53e9",
      ]
    ),
    item(
      "naplex",
      "07",
      "How many milliequivalents of Na are in 1 L of 0.9% NaCl? (MW NaCl ≈ 58.5; Na = 23)",
      [
        "≈77 mEq",
        "≈308 mEq",
        "≈23 mEq",
        "≈154 mEq",
      ],
      3,
      "D — ≈154 mEq. 0.9% = 9 g NaCl/L. 9 g ÷ 58.5 g/mol = 0.154 mol, so 154 mEq Na⁺ (valence 1). A (77 mEq) is 0.45% NaCl. B (308) is the osmolarity in mOsm/L (Na⁺ plus Cl⁻). C (23) is the atomic weight of Na, not a concentration.",
      [
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2e5fe9f4-78e5-4af4-8bf9-9680e5dc5e88",
      ]
    ),
  ],
  pance: [
    item(
      "pance",
      "01",
      "A 24-year-old presents after a tick bite in Connecticut with an expanding erythema migrans rash and mild arthralgias. No focal neuro deficits. Best initial management?",
      [
        "Wait for confirmatory Lyme serology before any antibiotic",
        "Start oral doxycycline now for early localized Lyme disease",
        "Give intravenous ceftriaxone for 14 days for this rash alone",
        "Treat with prednisone for presumed reactive arthritis",
      ],
      1,
      "B — Start oral doxycycline now for early localized Lyme disease. Erythema migrans after a tick bite in an endemic area is a clinical diagnosis. Treat right away with doxycycline 100 mg BID for 10 days (CDC: 10–14). A: serology is often negative in early infection. C: IV ceftriaxone is for specific disseminated disease such as meningitis or carditis, not EM. D: prednisone does not treat the infection.",
      [
        "https://www.cdc.gov/lyme/hcp/clinical-care/erythema-migrans-rash.html",
      ]
    ),
    item(
      "pance",
      "02",
      "A 55-year-old smoker has hemoptysis and a new 2.5 cm spiculated upper-lobe nodule. Next best step?",
      [
        "Reassure the patient and repeat the chest x-ray in two years",
        "Give a week of antibiotics and do no further imaging",
        "Arrange prompt evaluation for lung cancer (CT/PET-CT and tissue diagnosis)",
        "Repeat low-dose CT in 12 months if the hemoptysis stops",
      ],
      2,
      "C — Arrange prompt evaluation for lung cancer (CT/PET-CT and tissue diagnosis). A 2.5 cm spiculated upper-lobe mass in a 55-year-old smoker with hemoptysis is highly suspicious for lung cancer and needs prompt staging and tissue diagnosis. A: a 2-year chest x-ray delay is unsafe. B: antibiotics without follow-up imaging miss a likely cancer. D: 12-month low-dose CT is for low-risk screening findings, not a symptomatic lesion over 8 mm.",
      [
        "https://www.nice.org.uk/guidance/ng12",
      ]
    ),
    item(
      "pance",
      "03",
      "A 22-year-old has 2 days of worsening headache, fever 39.4°C (103°F), photophobia, and nuchal rigidity. Kernig sign is positive. Neurologic exam is otherwise nonfocal, with no papilledema. Immediate priority?",
      [
        "Sumatriptan now and a clinic visit tomorrow for presumed migraine",
        "MRI of the brain before antibiotics or lumbar puncture",
        "Acetaminophen and discharge if the CT scan is normal",
        "Stabilize, draw blood cultures, and start empiric antibiotics plus dexamethasone for meningitis",
      ],
      3,
      "D — Stabilize, draw blood cultures, and start empiric antibiotics plus dexamethasone for meningitis. Fever 39.4°C, photophobia, nuchal rigidity, and a positive Kernig sign suggest bacterial meningitis. Draw blood cultures and give dexamethasone with or just before the first dose of ceftriaxone plus vancomycin. Do not delay for imaging. A (sumatriptan and clinic follow-up) misses an emergency. B (brain MRI first) delays antibiotics; imaging before LP is only for specific indications (focal deficit, papilledema, altered mental status, immunocompromise, new seizure), and none apply here. C (acetaminophen and discharge) is unsafe.",
      [
        "https://www.nice.org.uk/guidance/ng240",
      ]
    ),
    item(
      "pance",
      "04",
      "A 62-year-old with CHF has weight gain, rising creatinine on high-dose loop diuretic, and orthopnea. Exam shows crackles. Best next management?",
      [
        "Relieve congestion carefully while watching renal perfusion",
        "Stop the loop diuretic indefinitely because the creatinine rose",
        "Give an overnight fluid bolus to treat the creatinine rise",
        "Keep the same diuretic dose and stop recording daily weights",
      ],
      0,
      "A — Relieve congestion carefully while watching renal perfusion. Weight gain, orthopnea, and crackles mean the patient is still congested. A modest creatinine rise during decongestion is common and is not a reason to stop. Intensify decongestion (for example, IV loop diuretic or sequential nephron blockade) while monitoring creatinine, electrolytes, and perfusion. B: stopping the loop diuretic leaves the patient volume overloaded. C: a fluid bolus worsens the congestion. D: daily weights are needed to guide therapy.",
      [
        "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001063",
      ]
    ),
    item(
      "pance",
      "05",
      "Which screening test is most appropriate for a sexually active 22-year-old woman at a preventive visit?",
      [
        "Defer chlamydia testing until she turns 25 years old",
        "Order chlamydia and gonorrhea screening at this visit",
        "Mammography as the priority cancer screen at this visit",
        "Skip STI tests because she has no urinary symptoms",
      ],
      1,
      "B — Order chlamydia and gonorrhea screening at this visit. USPSTF recommends screening all sexually active women aged 24 or younger for both chlamydia and gonorrhea (NAAT). A: the age cutoff is ≤24, so a 22-year-old qualifies now. C: mammography is not indicated at 22. D: most infections cause no symptoms, which is why screening is done.",
      [
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/chlamydia-and-gonorrhea-screening",
      ]
    ),
    item(
      "pance",
      "06",
      "A patient with acute monoarticular knee pain, fever, and inability to bear weight. Synovial WBC is very high with neutrophils. Priority?",
      [
        "Rest, ice, and a clinic recheck in two days if fever persists",
        "Oral prednisone for suspected gout before any aspiration",
        "Start IV antibiotics after blood cultures and arrange urgent joint drainage",
        "Colchicine alone, with a follow-up visit next week",
      ],
      2,
      "C — Start IV antibiotics after blood cultures and arrange urgent joint drainage. Fever, an acutely painful knee, inability to bear weight, and neutrophil-predominant synovial fluid with a very high WBC count mean septic arthritis until proven otherwise. Send synovial Gram stain and culture plus blood cultures, start IV antibiotics, and arrange urgent drainage. A delays treatment of a joint-destroying infection. B: steroids before infection is excluded are dangerous. D: colchicine treats gout, not infection.",
      [
        "https://doi.org/10.1016/j.eimce.2023.07.007",
      ]
    ),
    item(
      "pance",
      "07",
      "Per GINA, what is the preferred first-line therapy for a newly diagnosed adult with infrequent asthma symptoms (a few times per month)?",
      [
        "Daily oral prednisone as the first controller medicine",
        "Salmeterol twice daily with no inhaled corticosteroid",
        "As-needed albuterol alone, with no inhaled steroid",
        "As-needed low-dose ICS–formoterol when symptoms occur",
      ],
      3,
      "D — As-needed low-dose ICS–formoterol when symptoms occur. GINA Track 1 (Steps 1–2) prefers as-needed low-dose ICS–formoterol for adults with infrequent symptoms because it lowers severe exacerbations compared with SABA alone. A: daily oral prednisone is not a controller for mild asthma. B: a LABA without ICS raises the risk of asthma death. C: GINA no longer recommends SABA-only treatment.",
      [
        "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf",
      ]
    ),
  ],
  "aanp-fnp": [
    item(
      "aanp-fnp",
      "01",
      "A 52-year-old woman with type 2 diabetes and BMI 34 has an A1c of 8.4% on metformin 1000 mg BID. BP 138/86, eGFR 72. Best next step?",
      [
        "Increase metformin to 1500 mg BID and add nothing else",
        "Add a GLP-1 receptor agonist or an SGLT2 inhibitor next",
        "Start basal insulin before optimizing other non-insulin therapy",
        "Lifestyle counseling only, and repeat the A1c in six months",
      ],
      1,
      "B — Add a GLP-1 receptor agonist or an SGLT2 inhibitor next. An A1c of 8.4% on metformin 2,000 mg/day is above goal. With BMI 34, ADA 2026 prefers a GLP-1 RA (or dual GIP/GLP-1 RA such as tirzepatide) for glucose and weight; an SGLT2 inhibitor is an alternative, preferred if HF or CKD develops. A: 1,500 mg BID (3,000 mg/day) exceeds the 2,550 mg/day maximum and adds little. C: insulin is not needed before trying these agents, absent catabolic symptoms or very high A1c. D: lifestyle alone delays needed intensification.",
      [
        "https://diabetesjournals.org/care/article/49/Supplement_1/S183/163934/9-Pharmacologic-Approaches-to-Glycemic-Treatment",
      ]
    ),
    item(
      "aanp-fnp",
      "02",
      "A 45-year-old’s screening BP is 148/92 on two separate visits. No end-organ damage. Next best step?",
      [
        "Recheck the blood pressure next year before starting treatment",
        "Refer for coronary angiography before any blood pressure medicine",
        "Confirm with home or ambulatory BP, then start lifestyle changes plus medication",
        "Start three antihypertensives today and skip lifestyle counseling",
      ],
      2,
      "C — Confirm with home or ambulatory BP, then start lifestyle changes plus medication. An office BP of 148/92 on two visits is in the stage 2 range (≥140/90). The 2025 AHA/ACC guideline recommends confirming with home or ambulatory monitoring, then starting medication plus lifestyle changes, preferably two first-line agents in a single-pill combination. A: waiting a year leaves stage 2 hypertension untreated. B: angiography is not indicated without symptoms. D: three drugs at once without lifestyle counseling is excessive.",
      [
        "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001356",
      ]
    ),
    item(
      "aanp-fnp",
      "03",
      "Which contraceptive counseling point is most accurate for a combined oral contraceptive candidate who smokes 15 cigarettes/day and is 36?",
      [
        "A combined pill is still preferred because she is younger than 40",
        "Thrombosis does not need to be discussed if her blood pressure is normal",
        "A levonorgestrel IUD is unsafe solely because she smokes",
        "Avoid combined hormones and offer a progestin-only or nonhormonal method",
      ],
      3,
      "D — Avoid combined hormones and offer a progestin-only or nonhormonal method. At 36 years old and 15 cigarettes/day (≥35 years and ≥15/day), combined hormonal contraception is US MEC Category 4 because of MI and stroke risk. A: the age cutoff is 35, not 40. B: thrombosis and cardiovascular risk must be discussed whatever the BP. C: the LNG-IUD is Category 1 for smokers.",
      [
        "https://www.cdc.gov/contraception/hcp/usmec/combined-hormonal-contraceptives.html",
        "https://www.cdc.gov/contraception/hcp/usmec/index.html",
      ]
    ),
    item(
      "aanp-fnp",
      "04",
      "A healthy 6-month-old is due for routine immunizations. Parents ask about acetaminophen before vaccines. Best guidance?",
      [
        "Skip a prophylactic dose; treat discomfort if it occurs after the visit",
        "Give ibuprofen before every vaccine so fever cannot occur",
        "Give aspirin beforehand; it is a substitute for ibuprofen here",
        "Delay the rest of the series because of one fever after a prior dose",
      ],
      0,
      "A — Skip a prophylactic dose; treat discomfort if it occurs after the visit. CDC does not recommend giving antipyretics before or at vaccination because they may reduce antibody responses. Treat fever or discomfort afterward if needed. B: prophylactic ibuprofen has the same problem and does not prevent all fever. C: aspirin is contraindicated in children (Reye syndrome). D: a fever after a prior dose is not a reason to delay the series.",
      [
        "https://www.cdc.gov/vaccines/hcp/imz-best-practice/",
      ]
    ),
    item(
      "aanp-fnp",
      "05",
      "A 28-year-old has dysuria, frequency, and no vaginal discharge. Urine dip is nitrite+. Best empiric approach for uncomplicated cystitis?",
      [
        "One intravenous dose of vancomycin and no oral agent afterward",
        "Nitrofurantoin for five days when renal function allows it",
        "No antibiotic, because she is afebrile and can increase fluids",
        "A cranberry supplement alone for the next several weeks",
      ],
      1,
      "B — Nitrofurantoin for five days when renal function allows it. Dysuria and frequency with no vaginal discharge and a positive nitrite in a 28-year-old is acute uncomplicated cystitis. Nitrofurantoin monohydrate/macrocrystals 100 mg BID for 5 days is first-line (avoid if CrCl <30 mL/min). A: IV vancomycin does not cover typical gram-negative uropathogens and is not indicated. C: withholding antibiotics in symptomatic, nitrite-positive cystitis is not standard. D: cranberry does not treat an active infection.",
      [
        "https://www.idsociety.org/practice-guideline/uncomplicated-cystitis-and-pyelonephritis-uti/",
      ]
    ),
    item(
      "aanp-fnp",
      "06",
      "An older adult’s PHQ-9 is 18 with anhedonia and passive death wish but no plan/intent. Best next step?",
      [
        "Send the patient home with no scheduled follow-up visit",
        "Start clonazepam as the only treatment for this depression",
        "Assess safety, treat or refer, and arrange close follow-up",
        "Offer no treatment; a score in this range is ordinary grief",
      ],
      2,
      "C — Assess safety, treat or refer, and arrange close follow-up. A PHQ-9 of 18 is moderately severe depression, and a passive death wish is a positive item 9. Do a structured suicide risk assessment and safety plan, start treatment (antidepressant and/or psychotherapy) or refer, and follow up within 1–2 weeks. A: no follow-up is unsafe. B: benzodiazepine monotherapy does not treat depression and is a Beers drug in older adults. D: a score of 18 with anhedonia is not ordinary grief.",
      [
        "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults",
      ]
    ),
    item(
      "aanp-fnp",
      "07",
      "A patient with osteoarthritis knee pain failed acetaminophen. No GI bleed history. Which is a reasonable next pharmacologic step?",
      [
        "Scheduled oxycodone before any topical analgesic",
        "A standing course of oral prednisone for the knee",
        "Explain that no further medication is useful after acetaminophen",
        "Try a topical or oral NSAID and counsel on GI and renal risk",
      ],
      3,
      "D — Try a topical or oral NSAID and counsel on GI and renal risk. ACR/AF 2019 strongly recommends topical NSAIDs for knee OA, ideally before oral NSAIDs, and gives acetaminophen only a conditional recommendation. With no GI bleed history, an NSAID is reasonable with GI, renal, and cardiovascular counseling. A: opioids are not recommended ahead of topical options. B: oral prednisone is not recommended for OA. C: other effective options remain, including NSAIDs, intra-articular steroids, exercise, and weight loss.",
      [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC11488261/",
      ]
    ),
  ],
  "npte-pt": [
    item(
      "npte-pt",
      "01",
      "A physical therapist evaluates a patient 2 days post–total knee arthroplasty. Knee flexion 65°, moderate effusion, quadriceps activation lag. Priority intervention?",
      [
        "Force end-range flexion despite a tense knee effusion",
        "Quad sets, edema control, and range within the protocol",
        "Bed rest until the surgical incision has fully healed",
        "Hold every strengthening exercise until after the sixth week",
      ],
      1,
      "B — Quad sets, edema control, and range within the protocol. On day 2 after TKA, with 65° of flexion, moderate effusion, and a quadriceps lag, the priorities are quad activation (consider NMES), effusion control, and progressive ROM within the surgeon's protocol. A: forcing end range against a tense effusion increases pain and inhibition. C: bed rest is contrary to early mobility. D: delaying strengthening for 6 weeks prolongs quad weakness.",
      [
        "https://academic.oup.com/ptj/article/100/9/1603/5857258",
      ]
    ),
    item(
      "npte-pt",
      "02",
      "A patient with Parkinson disease shows festinating gait and reduced step length. Which cueing strategy is most appropriate?",
      [
        "Encourage faster shuffling and do not add external cues",
        "Stop gait practice and use supine exercise only",
        "Use rhythmic auditory or visual cues to lengthen the stride",
        "Limit the plan of care to passive range of motion in bed",
      ],
      2,
      "C — Use rhythmic auditory or visual cues to lengthen the stride. The APTA Parkinson CPG strongly recommends external cueing (for example, a metronome or floor lines) to improve stride length and gait. A: faster shuffling makes festination worse. B and D: stopping gait training or limiting care to supine or passive exercise removes task-specific practice.",
      [
        "https://pmc.ncbi.nlm.nih.gov/articles/PMC9046970/",
      ]
    ),
    item(
      "npte-pt",
      "03",
      "During a lumbar exam, passive straight-leg raise reproduces familiar radicular pain at 35°. This finding most supports?",
      [
        "Hamstring tightness without nerve-root irritation",
        "Isolated osteoarthritis of the hip",
        "A normal straight-leg raise for this patient",
        "Lumbar nerve-root irritation from neural tension",
      ],
      3,
      "D — Lumbar nerve-root irritation from neural tension. A passive SLR that reproduces the patient's familiar radicular leg pain between roughly 30° and 70° (here 35°) is positive for lumbosacral nerve-root tension. A: hamstring tightness causes posterior thigh stretch, not radicular pain. B: hip OA causes groin pain with hip rotation, not radicular pain on SLR. C: reproduction of radicular pain makes the test positive, not normal.",
      [
        "https://www.jospt.org/doi/10.2519/jospt.2021.0304",
      ]
    ),
    item(
      "npte-pt",
      "04",
      "A patient with COPD has SpO₂ 85% on room air during ambulation and reports severe dyspnea. Best immediate action?",
      [
        "Stop activity, support breathing, and apply oxygen per order",
        "Finish the six-minute walk, then decide whether oxygen is needed",
        "Raise the treadmill speed and incline to build endurance",
        "Document the saturation and continue the same walking workload",
      ],
      0,
      "A — Stop activity, support breathing, and apply oxygen per order. Desaturation to 85% with severe dyspnea means the patient is not tolerating the exercise. Stop, use pursed-lip breathing and a recovery position, and give oxygen per order until SpO₂ is ≥88–90%. B: finishing the walk prolongs the hypoxemia. C: raising the workload is unsafe. D: continuing the same workload ignores the desaturation.",
      [
        "https://goldcopd.org/2025-gold-report/",
        "https://academic.oup.com/ajrccm/article/208/4/e7/8427885",
      ]
    ),
    item(
      "npte-pt",
      "05",
      "Which transfer is most appropriate for a patient with complete C6 tetraplegia who has strong tenodesis and fair trunk control in sitting?",
      [
        "Independent floor-to-chair transfers on the first training day",
        "Use a sliding-board transfer with assistance as needed",
        "A mechanical lift for every transfer, with board practice deferred",
        "A standing pivot transfer with no upper-limb support",
      ],
      1,
      "B — Use a sliding-board transfer with assistance as needed. Expected outcomes for complete C6 tetraplegia include level sliding-board transfers with some assistance progressing toward independence, using tenodesis, shoulder musculature, and sitting balance. A: floor-to-chair transfers are advanced and not realistic on day one. C: a lift for every transfer under-trains this patient. D: a standing pivot needs lower-extremity strength, which the patient lacks.",
      [
        "https://pva.org/wp-content/uploads/2021/09/cpg_outcomes-following-traumatic-sci.pdf",
      ]
    ),
    item(
      "npte-pt",
      "06",
      "A sports athlete 9 months post-ACL reconstruction has full ROM, good quad strength, and sport-specific clearance goals. Which principle guides return-to-sport testing?",
      [
        "Clear the athlete at eight weeks if the incision has healed",
        "Allow cutting drills even when they reproduce knee pain",
        "Use strength symmetry, hop tests, and movement quality together",
        "Use a functional brace in place of strength targets",
      ],
      2,
      "C — Use strength symmetry, hop tests, and movement quality together. Return to sport should be criterion-based (quad and hamstring LSI ≥90%, a hop-test battery ≥90%, movement quality, psychological readiness) and usually not before 9 months; earlier RTS carries a much higher reinjury risk. A: incision healing at 8 weeks says nothing about graft readiness. B: pain with cutting means the athlete is not ready. D: a brace does not replace strength criteria.",
      [
        "https://www.jospt.org/doi/10.2519/jospt.2020.9071",
        "https://pubmed.ncbi.nlm.nih.gov/32647735/",
      ]
    ),
    item(
      "npte-pt",
      "07",
      "A patient with a recent CVA has left neglect. Which treatment environment modification helps most during gait training?",
      [
        "Stand on the patient’s right and skip cues toward the left",
        "Cover the left visual field so attention stays on the right",
        "Delay all standing practice until neglect testing is normal",
        "Arrange cues so the patient must scan toward the left side",
      ],
      3,
      "D — Arrange cues so the patient must scan toward the left side. Left neglect after a right-hemisphere stroke is treated with visual scanning training and cues that draw attention into the neglected left space. A: avoiding left-sided cues reinforces the neglect. B: covering the left field removes left input, which is the opposite of what is needed. C: delaying standing practice slows recovery; neglect is treated during functional training.",
      [
        "https://www.ahajournals.org/doi/10.1161/STR.0000000000000098",
      ]
    ),
  ],
};

/**
 * Item for a Chicago calendar date, or null when that date must not be served.
 * Null is required for future and invalid dates so callers do not show item 01.
 */
export function getQotdForExam(
  exam: ExamSlug,
  dateIso: string,
  now = new Date()
): QotdItem | null {
  const pack = QOTD_BY_EXAM[exam];
  const idx = dayIndexFromIso(dateIso, now);
  if (idx == null) return null;
  return pack[idx % pack.length] ?? null;
}

export function getQotdHubFeatured(dateIso: string, now = new Date()): ExamSlug | null {
  const idx = dayIndexFromIso(dateIso, now);
  if (idx == null) return null;
  return EXAM_SLUGS[idx % EXAM_SLUGS.length] ?? null;
}
