"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GraduationCap } from "lucide-react";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { ROUTES } from "@/lib/routes";
import { isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "nav" | "mobile";
  onNavigate?: () => void;
};

export function GlobalExamSwitcher({ variant = "nav", onNavigate }: Props) {
  const { status } = useSession();
  const [examSlug, setExamSlug] = useState<ExamSlug | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPreference = useCallback(async () => {
    try {
      const res = await fetch("/api/user/exam-preference", { cache: "no-store" });
      const data = (await res.json()) as { examSlug?: string | null };
      if (data.examSlug && isExamSlug(data.examSlug)) {
        setExamSlug(data.examSlug);
      } else {
        setExamSlug(null);
      }
    } catch {
      setExamSlug(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      setExamSlug(null);
      return;
    }
    void loadPreference();
  }, [status, loadPreference]);

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
        void loadPreference();
      }}
    />
  );
}
