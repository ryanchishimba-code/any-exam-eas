import Link from "next/link";
import "@/styles/free-practice.css";
import { CROSSWORD_PRACTICE_NOTE, boardProfile, type CrosswordBoard } from "@/lib/crossword/boards";
import { crosswordBoardPath } from "@/lib/crossword/schedule";

/** Same promo pattern as the free-practice link already on each board page. */
export function BoardCrosswordPromo({ board }: { board: CrosswordBoard }) {
  const profile = boardProfile(board);
  const headingId = `crossword-promo-${board}`;

  return (
    <section className="fp-promo" aria-labelledby={headingId}>
      <p className="fp-promo__title" id={headingId}>
        Free {profile.shortName} crossword
      </p>
      <Link href={crosswordBoardPath(board)} className="aee-flagship-cta aee-flagship-cta--primary">
        Play today&apos;s crossword
      </Link>
      <p className="fp-promo__note">
        {profile.lede} No account required. {CROSSWORD_PRACTICE_NOTE}
      </p>
    </section>
  );
}
