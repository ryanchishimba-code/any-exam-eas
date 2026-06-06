"use client";

import { MpjeUsStateSearch } from "./MpjeUsStateSearch";
import { cn } from "@/lib/utils";

type MpjeStateSelectProps = {
  value: string;
  onChange: (code: string) => void;
  className?: string;
  disabled?: boolean;
};

/** Searchable MPJE state selector — 50 states + DC, default OK. */
export function MpjeStateSelect(props: MpjeStateSelectProps) {
  return (
    <MpjeUsStateSearch
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      className={cn(props.className)}
    />
  );
}
