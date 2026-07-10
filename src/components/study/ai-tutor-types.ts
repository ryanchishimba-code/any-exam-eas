/** Client payload for POST /api/learning/explain */
export type AiTutorRequest = {
  fieldId: string;
  questionId: string;
  stem: string;
  options: string[];
  correctAnswers: string[];
  selectedAnswers?: string[];
  explanation?: string;
  tags?: string[];
};
