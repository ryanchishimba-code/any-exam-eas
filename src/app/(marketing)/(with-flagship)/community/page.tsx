import { Users } from "lucide-react";
import { CommunityFeed } from "@/components/social/CommunityFeed";
import { CommunitySubmitForm } from "@/components/social/CommunitySubmitForm";
import { SocialShareBar } from "@/components/social/SocialShareBar";

export const metadata = {
  title: "Community wall — AnyExamEasy",
  description:
    "Study tips, wins, and questions from the AnyExamEasy community of NCLEX, USMLE, NAPLEX, PANCE, and FNP candidates.",
};

export default function CommunityPage() {
  return (
    <div className="bg-[var(--color-bg)]">
      <section className="px-6 pt-[var(--page-top)]">
        <div className="mx-auto max-w-5xl pb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-elevated))] px-4 py-1.5 text-sm font-bold text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
            <Users className="h-4 w-4" aria-hidden />
            Community wall
          </span>
          <h1 className="mt-6 text-balance text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
            Wins, tips, and questions from{" "}
            <span className="aee-flagship-gradient-text">students like you.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Real study tips and pass-day wins from the AnyExamEasy community. Share your own —
            approved posts appear here for everyone.
          </p>
          <div className="mt-6 flex justify-center">
            <SocialShareBar entityType="page" text="Join the AnyExamEasy community 🎓" />
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <CommunitySubmitForm />
          <CommunityFeed />
        </div>
      </section>
    </div>
  );
}
