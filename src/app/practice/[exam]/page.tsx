import { redirect } from "next/navigation";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamRouteSlug } from "@/lib/routes";

const FIELD_MAP: Record<ExamRouteSlug, string> = {
  nclex: "nursing",
  naplex: "pharmacy",
  usmle: "usmle-step-2",
  pance: "pance",
};

type Props = {
  params: Promise<{ exam: string }>;
  searchParams: Promise<{ mode?: string; state?: string; field?: string }>;
};

/** Legacy `/practice/:exam` — canonical surfaces are /question-bank and /full-exam. */
export default async function PracticeExamRedirectPage({ params, searchParams }: Props) {
  const { exam } = await params;
  const sp = await searchParams;

  if (!["nclex", "naplex", "usmle", "pance"].includes(exam)) {
    redirect(ROUTES.dashboard);
  }

  const slug = exam as ExamRouteSlug;
  const field = sp.field ?? FIELD_MAP[slug];

  if (sp.mode === "timed") {
    redirect(fullExamHref(slug));
  }

  const qs = new URLSearchParams({ field });
  redirect(`/question-bank?${qs.toString()}`);
}
