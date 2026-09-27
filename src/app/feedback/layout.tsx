import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";

/**
 * `/feedback` (canonical Contact; `/contact` redirects here) lives outside
 * `(marketing)`, so it does not inherit that layout. Without this wrapper,
 * `--color-accent` stays the app indigo and flagship CTA styles never load.
 * `.aee-marketing` scopes teal the same way home, pricing, and about do.
 */
export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <div className="aee-marketing">{children}</div>;
}
