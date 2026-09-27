import type { HeroNgnFrame as HeroNgnFrameData } from "@/lib/marketing/hero-ngn-frame";

/** Static screen of a published bow-tie, rationale, and stored sources. */
export function HeroNgnFrame({
  frame,
  className = "",
}: {
  frame: HeroNgnFrameData;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-3xl border border-white/15 bg-[#f7f4ef] text-[#1e3a5f] shadow-[0_24px_60px_rgba(0,0,0,0.28)] ${className}`}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-[#1e3a5f]/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em]">
        <span>Qbank · NGN bow-tie</span>
        <span className="font-medium normal-case tracking-normal text-[#1e3a5f]">
          Published item {frame.itemId}
        </span>
      </figcaption>
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold leading-relaxed">{frame.stem}</p>
        {frame.exhibitText ? (
          <div className="rounded-2xl bg-white px-3 py-3 text-sm leading-relaxed">
            {frame.exhibitTitle ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                {frame.exhibitTitle}
              </p>
            ) : null}
            <p className={`line-clamp-6 ${frame.exhibitTitle ? "mt-2" : ""}`}>{frame.exhibitText}</p>
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          {frame.columns.map((column) => (
            <div key={column.label}>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">
                {column.label}
              </p>
              <ul className="mt-2 space-y-1.5">
                {column.options.map((option) => (
                  <li
                    key={option.text}
                    className={
                      option.keyed
                        ? "rounded-xl bg-[#0d9488]/15 px-2 py-1.5 text-xs font-semibold leading-snug"
                        : "rounded-xl bg-white px-2 py-1.5 text-xs leading-snug text-[#1e3a5f]/80"
                    }
                  >
                    {option.keyed ? <span className="sr-only">Keyed answer. </span> : null}
                    {option.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white px-3 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">Rationale</p>
          <p className="mt-2 text-sm leading-relaxed">{frame.rationale}</p>
          <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[#1e3a5f]/75">
            {frame.sources.map((source) => (
              <li key={`${source.title}-${source.locator ?? ""}`}>
                Source: {source.title}
                {source.locator ? ` — ${source.locator}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </figure>
  );
}
