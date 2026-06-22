import type { Metadata } from "next";
import { QuestionBankManager } from "@/components/internal/QuestionBankManager";

export const metadata: Metadata = {
  title: "Question bank · Admin",
  robots: { index: false, follow: false },
};

/**
 * Surfaces the full question-bank manager (search, filters, pagination, bulk
 * actions, add/edit, preview drawer) inside the admin portal. The component
 * talks to /api/internal/questions/bank/* and self-gates each action with the
 * questions.view / questions.edit / questions.publish permissions — all of
 * which admins hold. Auth for the page itself comes from the (portal) layout.
 */
export default function AdminQuestionsPage() {
  return <QuestionBankManager />;
}
