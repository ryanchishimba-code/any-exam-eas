#!/usr/bin/env node
/**
 * Clear premature PromoRedemption rows so users can apply codes at checkout.
 *
 * Signup used to redeem immediately (before payment). This undoes that for
 * accounts that never reached an active paid subscription.
 *
 *   bash scripts/run-with-node.sh npx tsx scripts/clear-orphan-promo-redemptions.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/clear-orphan-promo-redemptions.mts --email you@example.com
 *   bash scripts/run-with-node.sh npx tsx scripts/clear-orphan-promo-redemptions.mts --code WELCOME10 --dry-run
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const dryRun = process.argv.includes("--dry-run");
const email = argValue("--email")?.trim().toLowerCase();
const code = argValue("--code")?.trim().toUpperCase();

async function main() {
  const promoFilter = code ? { code } : undefined;
  const redemptions = await prisma.promoRedemption.findMany({
    where: {
      ...(promoFilter ? { promoCode: promoFilter } : {}),
      ...(email
        ? { user: { email: { equals: email, mode: "insensitive" } } }
        : {}),
    },
    include: {
      promoCode: { select: { id: true, code: true, currentUses: true } },
      user: {
        select: {
          id: true,
          email: true,
          subscription: { select: { status: true, plan: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const orphans = redemptions.filter((r) => {
    const status = r.user.subscription?.status ?? "none";
    // Keep redemptions only for users who completed paid access.
    return status !== "active";
  });

  console.log(
    JSON.stringify(
      {
        dryRun,
        scanned: redemptions.length,
        orphans: orphans.length,
        sample: orphans.slice(0, 20).map((r) => ({
          email: r.user.email,
          code: r.promoCode.code,
          status: r.user.subscription?.status ?? "none",
          plan: r.user.subscription?.plan ?? null,
          redeemedAt: r.createdAt,
        })),
      },
      null,
      2
    )
  );

  if (dryRun || orphans.length === 0) return;

  for (const row of orphans) {
    await prisma.$transaction(async (tx) => {
      await tx.promoRedemption.delete({ where: { id: row.id } });
      const uses = row.promoCode.currentUses;
      if (uses > 0) {
        await tx.promoCode.update({
          where: { id: row.promoCode.id },
          data: { currentUses: Math.max(0, uses - 1) },
        });
      }
    });
  }

  console.log(`Cleared ${orphans.length} orphan promo redemption(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
