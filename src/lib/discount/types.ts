import type { BillingInterval } from "@/lib/billing-config";
import type { PromoPricing } from "@/lib/promo-pricing";
import type { SignupPlan } from "@/lib/validators/auth";

/** Machine-readable validation outcome for UI and logging. */
export type DiscountErrorCode =
  | "empty"
  | "not_found"
  | "inactive"
  | "expired"
  | "max_uses"
  | "already_redeemed"
  | "invalid_code"
  | "server_error";

export type DiscountValidation = {
  valid: boolean;
  code: string;
  message: string;
  errorCode?: DiscountErrorCode;
  plan?: SignupPlan;
  discountPercent?: number;
  discountAmount?: number;
  stripeCouponId?: string | null;
  pricing?: PromoPricing;
  /** Discount never reduces product features — same as standard subscribers. */
  fullAccessIncluded: boolean;
};

export type ValidateDiscountInput = {
  code: string;
  plan?: SignupPlan;
  interval?: BillingInterval;
  userId?: string;
};
