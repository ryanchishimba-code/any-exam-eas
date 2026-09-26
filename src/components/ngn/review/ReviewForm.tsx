"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ngnFocus } from "@/components/ngn/brand";

const RUBRIC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] as const;

const fieldClass = `mt-1 w-full min-h-11 rounded-xl border border-[#e2e8f0] bg-white px-3 text-sm text-[#0A2540] ${ngnFocus}`;

export function ReviewForm({
  itemId,
  itemVersion,
  flags,
}: {
  itemId: string;
  itemVersion: number;
  flags: string[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [rubric, setRubric] = useState<Record<string, number>>(() =>
    Object.fromEntries(RUBRIC.map((key) => [key, 3]))
  );
  const [resolutions, setResolutions] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    const form = new FormData(event.currentTarget);
    const missing = flags.filter((flag) => !resolutions[flag]?.trim());
    if (missing.length > 0) {
      setError("Write one resolution for each RN flag.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/admin/ngn/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          itemId,
          itemVersion,
          reviewerName: String(form.get("reviewerName") ?? ""),
          licenseType: String(form.get("licenseType") ?? ""),
          licenseNumber: String(form.get("licenseNumber") ?? ""),
          licenseState: String(form.get("licenseState") ?? ""),
          multistateNlc: form.get("multistateNlc") === "on",
          nursysVerifiedOn: String(form.get("nursysVerifiedOn") ?? ""),
          nursysResult: String(form.get("nursysResult") ?? ""),
          decision: String(form.get("decision") ?? ""),
          rubric,
          flagResolutions: resolutions,
          comments: String(form.get("comments") ?? ""),
          minutesSpent: Number(form.get("minutesSpent") ?? 0),
        }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "The review could not be saved.");
        return;
      }
      setSaved(true);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-[#e2e8f0] bg-white p-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0A2540]">Record a review</h3>
        <p className="mt-1 text-sm leading-6 text-[#334155]">
          Reviews are append-only. This form does not publish the item.
        </p>
      </div>
      <label className="block text-sm font-medium text-[#0A2540]">
        Reviewer name
        <input name="reviewerName" required className={fieldClass} autoComplete="name" />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm font-medium text-[#0A2540]">
          License type
          <input name="licenseType" required defaultValue="RN" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#0A2540]">
          License number
          <input name="licenseNumber" required className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#0A2540]">
          License state
          <input name="licenseState" required className={fieldClass} />
        </label>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm text-[#0A2540]">
        <input type="checkbox" name="multistateNlc" className="h-4 w-4 accent-[#0A2540]" />
        Multistate NLC
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[#0A2540]">
          Nursys verified on
          <input name="nursysVerifiedOn" type="date" required className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-[#0A2540]">
          Nursys result
          <input name="nursysResult" required className={fieldClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-[#0A2540]">
        Decision
        <select name="decision" required className={fieldClass} defaultValue="revise">
          <option value="approve">Approve</option>
          <option value="revise">Revise</option>
          <option value="reject">Reject</option>
        </select>
      </label>
      <fieldset>
        <legend className="text-sm font-medium text-[#0A2540]">Rubric A–J (1–4)</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {RUBRIC.map((key) => (
            <label key={key} className="text-sm text-[#0A2540]">
              {key}
              <select
                className={fieldClass}
                value={rubric[key]}
                onChange={(event) =>
                  setRubric((current) => ({ ...current, [key]: Number(event.target.value) }))
                }
              >
                {[1, 2, 3, 4].map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      {flags.length > 0 ? (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[#0A2540]">One resolution per RN flag</legend>
          {flags.map((flag) => (
            <label key={flag} className="block text-sm text-[#334155]">
              {flag}
              <textarea
                required
                className={fieldClass}
                value={resolutions[flag] ?? ""}
                onChange={(event) =>
                  setResolutions((current) => ({ ...current, [flag]: event.target.value }))
                }
              />
            </label>
          ))}
        </fieldset>
      ) : (
        <p className="text-sm text-[#334155]">No RN flags on this item.</p>
      )}
      <label className="block text-sm font-medium text-[#0A2540]">
        Comments
        <textarea name="comments" className={fieldClass} rows={3} />
      </label>
      <label className="block text-sm font-medium text-[#0A2540]">
        Minutes spent
        <input name="minutesSpent" type="number" required min={1} max={600} defaultValue={20} className={fieldClass} />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-[#9f1239]">
          {error}
        </p>
      ) : null}
      {saved ? <p className="text-sm text-[#0A2540]">Review saved. It cannot be edited.</p> : null}
      <button
        type="submit"
        disabled={pending}
        className={`min-h-11 rounded-full bg-[#0A2540] px-5 text-sm font-medium text-white disabled:bg-[#334155] ${ngnFocus}`}
      >
        {pending ? "Saving…" : "Save review"}
      </button>
    </form>
  );
}
