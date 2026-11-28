import Script from "next/script";
import { GOOGLE_ADS_ID, googleAdsScriptSrc } from "@/lib/analytics/google-ads";

const CONSENT_STUB = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });
`;

/**
 * Sitewide Google tag. The consent default is set before paint so ads storage
 * stays denied until a server-confirmed conversion. The tag itself loads with
 * next/script afterInteractive. The script address is only the Ads id.
 */
export function GoogleAdsTag() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: CONSENT_STUB }} suppressHydrationWarning />
      <Script src={googleAdsScriptSrc()} strategy="afterInteractive" />
    </>
  );
}
