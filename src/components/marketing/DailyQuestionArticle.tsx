import Link from "next/link";
import type { QotdItem } from "@/lib/demo/qotd-public";
import { examMarketingHref, qotdPath } from "@/lib/demo/qotd-public";

const LABELS = ["A", "B", "C", "D"] as const;

/** Server-rendered question, choices, correct answer, and rationale. */
export function DailyQuestionArticle({ item }: { item: QotdItem }) {
  return (
    <article className="aee-daily-q" id={`daily-${item.examSlug}`}>
      <h2>
        <Link href={qotdPath(item.examSlug)}>{item.examLabel} practice question</Link>
      </h2>
      <p className="aee-daily-q__stem">{item.stem}</p>
      <ol className="aee-daily-q__options">
        {item.options.map((option, index) => (
          <li key={option}>
            <span className="aee-daily-q__label">{LABELS[index] ?? index + 1}.</span> {option}
          </li>
        ))}
      </ol>
      <h3>Rationale</h3>
      <p className="aee-daily-q__answer">
        <strong>Correct answer: {item.correct}</strong>
      </p>
      <p className="aee-daily-q__rationale">{item.rationale}</p>
      <p className="aee-daily-q__more">
        <Link href={examMarketingHref(item.examSlug)}>{item.examLabel} exam prep</Link>
      </p>
    </article>
  );
}

/** Answer text for the practice page. The stem already renders above this block. */
export function DailyAnswerBlock({ item }: { item: QotdItem }) {
  return (
    <section className="aee-daily-answer" aria-labelledby={`rationale-${item.examSlug}`}>
      <h2 id={`rationale-${item.examSlug}`}>Rationale</h2>
      <p className="aee-daily-q__answer">
        <strong>Correct answer: {item.correct}</strong>
      </p>
      <p className="aee-daily-q__rationale">{item.rationale}</p>
    </section>
  );
}
