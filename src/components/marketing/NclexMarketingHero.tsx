import { ExamMarketingHero } from "@/components/marketing/ExamMarketingHero";

type Props = {
  questionCountLine: string;
};

/** @deprecated Use ExamMarketingHero — kept as a thin NCLEX wrapper. */
export function NclexMarketingHero({ questionCountLine }: Props) {
  return <ExamMarketingHero examKey="nclex" questionCountLine={questionCountLine} />;
}
