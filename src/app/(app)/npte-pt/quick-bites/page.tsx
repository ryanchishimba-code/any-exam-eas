import { QuickBitesPage } from "@/components/quick-bites/QuickBitesPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Medical Math — AnyExamEasy",
  robots: { index: false, follow: false },
};

export default function NpteMedicalMathPage() {
  return <QuickBitesPage exam="npte-pt" />;
}
