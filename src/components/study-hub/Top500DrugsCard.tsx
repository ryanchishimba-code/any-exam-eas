import Link from "next/link";
import { ArrowRight, Beaker } from "lucide-react";

/** Literal path — avoid pulling study-hub/config → routes into home client chunks. */
const TOP_500_DRUGS_PATH = "/study/drugs300";

export function Top500DrugsCard() {
  return (
    <Link
      href={TOP_500_DRUGS_PATH}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-500/10 to-orange-600/5 p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white/80 p-2.5 text-amber-700 shadow-sm">
          <Beaker className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Top 500 Drugs</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            One shared list for NCLEX, USMLE, and NAPLEX — flashcards with spaced
            repetition.
          </p>
        </div>
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
        aria-hidden
      />
    </Link>
  );
}
