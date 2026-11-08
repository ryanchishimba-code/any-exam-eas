import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quick Bites: FNP — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default function AanpFnpQuickBitesPage() {
  return <QuickBitesPage exam="aanp-fnp" />;
}
