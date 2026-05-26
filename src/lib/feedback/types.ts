export const FEEDBACK_CATEGORIES = [
  { id: "general", label: "General feedback" },
  { id: "bug", label: "Bug report" },
  { id: "feature", label: "Feature request" },
  { id: "content", label: "Content / questions" },
  { id: "billing", label: "Billing & subscription" },
  { id: "ux", label: "Usability & design" },
  { id: "other", label: "Other" },
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]["id"];

export const FEEDBACK_CATEGORY_IDS = FEEDBACK_CATEGORIES.map((c) => c.id);

export type FeedbackStatus = "open" | "resolved";

export type FeedbackSort = "newest" | "oldest" | "rating_high" | "rating_low";

export type FeedbackListItem = {
  id: string;
  name: string | null;
  email: string | null;
  category: string;
  message: string;
  rating: number;
  status: FeedbackStatus;
  userId: string | null;
  createdAt: string;
  resolvedAt: string | null;
};
