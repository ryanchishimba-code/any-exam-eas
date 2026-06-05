import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";

const STORAGE_KEY = "aee_checkout_discount";

export type StoredCheckoutDiscount = {
  code: string;
  plan: SignupPlan;
  validation: DiscountValidation;
  storedAt: string;
};

export function saveCheckoutDiscount(plan: SignupPlan, validation: DiscountValidation): void {
  if (!validation.valid || !validation.code) return;
  const payload: StoredCheckoutDiscount = {
    code: validation.code,
    plan,
    validation,
    storedAt: new Date().toISOString(),
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem("aee_promo", validation.code);
  } catch {
    /* ignore */
  }
}

export function loadCheckoutDiscount(plan: SignupPlan): StoredCheckoutDiscount | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCheckoutDiscount;
    if (parsed.plan !== plan || !parsed.validation?.valid) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearCheckoutDiscount(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("aee_promo");
  } catch {
    /* ignore */
  }
}
