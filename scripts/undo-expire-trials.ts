/**
 * Restore card-free trials flipped by the 2026-10-28 expire-trials run.
 *
 * Default is a dry run. It prints the restore and does not open a database.
 *
 * A real restore requires BOTH:
 *   --apply
 *   CONFIRM_EXPIRE_TRIALS_UNDO=undo-expire-trials
 *
 * Only backup ids that are still trial_expired, have no Stripe subscription id,
 * and do not have a future complimentary pass are set back to trialing.
 * Emails and other row fields are not printed.
 *
 *   npx tsx scripts/undo-expire-trials.ts
 *   CONFIRM_EXPIRE_TRIALS_UNDO=undo-expire-trials npx tsx scripts/undo-expire-trials.ts --apply
 */

const BACKUP_TABLE = "Subscription_backup_20261028";

const apply = process.argv.includes("--apply");

console.log(
  `Would set status back to trialing for ids in "${BACKUP_TABLE}" that are still trial_expired, have no Stripe subscription id, and have no future comp pass.`
);

if (!apply) {
  console.log("Dry run: no database connection was opened.");
  process.exit(0);
}

if (process.env.CONFIRM_EXPIRE_TRIALS_UNDO !== "undo-expire-trials") {
  console.error(
    "Refusing to write. Set CONFIRM_EXPIRE_TRIALS_UNDO=undo-expire-trials and pass --apply."
  );
  process.exit(1);
}

async function applyUndo() {
  const { prisma } = await import("../src/lib/prisma");
  const backup = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count FROM "Subscription_backup_20261028"
  `;
  const eligible = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count
    FROM "Subscription" AS s
    INNER JOIN "Subscription_backup_20261028" AS b ON s.id = b.id
    WHERE s.status = 'trial_expired'
      AND s."stripeSubscriptionId" IS NULL
      AND (s."compAccessUntil" IS NULL OR s."compAccessUntil" <= NOW())
  `;
  const restored = await prisma.$executeRaw`
    UPDATE "Subscription" AS s
    SET status = 'trialing', "updatedAt" = NOW()
    FROM "Subscription_backup_20261028" AS b
    WHERE s.id = b.id
      AND s.status = 'trial_expired'
      AND s."stripeSubscriptionId" IS NULL
      AND (s."compAccessUntil" IS NULL OR s."compAccessUntil" <= NOW())
  `;
  console.log(
    `Backup rows ${Number(backup[0]?.count ?? 0)}. Eligible ${Number(eligible[0]?.count ?? 0)}. Restored ${Number(restored)}.`
  );
  await prisma.$disconnect();
}

void applyUndo().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (/postgres(ql)?:\/\//i.test(message) || /password/i.test(message)) {
    console.error("Undo failed. The database error was withheld.");
  } else if (/does not exist|42P01/i.test(message)) {
    console.error("Backup table is missing.");
  } else {
    console.error("Undo failed.");
  }
  process.exit(1);
});
