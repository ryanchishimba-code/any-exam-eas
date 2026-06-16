#!/usr/bin/env npx tsx
import {
  auditUserCredentials,
  repairUserCredentials,
} from "../src/lib/user-credentials-audit";

const repair = process.argv.includes("--repair");

async function main() {
  const report = await auditUserCredentials();
  console.log(`Scanned ${report.scanned} users.`);

  if (report.issues.length === 0) {
    console.log("No credential issues found.");
    return;
  }

  for (const issue of report.issues) {
    console.log(JSON.stringify(issue));
  }

  if (!repair) {
    console.log("\nRun with --repair to normalize emails and clear invalid password hashes.");
    return;
  }

  const result = await repairUserCredentials();
  console.log("\nRepair complete:");
  console.log(`  emails normalized: ${result.emailsNormalized}`);
  console.log(`  invalid hashes cleared: ${result.invalidHashesCleared}`);
  console.log(`  email conflicts skipped: ${result.skippedEmailConflicts}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  });
