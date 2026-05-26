export const EVENT_TYPES = {
  USER_REGISTERED: "USER_REGISTERED",
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  SESSION_STARTED: "SESSION_STARTED",
  PAGE_VIEW: "PAGE_VIEW",
  QUESTION_GENERATED: "QUESTION_GENERATED",
  QUESTION_GENERATION_FAILED: "QUESTION_GENERATION_FAILED",
  QUESTION_BANK_FETCH: "QUESTION_BANK_FETCH",
  QUILT_GENERATED: "QUILT_GENERATED",
  PROGRESS_UPDATED: "PROGRESS_UPDATED",
  SEARCH_TOPIC: "SEARCH_TOPIC",
  EXPORT_CONTENT: "EXPORT_CONTENT",
  SAVE_CONTENT: "SAVE_CONTENT",
  BILLING_CHECKOUT: "BILLING_CHECKOUT",
  BILLING_SUBSCRIPTION_UPDATED: "BILLING_SUBSCRIPTION_UPDATED",
  BILLING_PAYMENT_FAILED: "BILLING_PAYMENT_FAILED",
  ADMIN_VIEW_USER: "ADMIN_VIEW_USER",
  ADMIN_NOTE_ADDED: "ADMIN_NOTE_ADDED",
  FEEDBACK_SUBMITTED: "FEEDBACK_SUBMITTED",
  SECTION_ENGAGEMENT: "SECTION_ENGAGEMENT",
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export type EventCategory =
  | "auth"
  | "education"
  | "billing"
  | "engagement"
  | "admin"
  | "system"
  | "general";

export type TrackEventInput = {
  userId?: string | null;
  sessionId?: string | null;
  eventType: EventType | string;
  category?: EventCategory;
  metadata?: Record<string, unknown>;
  req?: Request;
};

export type StaffRole =
  | "user"
  | "support_staff"
  | "moderator"
  | "admin"
  | "super_admin";
