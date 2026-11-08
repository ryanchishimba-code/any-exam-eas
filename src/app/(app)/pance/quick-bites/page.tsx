import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quick Bites: PANCE — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default function PanceQuickBitesPage() {
  return <QuickBitesPage exam="pance" />;
}
