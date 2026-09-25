import { redirect } from "next/navigation";
import Link from "next/link";
import { ReadinessCheckPlayer } from "@/components/readiness/ReadinessCheckPlayer";
import { getCachedSession } from "@/lib/auth/session";
import { requireAppPage } from "@/lib/require-premium-page";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Readiness check — Any Exam Easy",
  description: "A short fixed check across your board.",
};

export default async function ReadinessCheckPage() {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(`${ROUTES.readiness}/check`)}`);
  }

  const access = await requireAppPage(`${ROUTES.readiness}/check`);
  if (!access.hasStudyAccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]">
          A readiness check uses the question bank
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-muted)]">
          You can still see levels you already earned, and record how an exam went, from the readiness page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href={ROUTES.pricing} className={cn(dbUi.primaryBtn, "min-h-11")}>
            View plans
          </Link>
          <Link href={ROUTES.readiness} className={cn(dbUi.ghostBtn, "min-h-11")}>
            Your readiness
          </Link>
        </div>
      </div>
    );
  }

  return <ReadinessCheckPlayer />;
}
