#!/usr/bin/env node
/**
 * Idempotent student used by the signed-in smoke test.
 *
 * The email must be an @anyexameasy.test address. Role is always "user".
 * Question rows are inserted only when SMOKE_SEED_QUESTIONS=1, and never
 * into the production database.
 *
 * Production (Ryan, once), from a shell whose DATABASE_URL is production:
 *   SMOKE_SEED_PRODUCTION=1 \
 *   SMOKE_STUDENT_EMAIL=smoke-student@anyexameasy.test \
 *   SMOKE_STUDENT_PASSWORD='<value stored as the SMOKE_STUDENT_PASSWORD secret>' \
 *   npm run db:seed-smoke-student
 */
import { PrismaClient } from "@prisma/client";
import { EXAM_CATALOG } from "../src/lib/edtech/exams.ts";
import { hashPassword, passwordCredentialFields } from "../src/lib/password-hash.ts";
import { isProductionDatabaseHost } from "./prisma-env.mjs";

const CI_PUBLIC_PASSWORD = "ci-smoke-student-password";
const EMAIL_SUFFIX = "@anyexameasy.test";
const QUESTIONS_PER_SUBJECT = 8;

const SMOKE_SUBJECTS = [
  { fieldId: "nursing", subjectId: "pharmacology-nursing" },
  { fieldId: "pharmacy", subjectId: "patient-counseling" },
  { fieldId: "pance", subjectId: "cardiovascular" },
  { fieldId: "aanp-fnp", subjectId: "cardiovascular" },
];

const email = (process.env.SMOKE_STUDENT_EMAIL ?? "smoke-student@anyexameasy.test")
  .trim()
  .toLowerCase();
const password = process.env.SMOKE_STUDENT_PASSWORD ?? "";
const databaseUrl = process.env.DATABASE_URL ?? "";
const productionHost = isProductionDatabaseHost(databaseUrl);
const seedQuestions = process.env.SMOKE_SEED_QUESTIONS === "1";

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!email.endsWith(EMAIL_SUFFIX)) {
  fail(`Smoke student email must end with ${EMAIL_SUFFIX}. Refusing ${email}.`);
}
if (!password) {
  fail("Set SMOKE_STUDENT_PASSWORD. This script does not invent a password.");
}
if (productionHost && process.env.SMOKE_SEED_PRODUCTION !== "1") {
  fail(
    "DATABASE_URL is the production database. Re-run with SMOKE_SEED_PRODUCTION=1 to create the smoke student there."
  );
}
if (productionHost && password === CI_PUBLIC_PASSWORD) {
  fail("Refusing to store the public CI password on the production database.");
}
if (productionHost && seedQuestions) {
  fail("Refusing to insert smoke questions into the production database.");
}

const prisma = new PrismaClient();

async function ensureBoardExams() {
  for (const exam of Object.values(EXAM_CATALOG)) {
    await prisma.boardExam.upsert({
      where: { slug: exam.slug },
      create: {
        slug: exam.slug,
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
}

async function upsertStudent() {
  const credentialFields = passwordCredentialFields(await hashPassword(password));
  const subscription = {
    status: "active",
    planTier: "pro",
    planInterval: "yearly",
    purchaseType: "subscription",
    trialEndsAt: null,
    currentPeriodEnd: daysFromNow(365),
    compAccessUntil: daysFromNow(365),
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  };
  const tourMetadata = JSON.stringify({
    tours: {
      "firstLogin.v1": {
        status: "skipped",
        step: 0,
        at: "2026-01-01T00:00:00.000Z",
        device: "mobile",
      },
    },
  });

  const existing = await prisma.user.findUnique({ where: { email } });
  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: {
          name: "Smoke Student",
          role: "user",
          accountStatus: "active",
          emailVerified: existing.emailVerified ?? new Date(),
          ...credentialFields,
        },
      })
    : await prisma.user.create({
        data: {
          email,
          name: "Smoke Student",
          role: "user",
          accountStatus: "active",
          emailVerified: new Date(),
          dateOfBirth: new Date("1995-06-15"),
          ...credentialFields,
        },
      });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...subscription },
    update: subscription,
  });
  await prisma.userPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, metadata: tourMetadata },
    update: { metadata: tourMetadata },
  });
  await prisma.userExamPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, examSlug: "nclex", lastStudiedAt: new Date() },
    update: { examSlug: "nclex", lastStudiedAt: new Date() },
  });
  await prisma.userSession.deleteMany({ where: { userId: user.id } });
  console.log(`Smoke student ready: ${email} (role user)`);
}

async function seedServeReadyQuestions() {
  const { collectSeedQuestionRows } = await import("../src/lib/question-bank-seed.ts");
  const { filterBankItemsForServe } = await import("../src/lib/exam-prep/prepare-bank-session.ts");
  const { rowToCreateData } = await import("../src/lib/sync-question-bank.ts");

  const catalog = collectSeedQuestionRows();
  for (const board of SMOKE_SUBJECTS) {
    const pool = catalog
      .filter((row) => row.fieldId === board.fieldId && row.subjectId === board.subjectId)
      .map((row) => ({ ...row.item, subjectId: row.subjectId }));
    const ready = filterBankItemsForServe(board.fieldId, pool).slice(0, QUESTIONS_PER_SUBJECT);
    if (ready.length < 5) {
      fail(
        `Only ${ready.length} serve-ready ${board.fieldId}/${board.subjectId} questions in the repo seeds. The smoke session needs 5.`
      );
    }
    for (const item of ready) {
      const data = {
        ...rowToCreateData(board.fieldId, board.subjectId, item, "seed"),
        qaPassed: true,
        active: true,
      };
      await prisma.questionBankItem.upsert({
        where: { contentHash: data.contentHash },
        create: data,
        update: data,
      });
    }
    console.log(`Smoke questions: ${ready.length} ${board.fieldId}/${board.subjectId}`);
  }
}

try {
  await ensureBoardExams();
  await upsertStudent();
  if (seedQuestions) await seedServeReadyQuestions();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  await prisma.$disconnect();
}
