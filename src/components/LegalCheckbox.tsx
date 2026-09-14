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
        <details className="rounded-xl border border-[var(--color-border)]/70 bg-[var(--color-surface)]/60 px-3 py-2">
          <summary className="cursor-pointer text-[11px] font-semibold text-[var(--color-ink)]">
            What you are agreeing to
          </summary>
          <span className="mt-2 block space-y-2 text-[11px] text-[var(--color-ink-muted)]">
            {summaryLine ? <span className="block">{summaryLine}</span> : null}
            <span className="block">
              {LEGAL_ENTITY.productName} does not guarantee exam passage, licensure, or
              certification. Subscription terms include auto-renewal as described in the Terms.
            </span>
          </span>
        </details>
      </span>
    </label>
  );
}
