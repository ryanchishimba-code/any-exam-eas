import {
  TRIAL_UPGRADE_COUPON_ID,
  TRIAL_UPGRADE_OFFER_PERCENT,
  isTrialUpgradeCoupon,
} from "@/lib/billing/trial-upgrade-offer";

type CouponLike = {
  percent_off: number | null;
  duration: string | null;
  valid: boolean;
};

type CouponApi = {
  coupons: {
    retrieve: (id: string) => Promise<CouponLike>;
    create: (params: {
      id: string;
      percent_off: number;
      duration: "once";
      name: string;
      metadata: { purpose: string };
    }) => Promise<{ id: string }>;
  };
};

function isMissingCoupon(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "resource_missing"
  );
}

/**
 * One Stripe coupon for every offer. Duration `once` limits it to the first
 * invoice (or the single pay-once charge). Per-user expiry lives on the offer row.
 * Prefers STRIPE_TRIAL_UPGRADE_COUPON_ID when that coupon is already 25% once.
 */
export async function resolveTrialUpgradeCouponId(stripe: CouponApi): Promise<string> {
  const fromEnv = process.env.STRIPE_TRIAL_UPGRADE_COUPON_ID?.trim();
  const id = fromEnv || TRIAL_UPGRADE_COUPON_ID;

  try {
    const existing = await stripe.coupons.retrieve(id);
    if (!isTrialUpgradeCoupon(existing)) {
      throw new Error(
        `Coupon ${id} must be ${TRIAL_UPGRADE_OFFER_PERCENT}% off with duration once.`
      );
    }
    return id;
  } catch (error) {
    if (!isMissingCoupon(error)) throw error;
    if (fromEnv) {
      throw new Error(`STRIPE_TRIAL_UPGRADE_COUPON_ID ${id} was not found in Stripe.`);
    }
  }

  const created = await stripe.coupons.create({
    id: TRIAL_UPGRADE_COUPON_ID,
    percent_off: TRIAL_UPGRADE_OFFER_PERCENT,
    duration: "once",
    name: "Trial upgrade — 25% off first payment",
    metadata: { purpose: "trial_upgrade_first_payment" },
  });
  return created.id;
}
