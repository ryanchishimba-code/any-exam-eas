import type { DiscountValidation } from "./types";

const ENUMERABLE_FAILURE_CODES = new Set([
  "not_found",
  "inactive",
  "expired",
  "max_uses",
]);

const PUBLIC_INVALID_MESSAGE =
  "This code isn't valid or can't be applied. You can still continue with the standard price and full access.";

/** Collapse promo enumeration signals for unauthenticated public validation. */
export function sanitizeDiscountForPublic(
  result: DiscountValidation
): DiscountValidation {
  // Never expose Stripe coupon IDs to the browser — checkout re-validates server-side.
  const { stripeCouponId: _coupon, ...safe } = result;

  if (safe.valid) return safe;
  if (safe.errorCode && ENUMERABLE_FAILURE_CODES.has(safe.errorCode)) {
    return {
      ...safe,
      errorCode: "invalid_code",
      message: PUBLIC_INVALID_MESSAGE,
    };
  }
  return safe;
}
