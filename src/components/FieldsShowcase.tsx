import { FIELD_LABELS } from "@/lib/fields";

export function FieldsShowcase() {
  return (
    <section className="py-[clamp(4rem,10vw,7rem)]">
      <div className="mx-auto max-w-[980px] px-6 text-center">
        <p className="apple-eyebrow">Subjects</p>
        <h2 className="apple-headline mt-3">K–12 to professional.</h2>
        <p className="apple-lede mx-auto mt-5">
          Every field pulls from open textbooks and curated research — then generates
          high-yield questions scoped to the subject you choose.
        </p>
        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {FIELD_LABELS.map((f) => (
            <li key={f}>
              <span className="apple-pill inline-block">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
