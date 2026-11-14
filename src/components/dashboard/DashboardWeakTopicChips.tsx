import Link from "next/link";
import { Target } from "lucide-react";
import { weakTopicPracticeHref } from "@/components/dashboard/DashboardGraphicHero";
import { filterStudentFacingWeakTopics } from "@/lib/learning/concept-labels";
import { dbUi } from "@/lib/study/dashboard-ui";
import { listedWeakTopics, weakTopicMissLabel, weakTopicMissed, type WeakTopicRow } from "@/lib/learning/student-dashboard";
import { weakTopicSessionHref } from "@/lib/learning/weak-area-practice-href";
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
  const facing = listedWeakTopics(filterStudentFacingWeakTopics(weakTopics)).slice(0, 3);
  if (facing.length === 0) return null;

  return (
    <section aria-labelledby="dashboard-weak-chips-heading" className="space-y-2.5">
      <div className="flex items-center gap-2 px-0.5">
        <Target className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden />
        <h2 id="dashboard-weak-chips-heading" className={dbUi.sectionTitle}>
          Recent misses
        </h2>
      </div>
      <ul className="flex flex-wrap gap-2" role="list">
        {facing.map((topic) => {
          const slug = topic.id.replace(/^(tag|subject):/, "");
          const href = weakTopicSessionHref({
            examSlug,
            topicId: topic.id,
            fieldId: topic.fieldId || practiceFieldId || "",
            fallbackHref:
              topic.studyLinks?.practiceHref ||
              weakTopicPracticeHref(examSlug, slug, practiceFieldId),
          });
          const missed = weakTopicMissed(topic);
          const label = (
            <>
              <span className="break-words" title={topic.name}>
                {topic.name}
              </span>
              <span
                className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-border)]/70"
                aria-hidden
              >
                <span
                  className="block h-full rounded-full bg-amber-500"
                  style={{
                    width: `${Math.round(((missed?.missed ?? 0) / Math.max(topic.attempts, 1)) * 100)}%`,
                  }}
                />
              </span>
              <span className="shrink-0 tabular-nums text-[var(--color-ink-muted)]">
                {weakTopicMissLabel(topic)}
              </span>
            </>
          );
          return (
            <li key={topic.id}>
              {href ? (
                <Link href={href} className={dbUi.weakChip}>
                  {label}
                </Link>
              ) : (
                <span className={dbUi.weakChip}>{label}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
