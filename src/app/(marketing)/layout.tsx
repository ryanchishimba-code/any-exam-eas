import "@/styles/landing-theme.css";

/**
 * Shared marketing tokens. The large flagship stylesheet is loaded by the
 * `(with-flagship)` group so `/pricing` does not parse it on first paint.
 * `.aee-marketing` scopes teal accent + clearer muted ink without recoloring the app.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <div className="aee-marketing">{children}</div>;
}
