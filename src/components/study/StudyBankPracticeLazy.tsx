"use client";

import dynamic from "next/dynamic";
import { useEffect, type ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function StudyBankPracticeSkeleton() {
  return (
    <div className="question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}

const StudyBankPractice = dynamic(
  () => import("./StudyBankPractice").then((m) => m.StudyBankPractice),
  { loading: () => <StudyBankPracticeSkeleton /> }
);

export function StudyBankPracticeLazy(
  props: ComponentProps<typeof StudyBankPractice>
) {
  useEffect(() => {
    try {
      sessionStorage.removeItem("aee:qb-error-auto-retry");
    } catch {
      /* ignore */
    }
  }, []);

  const scopeKey = `${props.preferredExamSlug ?? "open"}:${props.initialFieldId ?? "default"}`;
  return <StudyBankPractice key={scopeKey} {...props} />;
}
