"use client";

import { ngnFocus } from "@/components/ngn/brand";
import { InlineBold } from "@/components/ngn/InlineBold";
import { stripInlineBoldMarkers } from "@/lib/questions/inline-bold";

type Token = { id?: string; text: string; selectable?: boolean };

export function HighlightText({
  tokens,
  selected,
  onChange,
  disabled,
}: {
  tokens: Token[];
  selected: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}) {
  const chosen = new Set(selected);

  function toggle(id: string) {
    if (disabled) return;
    const next = chosen.has(id) ? selected.filter((entry) => entry !== id) : [...selected, id];
    onChange(next);
  }

  return (
    <p className="text-[17px] leading-8 text-[#0A2540]">
      {tokens.map((token, index) => {
        if (!token.selectable || !token.id) {
          return (
            <span key={`static-${index}`}>
              <InlineBold text={token.text} />
            </span>
          );
        }
        const id = token.id;
        const pressed = chosen.has(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={pressed}
            aria-label={`Selectable phrase: ${stripInlineBoldMarkers(token.text)}`}
            disabled={disabled}
            onClick={() => toggle(id)}
            className={`rounded-sm px-0.5 text-left motion-reduce:transition-none ${ngnFocus} ${
              pressed
                ? "bg-[#0A2540] text-white"
                : "bg-transparent text-inherit decoration-[#00D4C8] decoration-2 underline-offset-4 hover:bg-[#E5FBF9] hover:underline focus-visible:bg-[#E5FBF9] focus-visible:underline"
            }`}
          >
            <InlineBold text={token.text} />
          </button>
        );
      })}
    </p>
  );
}
