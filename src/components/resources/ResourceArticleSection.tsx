import type { ResourceSection } from "@/lib/seo/resources-content";

export function ResourceArticleSection({ section }: { section: ResourceSection }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[var(--color-ink)]">{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-3 leading-relaxed text-[var(--color-ink-muted)]">
          {paragraph}
        </p>
      ))}
      {section.bullets && section.bullets.length > 0 ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-ink-muted)]">
          {section.bullets.map((item) => (
            <li key={item.slice(0, 48)} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {section.comparisonRows && section.comparisonRows.length > 0 ? (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Feature
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  AnyExamEasy
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink-muted)]">
                  Typical QBank
                </th>
              </tr>
            </thead>
            <tbody>
              {section.comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-[var(--color-border)] last:border-0">
                  <th scope="row" className="px-4 py-3 font-medium text-[var(--color-ink)]">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{row.anyExamEasy}</td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">{row.typicalQbank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
