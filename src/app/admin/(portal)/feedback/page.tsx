import FeedbackInbox from "@/app/internal/feedback/FeedbackInbox";

export const metadata = {
  title: "Admin Feedback — Any Exam Easy",
};

export default function AdminFeedbackPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Feedback</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review submissions, reply to users, and mark issues resolved.
        </p>
      </div>
      <FeedbackInbox enableReply />
    </div>
  );
}
