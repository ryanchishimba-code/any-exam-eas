import { AdminUserSearch } from "@/components/admin/AdminUserSearch";
import Link from "next/link";

export const metadata = {
  title: "Admin Users — Any Exam Easy",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search accounts by email or name. To add staff, go to{" "}
          <Link href="/admin/employees" className="font-medium text-indigo-700 hover:underline">
            Employees
          </Link>
          .
        </p>
      </div>
      <AdminUserSearch />
    </div>
  );
}
