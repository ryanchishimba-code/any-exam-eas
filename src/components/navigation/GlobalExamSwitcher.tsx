"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GraduationCap } from "lucide-react";
import { useAppPreferences } from "@/lib/client/use-app-preferences";
import { ExamSwitcher } from "@/components/edtech/ExamSwitcher";
import { headerBoardExamSlug } from "@/lib/navigation/app-shell";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "nav" | "mobile";
  onNavigate?: () => void;
};

function GlobalExamSwitcherInner({ variant = "nav", onNavigate }: Props) {
  const pathname = usePathname();
  const { examSlug, loading, refresh } = useAppPreferences();
  // Saved primary exam only. A study-guide path must not relabel this chip
  // while Bank / Exam links still point at the saved board.
  const displayExam = headerBoardExamSlug(pathname, examSlug);

  if (loading && !displayExam) {
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

  if (!displayExam) {
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
      currentExam={displayExam}
      variant={variant}
      onSwitched={() => {
        onNavigate?.();
        void refresh();
      }}
    />
  );
}

export function GlobalExamSwitcher(props: Props) {
  // `useSession` can be authenticated in the server render and still "loading"
  // on the first client render when no session is passed into SessionProvider.
  // The chip and the account label are the two text nodes that then disagree
  // (#418). Hold every variant to an empty span until mount, before reading
  // session status, so header and sidebar cannot paint a name early.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-block",
          props.variant === "mobile" ? "h-10 w-full" : "h-9 min-w-[5.5rem]"
        )}
        aria-hidden
      />
    );
  }

  return <GlobalExamSwitcherAuthenticated {...props} />;
}

function GlobalExamSwitcherAuthenticated(props: Props) {
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <Suspense
      fallback={
        <span
          className={cn(
            "inline-block animate-pulse rounded-lg bg-black/[0.06]",
            props.variant === "nav" ? "h-8 w-24" : "h-10 w-full"
          )}
          aria-hidden
        />
      }
    >
      <GlobalExamSwitcherInner {...props} />
    </Suspense>
  );
}
