"use client";

import { useState } from "react";
import type { QuiltTile } from "@/lib/ai";
import { cleanOptionText } from "@/lib/question-format";

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

  const options = tile.options ?? [];

  function check() {
    if (!selected) return;
    setRevealed(true);
  }

  const isCorrect =
    revealed && selected && cleanOptionText(selected) === cleanOptionText(correct);

  return (
    <div className="apple-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        Quiz tile
      </p>
      <p className="mt-3 text-lg font-medium leading-relaxed">{tile.front}</p>
      <ul className="mt-6 space-y-2">
        {options.map((o, i) => {
          const isSel = selected === o;
          const isCorr = cleanOptionText(o) === cleanOptionText(correct);
          let row = "border-black/[0.06] bg-white";
          if (revealed) {
            row = isCorr
              ? "border-green-300 bg-green-50"
              : isSel
                ? "border-red-300 bg-red-50"
                : "border-black/5 opacity-60";
          } else if (isSel) {
            row = "border-[var(--color-accent)] bg-blue-50";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => setSelected(o)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${row}`}
              >
                {String.fromCharCode(65 + i)}. {o}
              </button>
            </li>
          );
        })}
      </ul>
      {!revealed ? (
        <button
          type="button"
          onClick={check}
          disabled={!selected}
          className="mt-6 rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Check answer
        </button>
      ) : (
        <div className="mt-6">
          <p className={`text-sm font-medium ${isCorrect ? "text-green-800" : "text-red-800"}`}>
            {isCorrect ? "Correct!" : `Answer: ${correct}`}
          </p>
          {onMastered && (
            <button
              type="button"
              onClick={onMastered}
              className="mt-4 rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-[var(--color-accent)]"
            >
              Next tile
            </button>
          )}
        </div>
      )}
    </div>
  );
}
