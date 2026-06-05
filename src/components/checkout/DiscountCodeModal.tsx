"use client";

import { X } from "lucide-react";
import { DiscountCodeInput } from "@/components/discount/DiscountCodeInput";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";

type DiscountCodeModalProps = {
  open: boolean;
  onClose: () => void;
  plan: SignupPlan;
  initialCode?: string;
  onApplied: (result: DiscountValidation) => void;
};

export function DiscountCodeModal({
  open,
  onClose,
  plan,
  initialCode = "",
  onApplied,
}: DiscountCodeModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="discount-modal-title" className="text-lg font-semibold text-slate-900">
            Apply discount
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <DiscountCodeInput
          plan={plan}
          initialCode={initialCode}
          variant="compact"
          onValidationChange={(result) => {
            if (result?.valid) {
              onApplied(result);
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}
