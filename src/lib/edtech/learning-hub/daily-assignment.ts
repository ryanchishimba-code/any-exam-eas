import type { ExamSlug } from "@/types/edtech";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  deepDiveTopicHref,
  highYieldTopicHref,
  practiceTopicHref,
} from "@/lib/edtech/practice-links";
import { ROUTES } from "@/lib/routes";
import {
  USMLE_LEARNING_STAGES,
  USMLE_TOPIC_MODULES,
  getUsmleModuleBySlug,
  modulesForStage,
} from "./usmle-learning-paths";
import {
  PANCE_LEARNING_STAGES,
  PANCE_TOPIC_MODULES,
  getPanceModuleBySlug,
  panceModulesForStage,
} from "./pance-learning-paths";
import {
  AANP_FNP_LEARNING_STAGES,
  AANP_FNP_TOPIC_MODULES,
  aanpFnpModulesForStage,
  getAanpFnpModuleBySlug,
} from "./aanp-fnp-learning-paths";
import {
  NPTE_PT_LEARNING_STAGES,
  NPTE_PT_TOPIC_MODULES,
  nptePtModulesForStage,
} from "./npte-pt-learning-paths";
import { studyHubHref } from "@/lib/learning/exam-roadmap";

export type DailyAssignmentTask = {
  id: string;
  kind: "review" | "practice" | "weak-area" | "timed-block" | "reference";
  title: string;
  description: string;
  href: string;
  estimatedMinutes: number;
  meta?: { system?: string; questionCount?: number };
};

export type DailyAssignmentPlan = {
  examSlug: ExamSlug;
  date: string;
  headline: string;
  stageLabel?: string;
  tasks: DailyAssignmentTask[];
};

function dayIndex(): number {
  const start = new Date(Date.UTC(2024, 0, 1));
  const now = new Date();
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((utc - start.getTime()) / 86_400_000);
}

function pickModuleForDay(stageId: "foundations" | "clerkship" | "board-crunch"): string {
  const pool = modulesForStage(stageId);
  if (pool.length === 0) return USMLE_TOPIC_MODULES[0]!.slug;
  return pool[dayIndex() % pool.length]!.slug;
}

function weakAreaHref(examSlug: ExamSlug, count = 15): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    style: "weak_areas",
    count: String(count),
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

