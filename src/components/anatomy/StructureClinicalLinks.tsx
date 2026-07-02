"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Activity, Pill, Stethoscope, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  anatomyDrugHref,
  getResolvedDiseaseLinksForStructure,
  type ClinicalEndpoint,
  type ResolvedAnatomyDiseaseLink,
} from "@/lib/anatomy/clinical-links";
import type { AnatomyStructure } from "@/lib/anatomy/types";

type Props = {
  structure: AnatomyStructure;
  focusedDiseaseId?: string | null;
  onFocusDisease?: (diseaseId: string | null) => void;
};

export function StructureClinicalLinks({
  structure,
  focusedDiseaseId = null,
  onFocusDisease,
}: Props) {
  const diseases = getResolvedDiseaseLinksForStructure(structure.id).filter(
    (d) => d.firstLineDrugs.length > 0 || d.adjunctDrugs.length > 0
  );

  if (diseases.length === 0) return null;

  return (
    <section aria-label="Disease states and treatments">
      <div className="mb-2 flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-cyan-400" aria-hidden />
        <h4 className="text-sm font-bold text-white">Disease → drug → endpoints</h4>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-white/70">
        Tap a related condition above or explore each thread — drugs open the Top 500 card.
      </p>

      <ul className="space-y-3">
        {diseases.map((disease) => (
          <DiseaseCard
            key={disease.id}
            disease={disease}
            focused={focusedDiseaseId === disease.id}
            onFocus={() => onFocusDisease?.(disease.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function DiseaseCard({
  disease,
  focused,
  onFocus,
}: {
  disease: ResolvedAnatomyDiseaseLink;
  focused: boolean;
  onFocus: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focused]);

  return (
    <li
      ref={ref}
      id={`disease-${disease.id}`}
      className={`rounded-2xl border p-3 transition ${
        focused
          ? "border-cyan-500/40 bg-[#283040] ring-1 ring-cyan-500/25"
          : "border-white/[0.08] bg-[#222b38]"
      }`}
    >
      <button
        type="button"
        onClick={onFocus}
        className="flex w-full flex-wrap items-center gap-2 text-left"
      >
        <p className="text-sm font-semibold text-white">{disease.name}</p>
        {disease.highYield ? (
          <Badge className="bg-amber-500/15 text-amber-200">High-yield</Badge>
        ) : null}
        {disease.generated ? (
          <Badge className="bg-white/[0.08] text-white/70">Auto-linked</Badge>
        ) : null}
      </button>

      <p className="mt-1.5 text-xs leading-relaxed text-white/70">
        {disease.pathophysiology}
      </p>

      {disease.presentation.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {disease.presentation.slice(0, 3).map((item) => (
            <li key={item} className="text-xs text-white">
              · {item}
            </li>
          ))}
        </ul>
      ) : null}

      <EndpointGroup
        title="Diagnostic endpoints"
        icon={<Activity className="h-3 w-3" />}
        endpoints={disease.diagnosticEndpoints}
      />
      <EndpointGroup
        title="Monitoring"
        icon={<Target className="h-3 w-3" />}
        endpoints={disease.monitoringEndpoints}
      />

      {disease.treatmentGoals && disease.treatmentGoals.length > 0 ? (
        <div className="mt-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Goals</p>
          <ul className="mt-1 space-y-0.5">
            {disease.treatmentGoals.map((g) => (
              <li key={g} className="text-xs text-white">
                · {g}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {disease.firstLineDrugs.length > 0 ? (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-300">
            First-line therapy
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {disease.firstLineDrugs.map((drug) => (
              <DrugRow key={drug.id} drug={drug} />
            ))}
          </ul>
        </div>
      ) : null}

      {disease.adjunctDrugs.length > 0 ? (
        <div className="mt-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">
            Adjunct / special situations
          </p>
          <ul className="mt-1.5 space-y-1.5">
            {disease.adjunctDrugs.map((drug) => (
              <DrugRow key={drug.id} drug={drug} subdued />
            ))}
          </ul>
        </div>
      ) : null}

      {disease.counselingPearl ? (
        <p className="mt-2 rounded-lg bg-[#283040] px-2.5 py-2 text-[11px] leading-relaxed text-white/70">
          <strong className="font-semibold text-white">Counseling:</strong>{" "}
          {disease.counselingPearl}
        </p>
      ) : null}

      {disease.examPearl ? (
        <p className="mt-2 rounded-lg border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100">
          <strong className="font-semibold">Board pearl:</strong> {disease.examPearl}
        </p>
      ) : null}
    </li>
  );
}

function EndpointGroup({
  title,
  icon,
  endpoints,
}: {
  title: string;
  icon: React.ReactNode;
  endpoints?: ClinicalEndpoint[];
}) {
  if (!endpoints?.length) return null;
  return (
    <div className="mt-2">
      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
        {icon}
        {title}
      </p>
      <ul className="mt-1 flex flex-wrap gap-1.5">
        {endpoints.map((ep) => (
          <li
            key={`${ep.label}-${ep.target ?? ""}`}
            className="rounded-md bg-[#2f3a4a] px-2 py-1 text-[10px] text-white ring-1 ring-white/[0.06]"
          >
            <span className="font-semibold">{ep.label}</span>
            {ep.target ? <span className="text-white/70"> → {ep.target}</span> : null}
            {ep.frequency ? (
              <span className="block text-white/70">{ep.frequency}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrugRow({
  drug,
  subdued = false,
}: {
  drug: { id: string; generic: string; brand: string; therapeuticClass: string };
  subdued?: boolean;
}) {
  return (
    <li>
      <Link
        href={anatomyDrugHref(drug.id)}
        className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm transition hover:border-cyan-500/30 hover:bg-[#2e3848] ${
          subdued ? "border-white/[0.06] bg-[#222b38]" : "border-white/[0.08] bg-[#283040]"
        }`}
      >
        <Pill className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
        <span className="min-w-0">
          <span className="font-semibold text-white">{drug.generic}</span>
          <span className="text-white/70"> ({drug.brand})</span>
          <span className="mt-0.5 block text-[10px] text-white/70">
            {drug.therapeuticClass}
          </span>
        </span>
      </Link>
    </li>
  );
}

/** Resolve disease id when user taps a pathology badge. */
export function resolvePathologyDiseaseId(
  structureId: string,
  pathologyLabel: string
): string | undefined {
  return getResolvedDiseaseLinksForStructure(structureId).find(
    (d) =>
      d.pathologyLabel?.toLowerCase() === pathologyLabel.toLowerCase() ||
      d.name.toLowerCase() === pathologyLabel.toLowerCase()
  )?.id;
}
