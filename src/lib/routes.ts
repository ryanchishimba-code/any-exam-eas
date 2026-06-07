import type { ExamSlug } from "@/lib/exams/catalog";
import type { ExamSlug as EdtechExamSlug } from "@/types/edtech";

/** Canonical app routes — use these in nav, links, and redirects. */
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  /** @deprecated use dashboard */
  practiceHub: "/dashboard",
  selectExam: "/select-exam",
  /** @deprecated use selectExam */
  examSelect: "/select-exam",
  fullExam: "/full-exam",
  questionBank: "/question-bank",
  analytics: "/analytics",
  highYieldTopics: "/dashboard/topics",
  practice: "/practice",
  exams: "/exams",
  pricing: "/pricing",
  feedback: "/feedback",
  settings: "/settings",
  drugs300: "/study/drugs300",
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  admin: {
    root: "/admin",
    login: "/admin/login",
    analytics: "/admin/analytics",
    users: "/admin/users",
    feedback: "/admin/feedback",
    support: "/admin/support",
  },
} as const;

export type ExamRouteSlug = Exclude<ExamSlug, "top500">;

export const EXAM_NAV_ITEMS: {
  slug: ExamRouteSlug;
  label: string;
  short: string;
  href: string;
  fieldId: string;
  practiceHref: string;
  stat: string;
}[] = [
  {
    slug: "nclex",
    label: "NCLEX",
    short: "Nursing",
    href: "/exams/nclex",
    fieldId: "nursing",
    practiceHref: "/practice/nclex",
    stat: "130K+ items",
  },
  {
    slug: "usmle",
    label: "USMLE",
    short: "Medicine",
    href: "/exams/usmle",
    fieldId: "usmle-step-2",
    practiceHref: "/practice/usmle",
    stat: "30K+ items",
  },
  {
    slug: "naplex",
    label: "NAPLEX",
    short: "Pharmacy",
    href: "/exams/naplex",
    fieldId: "pharmacy",
    practiceHref: "/practice/naplex",
    stat: "24K+ items",
  },
  {
    slug: "mpje",
    label: "MPJE",
    short: "Pharmacy law",
    href: "/exams/mpje",
    fieldId: "mpje",
    practiceHref: "/practice/mpje",
    stat: "Federal + state",
  },
];

export function examHref(slug: ExamRouteSlug): string {
  return `/exams/${slug}`;
}

export function practiceHref(
  slug: ExamRouteSlug,
  opts?: { mode?: "bank" | "timed"; state?: string; step?: string }
): string {
  const qs = new URLSearchParams();
  if (opts?.mode) qs.set("mode", opts.mode);
  if (opts?.state) qs.set("state", opts.state);
  if (opts?.step) qs.set("step", opts.step);
  const q = qs.toString();
  return q ? `/practice/${slug}?${q}` : `/practice/${slug}`;
}

export function fullExamHref(examSlug: EdtechExamSlug): string {
  return `${ROUTES.fullExam}/${examSlug}`;
}

export function legacyPracticeQuery(fieldId: string, mode = "bank"): string {
  return `/study/practice?field=${encodeURIComponent(fieldId)}&mode=${mode}`;
}
