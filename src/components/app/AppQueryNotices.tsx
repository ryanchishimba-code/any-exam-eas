"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StatusMessage } from "@/components/ui/StatusMessage";

const NOTICE_KEYS = ["checkout", "verified", "error"] as const;

type Notice =
  | { kind: "checkout" }
  | { kind: "verified" }
  | { kind: "error"; variant: "error" | "warning"; text: string };

function messageForError(code: string): { variant: "error" | "warning"; text: string } | null {
  switch (code) {
    case "admin_only":
      return {
        variant: "warning",
        text: "Admin accounts cannot access the student study hub. Use the admin console instead.",
      };
    case "staff_only":
      return {
        variant: "warning",
        text: "Staff accounts cannot access the student study hub. Use the internal tools instead.",
      };
    default:
      return null;
  }
}

function AppQueryNoticesInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cleanedRef = useRef(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setNotice({ kind: "checkout" });
    } else if (searchParams.get("verified") === "1") {
      setNotice({ kind: "verified" });
    } else {
      const errorCode = searchParams.get("error");
      const errorNotice = errorCode ? messageForError(errorCode) : null;
      if (errorNotice) {
        setNotice({ kind: "error", variant: errorNotice.variant, text: errorNotice.text });
      }
    }

    if (cleanedRef.current) return;
    const hasNoticeParam = NOTICE_KEYS.some((key) => searchParams.has(key));
    if (!hasNoticeParam) return;

    cleanedRef.current = true;
    const next = new URLSearchParams(searchParams.toString());
    for (const key of NOTICE_KEYS) next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  if (!notice) return null;

  if (notice.kind === "error") {
    return (
      <StatusMessage variant={notice.variant} className="mb-4">
        {notice.text}
      </StatusMessage>
    );
  }

  if (notice.kind === "verified") {
    return (
      <StatusMessage variant="success" className="mb-4">
        Your email is verified. You&apos;re all set to start studying.
      </StatusMessage>
    );
  }

  return (
    <StatusMessage variant="success" className="mb-4">
      Subscription active — welcome to Any Exam Easy.
    </StatusMessage>
  );
}

export function AppQueryNotices() {
  return (
    <Suspense fallback={null}>
      <AppQueryNoticesInner />
    </Suspense>
  );
}
