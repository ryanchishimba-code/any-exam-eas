import { getFieldMeta } from "./fields";

export type FieldSubject = {
  id: string;
  label: string;
  /** Open textbook anchors for research */
  textbookRefs: string;
  examHints: string;
  keywords: string[];
  focusPlaceholder: string;
};

/** Subjects/topics per field — questions are scoped ONLY to the selected subject */
export const FIELD_SUBJECTS: Record<string, FieldSubject[]> = {
  mathematics: [
    {
      id: "calculus",
      label: "Calculus",
      textbookRefs: "OpenStax Calculus Volumes 1–3",
      examHints: "limits, derivatives, integrals, applications, series, multivariable basics",
      keywords: ["calculus", "derivative", "integral", "limit", "chain rule", "integration", "series"],
      focusPlaceholder: "e.g. Derivatives, u-substitution",
    },
    {
      id: "algebra",
      label: "Algebra",
      textbookRefs: "OpenStax Elementary Algebra, Intermediate Algebra",
      examHints: "equations, inequalities, polynomials, factoring, functions",
      keywords: ["algebra", "equation", "polynomial", "quadratic", "factor", "linear", "slope"],
      focusPlaceholder: "e.g. Quadratic equations, factoring",
    },
    {
      id: "geometry",
      label: "Geometry",
      textbookRefs: "OpenStax Geometry",
      examHints: "angles, triangles, circles, proofs, area, volume, coordinate geometry",
      keywords: ["geometry", "triangle", "circle", "angle", "pythagorean", "area", "volume"],
      focusPlaceholder: "e.g. Circle theorems, similar triangles",
    },
    {
      id: "trigonometry",
      label: "Trigonometry",
      textbookRefs: "OpenStax Algebra and Trigonometry",
      examHints: "unit circle, identities, sine, cosine, tangent, inverse trig",
      keywords: ["trigonometry", "sin", "cos", "tan", "identity", "unit circle", "radian"],
      focusPlaceholder: "e.g. Trig identities",
    },
    {
      id: "precalculus",
      label: "Precalculus",
      textbookRefs: "OpenStax Precalculus",
      examHints: "functions, graphs, sequences, conic sections, exponential/log intro",
      keywords: ["precalculus", "function", "sequence", "conic", "exponential", "logarithm"],
      focusPlaceholder: "e.g. Logarithmic functions",
    },
    {
      id: "statistics",
      label: "Statistics & Probability",
      textbookRefs: "OpenStax Introductory Statistics",
      examHints: "descriptive stats, probability, distributions, hypothesis testing, regression",
      keywords: ["statistics", "probability", "mean", "standard deviation", "hypothesis", "regression"],
      focusPlaceholder: "e.g. Normal distribution, t-tests",
    },
    {
      id: "linear-algebra",
      label: "Linear Algebra",
      textbookRefs: "OpenStax Linear Algebra",
      examHints: "vectors, matrices, determinants, eigenvalues, linear transformations",
      keywords: ["matrix", "vector", "eigenvalue", "determinant", "linear algebra"],
      focusPlaceholder: "e.g. Eigenvalues",
    },
  ],
  biology: [
    { id: "cell-biology", label: "Cell Biology", textbookRefs: "OpenStax Biology Ch. 4–6", examHints: "organelles, membrane, metabolism", keywords: ["cell", "mitochondria", "mitosis", "membrane"], focusPlaceholder: "e.g. Mitosis" },
    { id: "genetics", label: "Genetics", textbookRefs: "OpenStax Biology — Genetics", examHints: "Mendel, DNA, transcription, mutations", keywords: ["genetics", "DNA", "allele", "Mendel", "transcription"], focusPlaceholder: "e.g. Punnett squares" },
    { id: "evolution", label: "Evolution", textbookRefs: "OpenStax Biology — Evolution", examHints: "natural selection, speciation, phylogeny", keywords: ["evolution", "selection", "speciation", "phylogeny"], focusPlaceholder: "e.g. Natural selection" },
    { id: "ecology", label: "Ecology", textbookRefs: "OpenStax Biology — Ecology", examHints: "ecosystems, populations, biomes", keywords: ["ecology", "ecosystem", "population", "biome"], focusPlaceholder: "e.g. Food webs" },
    { id: "human-biology", label: "Human Biology", textbookRefs: "OpenStax A&P", examHints: "organ systems, homeostasis", keywords: ["physiology", "organ", "homeostasis"], focusPlaceholder: "e.g. Cardiovascular system" },
  ],
  chemistry: [
    { id: "general", label: "General Chemistry", textbookRefs: "OpenStax Chemistry", examHints: "stoichiometry, periodic table, bonding, gases", keywords: ["stoichiometry", "mole", "periodic", "bonding", "gas law"], focusPlaceholder: "e.g. Stoichiometry" },
    { id: "organic", label: "Organic Chemistry", textbookRefs: "OpenStax Organic Chemistry", examHints: "nomenclature, mechanisms, functional groups", keywords: ["organic", "alkane", "functional group", "SN1", "SN2"], focusPlaceholder: "e.g. Alkenes" },
    { id: "biochem", label: "Biochemistry", textbookRefs: "LibreTexts Biochemistry", examHints: "amino acids, enzymes, metabolism", keywords: ["amino acid", "enzyme", "glycolysis", "protein"], focusPlaceholder: "e.g. Enzyme kinetics" },
  ],
  physics: [
    { id: "mechanics", label: "Mechanics", textbookRefs: "OpenStax University Physics Vol 1", examHints: "kinematics, Newton's laws, energy, momentum", keywords: ["kinematics", "force", "newton", "momentum", "energy"], focusPlaceholder: "e.g. Projectile motion" },
    { id: "em", label: "Electricity & Magnetism", textbookRefs: "OpenStax University Physics Vol 2", examHints: "Coulomb, circuits, fields, induction", keywords: ["circuit", "voltage", "current", "magnetic", "electric field"], focusPlaceholder: "e.g. Ohm's law" },
    { id: "waves", label: "Waves & Optics", textbookRefs: "OpenStax Physics — Waves", examHints: "sound, light, interference, diffraction", keywords: ["wave", "frequency", "optics", "interference"], focusPlaceholder: "e.g. Doppler effect" },
    { id: "modern", label: "Modern Physics", textbookRefs: "OpenStax Modern Physics", examHints: "relativity intro, quantum, photoelectric", keywords: ["quantum", "relativity", "photon", "de broglie"], focusPlaceholder: "e.g. Photoelectric effect" },
  ],
  medicine: [
    { id: "anatomy", label: "Anatomy", textbookRefs: "OpenStax Anatomy & Physiology", examHints: "structures, relations, innervation", keywords: ["anatomy", "tissue", "nerve", "artery", "muscle"], focusPlaceholder: "e.g. Brachial plexus" },
    { id: "physiology", label: "Physiology", textbookRefs: "OpenStax A&P", examHints: "mechanisms, regulation, organ systems", keywords: ["physiology", "cardiac", "renal", "respiratory"], focusPlaceholder: "e.g. Cardiac cycle" },
    { id: "pathology", label: "Pathology", textbookRefs: "LibreTexts Pathology", examHints: "disease mechanisms, histology", keywords: ["pathology", "neoplasia", "inflammation"], focusPlaceholder: "e.g. Neoplasia" },
    { id: "pharmacology", label: "Pharmacology", textbookRefs: "OpenStax Pharmacology", examHints: "MOA, side effects, interactions", keywords: ["pharmacology", "drug", "receptor", "dose"], focusPlaceholder: "e.g. Beta-blockers" },
    { id: "biochemistry", label: "Biochemistry", textbookRefs: "LibreTexts Medical Biochemistry", examHints: "pathways, enzymes, deficiencies", keywords: ["biochemistry", "glycolysis", "amino acid"], focusPlaceholder: "e.g. Glycolysis" },
    { id: "microbiology", label: "Microbiology", textbookRefs: "OpenStax Microbiology", examHints: "organisms, virulence, immunity", keywords: ["microbiology", "bacteria", "virus", "immune"], focusPlaceholder: "e.g. Gram stain" },
  ],
  nursing: [
    { id: "fundamentals", label: "Nursing Fundamentals", textbookRefs: "Open RN Nursing Fundamentals", examHints: "safety, assessment, care plans", keywords: ["nursing", "assessment", "safety", "care plan"], focusPlaceholder: "e.g. Vital signs" },
    { id: "pharmacology", label: "Pharmacology for Nurses", textbookRefs: "Open RN Pharmacology", examHints: "medication rights, adverse effects", keywords: ["medication", "dose", "nursing", "pharmacology"], focusPlaceholder: "e.g. Insulin" },
    { id: "med-surg", label: "Medical-Surgical", textbookRefs: "Open RN Medical-Surgical", examHints: "post-op, chronic disease, prioritization", keywords: ["medical-surgical", "postoperative", "priority"], focusPlaceholder: "e.g. Heart failure" },
  ],
  pharmacy: [
    { id: "pharmaceutics", label: "Pharmaceutics", textbookRefs: "LibreTexts Pharmaceutics", examHints: "dosage forms, delivery", keywords: ["dosage form", "tablet", "bioavailability"], focusPlaceholder: "e.g. Tablets" },
    { id: "pharmacology", label: "Pharmacology", textbookRefs: "OpenStax Pharmacology", examHints: "MOA, ADME, interactions", keywords: ["pharmacology", "MOA", "interaction", "ADME"], focusPlaceholder: "e.g. Antibiotics" },
  ],
  engineering: [
    { id: "statics", label: "Statics", textbookRefs: "OpenStax University Physics / Engineering Statics", examHints: "free body diagrams, equilibrium", keywords: ["statics", "equilibrium", "force", "moment"], focusPlaceholder: "e.g. Trusses" },
    { id: "dynamics", label: "Dynamics", textbookRefs: "Engineering Mechanics", examHints: "kinematics of particles, kinetics", keywords: ["dynamics", "acceleration", "kinetics"], focusPlaceholder: "e.g. Rotation" },
    { id: "circuits", label: "Circuits", textbookRefs: "OpenStax Circuits", examHints: "Ohm, Kirchhoff, AC/DC", keywords: ["circuit", "resistor", "voltage", "current"], focusPlaceholder: "e.g. Kirchhoff" },
  ],
  law: [
    { id: "contracts", label: "Contracts", textbookRefs: "Open Textbooks — Contracts", examHints: "offer, acceptance, consideration, breach", keywords: ["contract", "offer", "consideration", "breach"], focusPlaceholder: "e.g. Consideration" },
    { id: "torts", label: "Torts", textbookRefs: "CALI / open torts materials", examHints: "negligence, strict liability, damages", keywords: ["tort", "negligence", "duty", "damages"], focusPlaceholder: "e.g. Negligence elements" },
    { id: "constitutional", label: "Constitutional Law", textbookRefs: "Cornell LII / open con law", examHints: "rights, scrutiny, federalism", keywords: ["constitutional", "amendment", "due process"], focusPlaceholder: "e.g. First Amendment" },
  ],
  business: [
    { id: "accounting", label: "Accounting", textbookRefs: "OpenStax Principles of Accounting", examHints: "financial statements, debits/credits", keywords: ["accounting", "balance sheet", "income", "debit", "credit"], focusPlaceholder: "e.g. Balance sheet" },
    { id: "finance", label: "Finance", textbookRefs: "OpenStax Finance", examHints: "NPV, IRR, ratios, capital structure", keywords: ["finance", "NPV", "ratio", "investment"], focusPlaceholder: "e.g. NPV" },
    { id: "marketing", label: "Marketing", textbookRefs: "OpenStax Marketing", examHints: "segmentation, 4Ps, branding", keywords: ["marketing", "segmentation", "brand"], focusPlaceholder: "e.g. Target market" },
  ],
  history: [
    { id: "us-history", label: "U.S. History", textbookRefs: "OpenStax U.S. History", examHints: "chronology, causation, primary sources", keywords: ["american", "revolution", "civil war", "constitution"], focusPlaceholder: "e.g. Civil War causes" },
    { id: "world-history", label: "World History", textbookRefs: "OpenStax World History", examHints: "global trade, empires, revolutions", keywords: ["world", "empire", "colonial", "industrial"], focusPlaceholder: "e.g. World War I" },
  ],
  psychology: [
    { id: "intro", label: "Introductory Psychology", textbookRefs: "OpenStax Psychology", examHints: "theories, biopsychology, learning", keywords: ["psychology", "pavlov", "freud", "cognitive"], focusPlaceholder: "e.g. Classical conditioning" },
    { id: "abnormal", label: "Abnormal Psychology", textbookRefs: "OpenStax Abnormal Psychology", examHints: "DSM categories, therapy modalities", keywords: ["disorder", "depression", "anxiety", "DSM"], focusPlaceholder: "e.g. Major depression" },
  ],
  "computer-science": [
    { id: "programming", label: "Programming Fundamentals", textbookRefs: "OpenStax CS / Think Python", examHints: "variables, loops, functions, OOP basics", keywords: ["programming", "loop", "function", "array", "python"], focusPlaceholder: "e.g. Recursion" },
    { id: "algorithms", label: "Algorithms", textbookRefs: "Open Data Structures", examHints: "complexity, sorting, searching, graphs", keywords: ["algorithm", "complexity", "sort", "graph", "tree"], focusPlaceholder: "e.g. Big-O" },
    { id: "databases", label: "Databases", textbookRefs: "OpenStax Database Systems", examHints: "SQL, normalization, transactions", keywords: ["SQL", "database", "normalization", "query"], focusPlaceholder: "e.g. JOINs" },
  ],
  "middle-school": [
    { id: "pre-algebra", label: "Pre-Algebra", textbookRefs: "OpenStax Pre-Algebra", examHints: "fractions, ratios, intro equations", keywords: ["ratio", "fraction", "equation", "percent"], focusPlaceholder: "e.g. Ratios" },
    { id: "life-science", label: "Life Science", textbookRefs: "CK-12 Life Science", examHints: "cells, heredity, ecosystems", keywords: ["cell", "heredity", "ecosystem"], focusPlaceholder: "e.g. Cells" },
    { id: "earth-science", label: "Earth Science", textbookRefs: "CK-12 Earth Science", examHints: "geology, weather, astronomy intro", keywords: ["earth", "plate", "weather", "rock"], focusPlaceholder: "e.g. Plate tectonics" },
  ],
  "high-school": [
    { id: "algebra-2", label: "Algebra II", textbookRefs: "OpenStax Algebra 2", examHints: "quadratics, exponentials, logs", keywords: ["quadratic", "logarithm", "exponential"], focusPlaceholder: "e.g. Logarithms" },
    { id: "ap-biology", label: "AP Biology", textbookRefs: "OpenStax Biology", examHints: "AP-style reasoning, labs, evolution", keywords: ["photosynthesis", "cellular respiration", "evolution", "AP"], focusPlaceholder: "e.g. Photosynthesis" },
    { id: "ap-chemistry", label: "AP Chemistry", textbookRefs: "OpenStax Chemistry", examHints: "equilibrium, kinetics, thermochem", keywords: ["equilibrium", "kinetics", "enthalpy"], focusPlaceholder: "e.g. Equilibrium" },
  ],
};

export function getSubjectsForField(fieldLabel: string): FieldSubject[] {
  const meta = getFieldMeta(fieldLabel);
  const id = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");
  return FIELD_SUBJECTS[id] ?? [];
}

export function getFieldSubject(
  fieldLabel: string,
  subjectId: string
): FieldSubject | undefined {
  return getSubjectsForField(fieldLabel).find(
    (s) => s.id === subjectId || s.label.toLowerCase() === subjectId.toLowerCase()
  );
}

/** Scoped topic string for research + generation — strictly one subject */
export function buildScopedTopic(
  fieldLabel: string,
  subjectId: string,
  specificFocus?: string
): string {
  const subject = getFieldSubject(fieldLabel, subjectId);
  const base = subject?.label ?? subjectId;
  const focus = specificFocus?.trim();
  return focus ? `${base} — ${focus}` : base;
}

export function subjectMatchesQuestion(
  subject: FieldSubject,
  questionText: string,
  tags: string[] = []
): boolean {
  const haystack = `${questionText} ${tags.join(" ")}`.toLowerCase();
  return subject.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
