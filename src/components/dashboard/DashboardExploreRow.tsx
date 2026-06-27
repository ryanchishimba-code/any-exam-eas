"use client";

import Link from "next/link";
import { ArrowRight, Bone, Layers } from "lucide-react";
import { anatomyHref, top500Href } from "@/lib/edtech/practice-links";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type ExploreItem = {
  title: string;
  description: string;
  href: string;
  icon: typeof Bone;
};

export function DashboardExploreRow({ examSlug }: { examSlug: ExamSlug }) {
  if (!hasClinicalStudyTools(examSlug)) return null;

  const items: ExploreItem[] = [
    {
      title: "Anatomy Explorer",
      description: "3D structures with clinical pearls",
      href: anatomyHref(examSlug),
      icon: Bone,
    },
    {
      title: "Top 500 Drugs",
      description: "MOA, brands, and high-yield pearls",
      href: top500Href(examSlug),
      icon: Layers,
    },
  ];

  return (
    <section aria-labelledby="dashboard-explore-heading" className="space-y-2.5">
      <h2 id="dashboard-explore-heading" className={cn(dbUi.sectionTitle, "px-0.5")}>
        Clinical tools
      </h2>
      <div className={dbUi.exploreGrid}>
        {items.map((item) => (
          <Link key={item.title} href={item.href} className={dbUi.exploreLink}>
            <item.icon className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[var(--color-ink)]">{item.title}</p>
              <p className={dbUi.sectionHint}>{item.description}</p>
            </div>
            <ArrowRight
              className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-muted)]/40 group-hover:text-[var(--color-accent)]"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
