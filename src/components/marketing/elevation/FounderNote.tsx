import { FOUNDER_NOTE } from "@/lib/testimonials/consented-seed";

/** Founder line. Not a customer testimonial. */
export function FounderNote() {
  return (
    <aside className="rounded-3xl bg-[#1e3a5f] px-6 py-8 text-white sm:px-8" aria-label="From our founder">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5eead4]">{FOUNDER_NOTE.kicker}</p>
      <blockquote className="mt-4 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
        “{FOUNDER_NOTE.quote}”
      </blockquote>
      <p className="mt-5 text-sm font-medium text-white/80">{FOUNDER_NOTE.attribution}</p>
    </aside>
  );
}
