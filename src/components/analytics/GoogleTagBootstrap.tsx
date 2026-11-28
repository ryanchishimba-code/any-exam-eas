import { googleTagBootstrapScript } from "@/lib/analytics/google-ads";

/** Consent Mode v2 defaults and gtag stub, before the Google tag library loads. */
export function GoogleTagBootstrap() {
  return (
    <script
      id="google-tag-bootstrap"
      dangerouslySetInnerHTML={{ __html: googleTagBootstrapScript() }}
      suppressHydrationWarning
    />
  );
}
