"use client";

import { LEGAL_DISCLAIMERS } from "@/lib/legal";
import { getSignupConsentSummaryLines } from "@/lib/legal/consent-attestations";
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
        <div>
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
          . I understand and agree that:
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[var(--color-ink-muted)]">
            {getSignupConsentSummaryLines().map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-2">
            Billing terms include auto-renewal and non-refundable payments as described in the Terms.{" "}
            {LEGAL_DISCLAIMERS.userResponsibility}
          </p>
        </div>
      </label>
    </div>
  );
}
