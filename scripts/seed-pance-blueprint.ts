#!/usr/bin/env node
/**
 * Ensure PANCE blueprint reference tables are seeded (idempotent).
 * Migration SQL seeds on deploy; this script verifies counts for local dev.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.panceBlueprintCategory.count();
  const topics = await prisma.panceTopic.count();
  const questions = await prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true },
  });

  console.log(`PANCE blueprint categories: ${categories}`);
  console.log(`PANCE topics: ${topics}`);
  console.log(`PANCE question bank items: ${questions}`);

  if (categories < 23) {
    console.warn("Expected 23 blueprint rows (15 content + 8 task). Run db:migrate.");
  }
  if (topics < 20) {
    console.warn("Expected 20+ topic rows. Run db:migrate.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
