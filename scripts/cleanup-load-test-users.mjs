#!/usr/bin/env node
/**
 * Delete users created by scripts/load-test-concurrent.mjs (load-*@example.com).
 * Usage: node scripts/cleanup-load-test-users.mjs [--dry-run]
 */
import { PrismaClient } from "@prisma/client";

const dryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

try {
  const targets = await prisma.user.findMany({
    where: {
      email: { endsWith: "@example.com" },
    },
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  }).then((rows) =>
    rows.filter((u) => /^load-\d+-\d+@example\.com$/i.test(u.email))
  );

  console.log(`Found ${targets.length} load-test user(s)${dryRun ? " (dry run)" : ""}.`);

  if (targets.length === 0) {
    process.exit(0);
  }

  if (dryRun) {
    for (const u of targets.slice(0, 10)) {
      console.log(`  would delete: ${u.email}`);
    }
    if (targets.length > 10) console.log(`  … and ${targets.length - 10} more`);
    process.exit(0);
  }

  const ids = targets.map((u) => u.id);
  const deleted = await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  console.log(`Deleted ${deleted.count} load-test user(s).`);
} finally {
  await prisma.$disconnect();
}
