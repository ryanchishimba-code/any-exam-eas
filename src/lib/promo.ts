import { and, eq, sql } from "drizzle-orm";
import { prisma } from "@/lib/prisma";
import { requireDb } from "@/db";
import { promoCodes, promoRedemptions } from "@/db/schema";
import { createId } from "@/lib/id";
import { validateDiscount } from "@/lib/discount/validate";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";

export type { PromoValidation } from "@/lib/promo-types";
export type { DiscountValidation } from "@/lib/discount/types";

/** @deprecated Use validateDiscount from @/lib/discount */
export async function validatePromoCode(
  raw: string,
  plan?: SignupPlan,
  userId?: string
): Promise<DiscountValidation> {
  return validateDiscount({ code: raw, plan, userId });
}

/**
 * Record a successful promo redemption (call only after payment / Stripe apply).
 * Idempotent per user+code — does not double-increment `currentUses`.
 */
export async function redeemPromoCode(userId: string, code: string): Promise<void> {
  const normalized = code.trim().toUpperCase();
  if (!normalized || !userId) return;

  try {
    const db = requireDb();
    const [promo] = await db
      .select({ id: promoCodes.id })
      .from(promoCodes)
      .where(eq(promoCodes.code, normalized))
      .limit(1);

    if (!promo) return;

    const inserted = await db
      .insert(promoRedemptions)
      .values({ id: createId(), promoCodeId: promo.id, userId })
      .onConflictDoNothing({
        target: [promoRedemptions.promoCodeId, promoRedemptions.userId],
      })
      .returning({ id: promoRedemptions.id });

    if (inserted.length === 0) return;

    await db
      .update(promoCodes)
      .set({ currentUses: sql`${promoCodes.currentUses} + 1`, updatedAt: new Date() })
      .where(eq(promoCodes.id, promo.id));
  } catch {
    const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });
    if (!promo) return;

    try {
      await prisma.promoRedemption.create({
        data: { promoCodeId: promo.id, userId },
      });
      await prisma.promoCode.update({
        where: { id: promo.id },
        data: { currentUses: { increment: 1 } },
      });
    } catch {
      /* unique violation — already redeemed */
    }
  }
}

/**
 * Remove a premature / unused redemption so the user can apply the code at checkout.
 * Decrements currentUses when a row is deleted (floor 0).
 */
export async function clearPromoRedemption(userId: string, code: string): Promise<boolean> {
  const normalized = code.trim().toUpperCase();
  if (!normalized || !userId) return false;

  try {
    const db = requireDb();
    const [promo] = await db
      .select({ id: promoCodes.id, currentUses: promoCodes.currentUses })
      .from(promoCodes)
      .where(eq(promoCodes.code, normalized))
      .limit(1);
    if (!promo) return false;

    const deleted = await db
      .delete(promoRedemptions)
      .where(
        and(eq(promoRedemptions.promoCodeId, promo.id), eq(promoRedemptions.userId, userId))
      )
      .returning({ id: promoRedemptions.id });

    if (deleted.length === 0) return false;

    if (promo.currentUses > 0) {
      await db
        .update(promoCodes)
        .set({
          currentUses: sql`GREATEST(${promoCodes.currentUses} - 1, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(promoCodes.id, promo.id));
    }
    return true;
  } catch {
    const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });
    if (!promo) return false;
    const result = await prisma.promoRedemption.deleteMany({
      where: { promoCodeId: promo.id, userId },
    });
    if (result.count === 0) return false;
    if (promo.currentUses > 0) {
      await prisma.promoCode.update({
        where: { id: promo.id },
        data: { currentUses: Math.max(0, promo.currentUses - 1) },
      });
    }
    return true;
  }
}
