/** Canonical exam slugs for the four core boards. */
export type ExamSlug = "nclex" | "usmle" | "naplex" | "mpje";

export type ExamDefinition = {
  slug: ExamSlug;
  name: string;
  shortName: string;
  fieldId: string;
  description: string;
  accentClass: string;
  /** Minutes for full simulated exam */
  simulatedDurationMin: number;
  simulatedQuestionCount: number;
};

export type HighYieldTopic = {
  id: string;
  examSlug: ExamSlug;
  slug: string;
  category: string;
  title: string;
  /** One-line teaser shown on grid cards */
  overview: string;
  /** Multi-paragraph book-summary body shown in the detail panel */
  summary: string;
  keyConcepts: string[];
  mustKnowFacts: string[];
  pearls: string[];
  pitfalls: string[];
  sortOrder: number;
  /** Maps to QuestionBankItem.topicCategory / subject filters */
  practiceTopicSlug: string;
};

export type TopicProgressMap = Record<
  string,
  { reviewCount: number; practiceCount: number; lastViewedAt: string | null }
>;

export type UserExamPreference = {
  userId: string;
  examSlug: ExamSlug;
  lastStudiedAt: Date | null;
};

export type UserTopicProgress = {
  userId: string;
  topicId: string;
  lastViewedAt: Date | null;
  practiceCount: number;
};

export type StudyHubQuickStats = {
  questionsAnswered: number;
  questionsToday: number;
  accuracyPct: number;
  streakDays: number;
};

export type TopicQuestionSeed = {
  id: string;
  examSlug: ExamSlug;
  topicSlug: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};
