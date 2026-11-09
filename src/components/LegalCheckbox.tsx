import { LEGAL_ENTITY } from "@/lib/legal";
import { getSignupConsentSummaryLines } from "@/lib/legal/consent-attestations";

export function LegalCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const summaryLine = getSignupConsentSummaryLines()[0];

  return (
    <label className="flex cursor-pointer gap-3 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 shrink-0 accent-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        required
      />
      <span className="block space-y-2">
        <span className="block">
          I confirm I am at least 18 years old. I have read and agree to the{" "}
          <a href="/legal/terms" className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          ,{" "}
          <a href="/legal/privacy" className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          , and{" "}
          <a href="/legal/disclaimer" className="text-[var(--color-accent)] underline" target="_blank" rel="noopener noreferrer">
            Educational Disclaimers
          </a>
          .
        </span>
        {summaryLine ? (
          <span className="block space-y-1">
            {getSignupConsentSummaryLines().map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        ) : null}
        <details className="rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/60 px-3 py-2">
          <summary className="cursor-pointer text-[11px] font-semibold text-[var(--color-ink)]">
            Billing terms
          </summary>
          <span className="mt-2 block text-[11px] text-[var(--color-ink-muted)]">
            {LEGAL_ENTITY.productName} does not charge a card for the free trial. A paid
            subscription renews automatically at the price and interval you accept at checkout,
            until you cancel renewal in Settings. That checkout has its own renewal checkbox.
          </span>
        </details>
      </span>
    </label>
  );
}
