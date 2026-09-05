import Link from "next/link";
import { getCrmUserProfile } from "@/lib/crm/user-profile";
import UserProfileCRM from "@/app/internal/users/[userId]/UserProfileCRM";
import { CustomerServiceTools } from "@/components/admin/CustomerServiceTools";
import { displayFirstLastInitial } from "@/lib/display-name";

export const metadata = {
  title: "User Profile — Admin",
};

type Props = { params: Promise<{ userId: string }> };

export default async function AdminUserProfilePage({ params }: Props) {
  const { userId } = await params;
  const profile = await getCrmUserProfile(userId);

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

  const sub = profile.subscription;
  const subscriptionLabel = sub
    ? `${sub.status}${sub.plan ? ` (${sub.plan})` : ""}`
    : "No subscription";
  const displayName = displayFirstLastInitial(profile.user.name, profile.user.email);

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

      <UserProfileCRM profile={profile} />
    </div>
  );
}
