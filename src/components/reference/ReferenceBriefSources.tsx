import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import type { ReferenceBriefSource } from "@/lib/reference/study-brief-types";
import { cn } from "@/lib/utils";

const SOURCE_LABELS: Record<ReferenceBriefSource["sourceType"], string> = {
  oer: "OER",
  web: "Guideline",
  exam_focus: "Exam focus",
  curriculum: "Curriculum",
};

type Props = {
  sources: ReferenceBriefSource[];
  className?: string;
  variant?: "light" | "dark";
  ctaClass?: string;
};

export function ReferenceBriefSources({
  sources,
  className,
  variant = "dark",
  ctaClass,
}: Props) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <div className={cn("mt-4", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition",
          isDark
            ? cn("border border-white/40", ctaClass ?? "bg-white text-slate-900 hover:bg-slate-50")
            : "border border-black/[0.08] bg-white text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
        )}
        aria-expanded={open}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        {open ? "Hide" : "View"} {sources.length} verified sources
      </button>

      {open ? (
        <ul
          className={cn(
            "mt-3 max-h-56 space-y-2 overflow-y-auto rounded-2xl border p-3 shadow-sm",
            isDark
              ? "border-white/40 bg-white/95 text-slate-900"
              : "border-black/[0.06] bg-[var(--color-surface)]"
          )}
        >
          {sources.map((source) => (
            <li key={source.url}>
              <Link
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs transition",
                  isDark
                    ? "text-slate-900 hover:bg-slate-100"
                    : "text-[var(--color-ink)] hover:bg-white"
                )}
              >
                <ExternalLink
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-accent)] opacity-80"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="font-semibold leading-snug text-slate-900 group-hover:underline">
                    {source.title}
                  </span>
                  <span className="mt-0.5 flex flex-wrap gap-1.5 text-slate-600">
                    <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-700">
                      {SOURCE_LABELS[source.sourceType]}
                    </span>
                    {source.topic ? <span>{source.topic}</span> : null}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
