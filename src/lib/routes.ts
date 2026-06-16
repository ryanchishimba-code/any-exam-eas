import type { ExamSlug } from "@/lib/exams/catalog";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { MARKETING_QUESTION_COUNTS } from "@/lib/marketing/bank-stats";
import type { ExamSlug as EdtechExamSlug } from "@/types/edtech";
import { examSlugFromFieldId } from "@/lib/edtech/exams";

/** Canonical app routes — use these in nav, links, and redirects. */
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  roadmap: "/dashboard/roadmap",
  /** @deprecated use dashboard */
  practiceHub: "/dashboard",
  selectExam: "/select-exam",
  /** @deprecated use selectExam */
  examSelect: "/select-exam",
  fullExam: "/full-exam",
  questionBank: "/question-bank",
  analytics: "/analytics",
  reference: "/reference",
  anatomy: "/anatomy",
  anatomyCatalog: "/anatomy/catalog",
  highYieldTopics: "/dashboard/topics",
  practice: "/practice",
  exams: "/exams",
  resources: "/resources",
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
    href: "/nclex",
    fieldId: "nursing",
    practiceHref: "/practice/nclex",
    stat: `${MARKETING_QUESTION_COUNTS.nursing} items`,
  },
  {
    slug: "usmle",
    label: "USMLE",
    short: "Medicine",
    href: "/usmle",
    fieldId: "usmle-step-2",
    practiceHref: "/practice/usmle",
    stat: `${MARKETING_QUESTION_COUNTS.usmle} items`,
  },
  {
    slug: "naplex",
    label: "NAPLEX",
    short: "Pharmacy",
    href: "/naplex",
    fieldId: "pharmacy",
    practiceHref: "/practice/naplex",
    stat: `${MARKETING_QUESTION_COUNTS.pharmacy} items`,
  },
  {
    slug: "pance",
    label: "PANCE",
    short: "Physician Assistant",
    href: "/pance",
    fieldId: "pance",
    practiceHref: "/practice/pance",
    stat: "300Q blueprint",
  },
  {
    slug: "aanp-fnp",
    label: "AANP FNP",
    short: "Nurse Practitioner",
    href: "/aanp-fnp",
    fieldId: "aanp-fnp",
    practiceHref: "/practice/aanp-fnp",
    stat: `${MARKETING_QUESTION_COUNTS.aanpFnp} items`,
  },
  {
    slug: "npte-pt",
    label: "NPTE-PT",
    short: "Physical Therapy",
    href: "/npte-pt",
    fieldId: "npte-pt",
    practiceHref: "/practice/npte-pt",
    stat: `${MARKETING_QUESTION_COUNTS.nptePt} items`,
  },
];

export function examHref(slug: ExamRouteSlug): string {
  return examMarketingPath(slug);
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
  if (mode === "timed") {
    const slug = examSlugFromFieldId(fieldId);
    if (slug) return fullExamHref(slug);
    return ROUTES.fullExam;
  }
  return `${ROUTES.questionBank}?field=${encodeURIComponent(fieldId)}`;
}
