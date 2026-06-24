"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { GraduationCap } from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "nav" | "mobile";
  onNavigate?: () => void;
};

export function GlobalExamSwitcher({ variant = "nav", onNavigate }: Props) {
  const { status } = useSession();
  const { examSlug, loading, refresh } = useAppPreferences();

  if (status !== "authenticated") return null;

  if (loading) {
    return (
      <span
        className={cn(
          "inline-block animate-pulse rounded-lg bg-black/[0.06]",
          variant === "nav" ? "h-8 w-24" : "h-10 w-full"
        )}
        aria-hidden
      />
    );
  }

  if (!examSlug) {
    return (
      <Link
        href={ROUTES.examSelect}
        onClick={onNavigate}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border border-teal-200/80 bg-teal-50/80 font-semibold text-teal-800 transition hover:bg-teal-100",
          variant === "nav" ? "px-2.5 py-1.5 text-xs" : "w-full px-3 py-2.5 text-sm"
        )}
      >
        <GraduationCap className="h-3.5 w-3.5" aria-hidden />
        Select exam
      </Link>
    );
  }

  return (
    <ExamSwitcher
      currentExam={examSlug}
      variant={variant}
      onSwitched={() => {
        onNavigate?.();
        void refresh();
      }}
    />
  );
}
