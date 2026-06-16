import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

/** AANPCB Domain III — Plan (26.5% of FNP exam). */
export const AANP_PLAN_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Plan domain items (~36 scored items) test evidence-based pharmacologic and non-pharmacologic therapy, patient education, preventive interventions, referrals, and NP scope boundaries.",
        "First-line therapy per major guidelines (ACC/AHA, ADA, GOLD, IDSA, APA) is high yield. Contraindications tied to comorbidity (asthma + non-selective BB, pregnancy + ACEi) appear repeatedly.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "First-line vs step-up therapy by syndrome and comorbidity",
        "Non-pharmacologic foundation: lifestyle, vaccines, counseling, safety",
        "Referral triggers: surgical abdomen, unstable ACS, suicidal ideation with plan, complicated pregnancy",
        "Scope: what FNP can prescribe/monitor vs must co-manage with specialist",
        "Patient-centered counseling: shared decision-making, literacy, cost, adherence barriers",
        "Preventive plan: immunizations, cancer screening, contraception, STI prevention",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "HTN: thiazide-like, CCB, or ACEi/ARB first line; ACEi/ARB preferred with DM/CKD/HF; avoid ACEi/ARB in pregnancy",
        "T2DM: metformin first if eGFR ≥30; add SGLT2i/GLP-1 RA with ASCVD/HF/CKD; insulin when indicated",
        "Asthma: SABA PRN; ICS for persistent; step up per NAEPP; teach inhaler technique",
        "COPD exacerbation: SABA ± SAMA, systemic steroids, antibiotics if increased purulence; O₂ target 88–92%",
        "CAP outpatient: amoxicillin or doxy/macrolide (local resistance); comorbidities → respiratory FQ or beta-lactam + macrolide",
        "Depression: SSRI first line for most; activate/suicide reassessment 1–2 weeks; psychotherapy + meds for moderate-severe",
        "Contraception: match method to thrombotic risk, breastfeeding, adherence preference",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "When to refer vs manage in primary care",
          headers: ["Scenario", "Manage in PC", "Refer / ED"],
          rows: [
            ["Uncomplicated HTN", "Start monotherapy, lifestyle, follow-up", "Hypertensive emergency, secondary HTN workup if young/severe"],
            ["Stable angina", "Risk factor modification, meds", "STEMI, unstable angina, new HF"],
            ["Uncomplicated UTI", "Empiric abx per local guide", "Pyelonephritis, sepsis, pregnancy, male UTI"],
            ["Mild-moderate depression", "SSRI + counseling", "Suicidal plan, psychosis, bipolar suspicion"],
            ["Well-child vaccines", "Administer per schedule", "Anaphylaxis to prior dose — allergy referral"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "HTN monotherapy selection flowchart by comorbidity (DM, CKD, HF, pregnancy)",
        "Asthma step therapy diagram (Steps 1–6)",
        "Depression treatment ladder: PHQ-9 severity → watchful waiting vs SSRI vs combo therapy",
        "Contraception effectiveness vs eligibility (USPSTF / CDC medical eligibility)",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "New antibiotic for every URI — most are viral; educate on symptomatic care",
        "Beta-blocker first line for HTN in asthma — prefer CCB or thiazide",
        "Skip pregnancy test before teratogenic prescribing",
        "Benzodiazepines first line for depression — SSRIs are first line unless contraindicated",
        "Discharge febrile neonate on oral antibiotics without full evaluation",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Plan items often pair correct drug class with wrong patient (pregnancy, asthma, eGFR)",
        "Always check renal/hepatic function, allergies, and drug interactions before selecting therapy",
        "Include patient education and follow-up interval in the 'best plan' answer",
        "Vaccines are Plan domain — know catch-up schedules and contraindications (live vaccines in immunocompromised)",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Plan = 26.5% — first-line therapy, counseling, prevention, referrals",
        "Guidelines drive answers: ACC/AHA, ADA, GOLD, IDSA, APA",
        "Match treatment to comorbidity and lifespan (peds dosing, geriatric Beers)",
        "Scope and safety: when to escalate to ED/specialist",
        "Non-pharmacologic + follow-up are part of a complete plan",
      ],
    },
  ],
};
