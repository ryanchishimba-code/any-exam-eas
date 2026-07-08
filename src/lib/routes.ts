import type { ExamSlug } from "@/lib/exams/catalog";
import { examMarketingPath } from "@/lib/seo/exam-config";
import type { ExamSlug as EdtechExamSlug } from "@/types/edtech";
import { examSlugFromFieldId } from "@/lib/edtech/exams";

/** Nav stat labels — mirrors FALLBACK_QUESTION_COUNTS in bank-stats.ts (avoids import cycle). */
const EXAM_NAV_STATS = {
  nursing: "6,200",
  usmle: "17,392",
  pharmacy: "7,595",
  aanpFnp: "4,781",
  nptePt: "4,240",
} as const;

/** Canonical app routes — use these in nav, links, and redirects. */
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  roadmap: "/dashboard/roadmap",
  learn: "/learn",
  /** @deprecated use dashboard */
  practiceHub: "/dashboard",
  selectExam: "/select-exam",
  /** USMLE Step 1 / Step 2 CK / Step 3 sub-selection. */
  selectExamUsmle: "/select-exam/usmle",
  /** @deprecated use selectExam */
  examSelect: "/select-exam",
  fullExam: "/full-exam",
  questionBank: "/question-bank",
  analytics: "/analytics",
  library: "/library",
  anatomy: "/anatomy",
  anatomyCatalog: "/anatomy/catalog",
  highYieldTopics: "/dashboard/topics",
  practice: "/practice",
  exams: "/exams",
  /** Legacy hub URL — use `toolkit`; individual articles remain at `/resources/[slug]`. */
  resources: "/toolkit",
  toolkit: "/toolkit",
  about: "/about",
  employers: "/employers",
  pricing: "/pricing",
  feedback: "/feedback",
  community: "/community",
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
    content: "/admin/content",
    questions: "/admin/questions",
    testimonials: "/admin/testimonials",
    social: "/admin/social",
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
    stat: `${EXAM_NAV_STATS.nursing} items`,
  },
  {
    slug: "usmle",
    label: "USMLE",
    short: "Medicine",
    href: "/usmle",
    fieldId: "usmle-step-2",
    practiceHref: "/practice/usmle",
    stat: `${EXAM_NAV_STATS.usmle} items`,
  },
  {
    slug: "naplex",
    label: "NAPLEX",
    short: "Pharmacy",
    href: "/naplex",
    fieldId: "pharmacy",
    practiceHref: "/practice/naplex",
    stat: `${EXAM_NAV_STATS.pharmacy} items`,
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
    stat: `${EXAM_NAV_STATS.aanpFnp} items`,
  },
  {
    slug: "npte-pt",
    label: "NPTE-PT",
    short: "Physical Therapy",
    href: "/npte-pt",
    fieldId: "npte-pt",
    practiceHref: "/practice/npte-pt",
    stat: `${EXAM_NAV_STATS.nptePt} items`,
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
