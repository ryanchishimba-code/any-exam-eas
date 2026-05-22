import { FIELD_LABELS } from "@/lib/fields";

export function FieldsShowcase() {
  return (
    <section className="py-[clamp(4rem,10vw,7rem)]">
      <div className="mx-auto max-w-[980px] px-6 text-center">
        <p className="apple-eyebrow">Health sciences</p>
        <h2 className="apple-headline mt-3">Medicine, nursing, pharmacy.</h2>
        <p className="apple-lede mx-auto mt-5">
          Questions are stratified by board-style subject areas — USMLE topics for
          medicine, NCLEX categories for nursing, and NAPLEX domains for pharmacy.
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
