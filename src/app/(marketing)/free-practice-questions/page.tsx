import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildFreePracticeJsonLd,
  FREE_PRACTICE_BOARDS,
  freePracticeIntro,
  FREE_PRACTICE_CTA_LABEL,
  FREE_PRACTICE_DESCRIPTION,
  FREE_PRACTICE_FAQS,
  FREE_PRACTICE_H1,
  FREE_PRACTICE_PATH,
  FREE_PRACTICE_TITLE,
  FREE_PRACTICE_TRIAL_HREF,
  questionsForBoard,
} from "@/lib/marketing/free-practice/catalog";
import "@/styles/free-practice.css";

export const dynamic = "force-static";
export const revalidate = 86400;

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

export const metadata: Metadata = {
  title: { absolute: FREE_PRACTICE_TITLE },
  description: FREE_PRACTICE_DESCRIPTION,
  alternates: { canonical: FREE_PRACTICE_PATH },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: FREE_PRACTICE_PATH,
    siteName: "AnyExamEasy",
    title: FREE_PRACTICE_TITLE,
    description: FREE_PRACTICE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: FREE_PRACTICE_TITLE,
    description: FREE_PRACTICE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function rationaleParagraphs(rationale: string): string[] {
  return rationale
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function FreePracticeQuestionsPage() {
  return (
    <div className="fp">
      <JsonLdScript data={buildFreePracticeJsonLd()} />
      <header className="fp-hero" id="top">
        <div className="fp-wrap">
          <p className="fp-kicker">AnyExamEasy</p>
          <h1>{FREE_PRACTICE_H1}</h1>
          <p className="fp-lede">
            Read free practice questions for six boards. Every stem, choice, answer, and rationale
            is on this page. A guideline source appears when the bank item has one. No account is
            required.
          </p>
          <div className="fp-cta-row">
            <Link className="fp-cta" href={FREE_PRACTICE_TRIAL_HREF}>
              {FREE_PRACTICE_CTA_LABEL}
            </Link>
            <p className="fp-note">Study support only. AnyExamEasy does not guarantee a result.</p>
          </div>
        </div>
      </header>

      <div className="fp-wrap">
        <nav aria-label="Free practice questions by board">
          <ul className="fp-jump">
            {FREE_PRACTICE_BOARDS.map((board) => (
              <li key={board.slug}>
                <a href={`#${board.slug}`}>{board.h2}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {FREE_PRACTICE_BOARDS.map((board) => {
        const questions = questionsForBoard(board.slug);
        return (
          <section key={board.slug} className="fp-board" id={board.slug} aria-labelledby={`${board.slug}-heading`}>
            <div className="fp-wrap">
              <h2 id={`${board.slug}-heading`}>{board.h2}</h2>
              <p>{freePracticeIntro(board.slug)}</p>
              <p className="fp-inline">
                <Link href={board.href}>{board.prepLabel}</Link>
                <a href="#top">All free practice questions</a>
              </p>
              <ol className="fp-list">
                {questions.map((question, index) => (
                  <li key={question.id}>
                    <article className="fp-card" aria-labelledby={`${question.id}-title`}>
                      <p className="fp-card-kicker">
                        <span className="fp-chip">
                          {board.label} {index + 1} of {questions.length}
                        </span>
                        {question.step ? <span className="fp-chip">{question.step}</span> : null}
                        {question.topic ? <span className="fp-chip">{question.topic}</span> : null}
                        <span className="fp-chip">Difficulty {question.difficulty} of 5</span>
                      </p>
                      <h3 id={`${question.id}-title`} className="fp-stem">
                        {question.stem}
                      </h3>
                      <ol className="fp-options" type="A">
                        {question.options.map((option, optionIndex) => (
                          <li key={option}>
                            <span className="fp-letter">{LETTERS[optionIndex]}.</span>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ol>
                      <details className="fp-reveal">
                        <summary>Show answer and rationale</summary>
                        <p className="fp-answer">
                          <strong>Answer. </strong>
                          {question.answer}
                        </p>
                        <div className="fp-rationale">
                          {rationaleParagraphs(question.rationale).map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex}>{paragraph}</p>
                          ))}
                        </div>
                        {question.sources.length > 0 ? (
                          <p className="fp-source">
                            <strong>Guideline. </strong>
                            {question.sources.map((source, sourceIndex) => (
                              <cite key={source}>
                                {sourceIndex > 0 ? " · " : ""}
                                {source}
                              </cite>
                            ))}
                          </p>
                        ) : null}
                      </details>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        );
      })}

      <section className="fp-faq" id="faq" aria-labelledby="free-practice-faq-heading">
        <div className="fp-wrap">
          <h2 id="free-practice-faq-heading">Free practice questions FAQ</h2>
          {FREE_PRACTICE_FAQS.map((faq) => (
            <div key={faq.question} className="fp-faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="fp-close" aria-labelledby="free-practice-close-heading">
        <div className="fp-wrap">
          <h2 id="free-practice-close-heading">Keep practicing on AnyExamEasy</h2>
          <p className="fp-lede">
            These free practice questions are a sample. A free trial opens the rest of the bank for
            the board you choose.
          </p>
          <div className="fp-cta-row">
            <Link className="fp-cta" href={FREE_PRACTICE_TRIAL_HREF}>
              {FREE_PRACTICE_CTA_LABEL}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
