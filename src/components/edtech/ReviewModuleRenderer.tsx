"use client";

import {
  AlertTriangle,
  BookOpen,
  Brain,
  Eye,
  Lightbulb,
  Scale,
  Sparkles,
  Star,
  Table2,
} from "lucide-react";
import type { ReviewModuleContent, ReviewModuleSection, ReviewModuleSectionId } from "@/lib/edtech/review-modules/types";
import { REVIEW_MODULE_DEFAULT_TITLES, REVIEW_MODULE_SECTION_ORDER } from "@/lib/edtech/review-modules/types";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Partial<Record<ReviewModuleSectionId, typeof BookOpen>> = {
  "why-it-matters": Sparkles,
  "core-concepts": Brain,
  "clinical-applications": Star,
  comparisons: Scale,
  "visual-aids": Eye,
  misconceptions: AlertTriangle,
  pearls: Lightbulb,
  "quick-summary": BookOpen,
};

const SECTION_STYLES: Partial<Record<ReviewModuleSectionId, string>> = {
  "why-it-matters": "from-teal-50/90 to-white border-teal-200/60",
  "clinical-applications": "from-amber-50/90 to-white border-amber-200/70",
  misconceptions: "from-rose-50/90 to-white border-rose-200/70",
  pearls: "from-violet-50/90 to-white border-violet-200/70",
  "quick-summary": "from-slate-50 to-white border-slate-200/80",
};

export function ReviewModuleRenderer({ content }: { content: ReviewModuleContent }) {
  const ordered = getOrderedSections(content);

  return (
    <div className="space-y-6">
      {ordered.map((section, index) => (
        <ModuleSection key={section.id} section={section} index={index} />
      ))}
    </div>
  );
}

export function getOrderedSections(content: ReviewModuleContent): ReviewModuleSection[] {
  return REVIEW_MODULE_SECTION_ORDER.map((id) =>
    content.sections.find((s) => s.id === id)
  ).filter(Boolean) as ReviewModuleSection[];
}

export function ModuleSection({ section, index }: { section: ReviewModuleSection; index: number }) {
  const Icon = SECTION_ICONS[section.id] ?? BookOpen;
  const title = section.title || REVIEW_MODULE_DEFAULT_TITLES[section.id];
  const style = SECTION_STYLES[section.id] ?? "from-white to-slate-50/50 border-slate-200/60";

  return (
    <section
      className={cn(
        "rounded-2xl border bg-gradient-to-br p-5 shadow-sm",
        style
      )}
      aria-labelledby={`module-section-${section.id}`}
    >
      <h3
        id={`module-section-${section.id}`}
        className="flex items-center gap-2 text-sm font-semibold text-slate-900"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 text-xs font-bold text-teal-700 shadow-sm">
          {index + 1}
        </span>
        <Icon className="h-4 w-4 text-teal-600" aria-hidden />
        {title}
      </h3>

      {section.paragraphs?.length ? (
        <div className="mt-3 space-y-3 text-[0.9375rem] leading-[1.65] text-slate-700">
          {section.paragraphs.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
      ) : null}

      {section.bullets?.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
          {section.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.tables?.map((table) => (
        <div key={table.caption ?? table.headers.join("-")} className="mt-4 overflow-x-auto">
          {table.caption ? (
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Table2 className="h-3.5 w-3.5" aria-hidden />
              {table.caption}
            </p>
          ) : null}
          <table className="w-full min-w-[280px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-white/70">
                {table.headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold text-slate-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-slate-100">
                  {row.map((cell, ci) => (
                    <td key={`${row[0]}-${ci}`} className="px-3 py-2 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
