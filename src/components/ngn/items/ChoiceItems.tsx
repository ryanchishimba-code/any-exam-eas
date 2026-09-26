"use client";

import type { ReactNode } from "react";
import { ngnFocus } from "@/components/ngn/brand";
import { orderForFormat } from "@/lib/assessment/shuffle";
import type { NgnOption } from "@/lib/assessment/types";

function OptionList({
  options,
  render,
}: {
  options: NgnOption[];
  render: (option: NgnOption) => ReactNode;
}) {
  return <ul className="space-y-2">{options.map((option) => <li key={option.id}>{render(option)}</li>)}</ul>;
}

const optionClass = (selected: boolean) =>
  `flex min-h-11 w-full items-start gap-3 rounded-2xl px-4 py-3 text-left text-[15px] leading-6 text-[#0A2540] motion-reduce:transition-none ${ngnFocus} ${
    selected ? "bg-[#E5FBF9] ring-2 ring-[#0A2540]" : "bg-white ring-1 ring-[#e2e8f0] hover:bg-[#f4f6f8]"
  }`;

export function McSingle({
  options,
  seed,
  value,
  onChange,
  disabled,
  name,
}: {
  options: NgnOption[];
  seed: string;
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  name: string;
}) {
  const ordered = orderForFormat("mc_single", options, seed);
  return (
    <OptionList
      options={ordered}
      render={(option) => (
        <label className={optionClass(value === option.id)}>
          <input
            type="radio"
            name={name}
            className="mt-1 h-4 w-4 accent-[#0A2540]"
            checked={value === option.id}
            disabled={disabled}
            onChange={() => onChange(option.id)}
          />
          <span>{option.text}</span>
        </label>
      )}
    />
  );
}

export function Sata({
  options,
  seed,
  selected,
  onChange,
  disabled,
}: {
  options: NgnOption[];
  seed: string;
  selected: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}) {
  const ordered = orderForFormat("mr_sata", options, seed);
  const chosen = new Set(selected);
  return (
    <OptionList
      options={ordered}
      render={(option) => {
        const checked = chosen.has(option.id);
        return (
          <label className={optionClass(checked)}>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[#0A2540]"
              checked={checked}
              disabled={disabled}
              onChange={() =>
                onChange(checked ? selected.filter((id) => id !== option.id) : [...selected, option.id])
              }
            />
            <span>{option.text}</span>
          </label>
        );
      }}
    />
  );
}

export function SelectN({
  options,
  n,
  seed,
  selected,
  onChange,
  disabled,
}: {
  options: NgnOption[];
  n: number;
  seed: string;
  selected: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}) {
  const ordered = orderForFormat("mr_select_n", options, seed);
  const chosen = new Set(selected);
  const atCap = selected.length >= n;
  return (
    <div>
      <p id="select-n-count" className="mb-3 text-sm font-medium text-[#334155]">
        Select {n}. {selected.length} of {n} selected.
      </p>
      <OptionList
        options={ordered}
        render={(option) => {
          const checked = chosen.has(option.id);
          const locked = Boolean(disabled) || (!checked && atCap);
          return (
            <label className={optionClass(checked)}>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#0A2540]"
                checked={checked}
                disabled={locked}
                aria-describedby="select-n-count"
                onChange={() => {
                  if (locked) return;
                  onChange(checked ? selected.filter((id) => id !== option.id) : [...selected, option.id]);
                }}
              />
              <span>{option.text}</span>
            </label>
          );
        }}
      />
    </div>
  );
}
