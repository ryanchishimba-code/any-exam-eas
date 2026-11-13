import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrosswordDay } from "@/components/crossword/CrosswordDay";
import { CROSSWORD_BOARDS, isCrosswordBoard } from "@/lib/crossword/boards";
import { dayMetadata } from "@/lib/crossword/metadata";
import { todayIsoCentral } from "@/lib/crossword/schedule";

export const revalidate = 60;

export function generateStaticParams() {
  return CROSSWORD_BOARDS.map((board) => ({ board }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isCrosswordBoard(board)) return {};
  return dayMetadata(board, todayIsoCentral());
}

export default async function CrosswordBoardPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isCrosswordBoard(board)) notFound();
  return <CrosswordDay board={board} date={todayIsoCentral()} />;
}
