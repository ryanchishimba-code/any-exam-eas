import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { getSocialEngagementSummary } from "@/lib/social/summary";
import { listModerationPosts } from "@/lib/social/posts";
import { listSocialAccountStatus } from "@/lib/social/accounts";
import { listScheduledPosts } from "@/lib/social/publish";
import { socialPublisher } from "@/lib/social/ayrshare";
import { SocialManager } from "@/components/admin/social/SocialManager";
import { SocialScheduler } from "@/components/admin/social/SocialScheduler";

export const metadata = {
  title: "Social & community — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  // Independent fetches; tolerate partial failure so the page still renders.
  const [summary, pending, channels, scheduled] = await Promise.all([
    getSocialEngagementSummary().catch(() => null),
    listModerationPosts({ status: "pending" }).catch(() => []),
    listSocialAccountStatus().catch(() => []),
    listScheduledPosts().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={ROUTES.admin.root}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to overview
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
          Social &amp; community
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Moderate the community wall, publish official posts, and track share engagement.
        </p>
      </div>

      <SocialScheduler initialPosts={scheduled} providerConfigured={socialPublisher.isConfigured()} />

      <SocialManager initialSummary={summary} initialPending={pending} channels={channels} />
    </div>
  );
}
