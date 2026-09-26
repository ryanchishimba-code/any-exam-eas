"use client";

import { ngnFocus } from "@/components/ngn/brand";

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
          return <span key={`static-${index}`}>{token.text}</span>;
        }
        const id = token.id;
        const pressed = chosen.has(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={pressed}
            disabled={disabled}
            onClick={() => toggle(id)}
            className={`mx-0.5 rounded-md px-1 py-0.5 text-left motion-reduce:transition-none ${ngnFocus} ${
              pressed
                ? "bg-[#0A2540] text-white"
                : "bg-transparent text-[#0A2540] underline decoration-[#00D4C8] decoration-2 underline-offset-4 hover:bg-[#E5FBF9]"
            }`}
          >
            {token.text}
          </button>
        );
      })}
    </p>
  );
}
