/**
 * Seed exams, high-yield topics, and starter questions for the edtech Study Hub.
 * Usage: npx tsx scripts/seed-edtech.ts
 */
import { PrismaClient } from "@prisma/client";
import { EXAM_CATALOG, EXAM_SLUGS } from "../src/lib/edtech/exams";
import { ALL_HIGH_YIELD_TOPICS } from "../src/lib/edtech/seeds";
import { EDTECH_TOPIC_QUESTIONS } from "../src/lib/edtech/seeds/questions";
import { questionContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();

async function seedExams() {
  for (const slug of EXAM_SLUGS) {
    const exam = EXAM_CATALOG[slug];
    await prisma.exam.upsert({
      where: { slug },
      create: {
        slug,
        name: exam.name,
        shortName: exam.shortName,
        fieldId: exam.fieldId,
        description: exam.description,
        simulatedDurationMin: exam.simulatedDurationMin,
        simulatedQuestionCount: exam.simulatedQuestionCount,
      },
      update: {
        name: exam.name,
        shortName: exam.shortName,
        fieldId: exam.fieldId,
        description: exam.description,
        simulatedDurationMin: exam.simulatedDurationMin,
        simulatedQuestionCount: exam.simulatedQuestionCount,
      },
    });
  }
  console.log(`✓ ${EXAM_SLUGS.length} exams`);
}

async function seedTopics() {
  const now = new Date();
  for (const topic of ALL_HIGH_YIELD_TOPICS) {
    await prisma.highYieldTopic.upsert({
      where: { examSlug_slug: { examSlug: topic.examSlug, slug: topic.slug } },
      create: {
        id: topic.id,
        examSlug: topic.examSlug,
        slug: topic.slug,
        category: topic.category,
        title: topic.title,
        overview: topic.overview,
        summary: topic.summary,
        keyConcepts: topic.keyConcepts,
        mustKnowFacts: topic.mustKnowFacts,
        pearls: topic.pearls,
        pitfalls: topic.pitfalls,
        sortOrder: topic.sortOrder,
        practiceTopicSlug: topic.practiceTopicSlug,
        updatedAt: now,
      },
      update: {
        category: topic.category,
        title: topic.title,
        overview: topic.overview,
        summary: topic.summary,
        keyConcepts: topic.keyConcepts,
        mustKnowFacts: topic.mustKnowFacts,
        pearls: topic.pearls,
        pitfalls: topic.pitfalls,
        sortOrder: topic.sortOrder,
        practiceTopicSlug: topic.practiceTopicSlug,
        updatedAt: now,
      },
    });
  }
  console.log(`✓ ${ALL_HIGH_YIELD_TOPICS.length} high-yield topics`);
}

async function seedQuestions() {
  let created = 0;
  for (const q of EDTECH_TOPIC_QUESTIONS) {
    const fieldId = EXAM_CATALOG[q.examSlug].fieldId;
    const contentHash = questionContentHash(fieldId, q.topicSlug, q.stem);
    const data = {
      fieldId,
      subjectId: q.topicSlug,
      topicCategory: q.topicSlug,
      difficulty: q.difficulty === "easy" ? 2 : q.difficulty === "hard" ? 4 : 3,
      itemType: "mcq",
      question: q.stem,
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      tags: JSON.stringify(["edtech-seed", "high-yield", q.examSlug]),
      source: "edtech-seed",
      contentHash,
      active: true,
    };
    await prisma.questionBankItem.upsert({
      where: { contentHash },
      create: data,
      update: data,
    });
    created++;
  }
  console.log(`✓ ${created} starter questions`);
}

async function main() {
  await seedExams();
  await seedTopics();
  await seedQuestions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
