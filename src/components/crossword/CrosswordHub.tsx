import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { puzzleForDate } from "@/lib/crossword/bank";
import {
  CROSSWORD_BOARDS,
  CROSSWORD_PRACTICE_NOTE,
  boardProfile,
} from "@/lib/crossword/boards";
import { formatTrialLabel } from "@/lib/site";
import { hubJsonLd } from "@/lib/crossword/metadata";
import {
  crosswordBoardPath,
  crosswordDatedPath,
  formatCrosswordDate,
  formatCrosswordDateLong,
  recentArchiveDates,
  todayIsoCentral,
} from "@/lib/crossword/schedule";

export function CrosswordHub() {
  const today = todayIsoCentral();
  const recent = recentArchiveDates(7);

  return (
    <article className="xw-wrap">
      <JsonLdScript data={hubJsonLd()} />
      <p className="xw-kicker">Free daily tool</p>
      <h1>Today&apos;s high-yield crossword</h1>
      <p className="xw-lede">
        {formatCrosswordDateLong(today)}. One new puzzle for each board, shared by everyone until midnight,
        America/Chicago. {CROSSWORD_PRACTICE_NOTE}
      </p>
      <div className="xw-hub-grid">
        {CROSSWORD_BOARDS.map((board) => {
          const profile = boardProfile(board);
          const count = puzzleForDate(board, today)?.slots.length ?? 10;
          return (
            <section key={board} className="xw-hub-card">
              <p className="xw-kicker">{profile.examName}</p>
              <h2>{profile.shortName}</h2>
              <p>{profile.lede}</p>
              <p>{count} clues today · about a few minutes</p>
              <div className="xw-hub-actions">
                <Link className="xw-btn xw-btn-primary" href={crosswordBoardPath(board)}>
                  Play {profile.shortName}
                </Link>
                <Link className="xw-btn" href={crosswordDatedPath(board, today)}>
                  Today&apos;s link
                </Link>
              </div>
            </section>
          );
        })}
      </div>
      <section className="xw-study" style={{ marginTop: "1.25rem" }} aria-label="How it works">
        <h2>How it works</h2>
        <ol className="xw-steps">
          <li>Open your board. The same puzzle is live for everyone until midnight, America/Chicago.</li>
          <li>Solve from the clues. Check your work, or reveal a letter or word if you are stuck.</li>
          <li>Finish for a one-line rationale, a spoiler-free share card, and a link to 10 free questions.</li>
        </ol>
        <p className="xw-note">No account required. A streak stays on this device until you create a free account. {CROSSWORD_PRACTICE_NOTE}</p>
      </section>
      <section className="xw-faq xw-card" style={{ marginTop: "1rem" }} aria-label="Crossword questions">
        <h2>Questions</h2>
        <details open>
          <summary>When does the puzzle change?</summary>
          <p className="xw-note">At midnight, America/Chicago. Yesterday&apos;s grid stays on its dated link.</p>
        </details>
        <details>
          <summary>Do I need an account?</summary>
          <p className="xw-note">No. Play first. Create a free account when you want to keep a streak, or start a {formatTrialLabel()}. No card needed.</p>
        </details>
        <details>
          <summary>Does this mean I will pass?</summary>
          <p className="xw-note">No. It is practice, not a promise you&apos;ll pass.</p>
        </details>
      </section>
      <section className="xw-archive" style={{ marginTop: "1rem" }} aria-label="Recent puzzles">
        <h2>Recent puzzles</h2>
        {recent.map((iso) => (
          <div key={iso} style={{ marginTop: "0.7rem" }}>
            <h3 className="xw-section-title">{formatCrosswordDate(iso)}</h3>
            <ul className="xw-board-row">
              {CROSSWORD_BOARDS.map((board) => (
                <li key={board}>
                  <Link href={crosswordDatedPath(board, iso)}>
                    {boardProfile(board).shortName}
                    {iso === today ? " today" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
