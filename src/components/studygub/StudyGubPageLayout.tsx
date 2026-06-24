"use client";

import { type ReactNode } from "react";
import { StudyGubNav } from "./StudyGubNav";
import { displayFirstName } from "@/lib/display-name";

export function StudyGubPageLayout({
  userName,
  children,
}: {
  userName?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-5xl gap-8 px-6 pb-24 pt-[var(--page-top)]">
        <StudyGubNav />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
            StudyGub
          </p>
          <h1 className="apple-display mt-2 text-[clamp(2rem,5vw,2.75rem)]">
            {userName ? `Hi, ${displayFirstName(userName)}.` : "StudyGub"}
          </h1>
          <p className="apple-subhead mt-3 max-w-xl text-[1.0625rem] text-slate-600">
            Question banks by exam and one shared Top 500 drug deck — nothing extra.
          </p>
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
