"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { clearAllStudySessionsLocally } from "@/lib/questions/storage";

/** Shared React Query client — tuned for fast perceived loads and stable bank counts. */
export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    const onSignOut = () => {
      client.clear();
      clearAllStudySessionsLocally();
    };
    window.addEventListener("aee:clear-access-cache", onSignOut);
    return () => window.removeEventListener("aee:clear-access-cache", onSignOut);
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
