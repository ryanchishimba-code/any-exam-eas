"use client";

import { MemberLoginLink } from "@/components/auth/MemberLoginLink";

type PageMemberAccessProps = {
  className?: string;
};

export function PageMemberAccess({ className = "mt-6" }: PageMemberAccessProps) {
  return (
    <MemberLoginLink callbackUrl="/study-hub" showEmailHint className={className} />
  );
}
