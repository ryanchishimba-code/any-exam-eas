"use client";

import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import Link from "next/link";

type Props = {
  acceptedTerms: boolean;
  acceptedAge: boolean;
  onTermsChange: (v: boolean) => void;
  onAgeChange: (v: boolean) => void;
};

export function LegalCheckboxGroup({
  acceptedTerms,
  acceptedAge,
  onTermsChange,
  onAgeChange,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl bg-[var(--color-surface)] p-4 text-sm">
      <label className="flex cursor-pointer gap-3">
        <input
          type="checkbox"
          checked={acceptedAge}
          onChange={(e) => onAgeChange(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I confirm I am at least 18 years old. {LEGAL_DISCLAIMERS.ageRequirement}
        </span>
      </label>
      <label className="flex cursor-pointer gap-3">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => onTermsChange(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I agree to the{" "}
          <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/legal/privacy" className="text-[var(--color-accent)] underline">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/legal/disclaimer" className="text-[var(--color-accent)] underline">
            Educational Disclaimer
          </Link>
          . I understand content is for study support only and I am responsible for
          verifying accuracy.
        </span>
      </label>
    </div>
  );
}
