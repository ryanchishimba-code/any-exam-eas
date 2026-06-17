"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { InlineError } from "@/components/ui/StatusMessage";

type FieldOption = { fieldId: string; examName: string };

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "1 · Easiest",
  2: "2 · Easy",
  3: "3 · Medium",
  4: "4 · Hard",
  5: "5 · Hardest",
};

export function AddQuestionForm({
  fields,
  onClose,
  onCreated,
}: {
  fields: FieldOption[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [fieldId, setFieldId] = useState(fields[0]?.fieldId ?? "nursing");
  const [subjectId, setSubjectId] = useState("general");
  const [itemType, setItemType] = useState("mcq");
  const [difficulty, setDifficulty] = useState(3);
  const [question, setQuestion] = useState("");
  const [scenario, setScenario] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [blueprintDomain, setBlueprintDomain] = useState("");
  const [blueprintTopic, setBlueprintTopic] = useState("");
  const [tags, setTags] = useState("");
  const [draft, setDraft] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  }

  function addOption() {
    setOptions((prev) => [...prev, ""]);
  }

  function removeOption(i: number) {
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    setCorrectIndex((prev) => (prev === i ? 0 : prev > i ? prev - 1 : prev));
  }

  async function submit() {
    setError(null);
    const cleanedOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanedOptions.length < 2) {
      setError("Add at least two answer options.");
      return;
    }
    const correctAnswer = (options[correctIndex] ?? "").trim();
    if (!correctAnswer) {
      setError("Select which option is correct.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/internal/questions/bank", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldId,
          subjectId,
          itemType,
          difficulty,
          question,
          scenario: scenario.trim() || undefined,
          options: cleanedOptions,
          correctAnswer,
          explanation,
          blueprintDomain: blueprintDomain.trim() || undefined,
          blueprintTopic: blueprintTopic.trim() || undefined,
          tags: tags
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : undefined,
          draft,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-black/[0.08] bg-white px-6 py-4">
          <h2 className="text-lg font-semibold">Add a question</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/[0.05]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Exam</span>
              <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                className="apple-input w-full"
              >
                {fields.map((f) => (
                  <option key={f.fieldId} value={f.fieldId}>
                    {f.examName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Subject / topic id</span>
              <input
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="apple-input w-full"
                placeholder="e.g. cardiovascular"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Item type</span>
              <input
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="apple-input w-full"
                placeholder="mcq"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Difficulty</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="apple-input w-full"
              >
                {[1, 2, 3, 4, 5].map((d) => (
                  <option key={d} value={d}>
                    {DIFFICULTY_LABELS[d]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Scenario / vignette (optional)</span>
            <textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              rows={2}
              className="apple-input w-full"
              placeholder="Clinical context shown above the stem"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Question stem</span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="apple-input w-full"
              placeholder="What is the priority nursing action?"
            />
          </label>

          <div className="text-sm">
            <span className="mb-1 block font-medium">Answer options · select the correct one</span>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    className="h-4 w-4 shrink-0"
                  />
                  <input
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    className="apple-input w-full"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="rounded-lg p-1.5 text-black/40 hover:bg-black/[0.05] hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]"
            >
              <Plus size={14} /> Add option
            </button>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Rationale / explanation</span>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
              className="apple-input w-full"
              placeholder="Explain why the correct answer is right and the distractors are wrong."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Blueprint category (optional)</span>
              <input
                value={blueprintDomain}
                onChange={(e) => setBlueprintDomain(e.target.value)}
                className="apple-input w-full"
                placeholder="e.g. Physiological Adaptation"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Blueprint topic (optional)</span>
              <input
                value={blueprintTopic}
                onChange={(e) => setBlueprintTopic(e.target.value)}
                className="apple-input w-full"
                placeholder="e.g. sepsis"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Tags (comma separated, optional)</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="apple-input w-full"
              placeholder="high-yield, prioritization"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
              className="h-4 w-4"
            />
            <span>
              Save as <strong>draft</strong> (inactive until reviewed &amp; QA-passed)
            </span>
          </label>

          {error ? <InlineError>{error}</InlineError> : null}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-black/[0.08] bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/[0.1] px-4 py-2 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Saving…" : draft ? "Save draft" : "Create question"}
          </button>
        </div>
      </div>
    </div>
  );
}
