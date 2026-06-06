import { AdminSupportConsole } from "@/components/admin/AdminSupportConsole";

export const metadata = {
  title: "Customer Service — Admin",
};

export default function AdminSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Customer service
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Find users quickly, send emails, trigger password resets, and review activity.
        </p>
      </div>
      <AdminSupportConsole />
    </div>
  );
}
