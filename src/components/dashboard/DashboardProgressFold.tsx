import Link from "next/link";
import { Check } from "lucide-react";
import { DashboardWeekPlan } from "@/components/dashboard/DashboardWeekPlan";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";

function PlanLinks({ plan, studyLocked }: { plan: ExamDayPlan; studyLocked: boolean }) {
  const lockedHref = postTrialCheckoutHref();

  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {plan.items.map((item) => {
        const href = studyLocked ? lockedHref : item.href;
        if (!href) return null;
        return (
          <li key={item.id}>
            <Link
              href={href}
              className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
            >
              {item.doneToday ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">Done today</span>
                </>
              ) : null}
              {item.cta}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Deeper dashboard analytics, closed until the student asks. */
export function DashboardProgressFold({
  plan = null,
  studyLocked = false,
  children,
}: {
  plan?: ExamDayPlan | null;
  studyLocked?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <details data-dashboard-progress data-today-details className="px-0.5">
      <summary className="cursor-pointer list-none text-[15px] font-semibold text-[var(--color-accent)] marker:content-none [&::-webkit-details-marker]:hidden">
        See progress
      </summary>
      <div data-today-details-body className="mt-5 space-y-5">
        {plan ? <PlanLinks plan={plan} studyLocked={studyLocked} /> : null}
        {plan ? (
          plan.weekPlan.active ? (
            <DashboardWeekPlan weekPlan={plan.weekPlan} />
          ) : (
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">{plan.weekPlan.summary}</p>
          )
        ) : null}
        {plan ? (
          <ReadinessProofPanel
            readiness={plan.readiness}
            domainsLabel={plan.coverage.domainsLabel}
            coverage={plan.coverage}
            showLeadReason={false}
          />
        ) : null}
        {children}
      </div>
    </details>
  );
}
