/** User-facing exam modes — mapped to study session configuration. */
export type ExamModeId =
  | "timed"
  | "tutor"
  | "adaptive"
  | "rapid"
  | "weak_area"
  | "mock_board"
  | "subject"
  | "mixed";

export type ExamModeDefinition = {
  id: ExamModeId;
  label: string;
  description: string;
  href: string;
  studyMode: "practice" | "rapid" | "timed";
  /** Query param for generators / practice */
  param?: string;
  premium?: boolean;
};

export const EXAM_MODES: ExamModeDefinition[] = [
  {
    id: "timed",
    label: "Timed exam",
    description: "Fixed clock per question — timed practice pacing without distractions.",
    href: "/study/practice?mode=timed",
    studyMode: "timed",
    param: "timed",
  },
  {
    id: "tutor",
    label: "Tutor mode",
    description: "Immediate explanations after each item — learn as you go.",
    href: "/study/practice?mode=practice",
    studyMode: "practice",
    param: "tutor",
  },
  {
    id: "adaptive",
    label: "Personalized practice",
    description: "Question order can emphasize topics where you need more review.",
    href: "/study/practice?mode=adaptive",
    studyMode: "practice",
    param: "adaptive",
  },
  {
    id: "rapid",
    label: "Rapid review",
    description: "High-yield drill — short sessions, fast feedback.",
    href: "/study/practice?mode=rapid",
    studyMode: "rapid",
    param: "rapid",
  },
  {
    id: "weak_area",
    label: "Weak-area mode",
    description: "Focus only on tags and topics you miss most often.",
    href: "/study/practice?mode=weak",
    studyMode: "practice",
    param: "weak",
  },
  {
    id: "mock_board",
    label: "Mock practice exam",
    description: "Full-length mixed-topic block with timed sections for self-assessment.",
    href: "/generate?mode=mock",
    studyMode: "timed",
    param: "mock",
  },
  {
    id: "subject",
    label: "Subject exam",
    description: "Deep dive one subject area from the question bank or AI generator.",
    href: "/generate",
    studyMode: "practice",
  },
  {
    id: "mixed",
    label: "Mixed-topic exam",
    description: "Cross-topic assessment spanning your chosen field.",
    href: "/generate?mixed=1",
    studyMode: "timed",
    param: "mixed",
  },
];

export function getExamMode(id: ExamModeId): ExamModeDefinition | undefined {
  return EXAM_MODES.find((m) => m.id === id);
}
