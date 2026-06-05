import { eq, sql } from "drizzle-orm";
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

export async function redeemPromoCode(userId: string, code: string): Promise<void> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return;

  const validation = await validateDiscount({ code: normalized, userId });
  if (!validation.valid) return;

  try {
    const db = requireDb();
    const [promo] = await db
      .select({ id: promoCodes.id })
      .from(promoCodes)
      .where(eq(promoCodes.code, normalized))
      .limit(1);

    if (!promo) return;

    await db
      .insert(promoRedemptions)
      .values({ id: createId(), promoCodeId: promo.id, userId })
      .onConflictDoNothing({
        target: [promoRedemptions.promoCodeId, promoRedemptions.userId],
      });

    await db
      .update(promoCodes)
      .set({ currentUses: sql`${promoCodes.currentUses} + 1`, updatedAt: new Date() })
      .where(eq(promoCodes.id, promo.id));
  } catch {
    const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });
    if (!promo) return;
    await prisma.promoRedemption.upsert({
      where: {
        promoCodeId_userId: { promoCodeId: promo.id, userId },
      },
      create: { promoCodeId: promo.id, userId },
      update: {},
    });
    await prisma.promoCode.update({
      where: { id: promo.id },
      data: { currentUses: { increment: 1 } },
    });
  }
}
