"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Sparkles, Tag } from "lucide-react";
import type { PromoValidation } from "@/lib/promo-types";
import { formatUsd, hasDiscount } from "@/lib/promo-pricing";
import type { SignupPlan } from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type DiscountCodeSectionProps = {
  plan: SignupPlan | "";
  value: string;
  onChange: (code: string) => void;
  onValidated?: (result: PromoValidation | null) => void;
  /** Pre-fill from URL (?promo=) */
  autoApplyInitial?: boolean;
};

function PriceCompare({
  original,
  discounted,
  label,
}: {
  original: number;
  discounted: number;
  label: string;
}) {
  const showStrike = discounted < original - 0.001;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <span className="text-sm text-slate-600">{label}</span>
      <div className="flex items-baseline gap-2">
        {showStrike && (
          <span className="text-sm text-slate-400 line-through">{formatUsd(original)}</span>
        )}
        <span
          className={cn(
            "text-lg font-semibold tabular-nums tracking-tight",
            showStrike ? "text-emerald-700" : "text-slate-900"
          )}
        >
          {formatUsd(discounted)}
        </span>
      </div>
    </div>
  );
}

export function DiscountCodeSection({
  plan,
  value,
  onChange,
  onValidated,
  autoApplyInitial = false,
}: DiscountCodeSectionProps) {
  const [open, setOpen] = useState(Boolean(value));
  const [status, setStatus] = useState<"idle" | "checking" | "applied" | "error">("idle");
  const [result, setResult] = useState<PromoValidation | null>(null);
  const [inputError, setInputError] = useState("");

  const applyCode = useCallback(
    async (code: string, selectedPlan: SignupPlan) => {
      const trimmed = code.trim();
      if (trimmed.length < 2) {
        setInputError("Enter at least 2 characters.");
        setResult(null);
        onValidated?.(null);
        return;
      }

      setInputError("");
      setStatus("checking");

      try {
        const res = await fetch("/api/discount/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: trimmed, plan: selectedPlan }),
        });
        const data = (await res.json()) as PromoValidation;
        setResult(data);
        onValidated?.(data);
        setStatus(data.valid ? "applied" : "error");
      } catch {
        const fallback: PromoValidation = {
          valid: false,
          code: trimmed.toUpperCase(),
          message: "Could not verify this code. Try again or continue without it.",
          plan: selectedPlan,
          fullAccessIncluded: true,
        };
        setResult(fallback);
        onValidated?.(fallback);
        setStatus("error");
      }
    },
    [onValidated]
  );

  useEffect(() => {
    if (!plan) {
      setResult(null);
      onValidated?.(null);
      setStatus("idle");
      return;
    }
    if (autoApplyInitial && value.trim().length >= 2 && status === "idle") {
      void applyCode(value, plan);
    }
  }, [plan, autoApplyInitial, value, applyCode, onValidated, status]);

  useEffect(() => {
    if (!open || !plan) return;
    if (result?.code && result.code !== value.trim().toUpperCase()) {
      setResult(null);
      onValidated?.(null);
      setStatus("idle");
    }
  }, [value, open, plan, result?.code, onValidated]);

  if (!plan) return null;

  if (!open) {
    return (
      <div className="flex justify-center pt-1">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] transition hover:opacity-80"
          onClick={() => setOpen(true)}
        >
          <Tag className="h-3.5 w-3.5" aria-hidden />
          Have a discount code?
        </button>
      </div>
    );
  }

  const pricing = result?.valid ? result.pricing : undefined;
  const showSuccess = status === "applied" && result?.valid && pricing && hasDiscount(pricing);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-sm)]"
      aria-label="Discount code"
    >
      <div className="border-b border-black/[0.04] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          Discount code
        </p>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value.toUpperCase());
              setInputError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void applyCode(value, plan);
              }
            }}
            placeholder="Enter code"
            className="apple-input min-w-0 flex-1 uppercase"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(inputError || (status === "error" && result && !result.valid))}
          />
          <button
            type="button"
            disabled={status === "checking" || !value.trim()}
            onClick={() => void applyCode(value, plan)}
            className="shrink-0 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "checking" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              "Apply"
            )}
          </button>
        </div>

        {inputError && (
          <p className="text-xs text-amber-800" role="alert">
            {inputError}
          </p>
        )}

        {status === "error" && result && !result.valid && (
          <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600" role="status">
            {result.message}
          </p>
        )}

        {showSuccess && pricing && (
          <div
            className="space-y-3 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white px-4 py-3"
            role="status"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  {result?.code} applied
                </p>
                <p className="mt-0.5 text-xs text-emerald-800">{result?.message}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-emerald-200/60 pt-3">
              <PriceCompare
                label={pricing.primary.label}
                original={pricing.primary.original}
                discounted={pricing.primary.discounted}
              />
              {pricing.recurring && (
                <PriceCompare
                  label={pricing.recurring.label}
                  original={pricing.recurring.original}
                  discounted={pricing.recurring.discounted}
                />
              )}
            </div>

            <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Full subscription access — same features as standard pricing.
            </p>
          </div>
        )}

        {status === "applied" && result?.valid && pricing && !hasDiscount(pricing) && (
          <p className="text-xs text-slate-600" role="status">
            {result.message}
          </p>
        )}

        <button
          type="button"
          className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          onClick={() => {
            setOpen(false);
            onChange("");
            setResult(null);
            onValidated?.(null);
            setStatus("idle");
          }}
        >
          Hide discount code
        </button>
      </div>
    </section>
  );
}