function adaptiveHref(examSlug: ExamSlug, subjectId: string, count: number): string {
  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    style: "adaptive",
    subjectId,
    count: String(count),
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

export function buildUsmleDailyAssignment(weakTopicSlugs: string[] = []): DailyAssignmentPlan {
  const stage =
    dayIndex() % 7 < 2
      ? USMLE_LEARNING_STAGES[0]
      : dayIndex() % 7 < 5
        ? USMLE_LEARNING_STAGES[1]
        : USMLE_LEARNING_STAGES[2];

  const moduleSlug = pickModuleForDay(stage.id);
  const mod = getUsmleModuleBySlug(moduleSlug) ?? USMLE_TOPIC_MODULES[0]!;
  const weakSlug = weakTopicSlugs[0] ?? mod.questions.practiceTopicSlug;

  const tasks: DailyAssignmentTask[] = [];

  if (mod.reviewTopicSlug) {
    tasks.push({
      id: "review-module",
      kind: "review",
      title: `Read: ${mod.title}`,
      description: mod.overview,
      href: deepDiveTopicHref("usmle", mod.reviewTopicSlug),
      estimatedMinutes: Math.min(20, mod.estimatedMinutes),
      meta: { system: mod.system },
    });
  } else {
    tasks.push({
      id: "review-topic",
      kind: "review",
      title: `High-yield: ${mod.system}`,
      description: mod.overview,
      href: highYieldTopicHref("usmle", mod.slug),
      estimatedMinutes: 10,
      meta: { system: mod.system },
    });
  }

  tasks.push({
    id: "curated-practice",
    kind: "practice",
    title: `${mod.title} — curated Qs`,
    description: `${mod.questions.reviewCount} board-style vignettes with full rationales.`,
    href: practiceTopicHref("usmle", mod.questions.practiceTopicSlug, mod.questions.reviewCount),
    estimatedMinutes: Math.ceil(mod.questions.reviewCount * 1.5),
    meta: { system: mod.system, questionCount: mod.questions.reviewCount },
  });

  tasks.push({
    id: "weak-area",
    kind: "weak-area",
    title: "Weak-area drill",
    description: weakTopicSlugs.length
      ? `Focus: ${weakSlug.replace(/-/g, " ")}`
      : "Adaptive set targeting your lowest-accuracy topics.",
    href: weakTopicSlugs.length
      ? adaptiveHref("usmle", weakSlug, 10)
      : weakAreaHref("usmle", 15),
    estimatedMinutes: 15,
    meta: { questionCount: 10 },
  });

  if (stage.id === "board-crunch" && dayIndex() % 3 === 0) {
    tasks.push({
      id: "timed-block",
      kind: "timed-block",
      title: "Timed mini-block",
      description: "25 questions under exam pacing (~35 min).",
      href: `${ROUTES.questionBank}?field=usmle-step-2&mode=bank&style=adaptive&count=25&pace=timed`,
      estimatedMinutes: 35,
      meta: { questionCount: 25 },
    });
  }

  return {
    examSlug: "usmle",
    date: new Date().toISOString().slice(0, 10),
    headline: `Today's plan · ${stage.label}`,
    stageLabel: stage.label,
    tasks,
  };
}

export function buildPanceDailyAssignment(weakTopicSlugs: string[] = []): DailyAssignmentPlan {
  const stage =
    dayIndex() % 7 < 2
      ? PANCE_LEARNING_STAGES[0]
      : dayIndex() % 7 < 5
        ? PANCE_LEARNING_STAGES[1]
        : PANCE_LEARNING_STAGES[2];

  const pool = panceModulesForStage(stage.id);
  const mod = pool[dayIndex() % pool.length] ?? PANCE_TOPIC_MODULES[0]!;
  const weakSlug = weakTopicSlugs[0] ?? mod.questions.practiceTopicSlug;

  const tasks: DailyAssignmentTask[] = [
    {
      id: "study-hub",
      kind: "review",
      title: "PANCE Study Hub readiness",
      description: "NCCPA blueprint readiness across all 15 medical content categories.",
      href: studyHubHref("pance"),
      estimatedMinutes: 10,
    },
    {
      id: "review-module",
      kind: "review",
      title: mod.title,
      description: mod.overview,
      href: mod.reviewTopicSlug
        ? deepDiveTopicHref("pance", mod.reviewTopicSlug)
        : highYieldTopicHref("pance", mod.slug),
      estimatedMinutes: Math.min(20, mod.estimatedMinutes),
      meta: { system: mod.system },
    },
    {
      id: "curated-practice",
      kind: "practice",
      title: `${mod.title} — practice`,
      description: `${mod.questions.reviewCount} PANCE-style vignettes with rationales.`,
      href: practiceTopicHref("pance", mod.questions.practiceTopicSlug, mod.questions.reviewCount),
      estimatedMinutes: Math.ceil(mod.questions.reviewCount * 1.5),
      meta: { system: mod.system, questionCount: mod.questions.reviewCount },
    },
    {
      id: "weak-area",
      kind: "weak-area",
      title: "Weak-area drill",
      description: weakTopicSlugs.length
        ? `Focus: ${weakSlug.replace(/-/g, " ")}`
        : "Adaptive set targeting your lowest-accuracy blueprint areas.",
      href: weakTopicSlugs.length
        ? adaptiveHref("pance", weakSlug, 10)
        : weakAreaHref("pance", 15),
      estimatedMinutes: 15,
      meta: { questionCount: 10 },
    },
  ];

  if (stage.id === "board-crunch" && dayIndex() % 3 === 0) {
    tasks.push({
      id: "timed-block",
      kind: "timed-block",
      title: "Timed mini-block",
      description: "50 questions under PANCE pacing (~60 min).",
      href: "/full-exam/pance?preset=50&autostart=1",
      estimatedMinutes: 60,
      meta: { questionCount: 50 },
    });
  }

  return {
    examSlug: "pance",
    date: new Date().toISOString().slice(0, 10),
    headline: `Today's plan · ${stage.label}`,
    stageLabel: stage.label,
    tasks,
  };
}

/** @deprecated Use buildPanceDailyAssignment */
export const buildFnpDailyAssignment = buildPanceDailyAssignment;

export function buildAanpFnpDailyAssignment(weakTopicSlugs: string[] = []): DailyAssignmentPlan {
  const stage =
    dayIndex() % 7 < 2
      ? AANP_FNP_LEARNING_STAGES[0]
      : dayIndex() % 7 < 5
        ? AANP_FNP_LEARNING_STAGES[1]
        : AANP_FNP_LEARNING_STAGES[2];

  const modules = aanpFnpModulesForStage(stage!.id);
  const mod = modules[dayIndex() % modules.length] ?? AANP_FNP_TOPIC_MODULES[0]!;
  const weakSlug = weakTopicSlugs[0] ?? mod.questions.practiceTopicSlug;

  const tasks: DailyAssignmentTask[] = [
    {
      id: "review",
      kind: "review",
      title: mod.title,
      description: mod.overview,
      href: mod.reviewTopicSlug
        ? deepDiveTopicHref("aanp-fnp", mod.reviewTopicSlug)
        : highYieldTopicHref("aanp-fnp", mod.slug),
      estimatedMinutes: mod.estimatedMinutes,
    },
    {
      id: "practice",
      kind: "practice",
      title: "Blueprint practice",
      description: `${mod.questions.reviewCount} questions · ${mod.system}`,
      href: practiceTopicHref("aanp-fnp", mod.questions.practiceTopicSlug),
      estimatedMinutes: 20,
      meta: { system: mod.system, questionCount: mod.questions.reviewCount },
    },
    {
      id: "study-hub",
      kind: "reference",
      title: "Study Hub readiness",
      description: "Readiness by Assess, Diagnose, Plan, and Evaluate domains.",
      href: studyHubHref("aanp-fnp"),
      estimatedMinutes: 5,
    },
    {
      id: "weak-area",
      kind: "weak-area",
      title: "Weak-area drill",
      description: weakTopicSlugs.length
        ? `Focus: ${weakSlug.replace(/-/g, " ")}`
        : "Adaptive set targeting your lowest-accuracy blueprint domains.",
      href: weakTopicSlugs.length
        ? adaptiveHref("aanp-fnp", weakSlug, 10)
        : weakAreaHref("aanp-fnp", 15),
      estimatedMinutes: 15,
      meta: { questionCount: 10 },
    },
  ];

  if (stage!.id === "board-crunch" && dayIndex() % 3 === 0) {
    tasks.push({
      id: "timed-block",
      kind: "timed-block",
      title: "Timed mini-block",
      description: "50 questions under AANP FNP pacing (~60 min).",
      href: "/full-exam/aanp-fnp?preset=50&autostart=1",
      estimatedMinutes: 60,
      meta: { questionCount: 50 },
    });
  }

  return {
    examSlug: "aanp-fnp",
    date: new Date().toISOString().slice(0, 10),
    headline: `Today's plan · ${stage!.label}`,
    stageLabel: stage!.label,
    tasks,
  };
}

export function buildNptePtDailyAssignment(weakTopicSlugs: string[] = []): DailyAssignmentPlan {
  const stage =
    dayIndex() % 7 < 2
      ? NPTE_PT_LEARNING_STAGES[0]
      : dayIndex() % 7 < 5
        ? NPTE_PT_LEARNING_STAGES[1]
        : NPTE_PT_LEARNING_STAGES[2];

  const pool = nptePtModulesForStage(stage!.id);
  const mod = pool[dayIndex() % pool.length] ?? NPTE_PT_TOPIC_MODULES[0]!;
  const weakSlug = weakTopicSlugs[0] ?? mod.questions.practiceTopicSlug;

  const tasks: DailyAssignmentTask[] = [
    {
      id: "study-hub",
      kind: "review",
      title: "NPTE-PT Study Hub readiness",
      description: "FSBPT blueprint readiness across body systems and non-systems categories.",
      href: studyHubHref("npte-pt"),
      estimatedMinutes: 10,
    },
    {
      id: "review-module",
      kind: "review",
      title: mod.title,
      description: mod.overview,
      href: mod.reviewTopicSlug
        ? deepDiveTopicHref("npte-pt", mod.reviewTopicSlug)
        : highYieldTopicHref("npte-pt", mod.slug),
      estimatedMinutes: Math.min(20, mod.estimatedMinutes),
      meta: { system: mod.system },
    },
    {
      id: "curated-practice",
      kind: "practice",
      title: `${mod.title} — practice`,
      description: `${mod.questions.reviewCount} NPTE-PT vignettes with rationales.`,
      href: practiceTopicHref("npte-pt", mod.questions.practiceTopicSlug, mod.questions.reviewCount),
      estimatedMinutes: Math.ceil(mod.questions.reviewCount * 1.5),
      meta: { system: mod.system, questionCount: mod.questions.reviewCount },
    },
    {
      id: "weak-area",
      kind: "weak-area",
      title: "Weak-area drill",
      description: weakTopicSlugs.length
        ? `Focus: ${weakSlug.replace(/-/g, " ")}`
        : "Adaptive set targeting your lowest-accuracy blueprint areas.",
      href: weakTopicSlugs.length
        ? adaptiveHref("npte-pt", weakSlug, 10)
        : weakAreaHref("npte-pt", 15),
      estimatedMinutes: 15,
      meta: { questionCount: 10 },
    },
  ];

  if (stage!.id === "board-crunch" && dayIndex() % 3 === 0) {
    tasks.push({
      id: "timed-block",
      kind: "timed-block",
      title: "Timed mini-block",
      description: "50 questions under NPTE-PT pacing (~60 min).",
      href: "/full-exam/npte-pt?preset=50&autostart=1",
      estimatedMinutes: 60,
      meta: { questionCount: 50 },
    });
  }

  return {
    examSlug: "npte-pt",
    date: new Date().toISOString().slice(0, 10),
    headline: `Today's plan · ${stage!.label}`,
    stageLabel: stage!.label,
    tasks,
  };
}

export function buildDailyAssignment(
  examSlug: ExamSlug,
  weakTopicSlugs: string[] = []
): DailyAssignmentPlan {
  if (examSlug === "usmle") return buildUsmleDailyAssignment(weakTopicSlugs);
  if (examSlug === "pance") return buildPanceDailyAssignment(weakTopicSlugs);
  if (examSlug === "aanp-fnp") return buildAanpFnpDailyAssignment(weakTopicSlugs);
  if (examSlug === "npte-pt") return buildNptePtDailyAssignment(weakTopicSlugs);

  const fieldId = EXAM_CATALOG[examSlug].fieldId;
  return {
    examSlug,
    date: new Date().toISOString().slice(0, 10),
    headline: "Today's study plan",
    tasks: [
      {
        id: "adaptive",
        kind: "practice",
        title: "Adaptive practice",
        description: "Personalized question set from your exam bank.",
        href: `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}&mode=bank&style=adaptive&count=20`,
        estimatedMinutes: 30,
        meta: { questionCount: 20 },
      },
      {
        id: "weak",
        kind: "weak-area",
        title: "Weak-area review",
        description: "Drill topics where accuracy is lowest.",
        href: weakAreaHref(examSlug, 15),
        estimatedMinutes: 20,
        meta: { questionCount: 15 },
      },
      {
        id: "topics",
        kind: "review",
        title: "High-yield topics",
        description: "Textbook-style review modules.",
        href: "/dashboard/topics",
        estimatedMinutes: 15,
      },
    ],
  };
}
