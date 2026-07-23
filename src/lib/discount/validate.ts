import { prisma } from "@/lib/prisma";
import { buildPlanPricing } from "@/lib/promo-pricing";
import { messageForErrorCode } from "./messages";
import type {
  DiscountErrorCode,
  DiscountValidation,
  ValidateDiscountInput,
} from "./types";
import { FULL_ACCESS_COPY } from "./access";

type PromoRow = {
  id: string;
  code: string;
  discountPercent: number | null;
  discountAmount: number | null;
  expiryDate: Date | null;
  maxUses: number | null;
  currentUses: number;
  active: boolean;
  stripeCouponId: string | null;
};

/** Short TTL so debounced typing doesn't hammer Neon on every keystroke. */
const PROMO_CACHE_TTL_MS = 30_000;
const promoCache = new Map<string, { row: PromoRow | null; expiresAt: number }>();

function readPromoCache(code: string): PromoRow | null | undefined {
  const hit = promoCache.get(code);
  if (!hit) return undefined;
  if (hit.expiresAt < Date.now()) {
    promoCache.delete(code);
    return undefined;
  }
  return hit.row;
}

function writePromoCache(code: string, row: PromoRow | null): void {
  promoCache.set(code, { row, expiresAt: Date.now() + PROMO_CACHE_TTL_MS });
  if (promoCache.size > 200) {
    const oldest = promoCache.keys().next().value;
    if (oldest) promoCache.delete(oldest);
  }
}

/** Invalidate after redeem/clear so maxUses stays accurate. */
export function invalidatePromoCache(code?: string): void {
  if (!code) {
    promoCache.clear();
    return;
  }
  promoCache.delete(code.trim().toUpperCase());
}

async function findPromoRow(code: string): Promise<PromoRow | null> {
  const cached = readPromoCache(code);
  if (cached !== undefined) return cached;

  const row = await prisma.promoCode.findUnique({ where: { code } });
  if (!row) {
    writePromoCache(code, null);
    return null;
  }
  const mapped: PromoRow = {
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
  writePromoCache(code, mapped);
  return mapped;
}

async function userAlreadyRedeemed(promoId: string, userId: string): Promise<boolean> {
  const row = await prisma.promoRedemption.findUnique({
    where: { promoCodeId_userId: { promoCodeId: promoId, userId } },
    select: { id: true },
  });
  return Boolean(row);
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

  if (userId) {
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
