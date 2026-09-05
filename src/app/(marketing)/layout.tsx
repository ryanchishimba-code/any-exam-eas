import "@/styles/landing-theme.css";
import "@/styles/landing-flagship.css";

/**
 * Marketing shell CSS: theme tokens + flagship (homepage + exam landings).
 * Heavier legacy `landing-page.css` is imported only by components that still
 * need older aee-* classes (HowWeCompare, Hero, etc.) so `/` stays lighter.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
