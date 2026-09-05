import Link from "next/link";
import { Target } from "lucide-react";
import { weakTopicPracticeHref } from "@/components/dashboard/DashboardGraphicHero";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug } from "@/types/edtech";

export function DashboardWeakTopicChips({
  examSlug,
  weakTopics,
  practiceFieldId,
}: {
  examSlug: ExamSlug;
  weakTopics: WeakTopicRow[];
  practiceFieldId?: string;
}) {
  if (weakTopics.length === 0) return null;

  return (
    <section aria-labelledby="dashboard-weak-chips-heading" className="space-y-2.5">
      <div className="flex items-center gap-2 px-0.5">
        <Target className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
        <h2 id="dashboard-weak-chips-heading" className={dbUi.sectionTitle}>
          Recent misses
        </h2>
      </div>
      <ul className="flex flex-wrap gap-2" role="list">
        {weakTopics.slice(0, 3).map((topic) => {
          const slug = topic.id.replace(/^(tag|subject):/, "");
          const href =
            topic.studyLinks?.practiceHref ??
            weakTopicPracticeHref(examSlug, slug, practiceFieldId);
          return (
            <li key={topic.id}>
              <Link href={href} className={dbUi.weakChip}>
                <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{topic.name}</span>
                <span
                  className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-border)]/70"
                  aria-hidden
                >
                  <span
                    className="block h-full rounded-full bg-amber-500"
                    style={{
                      width: `${Math.max(8, Math.min(100, topic.masteryScore))}%`,
                    }}
                  />
                </span>
                <span className="tabular-nums text-[var(--color-ink-muted)]">
                  {topic.masteryScore}%
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
