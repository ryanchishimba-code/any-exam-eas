import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { fullExamHref, ROUTES } from "@/lib/routes";

export default async function FullExamIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; autostart?: string; timed?: string }>;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.fullExam)}`);
  }

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  const sp = await searchParams;
  const qs = new URLSearchParams();
  qs.set("mode", sp.mode ?? "full");
  if (sp.autostart) qs.set("autostart", sp.autostart);
  if (sp.timed) qs.set("timed", sp.timed);
  const suffix = qs.toString();

  redirect(`${fullExamHref(pref.examSlug)}${suffix ? `?${suffix}` : ""}`);
}
