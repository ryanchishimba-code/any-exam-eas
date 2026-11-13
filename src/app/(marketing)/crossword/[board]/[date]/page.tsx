import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { CrosswordDay } from "@/components/crossword/CrosswordDay";
import { CROSSWORD_BOARDS, isCrosswordBoard } from "@/lib/crossword/boards";
import { dayMetadata } from "@/lib/crossword/metadata";
import { parseCrosswordDate, todayIsoCentral } from "@/lib/crossword/schedule";

/** Short cache so a dated URL can reveal answers after Chicago midnight. */
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  const today = todayIsoCentral();
  return CROSSWORD_BOARDS.map((board) => ({ board, date: today }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; date: string }>;
}): Promise<Metadata> {
  const { board, date } = await params;
  if (!isCrosswordBoard(board) || !parseCrosswordDate(date)) {
    await connection();
    return {};
  }
  return dayMetadata(board, date);
}

export default async function CrosswordDatedPage({
  params,
}: {
  params: Promise<{ board: string; date: string }>;
}) {
  const { board, date } = await params;
  if (!isCrosswordBoard(board) || !parseCrosswordDate(date)) {
    await connection();
    notFound();
  }
  return <CrosswordDay board={board} date={date} />;
}
