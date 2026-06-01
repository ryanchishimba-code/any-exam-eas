import { prisma } from "../src/lib/prisma";
import { RETIRED_FIELD_IDS } from "../src/lib/subjects/field-ids";

const STEP_1_SUBJECTS = [
  "anatomy",
  "physiology",
  "pathology",
  "pharmacology",
  "biochemistry",
  "microbiology",
];

type CleanupStats = {
  questionBankDeleted: number;
  questionBankMigratedStep1: number;
  questionBankMigratedStep2: number;
  questionAttemptsMigratedStep1: number;
  questionAttemptsMigratedStep2: number;
  questionAttemptsDeleted: number;
  conceptMasteryMigrated: number;
  conceptMasteryDeleted: number;
  studySessionsMigratedStep1: number;
  studySessionsMigratedStep2: number;
  studySessionsDeleted: number;
};

async function cleanupRetiredFields(): Promise<CleanupStats> {
  const stats: CleanupStats = {
    questionBankDeleted: 0,
    questionBankMigratedStep1: 0,
    questionBankMigratedStep2: 0,
    questionAttemptsMigratedStep1: 0,
    questionAttemptsMigratedStep2: 0,
    questionAttemptsDeleted: 0,
    conceptMasteryMigrated: 0,
    conceptMasteryDeleted: 0,
    studySessionsMigratedStep1: 0,
    studySessionsMigratedStep2: 0,
    studySessionsDeleted: 0,
  };

  const retiredWithoutMedicine = RETIRED_FIELD_IDS.filter((id) => id !== "medicine");

  const step1Bank = await prisma.questionBankItem.updateMany({
    where: { fieldId: "medicine", subjectId: { in: STEP_1_SUBJECTS } },
    data: { fieldId: "usmle-step-1" },
  });
  stats.questionBankMigratedStep1 = step1Bank.count;

  const step2Bank = await prisma.questionBankItem.updateMany({
    where: { fieldId: "medicine" },
    data: { fieldId: "usmle-step-2" },
  });
  stats.questionBankMigratedStep2 = step2Bank.count;

  const bankDelete = await prisma.questionBankItem.deleteMany({
    where: { fieldId: { in: [...retiredWithoutMedicine] } },
  });
  stats.questionBankDeleted = bankDelete.count;

  const step1Attempts = await prisma.questionAttempt.updateMany({
    where: { fieldId: "medicine", subjectId: { in: STEP_1_SUBJECTS } },
    data: { fieldId: "usmle-step-1" },
  });
  stats.questionAttemptsMigratedStep1 = step1Attempts.count;

  const step2Attempts = await prisma.questionAttempt.updateMany({
    where: { fieldId: "medicine" },
    data: { fieldId: "usmle-step-2" },
  });
  stats.questionAttemptsMigratedStep2 = step2Attempts.count;

  const attemptsDelete = await prisma.questionAttempt.deleteMany({
    where: { fieldId: { in: [...retiredWithoutMedicine] } },
  });
  stats.questionAttemptsDeleted = attemptsDelete.count;

  const masteryMigrate = await prisma.conceptMastery.updateMany({
    where: { fieldId: "medicine" },
    data: { fieldId: "usmle-step-2" },
  });
  stats.conceptMasteryMigrated = masteryMigrate.count;

  const masteryDelete = await prisma.conceptMastery.deleteMany({
    where: { fieldId: { in: [...retiredWithoutMedicine] } },
  });
  stats.conceptMasteryDeleted = masteryDelete.count;

  const step1Sessions = await prisma.studySession.updateMany({
    where: { fieldId: "medicine", subjectId: { in: STEP_1_SUBJECTS } },
    data: { fieldId: "usmle-step-1" },
  });
  stats.studySessionsMigratedStep1 = step1Sessions.count;

  const step2Sessions = await prisma.studySession.updateMany({
    where: { fieldId: "medicine" },
    data: { fieldId: "usmle-step-2" },
  });
  stats.studySessionsMigratedStep2 = step2Sessions.count;

  const sessionsDelete = await prisma.studySession.deleteMany({
    where: { fieldId: { in: [...retiredWithoutMedicine] } },
  });
  stats.studySessionsDeleted = sessionsDelete.count;

  return stats;
}

cleanupRetiredFields()
  .then((stats) => {
    console.log("Retired exam cleanup complete:");
    console.log(JSON.stringify(stats, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
