"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BillingInterval } from "@/lib/billing-config";
import type { DiscountValidation } from "@/lib/discount/types";
import type { SignupPlan } from "@/lib/validators/auth";

type UseDiscountValidationOptions = {
  plan: SignupPlan | "";
  interval?: BillingInterval;
  /** Debounce ms for real-time checks (default 450) */
  debounceMs?: number;
  /** Min characters before validating (default 2) */
  minLength?: number;
};

type UseDiscountValidationResult = {
  code: string;
  setCode: (code: string) => void;
  validation: DiscountValidation | null;
  status: "idle" | "typing" | "checking" | "valid" | "invalid";
  applyNow: () => Promise<DiscountValidation | null>;
  clear: () => void;
};

export function useDiscountValidation({
  plan,
  interval = "monthly",
  debounceMs = 450,
  minLength = 2,
}: UseDiscountValidationOptions): UseDiscountValidationResult {
  const [code, setCode] = useState("");
  const [validation, setValidation] = useState<DiscountValidation | null>(null);
  const [status, setStatus] = useState<UseDiscountValidationResult["status"]>("idle");
  const abortRef = useRef<AbortController | null>(null);

  const fetchValidation = useCallback(
    async (raw: string, selectedPlan: SignupPlan): Promise<DiscountValidation | null> => {
      const trimmed = raw.trim();
      if (trimmed.length < minLength) {
        setValidation(null);
        setStatus("idle");
        return null;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus("checking");

      try {
        const params = new URLSearchParams({
          code: trimmed,
          plan: selectedPlan,
          interval,
        });
        const res = await fetch(`/api/discount/validate?${params}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as DiscountValidation;
        if (controller.signal.aborted) return null;

        setValidation(data);
        setStatus(data.valid ? "valid" : "invalid");
        return data;
      } catch (e) {
        if (controller.signal.aborted) return null;
        const fallback: DiscountValidation = {
          valid: false,
          code: trimmed.toUpperCase(),
          errorCode: "server_error",
          message:
            "We couldn’t verify this code. Try again or continue without it.",
          plan: selectedPlan,
          fullAccessIncluded: true,
        };
        setValidation(fallback);
        setStatus("invalid");
        return fallback;
      }
    },
    [minLength, interval]
  );

  useEffect(() => {
    if (!plan) {
      setValidation(null);
      setStatus("idle");
      return;
    }

    if (code.trim().length < minLength) {
      setValidation(null);
      setStatus(code.trim() ? "typing" : "idle");
      return;
    }

    setStatus("typing");
    const t = setTimeout(() => {
      void fetchValidation(code, plan);
    }, debounceMs);

    return () => clearTimeout(t);
  }, [code, plan, debounceMs, minLength, fetchValidation]);

  const applyNow = useCallback(async () => {
    if (!plan) return null;
    abortRef.current?.abort();
    setStatus("checking");
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), plan, interval }),
      });
      const data = (await res.json()) as DiscountValidation;
      setValidation(data);
      setStatus(data.valid ? "valid" : "invalid");
      return data;
    } catch {
      const fallback: DiscountValidation = {
        valid: false,
        code: code.trim().toUpperCase(),
        errorCode: "server_error",
        message: "We couldn’t verify this code. Try again or continue without it.",
        plan,
        fullAccessIncluded: true,
      };
      setValidation(fallback);
      setStatus("invalid");
      return fallback;
    }
  }, [code, plan, interval]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setCode("");
    setValidation(null);
    setStatus("idle");
  }, []);

  return { code, setCode, validation, status, applyNow, clear };
}
