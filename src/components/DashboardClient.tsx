"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

type LessonPlan = {
  id: string;
  title: string;
  field: string;
  gradeLevel: string | null;
  subjects: string;
  goals: string | null;
};

export function DashboardClient() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [title, setTitle] = useState("");
  const [field, setField] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subjects, setSubjects] = useState("");
  const [goals, setGoals] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/lesson-plans")
      .then((r) => r.json())
      .then((d) => setPlans(d.plans ?? []))
      .catch(() => {});
  }, []);

  async function createPlan(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/lesson-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, field, gradeLevel, subjects, goals }),
    });
    const data = await res.json();
    if (res.ok) {
      setPlans((p) => [data.plan, ...p]);
      setTitle("");
      setField("");
      setGradeLevel("");
      setSubjects("");
      setGoals("");
      setMessage("Lesson plan saved.");
    } else {
      setMessage(data.error ?? "Failed to save");
    }
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      <section className="apple-card p-8">
        <h2 className="text-xl font-semibold tracking-tight">Quick actions</h2>
        <div className="mt-6 flex flex-col gap-3">
          <Button href="/generate">Generate exam</Button>
          <Button href="/learn" variant="secondary">
            Open learning quilt
          </Button>
          <Button href="/pricing" variant="ghost">
            Manage subscription
          </Button>
        </div>
      </section>

      <section className="apple-card p-8">
        <h2 className="text-xl font-semibold tracking-tight">New lesson plan</h2>
        <form onSubmit={createPlan} className="mt-6 space-y-4">
          <input
            required
            placeholder="Plan title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="apple-input"
          />
          <input
            required
            placeholder="Field (e.g. Nursing, Grade 5 Math)"
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="apple-input"
          />
          <input
            placeholder="Grade level (optional)"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="apple-input"
          />
          <textarea
            required
            placeholder="Subjects / units (comma-separated)"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            className="apple-input min-h-[4.5rem] resize-y"
            rows={2}
          />
          <textarea
            placeholder="Learning goals (optional)"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="apple-input min-h-[4.5rem] resize-y"
            rows={2}
          />
          <Button type="submit">Save lesson plan</Button>
        </form>
        {message && <p className="mt-3 text-sm text-[var(--color-ink-muted)]">{message}</p>}
      </section>

      <section className="apple-card lg:col-span-2 p-8">
        <h2 className="text-xl font-semibold tracking-tight">Your lesson plans</h2>
        {plans.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
            No plans yet. Create one to organize exams by subject.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-black/5">
            {plans.map((p) => (
              <li key={p.id} className="py-4">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-[var(--color-ink-muted)]">
                  {p.field}
                  {p.gradeLevel ? ` · ${p.gradeLevel}` : ""} — {p.subjects}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
