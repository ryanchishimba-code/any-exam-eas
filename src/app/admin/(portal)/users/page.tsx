import { AdminUserSearch } from "@/components/admin/AdminUserSearch";

export const metadata = {
  title: "Admin Users — Any Exam Easy",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search accounts by email or name. Open a profile for full CRM details.
        </p>
      </div>
      <AdminUserSearch />
    </div>
  );
}
