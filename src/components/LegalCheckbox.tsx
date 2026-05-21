import { LEGAL_DISCLAIMERS } from "@/lib/legal";

export function LegalCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 text-left text-xs leading-relaxed text-[var(--color-ink-muted)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 shrink-0"
        required
      />
      <span>
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
          Disclaimers
        </a>
        . {LEGAL_DISCLAIMERS.userResponsibility}
      </span>
    </label>
  );
}
