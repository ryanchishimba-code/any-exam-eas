import { LEGAL_DISCLAIMERS } from "@/lib/legal";

export const metadata = { title: "Disclaimers — Any Exam Easy" };

export default function DisclaimerPage() {
  const items = Object.entries(LEGAL_DISCLAIMERS);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-2xl px-6">
        <h1 className="text-3xl font-semibold">Disclaimers</h1>
        <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
          Please read carefully before using Any Exam Easy for academic or professional study.
        </p>
        <ul className="mt-10 space-y-6">
          {items.map(([key, text]) => (
            <li key={key} className="rounded-2xl bg-[var(--color-surface)] p-6 text-sm leading-relaxed">
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-[var(--color-ink-muted)]">
          These disclaimers do not replace advice from a qualified attorney. Jurisdiction-specific
          requirements may apply.
        </p>
      </article>
    </div>
  );
}
