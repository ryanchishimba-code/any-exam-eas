import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/** Maps to Prisma `User` table — NextAuth credentials + optional Clerk id. */
export const users = pgTable(
  "User",
  {
    id: text("id").primaryKey(),
    clerkId: text("clerkId"),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    passwordHash: text("passwordHash"),
    image: text("image"),
    dateOfBirth: timestamp("dateOfBirth", { mode: "date" }).notNull(),
    role: text("role").default("user").notNull(),
    accountStatus: text("accountStatus").default("active").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("User_email_key").on(t.email), uniqueIndex("User_clerkId_key").on(t.clerkId)]
);

export const subscriptions = pgTable(
  "Subscription",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull().unique(),
    stripeCustomerId: text("stripeCustomerId").unique(),
    stripeSubscriptionId: text("stripeSubscriptionId").unique(),
    status: text("status").default("trialing").notNull(),
    plan: text("plan"),
    planInterval: text("planInterval").default("monthly").notNull(),
    trialEndsAt: timestamp("trialEndsAt", { mode: "date" }),
    currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("Subscription_userId_key").on(t.userId)]
);

export const promoCodes = pgTable(
  "PromoCode",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    discountPercent: integer("discountPercent"),
    discountAmount: doublePrecision("discountAmount"),
    expiryDate: timestamp("expiryDate", { mode: "date" }),
    maxUses: integer("maxUses"),
    currentUses: integer("currentUses").default(0).notNull(),
    stripeCouponId: text("stripeCouponId"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("PromoCode_code_key").on(t.code)]
);

export const promoRedemptions = pgTable(
  "PromoRedemption",
  {
    id: text("id").primaryKey(),
    promoCodeId: text("promoCodeId").notNull(),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("PromoRedemption_promoCodeId_userId_key").on(t.promoCodeId, t.userId),
    index("PromoRedemption_userId_idx").on(t.userId),
  ]
);

export const examSessions = pgTable(
  "exam_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    examType: text("examType").notNull(),
    fieldId: text("fieldId"),
    title: text("title"),
    status: text("status").default("in_progress").notNull(),
    score: doublePrecision("score"),
    weakAreas: jsonb("weakAreas"),
    answers: jsonb("answers").default([]).notNull(),
    analysis: jsonb("analysis"),
    questionCount: integer("questionCount").default(0).notNull(),
    timeLimitSec: integer("timeLimitSec"),
    startedAt: timestamp("startedAt", { mode: "date" }).defaultNow().notNull(),
    completedAt: timestamp("completedAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [index("exam_sessions_userId_examType_createdAt_idx").on(t.userId, t.examType, t.createdAt)]
);

export const generatedQuestions = pgTable(
  "generated_questions",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    examType: text("examType").notNull(),
    topic: text("topic"),
    questionText: text("questionText").notNull(),
    options: jsonb("options").notNull(),
    answer: text("answer").notNull(),
    explanation: text("explanation").notNull(),
    source: text("source"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("generated_questions_userId_examType_createdAt_idx").on(t.userId, t.examType, t.createdAt)]
);

export const flashcards = pgTable(
  "flashcards",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    examType: text("examType").notNull(),
    front: text("front").notNull(),
    back: text("back").notNull(),
    topic: text("topic"),
    dueDate: timestamp("dueDate", { mode: "date" }).defaultNow().notNull(),
    interval: doublePrecision("interval").default(0).notNull(),
    easeFactor: doublePrecision("easeFactor").default(2.5).notNull(),
    repetitions: integer("repetitions").default(0).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [index("flashcards_userId_examType_dueDate_idx").on(t.userId, t.examType, t.dueDate)]
);

export const examTopics = pgTable(
  "exam_topics",
  {
    id: text("id").primaryKey(),
    examType: text("examType").notNull(),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    description: text("description"),
    sortOrder: integer("sortOrder").default(0).notNull(),
    parentSlug: text("parentSlug"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("exam_topics_examType_slug_key").on(t.examType, t.slug),
    index("exam_topics_examType_sortOrder_idx").on(t.examType, t.sortOrder),
  ]
);

export const textbookUploads = pgTable(
  "textbook_uploads",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    examType: text("examType"),
    title: text("title").notNull(),
    blobUrl: text("blobUrl").notNull(),
    mimeType: text("mimeType").default("application/pdf").notNull(),
    pageCount: integer("pageCount"),
    chunkCount: integer("chunkCount").default(0).notNull(),
    status: text("status").default("processing").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [index("textbook_uploads_userId_createdAt_idx").on(t.userId, t.createdAt)]
);

export const questionAttempts = pgTable(
  "QuestionAttempt",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    correct: boolean("correct").notNull(),
    fieldId: text("fieldId").notNull(),
    subjectId: text("subjectId"),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [index("QuestionAttempt_userId_fieldId_createdAt_idx").on(t.userId, t.fieldId, t.createdAt)]
);

export const learningProfiles = pgTable("LearningProfile", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().unique(),
  readinessScore: doublePrecision("readinessScore").default(0).notNull(),
  studyStreakDays: integer("studyStreakDays").default(0).notNull(),
  lastStudiedAt: timestamp("lastStudiedAt", { mode: "date" }),
});

/** Static reference — four supported board exams. */
export const exams = pgTable("Exam", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  shortName: text("shortName").notNull(),
  fieldId: text("fieldId").notNull(),
  description: text("description").notNull(),
  simulatedDurationMin: integer("simulatedDurationMin").notNull(),
  simulatedQuestionCount: integer("simulatedQuestionCount").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const userExamPreferences = pgTable("UserExamPreference", {
  userId: text("userId").primaryKey(),
  examSlug: text("examSlug").notNull(),
  lastStudiedAt: timestamp("lastStudiedAt", { mode: "date" }),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const highYieldTopics = pgTable(
  "HighYieldTopic",
  {
    id: text("id").primaryKey(),
    examSlug: text("examSlug").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull(),
    title: text("title").notNull(),
    overview: text("overview").notNull(),
    summary: text("summary").notNull().default(""),
    keyConcepts: jsonb("keyConcepts").notNull(),
    mustKnowFacts: jsonb("mustKnowFacts").notNull(),
    pearls: jsonb("pearls").notNull(),
    pitfalls: jsonb("pitfalls").notNull(),
    sortOrder: integer("sortOrder").default(0).notNull(),
    practiceTopicSlug: text("practiceTopicSlug").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  },
  (t) => [
    uniqueIndex("HighYieldTopic_examSlug_slug_key").on(t.examSlug, t.slug),
    index("HighYieldTopic_examSlug_sortOrder_idx").on(t.examSlug, t.sortOrder),
  ]
);

export const userTopicProgress = pgTable(
  "UserTopicProgress",
  {
    id: text("id").primaryKey(),
    userId: text("userId").notNull(),
    topicId: text("topicId").notNull(),
    lastViewedAt: timestamp("lastViewedAt", { mode: "date" }),
    reviewCount: integer("reviewCount").default(0).notNull(),
    practiceCount: integer("practiceCount").default(0).notNull(),
  },
  (t) => [uniqueIndex("UserTopicProgress_userId_topicId_key").on(t.userId, t.topicId)]
);
