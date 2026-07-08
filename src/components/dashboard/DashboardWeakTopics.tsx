import Link from "next/link";
import { ArrowRight, GraduationCap, Target } from "lucide-react";
import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import { analyticsHref, libraryTopicHref, practiceTopicHref } from "@/lib/edtech/practice-links-core";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function DashboardWeakTopics({
  examSlug,
  weakTopics,
}: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
}) {
  if (weakTopics.length === 0) return null;

  return (
    <section aria-labelledby="dashboard-weak-heading" className="space-y-2.5">
      <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
            <h2 id="dashboard-weak-heading" className={dbUi.sectionTitle}>
              Weak topics
            </h2>
          </div>
          <p className={cn(dbUi.sectionHint, "mt-0.5")}>
            Extra practice where it may help most.
          </p>
        </div>
        <Link
          href={analyticsHref()}
          className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
        >
          Full analytics
        </Link>
      </div>

      <ul className={dbUi.listSurface}>
        {weakTopics.slice(0, 5).map((topic) => {
          const slug = topic.id.replace(/^(tag|subject):/, "");
          const links = topic.studyLinks;
          return (
            <li key={topic.id} className="px-4 py-3.5">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink)]">
                    <span className="truncate">{topic.name}</span>
                    <span className="shrink-0 tabular-nums text-[var(--color-ink-muted)]">
                      {topic.masteryScore}%
                    </span>
                  </p>
                  <p className={cn(dbUi.sectionHint, "mt-0.5")}>
                    {topic.attempts} attempt{topic.attempts === 1 ? "" : "s"} · {topic.weight}%
                    weight
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {links?.deepDiveHref ? (
                    <Link href={links.deepDiveHref} className={dbUi.ghostBtn}>
                      <GraduationCap className="h-3 w-3" aria-hidden />
                      Deep dive
                    </Link>
                  ) : null}
                  <Link
                    href={links?.libraryHref ?? libraryTopicHref(examSlug, slug)}
                    className={dbUi.ghostBtn}
                  >
                    Library
                  </Link>
                  <Link
                    href={links?.practiceHref ?? practiceTopicHref(examSlug, slug, 10)}
                    className={dbUi.ghostBtn}
                  >
                    Practice
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                  {links?.anatomyStructures?.length ? (
                    <RelatedAnatomyLinks
                      examSlug={examSlug}
                      structures={links.anatomyStructures}
                      variant="pill"
                    />
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
