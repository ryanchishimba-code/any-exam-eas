import Link from "next/link";
import { CrosswordPlayer } from "@/components/crossword/CrosswordPlayer";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { archiveAnswers, toPublicPuzzle } from "@/lib/crossword/bank";
import {
  CROSSWORD_BOARDS,
  CROSSWORD_PRACTICE_NOTE,
  boardHomeHref,
  boardProfile,
} from "@/lib/crossword/boards";
import { dayJsonLd } from "@/lib/crossword/metadata";
import {
  crosswordBoardPath,
  crosswordDatedPath,
  crosswordHubPath,
  formatCrosswordDate,
  formatCrosswordDateLong,
  recentArchiveDates,
} from "@/lib/crossword/schedule";
import type { CrosswordBoard } from "@/lib/crossword/boards";
import { notFound } from "next/navigation";

export function CrosswordDay({ board, date }: { board: CrosswordBoard; date: string }) {
  const puzzle = toPublicPuzzle(board, date);
  if (!puzzle) notFound();
  const profile = boardProfile(board);
  const answers = archiveAnswers(board, date);
  const recent = recentArchiveDates(14).filter((iso) => iso !== date);

  return (
    <article className="xw-wrap">
      <JsonLdScript data={dayJsonLd(board, date, puzzle.slots.map((slot) => slot.clue))} />
      <p className="xw-kicker">Free daily tool · {profile.shortName}</p>
      <h1>
        {profile.shortName} crossword for {formatCrosswordDate(date)}
      </h1>
      <p className="xw-lede">
        {formatCrosswordDateLong(date)} · {puzzle.slots.length} high-yield clues · {profile.lede}{" "}
        {CROSSWORD_PRACTICE_NOTE} A new puzzle unlocks at midnight, America/Chicago.
      </p>
      <CrosswordPlayer puzzle={puzzle} />
      <div className="xw-below">
        <section className="xw-study" aria-label="Keep studying">
          <h2>Keep studying {profile.shortName}</h2>
          <p className="xw-note">The crossword is a warm-up. The free questions are the next step.</p>
          <ul className="xw-links">
            <li>
              <Link href={puzzle.quizHref}>Try 10 free {profile.shortName} questions</Link>
            </li>
            <li>
              <Link href={puzzle.signupHref}>Create a free account</Link>
            </li>
            <li>
              <Link href={boardHomeHref(board)}>{profile.examName} overview</Link>
            </li>
            {profile.study.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link href={crosswordHubPath()}>All daily crosswords</Link>
            </li>
          </ul>
        </section>
        <section className="xw-archive" aria-label="Other puzzles">
          <h2>Other boards today</h2>
          <ul className="xw-board-row">
            {CROSSWORD_BOARDS.filter((item) => item !== board).map((item) => (
              <li key={item}>
                <Link href={crosswordBoardPath(item)}>{boardProfile(item).shortName}</Link>
              </li>
            ))}
          </ul>
          <h2 style={{ marginTop: "0.9rem" }}>Recent {profile.shortName} puzzles</h2>
          <ul className="xw-archive-list">
            {recent.map((iso) => (
              <li key={iso}>
                <Link href={crosswordDatedPath(board, iso)}>{formatCrosswordDate(iso)}</Link>
              </li>
            ))}
          </ul>
        </section>
        {answers ? (
          <details className="xw-answers xw-card">
            <summary>Show answers and rationales for {formatCrosswordDate(date)}</summary>
            <ol className="xw-answer-list">
              {answers.map((item) => (
                <li key={item.label}>
                  <strong>
                    {item.label}: {item.answer}
                  </strong>
                  <p>{item.clue}</p>
                  <p>{item.rationale}</p>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </div>
    </article>
  );
}
