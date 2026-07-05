import { LEGAL_ENTITY } from "@/lib/legal";
import { getSignupConsentSummaryLines } from "@/lib/legal/consent-attestations";

export function LegalCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const summaryLines = getSignupConsentSummaryLines();

  return (
    <label className="flex cursor-pointer gap-3 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 shrink-0"
        required
      />
      <span className="block space-y-2">
        <span className="block">
          I confirm I am at least 18 years old. I have read and agree to the{" "}
          <a href="/legal/terms" className="text-[var(--color-accent)] underline" target="_blank">
            Terms of Service
          </a>
          ,{" "}
          <a href="/legal/privacy" className="text-[var(--color-accent)] underline" target="_blank">
            Privacy Policy
          </a>
          , and{" "}
          <a href="/legal/disclaimer" className="text-[var(--color-accent)] underline" target="_blank">
            Educational Disclaimers
          </a>
          .
        </span>
        <span className="block font-medium text-[var(--color-ink)]">
          I understand and agree that:
        </span>
        <ul className="list-disc space-y-1 pl-4">
          {summaryLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <span className="block text-[11px] text-[var(--color-ink-muted)]">
          {LEGAL_ENTITY.productName} does not guarantee exam passage, licensure, or certification.
          Subscription terms include auto-renewal as described in the Terms.
        </span>
      </span>
    </label>
  );
}
