import { and, eq } from "drizzle-orm";
import { prisma } from "@/lib/prisma";
import { requireDb } from "@/db";
import { promoCodes, promoRedemptions } from "@/db/schema";
import { buildPlanPricing } from "@/lib/promo-pricing";
import { messageForErrorCode } from "./messages";
import type {
  DiscountErrorCode,
  DiscountValidation,
  ValidateDiscountInput,
} from "./types";
import { FULL_ACCESS_COPY } from "./access";

type PromoRow = {
  id?: string;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  expiryDate: Date | null;
  maxUses: number | null;
  currentUses: number;
  active: boolean;
  stripeCouponId: string | null;
};

async function findPromoRow(code: string): Promise<PromoRow | null> {
  try {
    const db = requireDb();
    const [row] = await db
      .select({
        id: promoCodes.id,
        code: promoCodes.code,
        discountPercent: promoCodes.discountPercent,
        discountAmount: promoCodes.discountAmount,
        expiryDate: promoCodes.expiryDate,
        maxUses: promoCodes.maxUses,
        currentUses: promoCodes.currentUses,
        active: promoCodes.active,
        stripeCouponId: promoCodes.stripeCouponId,
      })
      .from(promoCodes)
      .where(eq(promoCodes.code, code))
      .limit(1);
    return row ?? null;
  } catch {
    const row = await prisma.promoCode.findUnique({ where: { code } });
    if (!row) return null;
    return {
      id: row.id,
      code: row.code,
      discountPercent: row.discountPercent,
      discountAmount: row.discountAmount,
      expiryDate: row.expiryDate,
      maxUses: row.maxUses,
      currentUses: row.currentUses,
      active: row.active,
      stripeCouponId: row.stripeCouponId,
    };
  }
}

async function userAlreadyRedeemed(promoId: string, userId: string): Promise<boolean> {
  try {
    const db = requireDb();
    const [row] = await db
      .select({ id: promoRedemptions.id })
      .from(promoRedemptions)
      .where(
        and(
          eq(promoRedemptions.promoCodeId, promoId),
          eq(promoRedemptions.userId, userId)
        )
      )
      .limit(1);
    return Boolean(row);
  } catch {
    const row = await prisma.promoRedemption.findUnique({
      where: { promoCodeId_userId: { promoCodeId: promoId, userId } },
    });
    return Boolean(row);
  }
}

function fail(
  code: string,
  errorCode: DiscountErrorCode,
  plan?: ValidateDiscountInput["plan"]
): DiscountValidation {
  return {
    valid: false,
    code,
    errorCode,
    message: messageForErrorCode(errorCode),
    plan,
    fullAccessIncluded: true,
  };
}

/**
 * Validate a discount code for checkout/signup.
 * Optional userId detects per-account redemption (already used).
 */
export async function validateDiscount(
  input: ValidateDiscountInput
): Promise<DiscountValidation> {
  const code = input.code.trim().toUpperCase();
  const { plan, userId, interval = "monthly" } = input;

  if (!code) {
    return fail("", "empty", plan);
  }

  const row = await findPromoRow(code);

  if (!row) {
    return fail(code, "not_found", plan);
  }

  if (!row.active) {
    return fail(code, "inactive", plan);
  }

  if (row.expiryDate && row.expiryDate < new Date()) {
    return fail(code, "expired", plan);
  }

  if (row.maxUses != null && row.currentUses >= row.maxUses) {
    return fail(code, "max_uses", plan);
  }

  if (userId && row.id) {
    const redeemed = await userAlreadyRedeemed(row.id, userId);
    if (redeemed) {
      return fail(code, "already_redeemed", plan);
    }
  }

  const pricing = plan
    ? buildPlanPricing(plan, "pro", interval, row.discountPercent, row.discountAmount)
    : undefined;

  const savingsText = pricing
    ? ` You save ${pricing.formattedSavings}.`
    : row.discountPercent
      ? ` ${row.discountPercent}% off.`
      : row.discountAmount
        ? ` $${row.discountAmount.toFixed(2)} off.`
        : "";

  return {
    valid: true,
    code,
    message: `Discount applied.${savingsText} ${FULL_ACCESS_COPY}`,
    plan,
    discountPercent: row.discountPercent ?? undefined,
    discountAmount: row.discountAmount ?? undefined,
    stripeCouponId: row.stripeCouponId,
    pricing,
    fullAccessIncluded: true,
  };
}
