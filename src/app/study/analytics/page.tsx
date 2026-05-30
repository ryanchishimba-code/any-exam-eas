import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export const metadata = {
  title: "Learning analytics | Any Exam Easy",
  description: "Mastery scores, weak areas, and personalized exam recommendations.",
};

export default function StudyAnalyticsPage() {
  return (
    <div className="mx-auto max-w-[980px] px-6 py-12">
      <p className="apple-eyebrow">Performance</p>
      <h1 className="apple-headline mt-2">Learning analytics</h1>
      <p className="apple-lede mt-4 max-w-xl">
        Accuracy trends, weak topics, and recent test scores — powered by your question
        attempts.
      </p>
      <StudentDashboard />
    </div>
  );
}
