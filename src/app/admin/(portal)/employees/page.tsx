import { StaffManagementPanel } from "@/components/crm/StaffManagementPanel";

export const metadata = {
  title: "Admin Employees — Any Exam Easy",
};

export default function AdminEmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Employees</h1>
        <p className="mt-1 text-sm text-slate-500">
          Invite staff, assign roles, and manage access to the employee portal.
        </p>
      </div>
      <StaffManagementPanel />
    </div>
  );
}
