"use client";

import { MemberLoginLink } from "@/components/auth/MemberLoginLink";

type PageMemberAccessProps = {
  variant?: "default" | "dark";
  className?: string;
};

export function PageMemberAccess({ variant = "default", className = "mt-6" }: PageMemberAccessProps) {
  return (
    <MemberLoginLink
      callbackUrl="/dashboard"
      variant={variant}
      showEmailHint
      className={className}
    />
  );
}
