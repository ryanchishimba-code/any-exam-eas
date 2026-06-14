"use client";

import Link from "next/link";
import { ArrowRight, Bone, Layers } from "lucide-react";
import { anatomyHref, top500Href } from "@/lib/edtech/practice-links";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";

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
      description: "3D structures with clinical pearls.",
      href: anatomyHref(examSlug),
      icon: Bone,
    },
    {
      title: "Top 500 Drugs",
      description: "MOA, brands, and high-yield pearls.",
      href: top500Href(examSlug),
      icon: Layers,
    },
  ];

  return (
    <section aria-labelledby="dashboard-explore-heading" className="space-y-3">
      <h2 id="dashboard-explore-heading" className={dbUi.sectionTitle}>
        Clinical tools
      </h2>
      <div className={dbUi.exploreRow}>
        {items.map((item) => (
          <Link key={item.title} href={item.href} className={dbUi.exploreLink}>
            <item.icon className="h-5 w-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
              <p className="text-[12px] text-[var(--color-ink-muted)]">{item.description}</p>
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-[var(--color-accent)] opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
