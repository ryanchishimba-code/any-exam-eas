import type { StudyQuestion } from "@/lib/questions/types";

export const sampleMcqQuestion: StudyQuestion = {
  id: "test-mcq-1",
  sourceIndex: 0,
  type: "multiple_choice",
  stem: "Which medication is first-line for HFrEF with reduced ejection fraction?",
  vignette:
    "A 68-year-old man with NYHA class II heart failure and LVEF 30% presents for medication review.",
  options: [
    "Furosemide monotherapy",
    "Sacubitril/valsartan with GDMT pillars",
    "Digoxin alone",
    "Hydralazine-isosorbide without beta-blocker",
  ],
  correctAnswers: ["Sacubitril/valsartan with GDMT pillars"],
  explanation: "GDMT pillars reduce mortality in HFrEF; diuretics treat congestion only.",
  field: "usmle-step-2",
  highYield: true,
  qualityScore: 0.92,
};

export const sampleNclexQuestion: StudyQuestion = {
  id: "test-nclex-1",
  sourceIndex: 1,
  type: "multiple_choice",
  stem: "The nurse should prioritize which action first?",
  options: [
    "Document the assessment",
    "Assess airway, breathing, and circulation",
    "Call the physician",
    "Administer PRN analgesia",
  ],
  correctAnswers: ["Assess airway, breathing, and circulation"],
  explanation: "ABCs take priority in acute assessment.",
  field: "nursing",
};
