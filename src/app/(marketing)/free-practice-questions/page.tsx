import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { TrialStartLink } from "@/components/marketing/TrialStartLink";
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
import { landingOgImage } from "@/lib/seo/landing-og-image";
import "@/styles/free-practice.css";

const FREE_PRACTICE_SHARE_IMAGE = landingOgImage("home");

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
    images: [FREE_PRACTICE_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: FREE_PRACTICE_TITLE,
    description: FREE_PRACTICE_DESCRIPTION,
    images: [FREE_PRACTICE_SHARE_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

function Mark({ name }: { name: "book" | "arrow" | "check" }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "arrow") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M5 12h14" {...stroke} />
        <path d="M13 6l6 6-6 6" {...stroke} />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" {...stroke} />
        <path d="M8.2 12.3l2.4 2.4 5.2-5.4" {...stroke} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14.5H7.5A2.5 2.5 0 0 0 5 20V5.5z" {...stroke} />
      <path d="M5 17.5A2.5 2.5 0 0 1 7.5 15H19" {...stroke} />
    </svg>
  );
}

function TrialLink() {
  return (
    <TrialStartLink className="fp-cta" href={FREE_PRACTICE_TRIAL_HREF}>
      {FREE_PRACTICE_CTA_LABEL}
      <Mark name="arrow" />
    </TrialStartLink>
  );
}

function displaySources(sources: string[]): string[] {
  return sources
    .map((source) => source.replace(/^Source\s*(\[\d+\]|\d+)\s*[—–-]\s*/i, "").trim())
    .filter(Boolean);
}

function rationaleParagraphs(rationale: string): string[] {
  return rationale
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function Difficulty({ value }: { value: number }) {
  return (
    <span className="fp-badge fp-badge--level">
      <span className="fp-dots" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((dot) => (
          <span key={dot} className={dot < value ? "is-on" : undefined} />
        ))}
      </span>
      Difficulty {value} of 5
    </span>
  );
}

