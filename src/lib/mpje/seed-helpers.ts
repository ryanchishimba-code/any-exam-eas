import type { BankItem } from "@/lib/question-bank";
import type { ExamItemType } from "@/lib/exam-prep/types";

const MPJE_DIFFICULTY: Record<string, number> = {
  "pharmacy-ethics": 2,
  "patient-privacy": 2,
  "uniform-mpje": 3,
  "dispensing-procedures": 3,
  "pharmacy-operations": 3,
  "federal-pharmacy-law": 4,
  "controlled-substances": 4,
  "compounding-regulations": 4,
  "state-practice-act": 4,
};

export const K_TYPE_COMBO_OPTIONS = [
  "I only",
  "II only",
  "III only",
  "I and II only",
  "I and III only",
  "II and III only",
  "All of the above",
] as const;

export function kTypeCorrectAnswer(truth: [boolean, boolean, boolean]): string {
  const [i, ii, iii] = truth;
  if (i && ii && iii) return "All of the above";
  if (i && ii) return "I and II only";
  if (i && iii) return "I and III only";
  if (ii && iii) return "II and III only";
  if (i) return "I only";
  if (ii) return "II only";
  if (iii) return "III only";
  return "None of the above";
}

type MpjeSeedBase = {
  subjectId: string;
  explanation: string;
  stateCode?: string | null;
  tags?: string[];
  difficulty?: number;
  references?: BankItem["references"];
};

export function mpjeMcq(
  stem: string,
  options: string[],
  correct: string,
  base: MpjeSeedBase,
  scenario?: string
): BankItem {
  const stateCode = base.stateCode ?? null;
  return {
    subjectId: base.subjectId,
    stateCode,
    scenario,
    question: stem,
    options: options as BankItem["options"],
    correctAnswer: correct,
    explanation: base.explanation,
    difficulty: base.difficulty ?? MPJE_DIFFICULTY[base.subjectId] ?? 3,
    topicCategory: base.subjectId,
    blueprintDomain: stateCode ? "mpje-jurisprudence" : "umpje-uniform",
    itemType: scenario ? "vignette" : "mcq",
    tags: [
      "mpje",
      "high-yield",
      "v2",
      ...(stateCode ? [`state-${stateCode}`] : ["federal"]),
      ...(base.tags ?? []),
    ],
    references: base.references,
  };
}

export function mpjeKType(
  stem: string,
  statements: [string, string, string],
  truth: [boolean, boolean, boolean],
  base: MpjeSeedBase,
  scenario?: string
): BankItem {
  const stateCode = base.stateCode ?? null;
  const formatted = statements.map((s, idx) => {
    const roman = ["I", "II", "III"][idx];
    return s.startsWith(`${roman}.`) ? s : `${roman}. ${s}`;
  });
  return {
    subjectId: base.subjectId,
    stateCode,
    scenario,
    question: stem,
    options: [...K_TYPE_COMBO_OPTIONS] as BankItem["options"],
    correctAnswer: kTypeCorrectAnswer(truth),
    explanation: base.explanation,
    difficulty: base.difficulty ?? MPJE_DIFFICULTY[base.subjectId] ?? 4,
    topicCategory: base.subjectId,
    blueprintDomain: stateCode ? "mpje-jurisprudence" : "umpje-uniform",
    itemType: "k_type",
    ngnPayload: { statements: formatted, itemFormat: "k_type" },
    tags: [
      "mpje",
      "high-yield",
      "k-type",
      "v2",
      ...(stateCode ? [`state-${stateCode}`] : ["federal"]),
      ...(base.tags ?? []),
    ],
    references: base.references,
  };
}

export function mpjeSelectAll(
  stem: string,
  options: string[],
  correct: string[],
  base: MpjeSeedBase,
  scenario?: string
): BankItem {
  const stateCode = base.stateCode ?? null;
  return {
    subjectId: base.subjectId,
    stateCode,
    scenario,
    question: stem,
    options: options as BankItem["options"],
    correctAnswer: correct.join("|||"),
    explanation: base.explanation,
    difficulty: base.difficulty ?? MPJE_DIFFICULTY[base.subjectId] ?? 3,
    topicCategory: base.subjectId,
    blueprintDomain: stateCode ? "mpje-jurisprudence" : "umpje-uniform",
    itemType: "select_all",
    tags: [
      "mpje",
      "high-yield",
      "sata",
      "v2",
      ...(stateCode ? [`state-${stateCode}`] : ["federal"]),
      ...(base.tags ?? []),
    ],
    references: base.references,
  };
}

export function mpjeItemTypeLabel(itemType?: string): ExamItemType | "k_type" {
  if (itemType === "k_type" || itemType === "select_all" || itemType === "vignette") {
    return itemType;
  }
  return "mcq";
}
