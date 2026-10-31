/**
 * Creates or removes the two preview-branch accounts used by the PANCE feed QA.
 * Refuses any DATABASE_URL that is not the preview compute ep-polished-night-apzk76v4.
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword, passwordCredentialFields } from "../src/lib/password-hash";

const PREVIEW_HOST = "ep-polished-night-apzk76v4";
const PAID_EMAIL = "pance-feed-paid-c526@anyexameasy.test";
const UNPAID_EMAIL = "pance-feed-unpaid-c526@anyexameasy.test";
const PASSWORD = process.env.PANCE_FEED_QA_PASSWORD ?? "PreviewFeed1!";

const url = process.env.DATABASE_URL ?? "";
if (!url.includes(PREVIEW_HOST)) {
  console.error("Refusing to run: DATABASE_URL is not the PANCE feed preview endpoint.");
  process.exit(1);
}

const prisma = new PrismaClient();
const mode = process.argv[2] ?? "upsert";

function daysFromNow(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function upsert(email: string, name: string, paid: boolean) {
  const credentialFields = passwordCredentialFields(await hashPassword(PASSWORD));
  const accessEndsAt = daysFromNow(365);
  const subscription = paid
    ? {
        status: "active",
        purchaseType: "one_time",
        accessEndsAt,
        currentPeriodEnd: accessEndsAt,
        planTier: "pro",
        planInterval: "yearly",
        trialEndsAt: null,
        compAccessUntil: null,
        stripeSubscriptionId: null,
      }
    : {
        status: "trialing",
        purchaseType: "subscription",
        trialEndsAt: daysFromNow(7),
        accessEndsAt: null,
        planTier: "pro",
        planInterval: "yearly",
        compAccessUntil: null,
        stripeSubscriptionId: null,
      };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        name,
        ...credentialFields,
        role: "user",
        accountStatus: "active",
        emailVerified: existing.emailVerified ?? new Date(),
      },
    });
    await prisma.subscription.upsert({
      where: { userId: existing.id },
      create: { userId: existing.id, ...subscription },
      update: subscription,
    });
    await prisma.panceFeedProgress.deleteMany({ where: { userId: existing.id } });
    return;
  }

  await prisma.user.create({
    data: {
      email,
      name,
      dateOfBirth: new Date("1990-01-15"),
      role: "user",
      accountStatus: "active",
      emailVerified: new Date(),
      ...credentialFields,
      subscription: { create: subscription },
    },
  });
}

async function main() {
  if (mode === "delete") {
    await prisma.user.deleteMany({ where: { email: { in: [PAID_EMAIL, UNPAID_EMAIL] } } });
    console.log("Removed preview QA users.");
    return;
  }
  await upsert(PAID_EMAIL, "PANCE Feed Paid", true);
  await upsert(UNPAID_EMAIL, "PANCE Feed Unpaid", false);
  console.log("Upserted preview QA users.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
