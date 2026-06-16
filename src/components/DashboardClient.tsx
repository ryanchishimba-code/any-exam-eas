"use client";

import { useEffect, useState } from "react";
import type { SubscriptionAccess } from "@/lib/subscription-access";
import { Button } from "./ui/Button";
import { ManageBillingButton } from "./ManageBillingButton";
import { ProgressTracker } from "./ProgressTracker";
import { SubscribeButton } from "./SubscribeButton";

type LessonPlan = {
  id: string;
  title: string;
  field: string;
  gradeLevel: string | null;
  subjects: string;
  goals: string | null;
};

export function DashboardClient({
  access,
  compact = false,
}: {
  access: SubscriptionAccess;
  compact?: boolean;
}) {
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

  if (compact && access.hasAccess) {
    return null;
  }

  return (
    <div className="mt-10 space-y-12">
      {!compact && (
        <section className="apple-card p-8">
          <h2 className="text-xl font-semibold tracking-tight">Start studying</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Board-style question banks, timed practice, and progress tracking — your activity
            saves automatically.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {access.hasAccess ? (
              <>
                <Button href="/study/practice?mode=timed">Timed exam</Button>
                <Button href="/study/practice?mode=bank" variant="secondary">
                  Question bank
                </Button>
                <Button href="/study-hub#progress" variant="ghost">
                  Progress
                </Button>
              </>
            ) : (
              <SubscribeButton />
            )}
            <Button href="/progress" variant="ghost">
              View progress
            </Button>
          </div>
        </section>
      )}

      {!compact && <ProgressTracker embedded />}

      <div className="grid gap-10 lg:grid-cols-2">
        <section className="apple-card p-8">
          <h2 className="text-xl font-semibold tracking-tight">Subscription</h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {access.status === "active"
              ? `${access.tier === "pro" ? "Pro" : "Basic"} plan active.`
              : access.status === "past_due"
                ? "Your last payment failed — study access is paused until you update your payment method."
                : access.status === "trialing"
                  ? `${access.tier === "pro" ? "Pro" : "Basic"} trial active${access.daysRemaining != null ? ` · ${access.daysRemaining} day${access.daysRemaining === 1 ? "" : "s"} left` : ""}. Payment on file — cancel anytime before trial ends for no charge.`
                  : access.status === "inactive" && access.needsPaymentMethod
                    ? "Complete checkout to start your free trial — payment required, not charged until trial ends."
                    : access.status === "canceled"
                      ? "Your subscription was canceled — reactivate anytime to restore access."
                      : access.status === "trial_expired"
                        ? "Your trial ended — subscribe to continue."
                        : "Choose a plan to unlock study features."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {access.status === "active" ? (
              <>
                <ManageBillingButton label="Cancel or manage billing" />
                {access.tier === "basic" && (
                  <Button href="/checkout?plan=subscribe&interval=yearly&tier=pro" variant="secondary">
                    Upgrade to Pro
                  </Button>
                )}
              </>
            ) : access.status === "past_due" ? (
              <ManageBillingButton label="Update payment method" intent="payment_method" variant="secondary" />
            ) : access.status === "canceled" || access.status === "trial_expired" ? (
              <Button href="/settings?reactivate=1" variant="secondary">
                Reactivate account
              </Button>
            ) : access.status === "inactive" && access.needsPaymentMethod ? (
              <Button href={`/checkout?plan=trial&interval=${access.planDuration}&tier=${access.tier}`} variant="secondary">
                Complete checkout
              </Button>
            ) : access.status === "trialing" ? (
              <>
                <ManageBillingButton label="Cancel or manage billing" />
                {access.tier === "basic" && (
                  <Button href={`/checkout?plan=subscribe&interval=${access.planDuration}&tier=pro`} variant="secondary">
                    Upgrade to Pro
                  </Button>
                )}
              </>
            ) : access.canStartCheckout ? (
              <SubscribeButton variant="secondary" />
            ) : null}
            <Button href="/settings" variant="ghost">
              Billing settings
            </Button>
            <Button href="/pricing" variant="ghost">
              View pricing
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
      </div>

      <section className="apple-card p-8">
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
