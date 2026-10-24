import { formatExactQuestionCount } from "@/lib/counts";
import type { HubExamKey } from "@/lib/marketing/board-landing/hub-model";

export type HubLiveBarRow = {
  id: string;
  label: string;
  count: number;
};

const BAR_HEADING: Record<HubExamKey, string> = {
  usmle: "Live questions by USMLE step",
  pance: "Live PANCE item types",
  "aanp-fnp": "Live FNP item types",
  "npte-pt": "Live NPTE item types",
};

const CLINICAL_TYPE_GROUPS: { id: string; label: string; types: string[] }[] = [
  { id: "vignette", label: "Vignettes", types: ["vignette", "mcq"] },
  { id: "sata", label: "SATA", types: ["select_all", "sata"] },
  { id: "constructed", label: "Fill-in response", types: ["constructed_response"] },
  { id: "exhibit", label: "Exhibits", types: ["exhibit"] },
];

function countForTypes(counts: Record<string, number>, types: readonly string[]): number {
  return types.reduce((sum, type) => sum + (counts[type.toLowerCase()] ?? 0), 0);
}

export function hubLiveBarChartHeading(examKey: HubExamKey): string {
  return BAR_HEADING[examKey];
}

export function buildUsmleStepBarRows(
  stepCounts: Partial<Record<"step1" | "step2" | "step3", number>>
): HubLiveBarRow[] {
  const rows: HubLiveBarRow[] = [];
  const steps: { id: string; label: string; key: "step1" | "step2" | "step3" }[] = [
    { id: "step1", label: "Step 1", key: "step1" },
    { id: "step2", label: "Step 2 CK", key: "step2" },
    { id: "step3", label: "Step 3", key: "step3" },
  ];
  for (const step of steps) {
    const count = stepCounts[step.key] ?? 0;
    if (count <= 0) continue;
    rows.push({ id: step.id, label: step.label, count });
  }
  return rows;
}

export function buildClinicalItemTypeBarRows(bankTypes: Record<string, number>): HubLiveBarRow[] {
  const rows: HubLiveBarRow[] = [];
  for (const group of CLINICAL_TYPE_GROUPS) {
    const count = countForTypes(bankTypes, group.types);
    if (count <= 0) continue;
    rows.push({ id: group.id, label: group.label, count });
  }
  return rows;
}

export function buildHubLiveBarRows(
  examKey: HubExamKey,
  input: {
    usmleStepCounts?: Partial<Record<"step1" | "step2" | "step3", number>>;
    bankTypes?: Record<string, number>;
  }
): HubLiveBarRow[] {
  if (examKey === "usmle") {
    return buildUsmleStepBarRows(input.usmleStepCounts ?? {});
  }
  return buildClinicalItemTypeBarRows(input.bankTypes ?? {});
}

export function formatHubLiveBarCount(count: number): string {
  return formatExactQuestionCount(count);
}
