"use client";

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
  const summaryLine = getSignupConsentSummaryLines()[0];

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
        <span>I confirm I am at least 18 years old.</span>
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
            Educational Disclaimers
          </Link>
          .
          {summaryLine ? (
            <p className="mt-2 text-[var(--color-ink-muted)]">{summaryLine}</p>
          ) : null}
        </div>
      </label>
    </div>
  );
}
