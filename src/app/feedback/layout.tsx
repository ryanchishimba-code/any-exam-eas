import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";

/**
 * `/feedback` (canonical Contact; `/contact` redirects here) lives outside
 * `(marketing)`, so it does not inherit that layout. This wrapper loads the
 * flagship CTA styles the contact form shares with the other public pages.
 * `.aee-marketing` scopes teal the same way home, pricing, and about do.
 */
export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <div className="aee-marketing">{children}</div>;
}
