import AnalyticsDashboard from "@/app/internal/analytics/AnalyticsDashboard";

export const metadata = {
  title: "Admin Analytics — Any Exam Easy",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign-ups, active users, subscriptions, and popular exams.
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
