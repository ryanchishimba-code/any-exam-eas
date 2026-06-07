import type { ExamSlug, TopicQuestionSeed } from "@/types/edtech";
import { ALL_HIGH_YIELD_TOPICS } from "./index";
import { EXAM_CATALOG } from "@/lib/edtech/exams";

/** Starter MCQs — 3 per high-yield topic (~36 per exam). */
function buildTopicQuestions(): TopicQuestionSeed[] {
  const out: TopicQuestionSeed[] = [];

  for (const topic of ALL_HIGH_YIELD_TOPICS) {
    const exam = EXAM_CATALOG[topic.examSlug];
    const base = `${topic.examSlug}-${topic.slug}`;

    const templates: Omit<TopicQuestionSeed, "id" | "examSlug" | "topicSlug">[] = [
      {
        stem: `Regarding ${topic.title.toLowerCase()}, which action is highest priority on ${exam.shortName}?`,
        options: [
          "Assess/stabilize before less urgent interventions",
          "Delegate all tasks to unlicensed assistive personnel",
          "Document before any patient contact",
          "Administer PRN comfort measures first",
        ],
        correctAnswer: "Assess/stabilize before less urgent interventions",
        explanation: `Core principle from ${topic.title}: ${topic.mustKnowFacts[0] ?? topic.keyConcepts[0]}`,
        difficulty: "medium",
      },
      {
        stem: `A test item focuses on ${topic.title}. Which statement is most accurate?`,
        options: [
          topic.keyConcepts[0] ?? topic.overview,
          "Ignore standard precautions when the patient appears well",
          "Skip verification steps to save time",
          "Treat all presentations identically regardless of acuity",
        ],
        correctAnswer: topic.keyConcepts[0] ?? topic.overview,
        explanation: topic.pearls[0] ?? topic.overview,
        difficulty: "easy",
      },
      {
        stem: `Which pitfall should you avoid in ${topic.title}?`,
        options: [
          topic.pitfalls[0] ?? "Overlooking assessment data",
          "Using evidence-based guidelines",
          "Collaborating with the interprofessional team",
          "Re-evaluating after intervention",
        ],
        correctAnswer: topic.pitfalls[0] ?? "Overlooking assessment data",
        explanation: `Common trap: ${topic.pitfalls[0] ?? "failing to reassess"}. Pearl: ${topic.pearls[0] ?? topic.overview}`,
        difficulty: "hard",
      },
    ];

    templates.forEach((t, i) => {
      out.push({
        id: `${base}-q${i + 1}`,
        examSlug: topic.examSlug,
        topicSlug: topic.practiceTopicSlug,
        ...t,
      });
    });
  }

  return out;
}

export const EDTECH_TOPIC_QUESTIONS = buildTopicQuestions();

export function getEdtechQuestionsForExam(examSlug: ExamSlug): TopicQuestionSeed[] {
  return EDTECH_TOPIC_QUESTIONS.filter((q) => q.examSlug === examSlug);
}
