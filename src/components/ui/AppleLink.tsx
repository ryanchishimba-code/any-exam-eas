import Link from "next/link";
import type { ReactNode } from "react";

export function AppleLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`apple-link ${className}`}>
      {children}
      <span aria-hidden className="apple-link-chevron">
        ›
      </span>
    </Link>
  );
}
