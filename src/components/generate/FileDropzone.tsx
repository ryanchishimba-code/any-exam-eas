"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ".txt,.md,.pdf,text/plain,text/markdown,application/pdf";

type Props = {
  onText: (text: string, fileName?: string) => void;
  disabled?: boolean;
};

export function FileDropzone({ onText, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");

  const processFile = useCallback(
    async (file: File) => {
      setError("");
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf") {
        setError(
          "PDF preview is limited — paste notes below or upload .txt / .md for best results."
        );
        setFileName(file.name);
        onText(
          `[Uploaded PDF: ${file.name}] — add pasted notes for question generation.`,
          file.name
        );
        return;
      }
      try {
        const text = await file.text();
        if (text.trim().length < 20) {
          setError("File is too short. Add at least a few paragraphs of notes.");
          return;
        }
        setFileName(file.name);
        onText(text.slice(0, 50_000), file.name);
      } catch {
        setError("Could not read file. Try a .txt or .md file.");
      }
    },
    [onText]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) void processFile(file);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
            : "border-black/[0.1] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-elevated)]",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-[var(--color-ink-muted)]" />
        <p className="text-sm font-medium text-[var(--color-ink)]">
          Drag & drop PDF or text notes
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          or click to browse · .txt, .md, .pdf
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
          }}
        />
      </div>

      {fileName && (
        <div className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-[var(--color-accent)]" />
          <span className="flex-1 truncate text-[var(--color-ink)]">{fileName}</span>
          <button
            type="button"
            className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            onClick={() => {
              setFileName(null);
              onText("");
            }}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-amber-700">{error}</p>}
    </div>
  );
}
