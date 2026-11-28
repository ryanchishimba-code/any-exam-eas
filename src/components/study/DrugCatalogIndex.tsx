import { ChevronDown } from "lucide-react";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  drugCatalogItemListJsonLd,
  publicDrugRowsByClass,
  publicDrugRowsByLetter,
} from "@/lib/drugs300/public-index";
import { studyUi } from "@/lib/study/study-ui";

const summaryClass =
  "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-[14px] font-semibold text-[var(--color-ink)] [&::-webkit-details-marker]:hidden";

function DrugNameList({
  drugs,
  withIds = false,
}: {
  drugs: { id: string; generic: string; brand: string; therapeuticClass: string }[];
  withIds?: boolean;
}) {
  return (
    <ul className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
      {drugs.map((drug) => (
        <li
          key={drug.id}
          id={withIds ? `drug-${drug.id}` : undefined}
          className="min-w-0 break-words border-b border-[var(--color-border)]/40 py-2.5 text-[13px] leading-snug"
        >
          <span className="font-medium text-[var(--color-ink)]">{drug.generic}</span>
          <span className="mt-0.5 block text-[12px] text-[var(--color-ink-muted)]">
            {drug.brand}
            <span aria-hidden> · </span>
            {drug.therapeuticClass}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server-rendered name index. Closed by default so the deck above stays the
 * page. The names are in the HTML either way. Mnemonics and pearls are not.
 */
export function DrugCatalogIndex() {
  const letters = publicDrugRowsByLetter();
  const classes = publicDrugRowsByClass();

  return (
    <section className="space-y-4 border-t border-[var(--color-border)]/60 pb-16 pt-6" aria-labelledby="drug-catalog-az">
      <JsonLdScript data={drugCatalogItemListJsonLd()} />
      <p className={studyUi.sectionHint}>
        Generic name, brand, and class for every drug in the deck. Indications, side effects, and
        mnemonics stay on the flashcards.
      </p>

      <div className="space-y-2">
        <h2 id="drug-catalog-az" className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
          Drug catalog, A to Z
        </h2>
        <details className={`group ${studyUi.panel}`}>
          <summary className={summaryClass}>
            <span>Show drugs A to Z</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-[var(--color-border)]/60 px-4 pb-4">
            {letters.map((group) => (
              <div key={group.letter} className="mt-4 first:mt-4">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {group.letter}
                </h3>
                <DrugNameList drugs={group.drugs} withIds />
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="space-y-2">
        <h2 id="drug-catalog-class" className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
          Classes in this deck
        </h2>
        <ul className={`${studyUi.panel} grid grid-cols-1 sm:grid-cols-2`}>
          {classes.map((group) => (
            <li
              key={group.id}
              className="min-w-0 break-words border-b border-[var(--color-border)]/40 px-4 py-3 text-[13px] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <h3 className="font-semibold text-[var(--color-ink)]">{group.label}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
