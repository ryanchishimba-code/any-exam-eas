"use client";

import { useEffect } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useDiscountValidation } from "@/lib/client/use-discount-validation";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type DiscountCodeInputProps = {
  plan: SignupPlan;
  initialCode?: string;
  onValidationChange?: (result: DiscountValidation | null) => void;
  variant?: "inline" | "compact";
  /** Hide duplicate price block — parent order summary shows totals */
  hidePricePreview?: boolean;
};

function errorTone(errorCode?: string): string {
  switch (errorCode) {
    case "expired":
    case "max_uses":
    case "already_redeemed":
      return "border-amber-200 bg-amber-50/90 text-amber-950";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function DiscountCodeInput({
  plan,
  initialCode = "",
  onValidationChange,
  variant = "inline",
  hidePricePreview = false,
}: DiscountCodeInputProps) {
  const { code, setCode, validation, status, applyNow, clear } = useDiscountValidation({
    plan,
  });

  useEffect(() => {
    if (initialCode.trim()) setCode(initialCode.toUpperCase());
  }, [initialCode, setCode]);

  useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);

  const showError = status === "invalid" && validation && !validation.valid;
  const showApplied = status === "valid" && validation?.valid;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white",
        variant === "inline"
          ? "border-slate-200/90 shadow-sm"
          : "border-slate-200/80"
      )}
    >
      <div className="flex gap-2 p-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), void applyNow())}
          placeholder="Enter discount code"
          className="apple-input min-w-0 flex-1 uppercase"
          autoComplete="off"
          spellCheck={false}
          aria-label="Discount code"
          aria-describedby="discount-feedback"
        />
        <button
          type="button"
          disabled={status === "checking" || code.trim().length < 2}
          onClick={() => void applyNow()}
          className="shrink-0 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          {status === "checking" ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden />
          ) : (
            "Apply"
          )}
        </button>
      </div>

      <div id="discount-feedback" className="px-4 pb-4" aria-live="polite">
        {status === "typing" && code.trim().length >= 2 && (
          <p className="text-xs text-slate-500">Validating…</p>
        )}

        {showError && validation && (
          <p
            className={cn(
              "flex gap-2 rounded-xl border px-3 py-2.5 text-xs leading-relaxed",
              errorTone(validation.errorCode)
            )}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{validation.message}</span>
          </p>
        )}

        {showApplied && !hidePricePreview && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
            {validation.code} applied — see updated total above
          </p>
        )}

        {showApplied && hidePricePreview && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
            <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
            Code accepted. Your order total has been updated.
          </p>
        )}
      </div>

      {code && !showApplied && (
        <div className="border-t border-slate-100 px-4 py-2">
          <button
            type="button"
            onClick={() => {
              clear();
              onValidationChange?.(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
