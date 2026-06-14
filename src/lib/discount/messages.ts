import type { DiscountErrorCode } from "./types";

export const DISCOUNT_ERROR_MESSAGES: Record<
  Exclude<DiscountErrorCode, "empty" | "server_error" | "invalid_code">,
  string
> = {
  not_found:
    "This code isn’t valid. You can still continue with the standard price and full access.",
  inactive:
    "This code is no longer active. You can still continue with the standard price and full access.",
  expired:
    "This code has expired. You can still continue with the standard price and full access.",
  max_uses:
    "This code has reached its usage limit. You can still continue with the standard price and full access.",
  already_redeemed:
    "You’ve already used this code. You can still continue with the standard price and full access.",
};

export function messageForErrorCode(code: DiscountErrorCode): string {
  if (code === "empty") return "Enter a discount code.";
  if (code === "invalid_code") {
    return "This code isn't valid or can't be applied. You can still continue with the standard price and full access.";
  }
  if (code === "server_error") {
    return "We couldn’t verify this code right now. Try again or continue without it — full access is unchanged.";
  }
  return DISCOUNT_ERROR_MESSAGES[code];
}
