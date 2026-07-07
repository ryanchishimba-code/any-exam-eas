import { defineExamTopics } from "./topic-factory";

/** Extended NAPLEX high-yield cards — fills blueprint gaps beyond core 16 topics. */
export const NAPLEX_EXTENDED_TOPICS = defineExamTopics("naplex", [
  {
    slug: "pharmacokinetics-pk-pd",
    category: "Foundations",
    title: "Pharmacokinetics & Pharmacodynamics",
    overview:
      "Master half-life, bioavailability, first-pass effect, protein binding, and receptor concepts tested on every NAPLEX.",
    summary:
      "Pharmacokinetics (what the body does to the drug) and pharmacodynamics (what the drug does to the body) underpin dosing decisions. Absorption varies by route: IV = 100% bioavailability; oral drugs may undergo first-pass hepatic metabolism (propranolol, morphine). Distribution depends on volume of distribution (Vd) and protein binding — highly bound drugs (phenytoin, warfarin) have less free fraction when albumin falls.\n\nHalf-life (t½) determines time to steady state (~5 half-lives) and time to elimination (~5 half-lives after last dose). Loading doses achieve target concentration quickly: Loading dose = Vd × Cp(target). Maintenance dose = Cl × Cp(steady state). Clearance (Cl) integrates hepatic and renal elimination.\n\nPharmacodynamics includes receptor theory: full agonists (morphine), partial agonists (buprenorphine), antagonists (naloxone), and inverse agonists. Efficacy is maximal effect; potency is dose required. Competitive antagonism is reversible (shift dose-response right); non-competitive is not overcome by more agonist. Therapeutic index = TD50/ED50 — narrow index drugs (lithium, digoxin, phenytoin, warfarin) need monitoring.",
    keyConcepts: [
      "Steady state reached in ~5 half-lives of consistent dosing",
      "Loading dose = Vd × target concentration; maintenance = Cl × Css",
      "First-pass metabolism reduces oral bioavailability (propranolol, nitroglycerin SL bypasses it)",
      "Highly protein-bound drugs: displacement interactions increase free fraction (warfarin + sulfonamides)",
      "Zero-order kinetics: fixed amount eliminated per time — phenytoin, ethanol, aspirin at high doses",
      "First-order kinetics: constant fraction eliminated — most drugs at therapeutic doses",
      "CYP450 inducers (rifampin) ↓ levels of substrates; inhibitors (azole antifungals) ↑ levels",
      "Narrow therapeutic index: lithium, digoxin, phenytoin, warfarin, theophylline, aminoglycosides",
    ],
    mustKnowFacts: [
      "A drug with t½ of 24 hours reaches steady state in ~5 days of daily dosing",
      "Active metabolites (codeine → morphine via CYP2D6) can cause variable response — pharmacogenomics matter",
    ],
    pearls: [
      "Lipophilic drugs have large Vd and long half-lives — digoxin distributes to muscle; loading takes time.",
      "Renal failure affects both elimination and protein binding — free drug levels may rise disproportionately.",
    ],
    pitfalls: [
      "Expecting immediate steady-state levels after starting a drug with long half-life without loading dose",
      "Ignoring active metabolites when switching routes (e.g., fentanyl patch to IV)",
    ],
    practiceTopicSlug: "pharmacokinetics",
  },
  {
    slug: "dyslipidemia-statins",
    category: "Drug Classes",
    title: "Dyslipidemia & Statin Therapy",
    overview:
      "Apply ACC/AHA lipid guidelines, statin intensity, ezetimibe/PCSK9i add-ons, and myopathy management.",
    summary:
      "Statin therapy is first-line for ASCVD risk reduction per ACC/AHA guidelines. High-intensity statins (atorvastatin 40–80 mg, rosuvastatin 20–40 mg) lower LDL ≥50%; moderate-intensity lower 30–49%. Indications include clinical ASCVD, LDL ≥190, diabetes age 40–75, or elevated 10-year risk.\n\nStatin ADRs: myopathy (CK elevation), rhabdomyolysis (rare), hepatotoxicity (transaminase monitoring), new-onset diabetes (small risk). CYP3A4 inhibitors (azole antifungals, macrolides, grapefruit) increase simvastatin and lovastatin levels — prefer pravastatin or rosuvastatin with interacting drugs. Ezetimibe adds ~18% LDL reduction; PCSK9 inhibitors (evolocumab, alirocumab) for refractory hypercholesterolemia or statin intolerance.\n\nCounseling: take most statins at bedtime if short half-life (simvastatin); atorvastatin/rosuvastatin any time. Report unexplained muscle pain. Avoid in pregnancy. Fibrates + statin increase myopathy — gemfibrozil worst offender; fenofibrate safer combination.",
    keyConcepts: [
      "High-intensity: atorvastatin 40–80, rosuvastatin 20–40 mg",
      "Moderate-intensity: atorvastatin 10–20, rosuvastatin 5–10, simvastatin 20–40 mg",
      "Statin + gemfibrozil: avoid — rhabdomyolysis risk; fenofibrate preferred if combo needed",
      "Simvastatin 80 mg: limited use due to myopathy; avoid with strong CYP3A4 inhibitors",
      "Ezetimibe: inhibits NPC1L1 intestinal absorption; add to statin for additional LDL lowering",
      "PCSK9i: subcutaneous injection q2–4 weeks; LDL reduction ~60% on top of statin",
      "Icosapent ethyl (Vascepa): reduces CV events in hypertriglyceridemia on statin",
      "Bile acid sequestrants (cholestyramine): bind in gut; separate from other drugs by 4 hours",
    ],
    mustKnowFacts: [
      "Pregnancy category X for statins — discontinue before conception; counsel reproductive-age women",
      "Check CK if patient reports muscle pain on statin; hold if CK >10× ULN with symptoms",
    ],
    pearls: [
      "Rosuvastatin and pravastatin have fewer CYP3A4 interactions — preferred with azole antifungals or macrolides.",
      "ASCVD risk calculator drives statin initiation in primary prevention — know diabetes and LDL ≥190 as automatic indications.",
    ],
    pitfalls: [
      "Continuing simvastatin 80 mg with clarithromycin — high rhabdomyolysis risk",
      "Prescribing statins in active liver disease with transaminases >3× ULN",
    ],
    practiceTopicSlug: "cardiovascular-rx",
  },
  {
    slug: "oncology-supportive-care",
    category: "Drug Classes",
    title: "Oncology Supportive Care & Chemo Toxicities",
    overview:
      "Manage chemo-induced nausea, neutropenia, cardiotoxicity, and high-alert oral oncolytics safely.",
    summary:
      "Oncology supportive care prevents treatment-limiting toxicities. Chemotherapy-induced nausea/vomiting (CINV): highly emetogenic regimens (cisplatin) require NK1 antagonist (aprepitant/fosaprepitant) + 5-HT3 antagonist (ondansetron) + dexamethasone; moderately emetogenic regimens need 5-HT3 + dexamethasone. Delayed CINV (days 2–5) managed with dexamethasone and aprepitant.\n\nFebrile neutropenia: ANC <500 + fever ≥38.3°C — medical emergency; empiric broad-spectrum antibiotics within 1 hour. G-CSF (filgrastim, pegfilgrastim) for primary/secondary prophylaxis when febrile neutropenia risk >20%. Anthracyclines (doxorubicin) cause cumulative dose-dependent cardiotoxicity — monitor EF; dexrazoxane for protection at high cumulative doses.\n\nOral oncolytics (capecitabine, temozolomide, imatinib) are high-alert — verify dose, cycle, and food interactions (capecitabine with food; temozolomide empty stomach). Methotrexate for oncology uses high-dose with leucovorin rescue — distinguish from weekly RA dosing. Hazardous drug handling per USP <800>.",
    keyConcepts: [
      "Highly emetogenic chemo: NK1 + 5-HT3 + dexamethasone (triple therapy)",
      "Febrile neutropenia: ANC <500 + fever — empiric antibiotics STAT",
      "G-CSF prophylaxis when FN risk >20% per regimen",
      "Anthracycline cardiotoxicity: cumulative lifetime dose limits (doxorubicin ~450–550 mg/m²)",
      "Capecitabine: hand-foot syndrome, diarrhea; take with food; DPD deficiency → severe toxicity",
      "Imatinib: CYP3A4 substrate; fluid retention; take with food and water",
      "High-dose methotrexate requires leucovorin rescue per protocol — NOT weekly RA dosing",
      "Tumor lysis syndrome: allopurinol or rasburicase prophylaxis in high-risk patients",
    ],
    mustKnowFacts: [
      "Oral oncolytics require REMS or special verification at some institutions — double-check dose and cycle day",
      "Weekly low-dose methotrexate for RA must NEVER be dispensed with daily dosing instructions",
    ],
    pearls: [
      "Ondansetron QT prolongation risk at high IV doses — use lowest effective dose.",
      "Pegfilgrastim is once-per-cycle (not daily like filgrastim) — attach to chemo day per protocol.",
    ],
    pitfalls: [
      "Single-agent ondansetron for cisplatin without NK1 and steroid — inadequate CINV control",
      "Dispensing capecitabine without counseling on hand-foot syndrome and diarrhea management",
    ],
    practiceTopicSlug: "oncology-rx",
  },
  {
    slug: "seizure-epilepsy",
    category: "Drug Classes",
    title: "Seizure Disorders & Antiepileptic Drugs",
    overview:
      "Select first-line AEDs by seizure type, manage drug interactions, and counsel on teratogenicity and levels.",
    summary:
      "Antiepileptic drug (AED) selection depends on seizure type. Focal (partial) seizures: lamotrigine, levetiracetam, carbamazepine, oxcarbazepine. Generalized tonic-clonic: valproate, lamotrigine, levetiracetam. Absence seizures: ethosuximide (first-line), valproate. Avoid carbamazepine/phenytoin/phenobarbital for absence — may worsen.\n\nAED interactions: enzyme inducers (carbamazepine, phenytoin, phenobarbital, topiramate at high dose) reduce OCP, warfarin, and DOAC levels. Valproate inhibits metabolism — raises lamotrigine levels (must titrate lamotrigine slowly). Levetiracetam has minimal interactions — preferred in polypharmacy.\n\nTeratogenicity: valproate highest risk (neural tube defects, cognitive impairment) — avoid in women of childbearing potential if possible; lamotrigine and levetiracetam have better pregnancy profiles. Sudden AED withdrawal precipitates status epilepticus — taper gradually. Status epilepticus: benzodiazepine (lorazepam IV) → fosphenytoin/valproate → refractory ICU protocol.",
    keyConcepts: [
      "Focal seizures: lamotrigine, levetiracetam, carbamazepine first-line",
      "Absence: ethosuximide first-line; avoid carbamazepine/phenytoin",
      "Valproate: broad spectrum but teratogenic — folic acid, avoid if pregnancy possible",
      "Carbamazepine: HLA-B*1502 screening in at-risk ancestry; hyponatremia; auto-induction",
      "Lamotrigine: titrate slowly (SJS risk); valproate doubles lamotrigine levels",
      "Levetiracetam: renal dosing; behavioral side effects; minimal interactions",
      "Phenytoin: zero-order kinetics; monitor free level in hypoalbuminemia",
      "Enzyme-inducing AEDs reduce OCP efficacy — backup contraception required",
    ],
    mustKnowFacts: [
      "Never abruptly discontinue AEDs — taper over weeks to months to prevent breakthrough seizures",
      "Valproate is among the most teratogenic AEDs — use lowest effective alternative in pregnancy",
    ],
    pearls: [
      "Levetiracetam is often preferred in elderly and polypharmacy due to minimal CYP interactions.",
      "Carbamazepine levels fall 2–4 weeks after initiation due to auto-induction — may need dose increase.",
    ],
    pitfalls: [
      "Using carbamazepine for absence seizures — worsens seizure control",
      "Starting lamotrigine at full dose with concurrent valproate — SJS/TEN risk",
    ],
    practiceTopicSlug: "cns-rx",
  },
  {
    slug: "thyroid-pharmacotherapy",
    category: "Drug Classes",
    title: "Thyroid Pharmacotherapy",
    overview:
      "Manage hypothyroidism, hyperthyroidism, and thyroid storm with correct levothyroxine counseling and antithyroid drugs.",
    summary:
      "Hypothyroidism: levothyroxine (T4) is replacement of choice — take on empty stomach 30–60 min before breakfast, separate from calcium, iron, PPIs, and coffee by 4 hours. Dose by weight (~1.6 mcg/kg/day); reduce in elderly and cardiac disease. Monitor TSH q6–8 weeks after dose change; target TSH 0.5–4.5 mIU/L (pregnancy first trimester <2.5).\n\nHyperthyroidism: methimazole (preferred except first trimester pregnancy) or propylthiouracil (PTU — first trimester only due to methimazole teratogenicity). Beta-blocker (propranolol) for symptomatic relief. Thyroid storm: PTU + iodide + beta-blocker + corticosteroids + supportive care.\n\nDrug interactions: levothyroxine absorption reduced by calcium, iron, sucralfate, bile acid sequestrants, PPIs — separate administration. Amiodarone causes both hypo- and hyperthyroidism. Lithium causes hypothyroidism — monitor TSH.",
    keyConcepts: [
      "Levothyroxine: empty stomach; separate from Ca, Fe, PPI by 4 hours",
      "TSH monitoring: q6–8 weeks after dose change; q6–12 months when stable",
      "Methimazole: preferred antithyroid except first trimester pregnancy",
      "PTU: first trimester pregnancy; hepatotoxicity risk — use methimazole after first trimester",
      "Thyroid storm: PTU + potassium iodide + propranolol + hydrocortisone",
      "Amiodarone: iodine load → hypo or hyperthyroidism; monitor TSH baseline and q6 months",
      "Subclinical hypothyroidism: treat if TSH >10 or symptoms with TSH 4.5–10",
      "Pregnancy: increase levothyroxine dose ~30% early; target TSH <2.5 first trimester",
    ],
    mustKnowFacts: [
      "Levothyroxine brand/generic switching may alter TSH — recheck after any product change",
      "Methimazole associated with aplasia cutis and embryopathy — PTU preferred weeks 4–10 gestation",
    ],
    pearls: [
      "Bedtime levothyroxine may improve absorption in some patients — consistency matters more than timing.",
      "Beta-blocker alone treats hyperthyroid symptoms without changing thyroid hormone levels.",
    ],
    pitfalls: [
      "Counseling levothyroxine with breakfast calcium supplement — reduced absorption",
      "Using methimazole in first trimester without considering PTU — teratogenicity concern",
    ],
    practiceTopicSlug: "endocrine-rx",
  },
  {
    slug: "pain-opioid-management",
    category: "Safety",
    title: "Pain Management & Opioid Safety",
    overview:
      "Apply multimodal analgesia, opioid equianalgesic dosing, naloxone access, and REMS requirements.",
    summary:
      "Multimodal analgesia combines non-opioid agents (acetaminophen, NSAIDs, gabapentinoids, regional blocks) to minimize opioid exposure. WHO analgesic ladder: non-opioid → weak opioid → strong opioid as pain escalates. Opioid equianalgesic conversions require cross-tolerance reduction (25–50%) when rotating — incomplete cross-tolerance prevents overdose.\n\nMorphine milligram equivalents (MME) guide risk assessment: ≥50 MME/day increases overdose risk; ≥90 MME/day warrants careful justification. Naloxone co-prescribing recommended when MME ≥50 or other risk factors. REMS programs may apply to extended-release/long-acting opioids.\n\nOpioid ADRs: respiratory depression, constipation (prophylactic laxative), sedation, tolerance, physical dependence, hyperalgesia. Tramadol: serotonin syndrome risk with SSRIs; lowers seizure threshold. Meperidine: avoid (normeperidine neurotoxicity). Partial agonists (buprenorphine) precipitate withdrawal in opioid-dependent patients if given with full agonist on board — understand induction protocols.",
    keyConcepts: [
      "Equianalgesic: morphine 30 mg oral ≈ oxycodone 20 mg ≈ hydrocodone 30 mg ≈ hydromorphone 6 mg",
      "Rotate opioid: reduce calculated equianalgesic dose by 25–50% for cross-tolerance",
      "MME ≥50/day: increased overdose risk; naloxone co-prescribe",
      "Naloxone: 0.4–2 mg IN/IM; repeat q2–3 min; observe re-sedation with long-acting opioids",
      "Tramadol: SNRI + weak opioid; seizure risk; serotonin syndrome with serotonergic drugs",
      "Buprenorphine: partial agonist; can precipitate withdrawal if full agonist on board",
      "Opioid + benzodiazepine: FDA boxed warning — respiratory depression",
      "Constipation: prophylactic stimulant + osmotic laxative with chronic opioids",
    ],
    mustKnowFacts: [
      "Never crush extended-release opioids (morphine ER, OxyContin) — dose dumping and fatal overdose",
      "Methadone has complex pharmacokinetics and QT prolongation — not for PRN pain management",
    ],
    pearls: [
      "Acetaminophen + NSAID combination provides synergistic analgesia — maximize before escalating opioids.",
      "Gabapentinoids help neuropathic pain but cause sedation and require renal dose adjustment.",
    ],
    pitfalls: [
      "Converting to full equianalgesic dose when rotating opioids — overdose from incomplete cross-tolerance accounting",
      "Prescribing tramadol with SSRI without serotonin syndrome counseling",
    ],
    practiceTopicSlug: "cns-rx",
  },
  {
    slug: "pediatric-pharmacy",
    category: "Special Populations",
    title: "Pediatric Pharmacy Essentials",
    overview:
      "Apply weight-based dosing, age-appropriate formulations, and key pediatric safety rules.",
    summary:
      "Pediatric dosing is primarily weight-based (mg/kg/dose or mg/kg/day). Always verify whether the dose is per day or per dose and divide by frequency. Neonates and infants have immature hepatic and renal function — extend dosing intervals and use lower doses. Use mg/kg/day for antibiotics (amoxicillin 80–90 mg/kg/day for otitis) and acetaminophen (10–15 mg/kg q4–6h, max 75 mg/kg/day).\n\nFormulation selection matters: oral liquids for young children; avoid choking hazards. Reye's syndrome: never aspirin in children with viral illness — use acetaminophen or ibuprofen. Codeine contraindicated in children <12 and post-tonsillectomy (ultra-rapid CYP2D6 → fatal morphine toxicity). Honey contraindicated <12 months (botulism).\n\nImmunization schedules differ from adults — know primary series timing. Off-label use is common in pediatrics — rely on pediatric references (Harriet Lane, Lexicomp pediatric). Minimize excipients (benzyl alcohol, propylene glycol) in neonates.",
    keyConcepts: [
      "Always confirm mg/kg/day vs mg/kg/dose before calculating",
      "Acetaminophen: 10–15 mg/kg q4–6h; max 75 mg/kg/day (≤4 g/day absolute max)",
      "Ibuprofen: 5–10 mg/kg q6–8h; avoid <6 months without specialist guidance",
      "Amoxicillin otitis: 80–90 mg/kg/day divided BID (high-dose regimen)",
      "Aspirin: contraindicated in children with viral illness (Reye's syndrome)",
      "Codeine: contraindicated <12 years and post-tonsillectomy/adenoidectomy",
      "Neonatal dosing: reduced Cl and protein binding — longer intervals, lower doses",
      "Honey: avoid <12 months (infant botulism risk)",
    ],
    mustKnowFacts: [
      "Pediatric medication errors often involve decimal point placement — always verify calculated volume",
      "Growth and development affect pharmacokinetics — reassess doses with significant weight changes",
    ],
    pearls: [
      "Oral syringes (not household teaspoons) for liquid dosing — teach caregivers proper measurement.",
      "Palatability affects adherence — flavoring may be available for some suspensions.",
    ],
    pitfalls: [
      "Using adult fixed-dose tablets for children without weight-based verification",
      "Dispensing codeine-containing cough syrup to post-tonsillectomy pediatric patient",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  {
    slug: "hepatitis-liver-disease",
    category: "Drug Classes",
    title: "Hepatitis & Liver Disease Pharmacotherapy",
    overview:
      "Know HCV direct-acting antiviral regimens, HBV treatment, and cirrhosis medication cautions.",
    summary:
      "Hepatitis C: direct-acting antivirals (DAAs) cure >95% — sofosbuvir/velpatasvir (Epclusa) pangenotypic; glecaprevir/pibrentasvir (Mavyret) 8 weeks for treatment-naive non-cirrhotic. Check drug interactions (CYP3A4, P-gp) — amiodarone + sofosbuvir → bradycardia; rifampin contraindicated. HBV: tenofovir or entecavir for chronic suppression; not curative — do not stop without monitoring (flare risk).\n\nCirrhosis medication cautions: avoid NSAIDs (renal failure, GI bleed), dose-adjust sedatives, limit sodium in ascites, spironolactone + furosemide for ascites. Hepatic encephalopathy: lactulose ± rifaximin. Variceal bleed prophylaxis: non-selective beta-blocker (propranolol, nadolol) or endoscopic banding.\n\nAcetaminophen in liver disease: max 2 g/day in chronic liver disease; avoid in acute liver failure. Drug-induced liver injury (DILI): acetaminophen #1 cause; stop offending agent; NAC for acetaminophen toxicity.",
    keyConcepts: [
      "HCV cure: DAA regimens 8–12 weeks; check interactions before dispensing",
      "Sofosbuvir + amiodarone: severe bradycardia — avoid combination",
      "HBV: tenofovir or entecavir long-term; stopping causes flare — monitor ALT/HBV DNA",
      "Cirrhosis: no NSAIDs; lactulose for HE; beta-blocker for variceal prophylaxis",
      "Ascites: spironolactone 100 + furosemide 40 mg (100:40 ratio)",
      "Acetaminophen in cirrhosis: max 2 g/day",
      "Autoimmune hepatitis: prednisone ± azathioprine",
      "NASH: weight loss first-line; pioglitazone or GLP-1 agonist in select patients",
    ],
    mustKnowFacts: [
      "Never stop HBV antivirals abruptly without monitoring — hepatitis flare can be fatal",
      "HCV DAAs have extensive interaction profiles — always run interaction check with all medications",
    ],
    pearls: [
      "HCV screening is recommended for all adults at least once per CDC — pharmacist can facilitate testing.",
      "Rifaximin for HE reduces hospitalization — add to lactulose when recurrent admissions.",
    ],
    pitfalls: [
      "Missing sofosbuvir + amiodarone interaction — symptomatic bradycardia",
      "Recommending ibuprofen for pain in cirrhotic patient — precipitates renal failure and GI bleed",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "pharmacogenomics",
    category: "Foundations",
    title: "Pharmacogenomics High-Yield",
    overview:
      "Apply HLA-B*5701, CYP2D6, CYP2C19, and TPMT testing to prevent severe ADRs and optimize therapy.",
    summary:
      "Pharmacogenomics guides drug selection and dosing based on genetic variants. HLA-B*5701: screen before abacavir — hypersensitivity reaction in carriers; never rechallenge. HLA-B*1502: carbamazepine SJS/TEN risk in Southeast Asian ancestry — screen before starting. TPMT: thiopurine (azathioprine, 6-MP) dosing — poor metabolizers need dose reduction to avoid myelosuppression.\n\nCYP2D6: ultrarapid metabolizers convert codeine to morphine rapidly (toxicity in children); poor metabolizers get inadequate analgesia. Tamoxifen requires CYP2D6 to active metabolite — CYP2D6 inhibitors (paroxetine, fluoxetine) reduce efficacy. CYP2C19: poor metabolizers have higher PPI levels and may need dose adjustment; clopidogrel requires CYP2C19 activation — poor metabolizers have reduced antiplatelet effect (consider prasugrel/ticagrelor).\n\nDPD deficiency: capecitabine/5-FU severe toxicity — consider testing before fluoropyrimidines in high-risk populations. VKORC1/CYP2C9 guide warfarin starting dose. Pharmacogenomic testing is increasingly available — document results in patient profile.",
    keyConcepts: [
      "HLA-B*5701: mandatory before abacavir — positive = do not use",
      "HLA-B*1502: screen before carbamazepine in at-risk ancestry",
      "TPMT: poor metabolizers need ↓ azathioprine/6-MP dose",
      "CYP2D6 ultrarapid: codeine → rapid morphine → toxicity risk",
      "CYP2D6 poor: codeine ineffective; tamoxifen less effective if CYP2D6 inhibited",
      "CYP2C19 poor: clopidogrel reduced activation — consider alternative P2Y12 inhibitor",
      "DPD deficiency: capecitabine/5-FU severe or fatal toxicity",
      "VKORC1/CYP2C9: warfarin sensitivity genotypes need lower starting dose",
    ],
    mustKnowFacts: [
      "Abacavir rechallenge after hypersensitivity reaction is contraindicated regardless of HLA status — potentially fatal",
      "Paroxetine and fluoxetine are strong CYP2D6 inhibitors — avoid with tamoxifen",
    ],
    pearls: [
      "CPIC guidelines provide actionable dosing recommendations for many gene-drug pairs.",
      "CYP2C19 poor metabolizers may have enhanced PPI effect — consider dose reduction for long-term use.",
    ],
    pitfalls: [
      "Starting abacavir without HLA-B*5701 screening when protocol requires it",
      "Using clopidogrel in known CYP2C19 poor metabolizer post-PCI without considering prasugrel/ticagrelor",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "medication-safety-ismp",
    category: "Safety",
    title: "Medication Safety & ISMP High-Alert Drugs",
    overview:
      "Prevent LASA errors, high-alert medication mistakes, and apply ISMP safety recommendations.",
    summary:
      "The Institute for Safe Medication Practices (ISMP) identifies high-alert medications that cause significant harm when used in error: anticoagulants, insulin, opioids, chemotherapeutic agents, neuromuscular blockers, concentrated electrolytes, and others. Independent double-checks are required for these agents in most institutions.\n\nLook-alike/sound-alike (LASA) drug pairs cause frequent dispensing errors: hydroxyzine/hydralazine, clonidine/Klonopin, Celebrex/celecoxib vs Celexa/citalopram, prednisone/prednisolone. Tall-man lettering (hydrALAZINE vs hydrOXYzine) and separate storage reduce errors. Trailing zeros (1.0 mg) and missing leading zeros (.5 mg) cause 10-fold dosing errors — always use 0.5 mg format.\n\nBarcode scanning, smart pump libraries, and prescription verification (patient, drug, dose, route, time) are core safety processes. Error reporting is non-punitive and system-focused — near-miss reporting prevents patient harm. REMS programs (isotretinoin, clozapine, thalidomide) have mandatory dispensing requirements.",
    keyConcepts: [
      "ISMP high-alert: anticoagulants, insulin, opioids, chemo, KCl concentrate, neuromuscular blockers",
      "LASA pairs: use tall-man lettering and separate storage",
      "Never use trailing zero (1.0 mg) — use 1 mg; always use leading zero (0.5 mg not .5 mg)",
      "Independent double-check for insulin, heparin, chemo, pediatric doses",
      "Barcode scanning at dispensing and administration — verify patient and product",
      "Root cause analysis: system-focused, not blame-focused",
      "REMS: isotretinoin (iPLEDGE), clozapine (Clozapine REMS), thalidomide (REMS)",
      "Tall-man lettering examples: vinCRIStine vs vinBLAStine; DOBUTamine vs DOPamine",
    ],
    mustKnowFacts: [
      "Insulin U-100 vs U-500 confusion is a fatal error category — separate storage and explicit labeling",
      "Concentrated potassium chloride must never be dispensed to patient care units without dilution protocol",
    ],
    pearls: [
      "Smart infusion pumps with drug libraries hard-stop out-of-range doses — configure and maintain libraries.",
      "Prescription verification includes therapeutic duplication and drug-disease contraindications — not just drug-drug.",
    ],
    pitfalls: [
      "Dispensing methotrexate daily instead of weekly for RA — catastrophic dosing error",
      "Selecting look-alike drug from inventory without triple-checking label",
    ],
    practiceTopicSlug: "pharmacy-law",
  },
  {
    slug: "hipaa-pharmacy-ethics",
    category: "Professional Practice",
    title: "HIPAA, Ethics & Pharmacy Law Essentials",
    overview:
      "Apply HIPAA privacy rules, ethical principles, scope of practice, and error reporting obligations.",
    summary:
      "HIPAA protects patient health information (PHI). Minimum necessary standard: access only PHI needed for the task. Permitted disclosures: treatment, payment, healthcare operations, public health reporting, and patient authorization. Pharmacy staff must not discuss patient information in public areas or share with unauthorized persons. Breach notification required within 60 days if unsecured PHI is compromised.\n\nEthical principles: autonomy (informed consent), beneficence, nonmaleficence, justice. Pharmacist refuses to fill when: invalid prescription, doctor shopping, dosage exceeds standard, or legitimate medical purpose in doubt — document and contact prescriber. Corresponding responsibility applies to controlled substances — pharmacist shares legal duty for legitimacy.\n\nScope of practice varies by state — pharmacists may administer immunizations, perform MTM, prescribe hormonal contraception or naloxone in some states. Error reporting: internal incident report + state board notification for sentinel events per state law. Whistleblower protections exist for reporting unsafe conditions.",
    keyConcepts: [
      "HIPAA: minimum necessary PHI access; no discussion in public areas",
      "Permitted without authorization: treatment, payment, operations, public health",
      "Breach notification: within 60 days to HHS and affected individuals if ≥500 in one state",
      "Corresponding responsibility: pharmacist validates CS prescription legitimacy",
      "Refusal to fill: document reason, contact prescriber, do not abandon patient without alternatives",
      "Informed consent: risks, benefits, alternatives for procedures and research",
      "Good Samaritan laws: limited liability when providing emergency aid",
      "State-specific scope: immunizations, MTM, prescribing authority varies",
    ],
    mustKnowFacts: [
      "Sharing PHI on social media — even de-identified patient stories can violate HIPAA if identifiable",
      "Pharmacist must verify prescriber DEA number and address on controlled substance prescriptions",
    ],
    pearls: [
      "Privacy practices notice must be provided to patients and posted prominently.",
      "PDMP query is mandatory before dispensing opioids/CS in most states — document the check.",
    ],
    pitfalls: [
      "Discussing a patient's medications with a family member without patient authorization",
      "Dispensing a controlled substance prescription with obvious red flags without investigation",
    ],
    practiceTopicSlug: "pharmacy-law",
  },
  {
    slug: "pharmacy-management",
    category: "Management & Leadership",
    title: "Pharmacy Management & Operations",
    overview:
      "Understand inventory control, formulary management, reimbursement basics, and quality improvement.",
    summary:
      "Pharmacy operations require inventory management (par levels, turnover, ABC analysis), expiration date tracking, and drug shortage mitigation (therapeutic substitution per protocol, allocation). 340B program allows eligible entities discounted drug pricing with specific dispensing and recordkeeping rules.\n\nFormulary management balances clinical efficacy, safety, and cost. P&T committee evaluates new drugs, class reviews, and prior authorization criteria. Generic substitution is permitted unless prescriber marks DAW (dispense as written). Biosimilars are interchangeable per state law if FDA designated.\n\nReimbursement: AWP (legacy), WAC, NADAC pricing benchmarks. DIR fees (Medicare Part D) affect pharmacy reimbursement retroactively. MTM and immunization services generate clinical revenue. Quality metrics: medication error rate, turnaround time, patient satisfaction, adherence measures (PDC/MPR for star ratings).",
    keyConcepts: [
      "ABC inventory analysis: A items (high value, tight control), C items (low value, bulk)",
      "Drug shortage response: identify alternatives, communicate to staff, update EHR/pump libraries",
      "340B: eligible entity pricing; split billing and duplicate discount prohibition",
      "Formulary tiers: generic preferred, brand non-preferred, specialty tier",
      "DAW codes: 0 = substitution permitted, 1 = prescriber DAW brand, 2 = patient requested brand",
      "Biosimilar interchange: state-dependent; FDA interchangeability designation matters",
      "DIR fees: retroactive pharmacy performance adjustments on Part D claims",
      "Star ratings: PDC ≥80% for diabetes, statins, RAS antagonists drives plan quality metrics",
    ],
    mustKnowFacts: [
      "Expired drugs must be quarantined and disposed per EPA/state hazardous waste rules — never dispense",
      "Medicare Part B vs Part D billing depends on drug and setting — billing errors are compliance violations",
    ],
    pearls: [
      "Just-in-time inventory reduces waste but increases shortage vulnerability — balance par levels.",
      "MTM comprehensive medication reviews are billable for eligible Part D beneficiaries — document time and outcomes.",
    ],
    pitfalls: [
      "Automatic generic substitution when prescriber wrote DAW — legal and ethical violation in most states",
      "Ignoring drug shortage alerts until stock is zero — proactive communication prevents patient harm",
    ],
    practiceTopicSlug: "pharmacy-law",
  },
  {
    slug: "contraception-womens-health",
    category: "Treatment Planning",
    title: "Contraception & Women's Health",
    overview:
      "Select contraceptive methods by efficacy, contraindications, and drug interactions — including emergency contraception.",
    summary:
      "Contraceptive efficacy tiers: LARC (IUD, implant) > depot/injection > combined oral contraceptives/patch/ring > progestin-only pill > barrier methods. Combined hormonal contraceptives (CHC) contraindicated with estrogen risk: migraine with aura, history of VTE, smoking ≥35, uncontrolled HTN, breast cancer.\n\nDrug interactions: enzyme inducers (rifampin, carbamazepine, phenytoin, efavirenz, St. John's wort) reduce CHC efficacy — recommend backup or LARC/non-hormonal method. Antibiotics (except rifampin): traditional warning largely debunked for standard antibiotics but counsel on GI upset affecting absorption.\n\nEmergency contraception: levonorgestrel 1.5 mg OTC (Plan B) within 72 hours (effective up to 120h with declining efficacy); ulipristal (ella) prescription, more effective, requires prescription. Copper IUD most effective EC and provides ongoing contraception. Progestin-only pill (norethindrone): no estrogen contraindications; strict timing (3-hour window).\n\nMenopause/HRT: lowest dose for shortest duration for vasomotor symptoms; transdermal estrogen lower VTE risk than oral; add progestin if intact uterus. BPH: alpha-blockers (tamsulosin) first-line; 5-alpha reductase inhibitors (finasteride) shrink prostate over months.",
    keyConcepts: [
      "CHC contraindications: migraine with aura, VTE history, smoking ≥35, uncontrolled HTN",
      "LARC: IUD (copper or levonorgestrel) and etonogestrel implant — highest efficacy",
      "Enzyme inducers reduce CHC efficacy — backup or switch method",
      "Plan B (levonorgestrel 1.5 mg): OTC; within 72h best, up to 120h",
      "Ella (ulipristal): prescription EC; more effective than LNG; not for ongoing contraception",
      "Copper IUD: most effective EC; insert within 5 days of unprotected intercourse",
      "Progestin-only pill: 3-hour timing window; safe in breastfeeding and estrogen contraindications",
      "HRT: transdermal estrogen preferred for VTE risk; add progestin if uterus present",
    ],
    mustKnowFacts: [
      "Combined hormonal contraceptives are category contraindicated in migraine with aura — stroke risk",
      "Ella and progestin-only pills may interact — do not start POP within 5 days of ulipristal",
    ],
    pearls: [
      "Levonorgestrel IUD (Mirena, Kyleena) provides contraception 3–8 years depending on product.",
      "Pharmacist prescribing of hormonal contraception is legal in many states — know local protocol.",
    ],
    pitfalls: [
      "Continuing combined OCP in patient newly diagnosed with migraine with aura",
      "Counseling that rifampin does not affect contraception — major interaction",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  {
    slug: "cap-pneumonia-regimens",
    category: "Infectious Disease",
    title: "CAP & Pneumonia Pharmacotherapy",
    overview:
      "Select empiric CAP regimens by setting, severity, and comorbidities per IDSA/ATS guidelines.",
    summary:
      "Community-acquired pneumonia (CAP) empiric therapy depends on outpatient vs inpatient and comorbidities. Healthy outpatient: amoxicillin, doxycycline, or macrolide (if local resistance <25%). Outpatient with comorbidities (COPD, CHF, diabetes): amoxicillin-clavulanate + macrolide or respiratory fluoroquinolone (levofloxacin, moxifloxacin). Inpatient non-ICU: beta-lactam + macrolide OR respiratory FQ monotherapy. ICU: beta-lactam + macrolide OR beta-lactam + FQ; add MRSA coverage (vancomycin/linezolid) if risk factors; add pseudomonal coverage if structural lung disease.\n\nDuration: minimum 5 days; patient afebrile ≥48h and clinically stable before discontinuation. Macrolide resistance is rising — FQ or beta-lactam/macrolide combo preferred in areas with high resistance. Vaccination: PCV20 or PCV15+PPSV23 for adults ≥65 and high-risk groups.\n\nHealthcare-associated pneumonia (HCAP/HAP) requires broader coverage including MRSA and Pseudomonas until cultures return. Aspiration pneumonia: anaerobic coverage (amoxicillin-clavulanate, ampicillin-sulbactam) if putrid sputum or periodontal disease.",
    keyConcepts: [
      "Healthy outpatient CAP: amoxicillin, doxy, or macrolide (low resistance areas)",
      "Outpatient with comorbidities: amox-clav + macrolide OR respiratory FQ",
      "Inpatient non-ICU: beta-lactam + macrolide OR FQ monotherapy",
      "ICU CAP: beta-lactam + macrolide/FQ ± MRSA ± Pseudomonas if risk",
      "Minimum 5 days therapy; afebrile 48h + stable before stopping",
      "Respiratory FQ: levofloxacin 750 mg daily, moxifloxacin 400 mg daily",
      "MRSA CAP risk: prior MRSA, recent IV antibiotics, necrotizing/cavitary pneumonia",
      "Vaccination: PCV20 single dose for adults ≥65",
    ],
    mustKnowFacts: [
      "Macrolide monotherapy for CAP is inappropriate in areas with pneumococcal macrolide resistance >25%",
      "Fluoroquinolone monotherapy for CAP reserves FQ — stewardship concern but guideline-accepted in select cases",
    ],
    pearls: [
      "Procalcitonin can guide antibiotic duration in CAP — shorter courses when procalcitonin normalizes.",
      "Pneumococcal urine antigen detects Streptococcus pneumoniae — useful before culture results.",
    ],
    pitfalls: [
      "Discharging CAP patient on azithromycin alone in high-resistance region — treatment failure",
      "Missing MRSA coverage in ICU patient with necrotizing pneumonia and recent hospitalization",
    ],
    practiceTopicSlug: "infectious-disease-rx",
  },
]);
