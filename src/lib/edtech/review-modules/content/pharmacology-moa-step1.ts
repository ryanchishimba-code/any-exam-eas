import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const PHARMACOLOGY_MOA_STEP1_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Pharmacology (~16% of Step 1) links drug class to physiologic outcome. Items test receptor level (agonist/antagonist), organ-specific autonomic effects, PK interactions, and antidote pairing.",
        "The autonomic table and CYP interaction patterns account for a disproportionate share of high-yield questions.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Agonist efficacy (Emax) vs potency (EC50); competitive antagonist shifts curve right; noncompetitive lowers Emax",
        "First-order elimination: constant fraction per time; steady state ~4–5 half-lives",
        "Zero-order: fixed amount eliminated (phenytoin, ethanol, aspirin overdose)",
        "CYP inducers (rifampin, carbamazepine, phenytoin) ↓ levels of substrates; inhibitors (azoles, macrolides) ↑ levels",
        "Muscarinic: SLUD + bronchoconstriction; Nicotinic NMJ: fasciculations; Alpha-1: vasoconstriction; Beta-1: ↑HR/contractility; Beta-2: bronchodilation",
        "Organophosphate: irreversible AChE inhibition → atropine (muscarinic) + pralidoxime (nicotinic, early)",
        "Partial agonist (buprenorphine) can block full agonist at same receptor",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Methotrexate toxicity → leucovorin rescue",
        "Warfarin start → bridge with heparin (protein C short half-life hypercoagulable window)",
        "Beta-blocker in cocaine toxicity worsens unopposed alpha vasoconstriction → benzodiazepines first",
        "Erythromycin + simvastatin → rhabdomyolysis via CYP3A4 inhibition",
        "Pheochromocytoma: alpha blockade before beta blockade",
      ],
    },
    {
      id: "comparisons",
      title: T.comparisons,
      tables: [
        {
          caption: "Agonist classes at a glance",
          headers: ["Class", "Efficacy", "Exam clue"],
          rows: [
            ["Full agonist", "Maximal", "Can be displaced by competitive antagonist"],
            ["Partial agonist", "Submaximal", "Acts as antagonist in presence of full agonist"],
            ["Inverse agonist", "Below basal", "Reduces constitutive receptor activity"],
          ],
        },
      ],
    },
    {
      id: "visual-aids",
      title: T["visual-aids"],
      bullets: [
        "Dose-response: parallel right shift = competitive antagonism; downshift = noncompetitive",
        "Therapeutic index = TD50/ED50 — narrow index drugs need monitoring",
        "Loading dose ≈ Css × Vd; maintenance ≈ Css × CL",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Partial agonists are not antagonists — they have submaximal efficacy",
        "Loading dose depends on Vd; maintenance dose depends on clearance",
        "All beta-blockers are not equal — propranolol non-selective vs metoprolol beta-1 selective",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Atropine before pralidoxime in organophosphate poisoning — drying secretions first",
        "Naloxone short half-life — monitor for re-sedation after opioid reversal",
        "Clopidogrel requires CYP2C6 activation — PPIs may reduce effect (clinical debate on significance)",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: [
        "Receptor + organ = side effect prediction",
        "Draw dose-response for antagonist type questions",
        "PK interactions: inducers, inhibitors, narrow therapeutic index drugs",
      ],
    },
  ],
};
