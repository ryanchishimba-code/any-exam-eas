#!/usr/bin/env npx tsx
/**
 * Issue or check a per-user 48-hour upgrade offer (25% off the first payment).
 *
 * The clock starts when the row is issued and does not move if you resend the
 * same link. Pass --rotate to replace an unused offer and start a new 48 hours.
 * An offer that was already used cannot be issued again. Paid accounts are refused.
 *
 *   npm run offer:trial-upgrade -- issue student@example.com
 *   npm run offer:trial-upgrade -- check student@example.com
 *   npm run offer:trial-upgrade -- issue student@example.com --rotate
 *
 * Requires DATABASE_URL (production, when sending a real link).
 * Optional OFFER_ORIGIN (default https://www.anyexameasy.com).
 *
 * To look up a row without the script:
 *
 *   SELECT u.email, o."issuedAt", o."expiresAt", o."redeemedAt", o.token
 *   FROM trial_upgrade_offers o
 *   JOIN "User" u ON u.id = o."userId"
 *   WHERE u.email = 'student@example.com';
 *
 * The link is https://www.anyexameasy.com/upgrade?offer=<token>
 */
import {
  checkTrialUpgradeOfferForEmail,
  issueTrialUpgradeOfferForEmail,
} from "../src/lib/billing/trial-upgrade-offer-db";
import { prisma } from "../src/lib/prisma";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const command = args[0];
const email = args.find((arg) => arg.includes("@")) ?? "";
const rotate = args.includes("--rotate");
const origin = process.env.OFFER_ORIGIN?.trim() || "https://www.anyexameasy.com";

function usage(): never {
  console.error(
    "Usage: npm run offer:trial-upgrade -- issue <email> [--rotate]\n       npm run offer:trial-upgrade -- check <email>"
  );
  process.exit(1);
}

if ((command !== "issue" && command !== "check") || !email) usage();

try {
  if (command === "check") {
    const result = await checkTrialUpgradeOfferForEmail({ email, origin });
    for (const line of result.lines) console.log(line);
  } else {
    const result = await issueTrialUpgradeOfferForEmail({ email, rotate, origin });
    if (!result.ok) {
      console.error(result.message);
      process.exitCode = 1;
    } else {
      console.log(result.action === "create" ? "Offer issued" : "Existing offer still active");
      console.log(`  Email:   ${result.email}`);
      console.log(`  Expires: ${result.expiresAt.toISOString()}`);
      console.log(`  Link:    ${result.link}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
