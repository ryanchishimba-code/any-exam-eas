"use client";

import dynamic from "next/dynamic";
import type { FreeQuizBoardSlug } from "@/lib/marketing/free-quiz";

const BoardFreeQuizSection = dynamic(
  () =>
    import("@/components/marketing/free-quiz/BoardFreeQuizSection").then(
      (mod) => mod.BoardFreeQuizSection
    ),
  { ssr: false, loading: () => null }
);

export function BoardFreeQuizLazy({ board }: { board: FreeQuizBoardSlug }) {
  return <BoardFreeQuizSection board={board} />;
}
