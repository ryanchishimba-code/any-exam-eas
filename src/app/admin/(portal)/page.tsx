import { PortalHomeDashboard } from "@/components/internal/PortalHomeDashboard";

export const metadata = {
  title: "Admin Overview — Any Exam Easy",
};

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform health, sign-ups, and key metrics at a glance.
        </p>
      </div>
      <PortalHomeDashboard />
    </div>
  );
}
