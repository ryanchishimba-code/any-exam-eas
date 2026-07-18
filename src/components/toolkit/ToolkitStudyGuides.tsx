import Link from "next/link";
import { EXAM_SEO_CONFIG, examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";
import { getArticlesForExam, RESOURCE_ARTICLES } from "@/lib/seo/resources-content";

const PRIORITY_EXAMS: ExamSeoKey[] = ["nclex", "usmle", "naplex"];

export function ToolkitStudyGuides() {
  return (
    <section className="px-6 py-16 sm:py-20" aria-labelledby="toolkit-guides-heading">
      <div className="mx-auto max-w-5xl">
        <h2
          id="toolkit-guides-heading"
          className="text-center text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
        >
          NCLEX, USMLE & NAPLEX Study Guides
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
          In-depth guides, comparisons, and step-by-step study plans — optimized for 2026 board prep
          topics including UWorld alternatives, Blueprint Roadmaps, Deep Dives, and Full Exam
          readiness.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {PRIORITY_EXAMS.map((exam) => {
            const articles = getArticlesForExam(exam).slice(0, 4);
            const config = EXAM_SEO_CONFIG[exam];
            return (
              <div key={exam}>
                <h3 className="text-lg font-bold text-[var(--color-ink)]">
                  <Link
                    href={examMarketingPath(exam)}
                    className="hover:text-[var(--color-accent)]"
                  >
                    {config.shortName} prep hub →
                  </Link>
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/resources/${article.slug}`}
                        className="text-sm leading-snug text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/resources/six-board-exams-one-subscription"
            className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            See all {RESOURCE_ARTICLES.length} study guides →
          </Link>
        </div>
      </div>
    </section>
  );
}
