import { redirect } from "next/navigation";
import { examMarketingPath, resolveExamSeoKey } from "@/lib/seo/exam-config";
import { buildExamMetadata } from "@/lib/seo/marketing-metadata";

type Props = { params: Promise<{ exam: string }> };

/** Legacy /exams/{slug} URLs → canonical /{slug} marketing pages. */
export async function generateMetadata({ params }: Props) {
  const { exam } = await params;
  return buildExamMetadata(exam);
}

export default async function LegacyExamPage({ params }: Props) {
  const { exam } = await params;
  if (exam === "top500") redirect("/study/drugs300");
  const key = resolveExamSeoKey(exam);
  if (!key) redirect("/");
  redirect(examMarketingPath(key));
}
