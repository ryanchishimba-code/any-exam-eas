"use client";

import { ngnFocus } from "@/components/ngn/brand";
import { InlineBold } from "@/components/ngn/InlineBold";
import { DEFAULT_MATRIX_ROW_HEADER } from "@/lib/assessment/matrix-row-header";
import { stripInlineBoldMarkers } from "@/lib/questions/inline-bold";

type Column = { id: string; label: string };
type Row = { id: string; text: string };

export function MatrixMC({
  columns,
  rows,
  value,
  onChange,
  disabled,
  name,
  rowHeader = DEFAULT_MATRIX_ROW_HEADER,
}: {
  columns: Column[];
  rows: Row[];
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  name: string;
  rowHeader?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-[#e2e8f0] px-3 py-2 text-[#334155]">
              <InlineBold text={rowHeader} />
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="border-b border-[#e2e8f0] px-3 py-2 font-semibold text-[#0A2540]"
              >
                <InlineBold text={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-[#e2e8f0] px-3 py-3 font-medium text-[#0A2540]">
                <InlineBold text={row.text} />
              </th>
              {columns.map((column) => {
                const checked = value[row.id] === column.id;
                return (
                  <td key={column.id} className="border-b border-[#e2e8f0] px-3 py-3 text-center">
                    <input
                      type="radio"
                      name={`${name}-${row.id}`}
                      className={`h-4 w-4 accent-[#0A2540] ${ngnFocus}`}
                      checked={checked}
                      disabled={disabled}
                      aria-label={`${stripInlineBoldMarkers(row.text)}: ${stripInlineBoldMarkers(column.label)}`}
                      onChange={() => onChange({ ...value, [row.id]: column.id })}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MatrixMR({
  columns,
  rows,
  value,
  onChange,
  disabled,
  rowHeader = DEFAULT_MATRIX_ROW_HEADER,
}: {
  columns: Column[];
  rows: Row[];
  value: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  disabled?: boolean;
  rowHeader?: string;
}) {
  function toggle(rowId: string, columnId: string) {
    const current = value[rowId] ?? [];
    const next = current.includes(columnId)
      ? current.filter((id) => id !== columnId)
      : [...current, columnId];
    onChange({ ...value, [rowId]: next });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-[#e2e8f0] px-3 py-2 text-[#334155]">
              <InlineBold text={rowHeader} />
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="border-b border-[#e2e8f0] px-3 py-2 font-semibold text-[#0A2540]"
              >
                <InlineBold text={column.label} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="border-b border-[#e2e8f0] px-3 py-3 font-medium text-[#0A2540]">
                <InlineBold text={row.text} />
              </th>
              {columns.map((column) => {
                const checked = (value[row.id] ?? []).includes(column.id);
                return (
                  <td key={column.id} className="border-b border-[#e2e8f0] px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      className={`h-4 w-4 accent-[#0A2540] ${ngnFocus}`}
                      checked={checked}
                      disabled={disabled}
                      aria-label={`${stripInlineBoldMarkers(row.text)}: ${stripInlineBoldMarkers(column.label)}`}
                      onChange={() => toggle(row.id, column.id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