export default function FreePracticeQuestionsPage() {
  return (
    <div className="fp">
      <JsonLdScript data={buildFreePracticeJsonLd()} />
      <header className="fp-hero" id="top">
        <div className="fp-wrap fp-hero-grid">
          <div className="fp-hero-copy">
            <p className="fp-kicker">
              <Mark name="book" />
              AnyExamEasy
            </p>
            <h1>
              {FREE_PRACTICE_H1.split(/(NPTE-PT)/).map((part, index) =>
                part === "NPTE-PT" ? (
                  <span key={index} className="fp-nobr">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </h1>
            <p className="fp-value">
              Sixty free practice questions, with every answer and rationale on this page.
            </p>
            <p className="fp-lede">
              Open any card to reveal the answer and a full rationale written to the current exam
              outline. No account required.
            </p>
            <div className="fp-cta-row">
              <TrialLink />
              <p className="fp-note">Study support only. AnyExamEasy does not guarantee a result.</p>
            </div>
          </div>
          <aside className="fp-aside" aria-label="What is on this page">
            <p className="fp-aside-kicker">On this page</p>
            <ul className="fp-stats">
              <li>
                <strong>60</strong>
                <span>Questions</span>
              </li>
              <li>
                <strong>6</strong>
                <span>Boards</span>
              </li>
              <li>
                <strong>10</strong>
                <span>Per board</span>
              </li>
            </ul>
          </aside>
        </div>
      </header>

      <div className="fp-study">
        <div className="fp-jump-wrap">
          <nav className="fp-wrap" aria-label="Free practice questions by board">
            <ul className="fp-jump">
              {FREE_PRACTICE_BOARDS.map((board) => (
                <li key={board.slug}>
                  <a className="fp-tab" href={`#${board.slug}`}>
                    {board.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {FREE_PRACTICE_BOARDS.map((board, boardIndex) => {
          const questions = questionsForBoard(board.slug);
          return (
            <section
              key={board.slug}
              className={boardIndex % 2 === 1 ? "fp-board fp-board--mist" : "fp-board"}
              id={board.slug}
              aria-labelledby={`${board.slug}-heading`}
            >
              <div className="fp-wrap">
                <p className="fp-board-kicker">
                  {String(boardIndex + 1).padStart(2, "0")}
                  <span aria-hidden="true"> · </span>
                  {board.label}
                </p>
                <h2 id={`${board.slug}-heading`}>{board.h2}</h2>
                <p>{freePracticeIntro(board.slug)}</p>
                <p className="fp-links">
                  <Link href={board.href}>{board.prepLabel}</Link>
                  <a href="#top">All free practice questions</a>
                </p>
                <ol className="fp-list">
                  {questions.map((question, index) => (
                    <li key={question.id}>
                      <article className="fp-card" aria-labelledby={`${question.id}-title`}>
                        <p className="fp-meta">
                          <span className="fp-badge">{board.label}</span>
                          <span className="fp-badge fp-badge--quiet">
                            {index + 1} of {questions.length}
                          </span>
                          {question.step ? <span className="fp-badge">{question.step}</span> : null}
                          {question.topic ? (
                            <span className="fp-badge fp-badge--topic">{question.topic}</span>
                          ) : null}
                          <Difficulty value={question.difficulty} />
                        </p>
                        <h3 id={`${question.id}-title`} className="fp-stem">
                          {question.stem}
                        </h3>
                        <ol className="fp-options">
                          {question.options.map((option, optionIndex) => {
                            const keyed = option === question.answer;
                            return (
                              <li
                                key={`${question.id}-${optionIndex}`}
                                className={keyed ? "fp-option fp-option--key" : "fp-option"}
                              >
                                <span className="fp-letter" aria-hidden="true">
                                  {LETTERS[optionIndex] ?? optionIndex + 1}
                                </span>
                                <span className="fp-option-text">
                                  <span className="fp-sr">{LETTERS[optionIndex] ?? optionIndex + 1}. </span>
                                  {option}
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                        <details className="fp-reveal">
                          <summary>Show answer and rationale</summary>
                          <div className="fp-reveal-body">
                            <p className="fp-answer">
                              <Mark name="check" />
                              <span>
                                <strong>Answer. </strong>
                                {question.answer}
                              </span>
                            </p>
                            <div className="fp-rationale">
                              {rationaleParagraphs(question.rationale).map((paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>{paragraph}</p>
                              ))}
                            </div>
                            {displaySources(question.sources).length > 0 ? (
                              <p className="fp-source">
                                <strong>Source. </strong>
                                {displaySources(question.sources).map((source, sourceIndex) => (
                                  <cite key={source}>
                                    {sourceIndex > 0 ? " · " : ""}
                                    {source}
                                  </cite>
                                ))}
                              </p>
                            ) : null}
                          </div>
                        </details>
                      </article>
                    </li>
                  ))}
                </ol>
                <div className="fp-band">
                  <div className="fp-band-copy">
                    <p className="fp-band-kicker">{board.label}</p>
                    <p className="fp-band-title">{`Keep going with ${board.label}`}</p>
                    <p className="fp-band-note">
                      {`These ten questions are free to read. A free trial opens the rest of the ${board.label} practice on AnyExamEasy. No card is required.`}
                    </p>
                  </div>
                  <div className="fp-band-actions">
                    <TrialLink />
                    <Link className="fp-quiet" href={board.href}>
                      {board.prepLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="fp-faq" id="faq" aria-labelledby="free-practice-faq-heading">
        <div className="fp-wrap">
          <p className="fp-board-kicker">Questions</p>
          <h2 id="free-practice-faq-heading">Free practice questions FAQ</h2>
          <p className="fp-lede fp-faq-lede">
            Short answers about reading this page and starting a trial.
          </p>
          <div className="fp-faq-list">
            {FREE_PRACTICE_FAQS.map((faq) => (
              <details key={faq.question} className="fp-faq-item" name="free-practice-faq">
                <summary>
                  <h3>{faq.question}</h3>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="fp-close" aria-labelledby="free-practice-close-heading">
        <div className="fp-wrap">
          <h2 id="free-practice-close-heading">Keep practicing on AnyExamEasy</h2>
          <p className="fp-lede">
            These free practice questions are a sample. A free trial opens the rest of the practice
            for the board you choose.
          </p>
          <div className="fp-cta-row">
            <TrialLink />
          </div>
        </div>
      </section>
    </div>
  );
}
