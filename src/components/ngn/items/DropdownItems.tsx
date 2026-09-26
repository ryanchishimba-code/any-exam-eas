"use client";

import { ngnFocus } from "@/components/ngn/brand";
import { orderForFormat } from "@/lib/assessment/shuffle";
import type { NgnOption, ResponseFormat } from "@/lib/assessment/types";

type Dropdown = { id: string; options: NgnOption[]; role?: string };

export function DropdownCloze({
  template,
  dropdowns,
  format,
  seed,
  value,
  onChange,
  disabled,
}: {
  template: string;
  dropdowns: Dropdown[];
  format: Extract<ResponseFormat, "dropdown_cloze" | "dropdown_rationale">;
  seed: string;
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const byId = new Map(dropdowns.map((dropdown) => [dropdown.id, dropdown]));
  const parts = template.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);

  return (
    <p className="text-[17px] leading-9 text-[#0A2540]">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{([a-zA-Z0-9_]+)\}\}$/);
        if (!match) return <span key={`text-${index}`}>{part}</span>;
        const id = match[1] ?? "";
        const dropdown = byId.get(id);
        if (!dropdown) return <span key={id}>{part}</span>;
        const options = orderForFormat(format, dropdown.options, `${seed}:${id}`);
        return (
          <label key={id} className="mx-1 inline-flex items-center">
            <span className="sr-only">{dropdown.role ? `${dropdown.role} ` : "Choice "}{id}</span>
            <select
              className={`min-h-11 max-w-full rounded-xl border border-[#e2e8f0] bg-white px-3 text-[15px] text-[#0A2540] ${ngnFocus}`}
              value={value[id] ?? ""}
              disabled={disabled}
              onChange={(event) => onChange({ ...value, [id]: event.target.value })}
            >
              <option value="">Select</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.text}
                </option>
              ))}
            </select>
          </label>
        );
      })}
    </p>
  );
}
