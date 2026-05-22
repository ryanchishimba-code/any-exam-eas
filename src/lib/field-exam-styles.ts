import { getFieldMeta } from "./fields";

export type FieldExamStyle = {
  systemAddendum: string;
  questionRules: string;
  allMultipleChoice: boolean;
};

const STYLES: Record<string, FieldExamStyle> = {
  medicine: {
    allMultipleChoice: true,
    systemAddendum: "USMLE/board style. Brief vignettes when appropriate.",
    questionRules:
      "Clinical reasoning, anatomy, pathophys, pharm. All items high-yield multiple choice, 4 unique distractors.",
  },
  nursing: {
    allMultipleChoice: true,
    systemAddendum: "NCLEX-style prioritization and safety.",
    questionRules:
      "ABC priorities, infection control, patient advocacy, pharmacology nursing implications. One best action.",
  },
  pharmacy: {
    allMultipleChoice: true,
    systemAddendum: "Pharmacy licensure / therapeutics focus.",
    questionRules: "MOA, interactions, contraindications, counseling, dosing calculations in MCQ form.",
  },
  engineering: {
    allMultipleChoice: true,
    systemAddendum: "FE/fundamentals and unit analysis.",
    questionRules:
      "Include unit consistency traps, formula application, design tradeoffs. Numeric answers as MCQ options.",
  },
  law: {
    allMultipleChoice: true,
    systemAddendum: "Bar exam / law school issue-spotting.",
    questionRules: "Fact pattern → rule → application. Distractors = wrong elements or wrong cases.",
  },
  business: {
    allMultipleChoice: true,
    systemAddendum: "MBA/undergrad business assessment.",
    questionRules: "Ratios, strategy frameworks, ethics scenarios, micro/macro concepts.",
  },
  mathematics: {
    allMultipleChoice: true,
    systemAddendum: "College/AP math exam style.",
    questionRules:
      "Computation, proofs intuition, definitions, common errors (sign errors, domain restrictions). Include algebra, geometry, calculus, statistics as topic fits. Options should include typical wrong answers from common mistakes.",
  },
  biology: {
    allMultipleChoice: true,
    systemAddendum: "Intro biology / AP Bio.",
    questionRules: "Processes, labs, evolution, molecular bio. Diagram descriptions in text if needed.",
  },
  chemistry: {
    allMultipleChoice: true,
    systemAddendum: "General / organic chemistry exams.",
    questionRules: "Stoichiometry, periodic trends, reactions, nomenclature, lab safety.",
  },
  physics: {
    allMultipleChoice: true,
    systemAddendum: "Intro physics problem style.",
    questionRules: "Setup problems with units, kinematics, forces, energy, circuits. Trap wrong units in distractors.",
  },
  history: {
    allMultipleChoice: true,
    systemAddendum: "History assessment / AP style.",
    questionRules: "Chronology, causation, primary source interpretation, comparison across periods.",
  },
  psychology: {
    allMultipleChoice: true,
    systemAddendum: "Psychology 101 / AP Psych.",
    questionRules: "Theories, famous experiments, disorders, research methods, terminology.",
  },
  "computer-science": {
    allMultipleChoice: true,
    systemAddendum: "CS fundamentals / AP CSP style.",
    questionRules: "Algorithms, complexity, data structures, trace small code segments in text.",
  },
  "middle-school": {
    allMultipleChoice: true,
    systemAddendum: "Grades 6–8 standards.",
    questionRules: "Pre-algebra, earth/life science basics, civics, reading comprehension.",
  },
  "high-school": {
    allMultipleChoice: true,
    systemAddendum: "High school / AP / SAT reasoning.",
    questionRules: "Rigorous HS standards, multi-step reasoning, evidence-based answers.",
  },
};

export function getFieldExamStyle(fieldLabel: string): FieldExamStyle {
  const meta = getFieldMeta(fieldLabel);
  const id = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");
  return (
    STYLES[id] ?? {
      allMultipleChoice: true,
      systemAddendum: "Standard academic exam.",
      questionRules:
        "High-yield multiple choice with 4 unique options. Match conventions of the discipline.",
    }
  );
}

export function buildFieldPromptBlock(fieldLabel: string, topic: string, count: number): string {
  const meta = getFieldMeta(fieldLabel);
  const style = getFieldExamStyle(fieldLabel);
  return `
FIELD: ${fieldLabel}
TOPIC: ${topic}
DISCIPLINE FOCUS: ${meta?.examFocus ?? "core curriculum"}
STYLE: ${style.systemAddendum}
QUESTION RULES: ${style.questionRules}
FORMAT: Quizlet-style — plain question stem (no "Question:" prefix); exactly ${count} multiple_choice items; 4 unique option strings (no letter prefix); highYield true for most items.
ALL questions must be multiple_choice with exactly 4 options.`;
}
