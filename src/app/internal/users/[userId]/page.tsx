import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { hasPermission } from "@/lib/permissions";
import { PageShell } from "@/components/PageShell";
import { getCrmUserProfile } from "@/lib/crm/user-profile";
import UserProfileCRM from "./UserProfileCRM";

type Props = { params: Promise<{ userId: string }> };

export default async function InternalUserProfilePage({ params }: Props) {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) {
    return (
      <PageShell title="Forbidden" description="You do not have access to the CRM.">
        <p className="mt-4 text-sm text-amber-800">Request admin access.</p>
      </PageShell>
    );
  }

  const { userId } = await params;
  const profile = await getCrmUserProfile(userId);
  if (!profile) {
    return <PageShell title="User not found" description="No matching account exists." />;
  }

  return (
    <PageShell
      title={profile.user.name ?? profile.user.email}
      eyebrow="Customer profile"
      description={`Role: ${profile.user.role} • Status: ${profile.user.accountStatus}`}
      maxWidth="max-w-5xl"
    >
      <UserProfileCRM
        profile={profile}
        actorRole={auth.role}
        canManageStaff={hasPermission(auth.role, "admin.actions")}
      />
    </PageShell>
  );
}

