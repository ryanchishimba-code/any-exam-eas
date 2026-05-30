import type { ExamQuestion, GeneratedExam } from "@/lib/ai";
import type { RetrievedChunk } from "@/lib/rag/types";
import type { GenerationQualityReport } from "@/lib/rag/types";
import {
  reflectOnQuestion,
  passesQualityGate,
  regenerateQuestion,
} from "@/lib/rag/self-rag";

export type SelfEvaluateOptions = {
  fieldId: string;
  field: string;
  topic: string;
  difficulty: string;
  chunks: RetrievedChunk[];
  mode?: "production" | "test";
  maxRegenerations?: number;
};

/**
 * Self-RAG quality control: reflect on each question, regenerate failures, gate low scores.
 */
export async function runSelfEvaluationLoop(
  exam: GeneratedExam,
  options: SelfEvaluateOptions
): Promise<{ exam: GeneratedExam; report: GenerationQualityReport }> {
  const maxRegen = options.maxRegenerations ?? 1;
  const perQuestion: GenerationQualityReport["perQuestion"] = [];
  const updatedQuestions: ExamQuestion[] = [];

  for (const q of exam.questions) {
    let current = q;
    let reflection = await reflectOnQuestion(current, options.chunks, options.fieldId);
    let regenerated = false;

    if (!passesQualityGate(reflection) && maxRegen > 0) {
      const improved = await regenerateQuestion({
        question: current,
        reflection,
        chunks: options.chunks,
        field: options.field,
        topic: options.topic,
        difficulty: options.difficulty,
      });
      if (improved) {
        current = { ...improved, id: q.id };
        regenerated = true;
        reflection = await reflectOnQuestion(current, options.chunks, options.fieldId);
      }
    }

    current.qualityScore = reflection.qualityScore;
    updatedQuestions.push(current);
    perQuestion.push({
      id: current.id,
      score: reflection.qualityScore,
      reflection,
      regenerated,
    });
  }

  const averageScore =
    perQuestion.length === 0
      ? 0
      : perQuestion.reduce((s, p) => s + p.score, 0) / perQuestion.length;

  const passed =
    averageScore >= 0.72 &&
    perQuestion.filter((p) => !passesQualityGate(p.reflection)).length <=
      Math.ceil(perQuestion.length * 0.15);

  const report: GenerationQualityReport = {
    passed,
    averageScore: Math.round(averageScore * 1000) / 1000,
    perQuestion,
    patternProfileUsed: true,
    chunksUsed: options.chunks.length,
    mode: options.mode ?? "production",
  };

  return {
    exam: { ...exam, questions: updatedQuestions },
    report,
  };
}
