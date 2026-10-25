import Link from "next/link";
import { getCrmUserProfile } from "@/lib/crm/user-profile";
import { summarizeBillingCycle } from "@/lib/crm/billing-cycle";
import UserProfileCRM from "@/app/internal/users/[userId]/UserProfileCRM";
import { CustomerServiceTools } from "@/components/admin/CustomerServiceTools";
import { displayFirstLastInitial } from "@/lib/display-name";
import { getCachedSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions";
import { logAdminAction } from "@/lib/audit";
import { loadAdminStudyProof } from "@/lib/engagement/admin-study-proof";
import { AdminStudyProofPanel } from "@/components/admin/AdminStudyProofPanel";
import { AdminStudyCompletionPanel } from "@/components/admin/AdminStudyCompletionPanel";
import { computeAdminStudyCompletionBreakdown } from "@/lib/learning/study-completion/compute-study-completion";

export const metadata = {
  title: "User Profile — Admin",
};

type Props = { params: Promise<{ userId: string }> };

export default async function AdminUserProfilePage({ params }: Props) {
  const { userId } = await params;
  const [profile, session] = await Promise.all([
    getCrmUserProfile(userId),
    getCachedSession(),
  ]);

  if (!profile) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">User not found.</p>
        <Link href="/admin/users" className="mt-4 inline-block text-sm text-cyan-700 hover:underline">
          ← Back to users
        </Link>
      </div>
    );
  }

  const canViewProof = hasPermission(session?.user?.role, "crm.view_users");
  const [billing, studyCompletionBoards, studyProof] = await Promise.all([
    Promise.resolve(summarizeBillingCycle(profile.subscription)),
    computeAdminStudyCompletionBreakdown(userId),
    canViewProof ? loadAdminStudyProof(userId) : Promise.resolve(null),
  ]);

  if (canViewProof && session?.user?.id) {
    void logAdminAction({
      actorId: session.user.id,
      action: "VIEW_STUDY_PROOF",
      targetType: "user",
      targetId: userId,
    });
  }
  const subscriptionLabel = `${billing.label} — ${billing.detail}`;
  const displayName = displayFirstLastInitial(profile.user.name, profile.user.email);
  const canManageStaff = hasPermission(session?.user?.role, "admin.actions");

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm text-cyan-700 hover:underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          {displayName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {profile.user.email} · {profile.user.role} · {profile.user.accountStatus}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-800">
          {billing.label}
          <span className="font-normal text-slate-500"> · {billing.detail}</span>
        </p>
      </div>

      <CustomerServiceTools
        userId={profile.user.id}
        email={profile.user.email}
        name={profile.user.name}
        accountStatus={profile.user.accountStatus}
        subscriptionLabel={subscriptionLabel}
        lastActiveAt={profile.user.lastActiveAt}
        activityTimeline={profile.activityTimeline ?? []}
      />

      {studyProof ? <AdminStudyProofPanel proof={studyProof} userId={userId} /> : null}

      <AdminStudyCompletionPanel boards={studyCompletionBoards} />

      <UserProfileCRM
        profile={profile}
        actorRole={session?.user?.role}
        canManageStaff={canManageStaff}
      />
    </div>
  );
}
