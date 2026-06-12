import { vi } from "vitest";
import React from "react";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>) => {
    const Lazy = React.lazy(async () => {
      const mod = await loader();
      return { default: mod.default ?? (mod as React.ComponentType<Record<string, unknown>>) };
    });
    return function DynamicComponent(props: Record<string, unknown>) {
      return (
        <React.Suspense fallback={<div data-testid="dynamic-loading" />}>
          <Lazy {...props} />
        </React.Suspense>
      );
    };
  },
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
