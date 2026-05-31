"use client";

import { Brain, Sparkles } from "lucide-react";
import type { DrugCardDto } from "@/lib/drugs300";

type Props = {
  card: DrugCardDto;
  flipped: boolean;
  onFlip: () => void;
  mnemonic: string | null;
  onGenerateMnemonic: () => void;
  mnemonicLoading: boolean;
};

export function DrugFlashcard({
  card,
  flipped,
  onFlip,
  mnemonic,
  onGenerateMnemonic,
  mnemonicLoading,
}: Props) {
  const displayMnemonic = mnemonic ?? card.customMnemonic ?? card.mnemonic;

  return (
    <div className="mx-auto w-full max-w-lg">
      <button
        type="button"
        onClick={onFlip}
        className="aee-flip-scene w-full text-left"
        aria-label={flipped ? "Hide answer" : "Reveal answer"}
      >
        <div className={`aee-flip-card min-h-[380px] ${flipped ? "is-flipped" : ""}`}>
          <div className="aee-flip-face aee-flip-front aee-drug-flashcard-front">
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-widest text-teal-100">
                #{card.rank} · {card.drugClassLabel}
              </span>
              <p className="mt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-teal-200/90">
                Generic name
              </p>
              <p className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {card.generic}
              </p>
              <p className="mt-8 text-xs text-teal-100/60">Tap card to flip</p>
            </div>
          </div>

          <div className="aee-flip-face aee-flip-back aee-drug-flashcard-back">
            <div className="flex h-full flex-col overflow-y-auto p-6 sm:p-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-cyan-200/90">
                Brand · Class
              </p>
              <p className="mt-2 text-xl font-bold text-white">{card.brand}</p>
              <p className="mt-1 text-sm text-cyan-100/85">{card.therapeuticClass}</p>

              <div className="mt-5 space-y-4 text-left">
                <div>
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-200/75">
                    Indications
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-teal-50/95">{card.indications}</p>
                </div>
                <div>
                  <p className="text-[0.625rem] font-bold uppercase tracking-wider text-amber-200/80">
                    Key side effects
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-amber-50/90">{card.sideEffects}</p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <p className="flex items-start gap-1.5 text-sm text-cyan-50">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden />
                    <span>
                      <strong className="font-semibold">Mnemonic:</strong> {displayMnemonic}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {flipped && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGenerateMnemonic();
          }}
          disabled={mnemonicLoading || Boolean(mnemonic || card.customMnemonic)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-teal-200/80 bg-white/80 px-4 py-2.5 text-sm font-medium text-teal-800 backdrop-blur transition hover:bg-teal-50 disabled:opacity-50 dark:border-teal-800 dark:bg-slate-900/80 dark:text-teal-200"
        >
          <Brain className="h-4 w-4" aria-hidden />
          {mnemonicLoading ? "Generating alternate…" : "AI alternate mnemonic"}
        </button>
      )}
    </div>
  );
}
