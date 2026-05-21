/**
 * Canonical subjects — each maps to OER domains and exam-focus hints for research.
 */
export type StudyField = {
  id: string;
  label: string;
  category: "k12" | "undergraduate" | "professional" | "stem" | "humanities";
  oerDomains: string[];
  examFocus: string;
  topicPlaceholder: string;
};

export const STUDY_FIELDS: StudyField[] = [
  {
    id: "medicine",
    label: "Medicine",
    category: "professional",
    oerDomains: ["openstax.org", "med.libretexts.org", "nih.gov", "ncbi.nlm.nih.gov"],
    examFocus: "clinical reasoning, anatomy, physiology, pathophysiology, diagnostics, board-style vignettes",
    topicPlaceholder: "Use subject area selector below",
  },
  {
    id: "nursing",
    label: "Nursing",
    category: "professional",
    oerDomains: ["openstax.org", "med.libretexts.org", "nih.gov", "cdc.gov"],
    examFocus: "NCLEX-style prioritization, safety, pharmacology, patient care, evidence-based practice",
    topicPlaceholder: "e.g. Pharmacology — insulin administration",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    category: "professional",
    oerDomains: ["chem.libretexts.org", "med.libretexts.org", "nih.gov", "ncbi.nlm.nih.gov"],
    examFocus: "mechanism of action, interactions, dosing, ADME, therapeutic classes, patient counseling",
    topicPlaceholder: "e.g. Antibiotics — beta-lactams",
  },
  {
    id: "engineering",
    label: "Engineering",
    category: "professional",
    oerDomains: ["openstax.org", "eng.libretexts.org", "wikibooks.org"],
    examFocus: "problem-solving, units, formulas, design constraints, FE-style fundamentals",
    topicPlaceholder: "e.g. Statics — free body diagrams",
  },
  {
    id: "law",
    label: "Law",
    category: "professional",
    oerDomains: ["wikibooks.org", "law.cornell.edu", "oyez.org"],
    examFocus: "issue spotting, rules, elements, landmark cases, IRAC application",
    topicPlaceholder: "e.g. Torts — negligence elements",
  },
  {
    id: "business",
    label: "Business",
    category: "undergraduate",
    oerDomains: ["openstax.org", "biz.libretexts.org", "wikibooks.org"],
    examFocus: "frameworks, financial ratios, strategy, ethics, case analysis",
    topicPlaceholder: "e.g. Financial accounting — balance sheet",
  },
  {
    id: "mathematics",
    label: "Mathematics",
    category: "stem",
    oerDomains: ["openstax.org", "math.libretexts.org", "wikibooks.org"],
    examFocus: "definitions, proofs intuition, computation, common mistake patterns",
    topicPlaceholder: "e.g. Calculus — derivatives, Algebra — quadratics",
  },
  {
    id: "biology",
    label: "Biology",
    category: "stem",
    oerDomains: ["openstax.org", "bio.libretexts.org", "wikibooks.org"],
    examFocus: "processes, structures, labs, evolution, molecular biology, AP/college intro",
    topicPlaceholder: "e.g. Cell biology — mitosis",
  },
  {
    id: "chemistry",
    label: "Chemistry",
    category: "stem",
    oerDomains: ["openstax.org", "chem.libretexts.org", "wikibooks.org"],
    examFocus: "stoichiometry, reactions, periodic trends, lab safety, nomenclature",
    topicPlaceholder: "e.g. Stoichiometry — limiting reagent",
  },
  {
    id: "physics",
    label: "Physics",
    category: "stem",
    oerDomains: ["openstax.org", "phys.libretexts.org", "wikibooks.org"],
    examFocus: "kinematics, forces, energy, circuits, problem setup and units",
    topicPlaceholder: "e.g. Kinematics — projectile motion",
  },
  {
    id: "history",
    label: "History",
    category: "humanities",
    oerDomains: ["openstax.org", "wikibooks.org", "wikiversity.org"],
    examFocus: "causation, chronology, primary source context, comparison, historiography",
    topicPlaceholder: "e.g. World War II — causes",
  },
  {
    id: "psychology",
    label: "Psychology",
    category: "undergraduate",
    oerDomains: ["openstax.org", "socialsci.libretexts.org", "wikibooks.org"],
    examFocus: "theories, experiments, disorders, research methods, terminology",
    topicPlaceholder: "e.g. Learning — classical conditioning",
  },
  {
    id: "computer-science",
    label: "Computer Science",
    category: "stem",
    oerDomains: ["openstax.org", "wikibooks.org", "eng.libretexts.org"],
    examFocus: "algorithms, complexity, data structures, systems, tracing code",
    topicPlaceholder: "e.g. Sorting — merge sort complexity",
  },
  {
    id: "middle-school",
    label: "Middle School",
    category: "k12",
    oerDomains: ["openstax.org", "wikibooks.org", "ck12.org"],
    examFocus: "pre-algebra, life/earth science intro, reading comprehension, civics basics",
    topicPlaceholder: "e.g. Fractions — adding unlike denominators",
  },
  {
    id: "high-school",
    label: "High School",
    category: "k12",
    oerDomains: ["openstax.org", "wikibooks.org", "ck12.org"],
    examFocus: "AP/HS standards, SAT-style reasoning, lab concepts, essay evidence",
    topicPlaceholder: "e.g. AP Biology — photosynthesis",
  },
];

export const FIELD_LABELS = STUDY_FIELDS.map((f) => f.label);

export function getFieldMeta(label: string): StudyField | undefined {
  return STUDY_FIELDS.find(
    (f) => f.label.toLowerCase() === label.toLowerCase()
  );
}
