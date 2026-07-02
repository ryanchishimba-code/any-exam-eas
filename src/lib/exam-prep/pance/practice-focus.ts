import { ROUTES } from "@/lib/routes";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links";
import {
  PANCE_TASK_AREAS,
  type PanceTaskArea,
  type PanceTaskAreaId,
} from "./content-outline";

export type PanceFeaturedDrill = {
  id: string;
  taskCategory: PanceTaskAreaId;
  title: string;
  subtitle: string;
  count: number;
};

/** Promoted drills — diagnosis first (differential diagnosis practice). */
export const PANCE_FEATURED_DRILLS: PanceFeaturedDrill[] = [
  {
    id: "diagnosis-drill",
    taskCategory: "diagnosis",
    title: "Differential diagnosis",
    subtitle: "Formulating most likely diagnosis — 18% of the exam",
    count: 25,
  },
  {
    id: "pharmacotherapy-drill",
    taskCategory: "pharmacotherapy",
    title: "Pharmaceutical therapeutics",
    subtitle: "First-line therapy, dosing, contraindications, and monitoring",
    count: 25,
  },
  {
    id: "clinical-intervention",
    taskCategory: "intervention",
    title: "Clinical intervention",
    subtitle: "Next step in management, procedures, and stabilization",
    count: 20,
  },
];

const TASK_BY_ID = new Map(PANCE_TASK_AREAS.map((t) => [t.id, t]));

export function isPanceTaskAreaId(value: string | null | undefined): value is PanceTaskAreaId {
  if (!value) return false;
  return TASK_BY_ID.has(value as PanceTaskAreaId);
}

export function parsePanceTaskCategoryParam(
  value: string | null | undefined
): PanceTaskAreaId | null {
  return isPanceTaskAreaId(value) ? value : null;
}

export function getPanceTaskArea(id: PanceTaskAreaId): PanceTaskArea | undefined {
  return TASK_BY_ID.get(id);
}

export function getPanceTaskLabel(id: PanceTaskAreaId): string {
  return TASK_BY_ID.get(id)?.label ?? id;
}

export function getPanceTaskShortLabel(id: PanceTaskAreaId): string {
  const task = TASK_BY_ID.get(id);
  if (!task) return id;
  if (id === "diagnosis") return "Diagnosis";
  if (id === "pharmacotherapy") return "Pharmacotherapy";
  if (id === "history-physical") return "History & exam";
  if (id === "prevention") return "Health maintenance";
  if (id === "intervention") return "Intervention";
  if (id === "labs") return "Labs & imaging";
  if (id === "foundational") return "Basic science";
  if (id === "professional") return "Professional practice";
  return task.label.split(" ")[0] ?? task.label;
}

export function panceTaskPracticeHref(
  taskCategory: PanceTaskAreaId,
  opts?: {
    subjectId?: string;
    count?: number;
    autostart?: boolean;
    pace?: "timed" | "untimed";
  }
): string {
  const fieldId = EXAM_CATALOG.pance.fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: opts?.subjectId ?? MIXED_SUBJECT_ID,
    count: String(opts?.count ?? 25),
    taskCategory,
    pace: opts?.pace ?? "untimed",
    style: "standard",
  });
  if (opts?.autostart) qs.set("autostart", "1");
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

export function panceDiagnosisDrillHref(
  count = 25,
  subjectId?: string,
  autostart = true
): string {
  return panceTaskPracticeHref("diagnosis", { count, subjectId, autostart });
}

export function sessionLabelWithTask(
  topicLabel: string,
  taskCategory: PanceTaskAreaId | null
): string {
  if (!taskCategory) return topicLabel;
  return `${topicLabel} · ${getPanceTaskShortLabel(taskCategory)}`;
}
