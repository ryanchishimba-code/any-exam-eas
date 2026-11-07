import Link from "next/link";
import "@/styles/free-practice.css";
import {
  FREE_PRACTICE_BOARDS,
  freePracticeHref,
  type FreePracticeBoardSlug,
} from "@/lib/marketing/free-practice/paths";

const BOARD = new Map(FREE_PRACTICE_BOARDS.map((board) => [board.slug, board]));

/** Crawlable link to the public free-practice page, or to one board section. */
export function FreePracticeLink({
  board,
  prominent = false,
}: {
  board?: FreePracticeBoardSlug;
  prominent?: boolean;
}) {
  const meta = board ? BOARD.get(board) : undefined;
  const href = freePracticeHref(board);
  return (
    <div className={prominent ? "fp-promo" : "fp-promo fp-promo--quiet"}>
      {prominent && meta ? (
        <p className="fp-promo__title">Free {meta.label} practice questions</p>
      ) : null}
      <Link href={href} className={prominent ? "aee-flagship-cta aee-flagship-cta--primary" : undefined}>
        Free practice questions
      </Link>
      <p className="fp-promo__note">
        {meta
          ? `Read 10 free ${meta.label} practice questions with answers and rationales. No account required.`
          : "Read free practice questions for NCLEX, NAPLEX, PANCE, AANP FNP, USMLE, and NPTE-PT."}
      </p>
    </div>
  );
}
