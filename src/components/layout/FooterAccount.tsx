"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/routes";

const SIGNED_OUT_LINKS = [
  { href: "/auth/login", label: "Log in" },
  { href: ROUTES.auth.signup, label: "Sign up" },
] as const;

const SIGNED_IN_LINKS = [
  { href: ROUTES.dashboard, label: "Dashboard" },
  { href: ROUTES.settings, label: "Settings" },
] as const;

/** Trial line under the logo. Hidden once the client knows the visitor is signed in. */
export function FooterSignedOutNote({ label }: { label: string }) {
  const { data, status } = useSession();
  if (status === "authenticated" && data?.user) return null;
  return (
    <p className="mt-3 max-w-full text-sm leading-relaxed text-[var(--color-ink-muted)]">
      {label} on AnyExamEasy. No payment method required.
    </p>
  );
}

/** Account column. First paint matches the logged-out cache; the session updates it. */
export function FooterAccountLinks() {
  const { data, status } = useSession();
  const signedIn = status === "authenticated" && Boolean(data?.user);
  const links = signedIn ? SIGNED_IN_LINKS : SIGNED_OUT_LINKS;
  return (
    <nav aria-label="Account links">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)]">
        Account
      </p>
      <ul className="space-y-2" role="list">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              prefetch={false}
              className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
