import { Analytics } from "@vercel/analytics/next";

/** Vercel Web Analytics — enable in Vercel project dashboard for production pageviews. */
export function VercelWebAnalytics() {
  return <Analytics />;
}
