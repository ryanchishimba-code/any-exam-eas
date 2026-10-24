import Link from "next/link";
import { boardAccentPillClass } from "@/lib/marketing/board-accent";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";

const BOARDS: { slug: ExamSeoKey; label: string }[] = [
  { slug: "nclex", label: "NCLEX" },
  { slug: "naplex", label: "NAPLEX" },
  { slug: "usmle", label: "USMLE" },
  { slug: "aanp-fnp", label: "FNP" },
  { slug: "pance", label: "PANCE" },
  { slug: "npte-pt", label: "NPTE-PT" },
];

export function HomeFreeQuizSection() {
  return (
    <section
      className="home-section home-rise home-free-quiz"
      aria-labelledby="home-free-quiz-heading"
    >
      <h2 id="home-free-quiz-heading">Try a free 10-question quiz</h2>
      <p className="home-free-quiz__lede">
        Open a board page, answer ten live sample items, and read rationales. No sign-up.
      </p>
      <ul className="home-free-quiz__boards">
        {BOARDS.map((board) => (
          <li key={board.slug}>
            <Link
              href={`${examMarketingPath(board.slug)}#quiz`}
              className={boardAccentPillClass(board.slug)}
            >
              {board.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
