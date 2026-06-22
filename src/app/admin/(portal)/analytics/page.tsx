import AnalyticsDashboard from "@/app/internal/analytics/AnalyticsDashboard";
import { ConversionsDashboard } from "@/components/analytics/ConversionsDashboard";

export const metadata = {
  title: "Admin Analytics — Any Exam Easy",
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Traffic & analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Page views, traffic sources, user engagement, subscriptions, and feedback trends.
        </p>
      </div>
      <AnalyticsDashboard />

      <div className="border-t border-slate-200 pt-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Marketing conversions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Funnel events mirrored from GA4 into Postgres — CTAs, pricing, plans, trials, and signups.
          </p>
        </div>
        <ConversionsDashboard />
      </div>
    </div>
  );
}
