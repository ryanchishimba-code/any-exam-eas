"use client";

import dynamic from "next/dynamic";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";

const BoardFreeQuizSection = dynamic(
  () =>
    import("@/components/marketing/free-quiz/BoardFreeQuizSection").then(
      (mod) => mod.BoardFreeQuizSection
    ),
  {
    loading: () => (
      <section id="quiz" className="bl-section bl-section--tight bl-free-quiz" aria-busy="true">
        <h2>Free quiz</h2>
        <p className="bl-section-lede">Student-eligible items from the live bank. No account required.</p>
      </section>
    ),
  }
);

export function BoardFreeQuizLazy({ board }: { board: FreeQuizBoardSlug }) {
  return <BoardFreeQuizSection board={board} />;
}
