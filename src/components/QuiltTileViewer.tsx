"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuiltTile } from "@/lib/ai";
import { cleanOptionText } from "@/lib/question-format";
import { normalizeStem } from "@/lib/questions/stem";

export function QuiltTileViewer({
  tile,
  onMastered,
}: {
  tile: QuiltTile;
  onMastered?: () => void;
}) {
  if (tile.type === "quiz" && tile.options && tile.options.length >= 2) {
    return <QuizTile tile={tile} onMastered={onMastered} />;
  }
  return <FlashcardTile tile={tile} onMastered={onMastered} />;
}

function FlashcardTile({
  tile,
  onMastered,
}: {
  tile: QuiltTile;
  onMastered?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-3xl bg-[var(--color-ink)] p-8 text-center text-white transition hover:opacity-95"
      >
        <p className="text-lg font-medium leading-relaxed">
          {flipped ? tile.back : tile.front}
        </p>
        {!flipped && tile.hint && (
          <p className="mt-2 text-sm text-neutral-400">{tile.hint}</p>
        )}
        <p className="mt-4 text-xs text-neutral-500">Tap to flip</p>
      </button>
      {flipped && onMastered && (
        <button
          type="button"
          onClick={onMastered}
          className="mt-4 w-full rounded-full bg-[var(--color-accent)] py-3 text-sm font-medium text-white"
        >
          Got it — next tile
        </button>
      )}
    </div>
  );
}

function QuizTile({
  tile,
  onMastered,
}: {
  tile: QuiltTile;
  onMastered?: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = tile.correctAnswer ?? tile.back;
  const stem = normalizeStem(tile.front);
  const options = tile.options ?? [];

  function check() {
    if (!selected) return;
    setRevealed(true);
  }

  const isCorrect =
    revealed && selected && cleanOptionText(selected) === cleanOptionText(correct);

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xl font-medium leading-snug sm:text-2xl">{stem}</p>
      <ul className="mt-6 space-y-2.5">
        {options.map((o, i) => {
          const isSel = selected === o;
          const isCorr = cleanOptionText(o) === cleanOptionText(correct);
          let row = "border-black/[0.08] bg-[var(--color-surface)]";
          if (revealed) {
            row = isCorr
              ? "border-emerald-300 bg-emerald-50"
              : isSel
                ? "border-red-300 bg-red-50"
                : "border-black/5 opacity-50";
          } else if (isSel) {
            row = "border-[var(--color-accent)] bg-sky-50 ring-2 ring-sky-200";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setSelected(o)}
                className={`flex w-full gap-3 rounded-xl border px-4 py-3.5 text-left text-sm ${row}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-xs font-semibold">
                  {i + 1}
                </span>
                {cleanOptionText(o)}
              </button>
            </li>
          );
        })}
      </ul>
      <AnimatePresence>
        {!revealed ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={check}
            disabled={!selected}
            className="mt-8 rounded-full bg-[var(--color-accent)] px-10 py-3 text-sm font-medium text-white disabled:opacity-40"
          >
            Check
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <p
              className={`text-sm font-semibold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}
            >
              {isCorrect ? "Correct" : "Review"}
            </p>
            {!isCorrect && (
              <p className="text-sm text-[var(--color-ink-muted)]">
                Answer: {cleanOptionText(correct)}
              </p>
            )}
            {onMastered && (
              <button
                type="button"
                onClick={onMastered}
                className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-[var(--color-accent)]"
              >
                Next tile
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
