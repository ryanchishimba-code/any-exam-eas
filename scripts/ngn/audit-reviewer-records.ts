#!/usr/bin/env node
/**
 * Read-only audit of NGN review rows that still credit Ryan as an RN,
 * or that record an owner sign-off with licenseType RN.
 *
 * Prints matching rows. Does not update or delete anything.
 * Do not run this against production unless the owner asks for the report.
 *
 *   npx tsx scripts/ngn/audit-reviewer-records.ts
 */
import { loadEnvFiles } from "../load-env";

const RYAN_RN = "Ryan Chishimba, RN";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main() {
  if (process.argv.includes("--apply") || process.argv.includes("--write")) {
    fail("This script is read-only. It does not accept --apply.");
  }

  loadEnvFiles();
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set. Nothing was queried.");

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.ngnItemReview.findMany({
      where: {
        OR: [
          { reviewerName: { contains: RYAN_RN } },
          {
            licenseType: "RN",
            OR: [
              { comments: { contains: "owner attestation" } },
              { reviewerUserId: { startsWith: "owner:" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        itemId: true,
        itemVersion: true,
        reviewerUserId: true,
        reviewerName: true,
        licenseType: true,
        comments: true,
        decision: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    console.log(
      JSON.stringify(
        {
          readOnly: true,
          matched: rows.length,
          rows,
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
