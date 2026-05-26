import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import FeedbackInbox from "./FeedbackInbox";

export default async function InternalFeedbackPage() {
  const auth = await requireInternalPermission("feedback.view");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">
        You do not have feedback access. Contact an administrator.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback inbox</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Review submissions, resolve issues, and track sentiment.
        </p>
      </div>
      <FeedbackInbox />
    </div>
  );
}
