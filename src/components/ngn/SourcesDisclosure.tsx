import { ngnFocus, ngnMuted } from "@/components/ngn/brand";
import { CollapsibleSources } from "@/components/study/questions/CollapsibleSources";
import { resolveCitedSources, type CitedSource } from "@/lib/assessment/sources";
import type { NgnReference, SourceRef } from "@/lib/assessment/types";

type SourcesDisclosureProps = {
  itemReferences: NgnReference[];
  caseReferences?: NgnReference[];
  sourcesById: Record<string, Pick<SourceRef, "title" | "url"> | undefined>;
};

function SourceList({ label, links }: { label: string; links: CitedSource[] }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#334155]">{label}</p>
      {links.length === 0 ? (
        <p className={`mt-1 text-sm leading-6 ${ngnMuted}`}>None listed.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {links.map((link) => (
            <li key={`${label}-${link.src}-${link.locator ?? ""}`}>
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-medium text-[#0A2540] underline decoration-[#00D4C8] decoration-2 underline-offset-4 ${ngnFocus}`}
                >
                  {link.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-sm font-medium text-[#0A2540]">{link.title}</span>
              )}
              {link.locator ? <span className={`mt-0.5 block text-sm leading-6 ${ngnMuted}`}>{link.locator}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Collapsed source list. Teal is the underline only. */
export function SourcesDisclosure({ itemReferences, caseReferences, sourcesById }: SourcesDisclosureProps) {
  const itemLinks = resolveCitedSources(itemReferences, sourcesById);
  const caseLinks = caseReferences ? resolveCitedSources(caseReferences, sourcesById) : null;
  const count = itemLinks.length + (caseLinks?.length ?? 0);
  const resetKey = [
    ...itemReferences.map((reference) => `${reference.src}:${reference.locator ?? ""}`),
    ...(caseReferences ?? []).map((reference) => `case:${reference.src}:${reference.locator ?? ""}`),
  ].join("|");

  return (
    <CollapsibleSources
      count={count}
      resetKey={resetKey}
      buttonClassName="text-[#334155] hover:text-[#0A2540]"
    >
      <div className="space-y-4 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-4">
        <SourceList label="This item" links={itemLinks} />
        {caseLinks ? <SourceList label="This case" links={caseLinks} /> : null}
      </div>
    </CollapsibleSources>
  );
}
