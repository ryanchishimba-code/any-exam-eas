import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { fullExamHref, ROUTES, type ExamRouteSlug } from "@/lib/routes";

const FIELD_MAP: Record<ExamRouteSlug, string> = {
  nclex: "nursing",
  naplex: "pharmacy",
  usmle: "usmle-step-2",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
};

type Props = {
  params: Promise<{ exam: string }>;
  searchParams: Promise<{ mode?: string; state?: string; field?: string }>;
};

/** Legacy `/practice/:exam` — canonical surfaces are /question-bank and /full-exam. */
export default async function PracticeExamRedirectPage({ params, searchParams }: Props) {
  const { exam } = await params;
  const sp = await searchParams;

  if (!["nclex", "naplex", "usmle", "pance", "aanp-fnp", "npte-pt"].includes(exam)) {
    redirect(ROUTES.dashboard);
  }

  const slug = exam as ExamRouteSlug;
  const session = await auth();
  if (session?.user?.id && isExamSlug(slug)) {
    const pref = await getUserExamPreference(session.user.id);
    if (!pref) redirect(ROUTES.selectExam);
    if (pref.examSlug !== slug) redirect(ROUTES.dashboard);
  }

  const field = sp.field ?? FIELD_MAP[slug];

  if (sp.mode === "timed") {
    redirect(fullExamHref(slug));
  }

  const qs = new URLSearchParams({ field });
  redirect(`/question-bank?${qs.toString()}`);
}
