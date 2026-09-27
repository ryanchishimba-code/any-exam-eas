import type { HomeProofFact } from "@/lib/marketing/home-proof";

/** Real facts only. No stars, pass rates, or user counts. */
export function HomeProofStrip({ facts }: { facts: HomeProofFact[] }) {
  if (facts.length === 0) return null;
  return (
    <section aria-label="Proof" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <ul className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2 sm:px-6">
        {facts.map((fact) => (
          <li key={fact.id} className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
            {fact.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
