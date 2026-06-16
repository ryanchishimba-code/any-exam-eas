#!/usr/bin/env node
/**
 * Ensure NPTE-PT blueprint reference tables are seeded (idempotent).
 * Migration SQL seeds on deploy; this script verifies counts for local dev.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.nptePtBlueprintCategory.count();
  const topics = await prisma.nptePtTopic.count();
  const questions = await prisma.questionBankItem.count({
    where: { fieldId: "npte-pt", active: true },
  });

  console.log(`NPTE-PT blueprint categories: ${categories}`);
  console.log(`NPTE-PT topics: ${topics}`);
  console.log(`NPTE-PT question bank items: ${questions}`);

  if (categories < 14) {
    console.warn("Expected 14+ blueprint category rows. Run db:migrate.");
  }
  if (topics < 4) {
    console.warn("Expected 4+ topic rows. Run db:migrate.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
