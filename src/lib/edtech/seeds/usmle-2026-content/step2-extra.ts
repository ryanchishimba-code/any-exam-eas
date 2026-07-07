import type { Usmle2026StudyContent } from "./types";

/** Step 2 CK — remaining systems (surgery, peds, OB/GYN, psychiatry). */
export const USMLE_2026_CONTENT_STEP2_EXTRA: Record<string, Usmle2026StudyContent> = {
  "pre-post-op-care": {
    overview: "Preoperative risk stratification, NPO, and post-op complications.",
    summary:
      "Pre-op: assess cardiac risk (RCRI), functional capacity, medication management (hold anticoagulants, continue beta-blockers if already on). NPO guidelines: solids 6–8 h, clear liquids 2 h. DVT prophylaxis and antibiotic prophylaxis per procedure.\n\nPost-op fever timing: day 1–2 atelectasis, day 3–5 pneumonia/wound, day 5+ abscess/UTI/DVT. Ileus vs obstruction — listen for bowel sounds, check labs, obtain imaging if uncertain.",
    keyConcepts: [
      "RCRI predicts cardiac events — functional capacity >4 METs lowers risk",
      "Continue beta-blockers perioperatively if chronically used",
      "Hold warfarin/DOAC per bleeding risk vs thrombosis — bridging when indicated",
      "Post-op fever mnemonic: Wind (atelectasis), Water (UTI), Wound, Walking (DVT), Wonder drugs",
      "Enhanced recovery after surgery: early ambulation, minimize opioids",
    ],
    mustKnowFacts: [
      "Malignant hyperthermia: dantrolene + stop triggering agents (volatile anesthetics, succinylcholine)",
    ],
    pearls: [
      "Day 1 post-op fever + basilar crackles → incentive spirometry before broad antibiotics.",
    ],
    pitfalls: [
      "Stopping chronic beta-blocker abruptly perioperatively — rebound tachycardia/ischemia",
    ],
  },
  "trauma-atls": {
    overview: "Primary survey ABCDE and hemorrhage control priorities.",
    summary:
      "ATLS: Airway with C-spine protection, Breathing (tension pneumo → needle decompression), Circulation (two large-bore IVs, blood products), Disability (GCS, pupils), Exposure. Control external hemorrhage with direct pressure; tourniquet for extremity exsanguination.\n\nFAST exam in unstable blunt trauma; DPL rarely needed. Pelvic binder for open-book fracture. Permissive hypotension in penetrating trauma until OR control when no TBI.",
    keyConcepts: [
      "Tension pneumothorax: tracheal deviation, hypotension — needle then chest tube",
      "Massive transfusion protocol: 1:1:1 RBC:FFP:platelets",
      "C-spine clearance only when clinical criteria met or imaging negative",
      "Open fracture: antibiotics + tetanus + urgent debridement",
      "Epidural hematoma: lucid interval — emergent neurosurgery",
    ],
    mustKnowFacts: [
      "Never delay life-saving intervention for imaging in unstable trauma",
    ],
    pearls: [
      "MVC + hypotension + distended neck veins + absent breath sounds → tension pneumo, needle 2nd ICS before CT.",
    ],
    pitfalls: [
      "Over-resuscitating penetrating trauma to normal BP before surgical control — dislodges clots",
    ],
  },
  "appendicitis-cholecystitis": {
    overview: "RLQ appendicitis vs RUQ biliary disease workup and management.",
    summary:
      "Appendicitis: periumbilical pain migrating to RLQ, anorexia, McBurney tenderness. CT or ultrasound confirms; NPO, IV fluids, antibiotics, appendectomy. Perforated appendicitis → abscess may drain + interval appendectomy.\n\nAcute cholecystitis: RUQ pain, fever, Murphy sign, leukocytosis. Ultrasound: gallstones, wall thickening, pericholecystic fluid. NPO, IV antibiotics, cholecystectomy within 72 h (early laparoscopic preferred).",
    keyConcepts: [
      "Alvarado score aids appendicitis probability — not definitive alone",
      "Pregnant appendicitis: ultrasound first, MRI if equivocal",
      "Ascending cholangitis: Charcot triad — ERCP urgent",
      "Choledocholithiasis: dilated CBD, elevated bilirubin/alk phos — MRCP or ERCP",
      "Emphysematous cholecystitis: diabetics, air in wall — emergent surgery",
    ],
    mustKnowFacts: [
      "Single dose pre-op antibiotics sufficient for uncomplicated appendectomy",
    ],
    pearls: [
      "Fever + RUQ pain post-cholecystectomy → suspect bile leak or retained stone — MRCP/ERCP.",
    ],
    pitfalls: [
      "Discharging RLQ pain with normal WBC — early appendicitis still possible",
    ],
  },
  "febrile-infant": {
    overview: "Age-based fever workup from neonate to 3 months.",
    summary:
      "Neonate ≤28 days with fever ≥38°C: full sepsis workup (blood, urine, LP) + empiric ampicillin + gentamicin/cefotaxime — admit regardless of appearance. 29–60 days: risk stratification (Boston/Philadelphia/Rochester criteria) may allow outpatient if low risk and reliable follow-up.\n\n3–36 months: source often viral URI/otitis; UTI common occult source — obtain UA in unexplained fever without focus.",
    keyConcepts: [
      "Neonate fever = sepsis until proven otherwise",
      "LP mandatory in neonatal fever workup",
      "Herpes encephalitis: vesicles, seizures — acyclovir empirically if concern",
      "Urine bag specimen not for culture — catheter or suprapubic",
      "Immunization status affects pretest probability (Hib, pneumococcus)",
    ],
    mustKnowFacts: [
      "Well-appearing febrile neonate still requires full evaluation and admission",
    ],
    pearls: [
      "14-day-old 38.2°C → blood culture, LP, UA, admit on IV antibiotics — do not observe at home.",
    ],
    pitfalls: [
      "Attributing neonatal fever to viral URI without full bacterial workup",
    ],
  },
  "preeclampsia-eclampsia": {
    overview: "Hypertensive disorders of pregnancy, severe features, and magnesium.",
    summary:
      "Preeclampsia: BP ≥140/90 after 20 weeks + proteinuria or end-organ dysfunction (thrombocytopenia, elevated LFTs, pulmonary edema, cerebral symptoms). Severe features: BP ≥160/110, severe headache, visual changes, epigastric pain.\n\nDelivery is definitive treatment at term or with severe features remote from term after stabilization. Magnesium sulfate prevents/treats eclampsia seizures. HELLP: hemolysis, elevated liver enzymes, low platelets.",
    keyConcepts: [
      "Magnesium toxicity: loss of reflexes, respiratory depression — calcium gluconate antidote",
      "Labetalol, hydralazine, nifedipine for acute severe hypertension in pregnancy",
      "Eclampsia: magnesium + delivery regardless of gestational age if unstable",
      "Aspirin prophylaxis for high-risk nulliparas from 12 weeks",
      "Postpartum preeclampsia can present up to 6 weeks after delivery",
    ],
    mustKnowFacts: [
      "Never use ACE inhibitors or ARBs in pregnancy — teratogenic",
    ],
    pearls: [
      "32 weeks + BP 165/105 + headache + platelets 90k → magnesium, BP control, betamethasone, plan delivery.",
    ],
    pitfalls: [
      "Diagnosing preeclampsia without checking urine protein or end-organ labs",
    ],
  },
  "suicide-risk": {
    overview: "Structured assessment, protective factors, and disposition.",
    summary:
      "Ask directly about suicidal ideation, plan, intent, means, and prior attempts. High risk: specific plan, access to lethal means, recent attempt, command hallucinations, severe hopelessness, substance intoxication.\n\nSafety planning, means restriction (firearm storage), and urgent psychiatry follow-up for moderate risk. Inpatient admission or involuntary hold when imminent danger — contract for safety alone is insufficient.",
    keyConcepts: [
      "Columbia Suicide Severity Rating Scale used in many settings",
      "Protective factors: social support, reasons for living, treatment engagement",
      "Lethal means counseling — firearms most common method in US",
      "Bipolar depression and postpartum period high-risk windows",
      "Document risk assessment and disposition clearly",
    ],
    mustKnowFacts: [
      "Asking about suicide does not increase suicide risk — essential to assess",
    ],
    pearls: [
      "Depressed patient with stockpiled pills and note → involuntary hold, 1:1 observation, remove means.",
    ],
    pitfalls: [
      "Discharging patient who denies suicide after recent overdose without psych evaluation",
    ],
  },
  "bowel-obstruction": {
    overview: "Small vs large bowel obstruction, closed loop, and strangulation.",
    summary:
      "SBO: crampy pain, vomiting before distention, high-pitched bowel sounds early. Causes: adhesions (most common post-op), hernia, malignancy. Closed-loop and strangulated obstruction need emergent surgery.\n\nLBO: distention, constipation, vomiting late; sigmoid volvulus (elderly) — endoscopic detorsion; cecal volvulus — surgical.",
    keyConcepts: [
      "SBO: air-fluid levels on upright XR; CT more sensitive",
      "Strangulation: fever, tachycardia, peritoneal signs, lactate elevation",
      "LBO: colonoscopy for malignant obstruction can decompress/stent",
      "Gallstone ileus: air in biliary tree — rigler triad",
      "Partial vs complete — partial may resolve with NG decompression",
      "Closed-loop obstruction: fixed point both ends — emergent surgery even if partial",
    ],
    mustKnowFacts: [
      "Never give oral contrast in complete obstruction if surgery planned emergently",
    ],
    pearls: [
      "Prior appendectomy + crampy pain + vomiting + dilated loops → adhesive SBO.",
    ],
    pitfalls: [
      "Missing closed-loop obstruction on CT — surgical emergency",
    ],
  },
  "hernia-management": {
    overview: "Inguinal anatomy, incarceration, and surgical repair indications.",
    summary:
      "Indirect inguinal: patent processus vaginalis through internal ring — lateral to inferior epigastrics; most common in infants and young men. Direct: Hesselbach triangle weakness — older men.\n\nIncarcerated hernia: irreducible, painful — urgent surgery if cannot reduce. Strangulated: compromised blood supply — emergent.",
    keyConcepts: [
      "Indirect inguinal: lateral to inferior epigastrics through internal ring",
      "Direct inguinal: Hesselbach triangle — acquired weakness in older men",
      "Femoral hernia: below inguinal ligament — high incarceration risk in women",
      "Richter hernia: partial bowel wall only — can strangulate with minimal obstruction",
      "Umbilical hernia in infant often closes by age 5",
      "Mesh repair standard for adult inguinal hernia",
    ],
    mustKnowFacts: [
      "Femoral hernia repair recommended even if asymptomatic due to incarceration risk",
    ],
    pearls: [
      "Irreducible tender groin mass + vomiting → incarcerated hernia; surgery if cannot reduce.",
    ],
    pitfalls: [
      "Attempting reduction of strangulated hernia without surgery plan",
    ],
  },
  "burns-management": {
    overview: "TBSA estimation, fluid resuscitation, and burn center criteria.",
    summary:
      "Rule of nines for TBSA; palm method ~1% in adults. Parkland formula: 4 mL × kg × %TBSA LR in first 24 h (half first 8 h). Full-thickness (third-degree) leathery, painless, no blanching.\n\nInhalation injury: carbonaceous sputum, hoarseness, carboxyhemoglobin — high-flow O₂, intubate early if stridor.",
    keyConcepts: [
      "Burn center: partial >10% TBSA, full-thickness >5%, face/hands/genital/perineal, inhalation, electrical, chemical",
      "Circumferential burns → escharotomy for compartment syndrome",
      "Silver sulfadiazine topical; avoid if sulfa allergy",
      "Electrical burns — deep tissue injury underestimated; rhabdomyolysis risk",
      "Tetanus prophylaxis and pain control essential",
    ],
    mustKnowFacts: [
      "Carbon monoxide poisoning: pulse ox unreliable — check co-oximetry",
    ],
    pearls: [
      "30% TBSA partial-thickness burn in adult → Parkland resuscitation + burn unit referral.",
    ],
    pitfalls: [
      "Underestimating fluid needs in inhalation injury and high-voltage electrical burns",
    ],
  },
  "developmental-milestones": {
    overview: "Motor, language, and social milestones with red flags.",
    summary:
      "12 months: walks, mama/dada specific, pincer grasp. 18 months: runs, 10+ words. 2 years: 2-word phrases, follows 2-step commands. 3 years: tricycle, sentences.\n\nRed flags: no babbling by 12 months, no words by 16 months, no 2-word phrases by 24 months, regression — evaluate for autism, hearing loss, global delay.",
    keyConcepts: [
      "Denver II screens gross/fine motor, language, personal-social",
      "Hearing loss common reversible cause of language delay — audiometry",
      "Primitive reflexes disappear: Moro gone by 3–4 months",
      "Preterm infants use corrected age until 2 years",
      "Failure to thrive + milestones delay → organic and psychosocial evaluation",
    ],
    mustKnowFacts: [
      "M-CHAT screens autism at 18 and 24 months well-child visits",
    ],
    pearls: [
      "18-month-old with no words but good social pointing → hearing test before labeling autism.",
    ],
    pitfalls: [
      "Attributing preterm delay to 'they'll catch up' without corrected age assessment",
    ],
  },
  "pediatric-infections": {
    overview: "Common childhood exanthems, otitis, and serious bacterial infection.",
    summary:
      "OM: amoxicillin first-line; consider amoxicillin-clavulanate if recent antibiotics or purulent conjunctivitis (H flu). Streptococcal pharyngitis: penicillin to prevent rheumatic fever — not viral URI.\n\nRoseola: high fever then rash as fever breaks. Hand-foot-mouth: Coxsackie. EBV mono: atypical lymphocytes, avoid ampicillin rash.",
    keyConcepts: [
      "Epiglottitis: drooling, tripod — H flu type b decreased with vaccine; secure airway",
      "Bacterial tracheitis: toxic, purulent secretions — ICU",
      "Scarlet fever: sandpaper rash + strep pharyngitis",
      "Kawasaki: fever ≥5 days + mucocutaneous features — IVIG + aspirin",
      "Acute rheumatic fever: Jones criteria after GAS pharyngitis",
    ],
    mustKnowFacts: [
      "Ampicillin/amoxicillin causes rash in EBV mononucleosis — not true allergy necessarily",
    ],
    pearls: [
      "3 days high fever then macular rash as fever resolves in toddler → roseola (HHV-6).",
    ],
    pitfalls: [
      "Treating viral URI with antibiotics",
    ],
  },
  "congenital-heart-disease": {
    overview: "Cyanotic vs acyanotic lesions and ductal-dependent circulation.",
    summary:
      "Cyanotic: TOF, TGA, tricuspid atresia, truncus arteriosus, TAPVR, HLHS. Acyanotic left-to-right shunts: VSD, ASD, PDA — heart failure and pulmonary HTN over time.\n\nDuctal-dependent lesions (e.g., coarctation, HLHS, critical AS): prostaglandin E1 maintains PDA until surgery.",
    keyConcepts: [
      "TOF: boot-shaped heart, VSD, overriding aorta, PS, RVH",
      "TGA: parallel circulations — prostaglandin + balloon septostomy then arterial switch",
      "VSD holosystolic murmur; large defects → CHF in infancy",
      "Coarctation: BP arms > legs, rib notching, associated bicuspid aortic valve",
      "Hyperoxia test: PaO₂ <150 on 100% O₂ suggests cyanotic CHD",
    ],
    mustKnowFacts: [
      "Prostaglandin E1 can cause apnea — have resuscitation ready",
    ],
    pearls: [
      "Cyanotic newborn unresponsive to O₂ → prostaglandin while arranging echo.",
    ],
    pitfalls: [
      "Missing coarctation by checking BP only in one arm",
    ],
  },
  "vaccination-schedules": {
    overview: "ACIP childhood and adolescent immunization highlights.",
    summary:
      "Birth: HBV. 2, 4, 6 months: DTaP, IPV, Hib, PCV13, rotavirus. 12–15 months: MMR, varicella, HepA series start. 4–6 years: booster DTaP/IPV/MMR/varicella.\n\nAdolescents: Tdap, HPV series, meningococcal ACWY, meningococcal B shared decision.",
    keyConcepts: [
      "Live vaccines (MMR, varicella, LAIV) contraindicated in severe immunocompromise and pregnancy",
      "Pertussis cocooning — Tdap for caregivers of infants",
      "Catch-up schedules differ by age at first dose",
      "Influenza annually ≥6 months",
      "COVID-19 vaccines per current ACIP in pediatrics",
    ],
    mustKnowFacts: [
      "Give first MMR at 12 months — earlier may fail due to maternal antibody",
    ],
    pearls: [
      "Unvaccinated 4-year-old needs catch-up — refer to ACIP catch-up table.",
    ],
    pitfalls: [
      "Giving live vaccines to immunosuppressed child on high-dose steroids",
    ],
  },
  "child-abuse-red-flags": {
    overview: "Physical abuse, neglect, and mandatory reporting.",
    summary:
      "Bruises in non-ambulatory infant highly suspicious. Pattern injuries (belt, handprint), burns with clear immersion lines, retinal hemorrhages with subdural hematomas (shaken baby).\n\nNeglect: failure to thrive, dental caries, lack of immunizations. Sexual abuse: STI in prepubertal child, genital injury — forensic exam by trained team.",
    keyConcepts: [
      "TEN-4 rule: torso, ear, neck bruising in <4 years or any bruising in <4 months concerning",
      "Metaphyseal corner fractures (bucket handle) classic for inflicted injury",
      "Differentiate osteogenesis imperfecta, accidental bruising with appropriate history",
      "Mandatory reporting to CPS — document objectively",
      "Abusive head trauma: triad not pathognomonic alone — workup for mimics",
    ],
    mustKnowFacts: [
      "Physicians are mandated reporters — report suspicion, not proof",
    ],
    pearls: [
      "Non-mobile infant with bruise → abuse workup including skeletal survey.",
    ],
    pitfalls: [
      "Accepting inconsistent mechanism for serious injury without evaluation",
    ],
  },
  "prenatal-care": {
    overview: "First trimester dating, screening, and teratogen avoidance.",
    summary:
      "Confirm intrauterine pregnancy, dating US in first trimester. Routine labs: blood type/Rh, antibody screen, rubella immunity, HIV, syphilis, hepatitis B, UA culture, CBC.\n\nFolic acid 400–800 mcg preconception reduces NTD. Avoid ACEi, warfarin, valproate, isotretinoin in pregnancy.",
    keyConcepts: [
      "NIPT (cell-free DNA) screens trisomy 21, 18, 13 — not diagnostic",
      "Diagnostic testing: CVS (10–13 wk) or amniocentesis (≥15 wk)",
      "Quad screen second trimester — AFP low in Down, high in NTD",
      "Rh negative: RhoGAM at 28 weeks and after sensitizing events",
      "GBS culture 36–37 weeks guides intrapartum antibiotics",
    ],
    mustKnowFacts: [
      "LMP dating inaccurate with irregular cycles — first-trimester US best",
    ],
    pearls: [
      "Elevated maternal serum AFP → targeted US; consider amnio if NTD suspected.",
    ],
    pitfalls: [
      "Missing syphilis treatment in pregnancy — congenital syphilis preventable",
    ],
  },
  "labor-delivery": {
    overview: "Stages of labor, fetal monitoring, and delivery complications.",
    summary:
      "Stage 1: cervical change. Stage 2: pushing to delivery. Stage 3: placenta. Active labor: ≥6 cm with regular contractions.\n\nFHR categories: I normal, II indeterminate (recurrent decelerations need action), III abnormal (sinusoidal, absent variability with decelerations). Shoulder dystocia: McRoberts, suprapubic pressure.",
    keyConcepts: [
      "Late decelerations: uteroplacental insufficiency — reposition, O₂, IV fluids, delivery if persistent",
      "Variable decelerations: cord compression — amnioinfusion, position change",
      "Prolonged rupture of membranes increases infection risk",
      "Postpartum hemorrhage: uterine atony first cause — oxytocin, massage",
      "Umbilical cord prolapse — elevate presenting part, emergent cesarean",
    ],
    mustKnowFacts: [
      "Category III tracing → expeditious delivery often indicated",
    ],
    pearls: [
      "Repetitive late decelerations + minimal variability → uteroplacental insufficiency; prepare for delivery.",
    ],
    pitfalls: [
      "Using methylergonovine in hypertensive patient — causes severe vasoconstriction",
    ],
  },
  "gyn-cancers": {
    overview: "Cervical, endometrial, ovarian screening and workup.",
    summary:
      "Cervical cancer: HPV-driven; Pap/HPV co-testing 21–65; colposcopy for abnormal screening. Endometrial: postmenopausal bleeding — endometrial biopsy; obesity and unopposed estrogen risk.\n\nOvarian: no effective screening in average risk; CA-125 nonspecific; RMI and imaging guide surgery referral.",
    keyConcepts: [
      "Endometrial biopsy for postmenopausal bleeding — cancer until proven otherwise",
      "Cervical dysplasia CIN 2/3 — LEEP or excision",
      "BRCA carriers: enhanced ovarian/breast surveillance and risk-reducing surgery options",
      "Granulosa cell tumor: inhibin elevation",
      "Gestational trophoblastic disease: markedly elevated beta-hCG",
    ],
    mustKnowFacts: [
      "HPV vaccination prevents high-risk oncogenic strains — primary prevention",
    ],
    pearls: [
      "Postmenopausal spotting + endometrial stripe 12 mm on US → biopsy.",
    ],
    pitfalls: [
      "Using CA-125 to screen average-risk asymptomatic women for ovarian cancer",
    ],
  },
  "contraception": {
    overview: "Method selection by efficacy, medical eligibility, and patient preference.",
    summary:
      "LARC (IUD, implant) highest typical-use efficacy. Combined OCPs contraindicated with estrogen risks (VTE, migraine with aura, smoking >35). Progestin-only and IUDs safe in many contraindications to estrogen.\n\nEmergency contraception: levonorgestrel 1.5 mg or copper IUD most effective.",
    keyConcepts: [
      "US MEC categories guide safety (1–4)",
      "Copper IUD effective emergency contraception up to 5 days",
      "Depo medroxyprogesterone q12 weeks — bone density concern long-term",
      "Progestin-only pill timing critical (3-hour window)",
      "Sterilization options — vasectomy lower failure than tubal ligation",
    ],
    mustKnowFacts: [
      "Breastfeeding <6 weeks: estrogen-containing methods category 3/4",
    ],
    pearls: [
      "Patient with history DVT → avoid combined OCP; consider copper IUD or progestin-only.",
    ],
    pitfalls: [
      "Prescribing estrogen OCP in active smoker age 40",
    ],
  },
  "menstrual-disorders": {
    overview: "AUB, amenorrhea, dysmenorrhea, and PCOS overlap.",
    summary:
      "PALM-COEIN classifies abnormal uterine bleeding. Anovulatory bleeding common in adolescence and perimenopause. Primary amenorrhea: no menses by 15 with development or 13 without — evaluate anatomy, karyotype, hormones.\n\nSecondary amenorrhea: pregnancy test first; then TSH, prolactin, FSH, consider PCOS.",
    keyConcepts: [
      "Pregnancy always excluded first in reproductive-age amenorrhea",
      "Asherman syndrome: post-D&C scarring — hypomenorrhea/infertility",
      "Endometriosis: dysmenorrhea, dyspareunia, infertility — laparoscopy diagnostic",
      "Primary dysmenorrhea: prostaglandins — NSAIDs first line",
      "Mullerian agenesis (MRKH): absent uterus, normal ovaries — 46,XX",
    ],
    mustKnowFacts: [
      "Turner syndrome 45,X — streak gonads, short stature, primary amenorrhea",
    ],
    pearls: [
      "No period by 15 with breast development → progesterone challenge, FSH, karyotype workup.",
    ],
    pitfalls: [
      "Missing ectopic pregnancy in abnormal bleeding",
    ],
  },
  "depression-bipolar": {
    overview: "MDD diagnosis, SSRI first-line, and bipolar spectrum recognition.",
    summary:
      "MDD: ≥5 symptoms ≥2 weeks including depressed mood or anhedonia. SSRI/SNRI first-line mild-moderate; psychotherapy combination for moderate-severe. Monitor for activation/suicidality early in treatment.\n\nBipolar I: manic episode ≥7 days hospitalization often; Bipolar II: hypomania + depression. Mood stabilizer before antidepressant monotherapy.",
    keyConcepts: [
      "PHQ-9 screens depression severity",
      "Bipolar: decreased need for sleep during mania (not just insomnia)",
      "Lithium: narrow index, thyroid/renal monitoring",
      "Valproate teratogenic — avoid in pregnancy",
      "ECT for severe depression, catatonia, psychosis, pregnancy",
    ],
    mustKnowFacts: [
      "Antidepressant monotherapy can precipitate mania in undiagnosed bipolar disorder",
    ],
    pearls: [
      "Patient reports 'best sleep ever on 3 hours' during productive week → screen for hypomania before SSRI.",
    ],
    pitfalls: [
      "Missing bipolar history before starting SSRI for depression",
    ],
  },
  "schizophrenia-psychosis": {
    overview: "Positive/negative symptoms, first episode, and antipsychotic selection.",
    summary:
      "Schizophrenia: ≥2 Criterion A symptoms ≥1 month with functional decline ≥6 months total. First episode psychosis: rule out substance, medical, mood disorder with psychotic features.\n\nSecond-generation antipsychotics preferred for lower EPS; clozapine for treatment-resistant after 2 failed trials.",
    keyConcepts: [
      "Positive: hallucinations, delusions, disorganized speech",
      "Negative: flat affect, alogia, avolition — harder to treat",
      "Brief psychotic disorder <1 month; schizophreniform 1–6 months",
      "Clozapine: ANC monitoring weekly initially — agranulocytosis risk",
      "NMS: rigidity, fever, CK elevation after antipsychotic",
    ],
    mustKnowFacts: [
      "First episode psychosis warrants brain imaging and toxicology screen",
    ],
    pearls: [
      "Auditory command hallucinations + disorganized behavior → low threshold for admission and antipsychotic.",
    ],
    pitfalls: [
      "Attributing new psychosis to schizophrenia without excluding delirium and substances",
    ],
  },
  "anxiety-disorders": {
    overview: "GAD, panic disorder, and agoraphobia management.",
    summary:
      "GAD: excessive worry ≥6 months, difficulty controlling, somatic symptoms. First-line SSRI/SNRI or CBT. Panic disorder: recurrent unexpected panic attacks + concern about future attacks.\n\nBenzodiazepines short-term adjunct only — dependence risk. SSRIs may initially increase anxiety — counsel patient.",
    keyConcepts: [
      "Panic attack peaks within minutes — palpitations, sweating, fear of dying",
      "Agoraphobia: avoidance of situations due to escape concerns",
      "Social anxiety disorder: fear of scrutiny — SSRIs, CBT, exposure",
      "Rule out hyperthyroidism, pheochromocytoma, stimulant use",
      "Beta-blockers for performance-only social anxiety (propranolol)",
    ],
    mustKnowFacts: [
      "CBT as effective as medication for many anxiety disorders long-term",
    ],
    pearls: [
      "Recurrent ER visits for chest pain + normal cardiac workup → consider panic disorder.",
    ],
    pitfalls: [
      "Long-term benzodiazepine monotherapy — tolerance and withdrawal",
    ],
  },
  "substance-use-disorders": {
    overview: "Withdrawal syndromes, MAT, and intoxication management.",
    summary:
      "Alcohol withdrawal: tremor, autonomic hyperactivity — benzodiazepines (CIWA protocol); seizures and DTs risk days 2–4. Opioid withdrawal unpleasant but not life-threatening — buprenorphine/methadone MAT.\n\nBenzodiazepine withdrawal can cause seizures — taper slowly. Cocaine/amphetamine intoxication: benzodiazepines for agitation/HTN — avoid beta-blockers alone.",
    keyConcepts: [
      "Wernicke encephalopathy: thiamine before glucose in malnourished alcoholic",
      "Opioid overdose: naloxone — shorter half-life than many opioids; observe for re-sedation",
      "Disulfiram: aversive therapy — avoid if active drinking or cardiovascular disease",
      "Naltrexone for alcohol and opioid relapse prevention — not during active opioid use",
      "Cannabis hyperemesis: hot showers relieve — stop cannabis",
    ],
    mustKnowFacts: [
      "Alcohol withdrawal delirium mortality high without benzodiazepine treatment",
    ],
    pearls: [
      "Tremulous alcoholic day 2 with HTN → start benzodiazepine per CIWA; give thiamine.",
    ],
    pitfalls: [
      "Precipitating opioid withdrawal with buprenorphine before partial agonist timing understood",
    ],
  },
  "personality-disorders": {
    overview: "Cluster A/B/C patterns and borderline management.",
    summary:
      "Cluster A (odd): paranoid, schizoid, schizotypal. Cluster B (dramatic): antisocial, borderline, histrionic, narcissistic. Cluster C (anxious): avoidant, dependent, OCPD.\n\nBorderline PD: instability in relationships, self-image, affect; impulsivity, self-harm — DBT first-line; avoid splitting in care teams.",
    keyConcepts: [
      "Personality disorder: enduring pattern inflexible and pervasive",
      "Borderline: fear of abandonment, splitting, chronic emptiness",
      "Antisocial: conduct disorder before 15, disregard for rights",
      "OCPD vs OCD: ego-syntonic rigidity vs ego-dystonic obsessions",
      "No medication treats personality disorder core — treat comorbid mood/anxiety",
    ],
    mustKnowFacts: [
      "Diagnosis of personality disorders generally not before age 18",
    ],
    pearls: [
      "Repeated self-harm with interpersonal crisis and unstable relationships → DBT referral, not only PRN benzos.",
    ],
    pitfalls: [
      "Labeling borderline patient pejoratively instead of structured treatment plan",
    ],
  },
};
