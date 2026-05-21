import { FIELD_LABELS } from "@/lib/fields";

export function FieldsShowcase() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          K–12 to professional.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[var(--color-ink-muted)]">
          Every subject pulls from open textbooks (OpenStax, LibreTexts, Wikibooks)
          plus curated web research — then generates high-yield exam questions.
        </p>
        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3">
          {FIELD_LABELS.map((f) => (
            <li
              key={f}
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
