import type { EngagementSurface } from "./config";

export function inferEngagementSurface(pathname: string): EngagementSurface {
  const path = pathname.toLowerCase();
  if (
    path.includes("/question-bank") ||
    path.includes("/practice") ||
    path.includes("/readiness") ||
    path.startsWith("/study/questions")
  ) {
    return "questions";
  }
  if (path.includes("/full-exam") || path.includes("/exam-session")) {
    return "exam";
  }
  if (path.includes("quick-bite") || path.includes("#video-quick-bites")) {
    return "quick-bites";
  }
  if (path.includes("/study-guide")) {
    return "study-guide";
  }
  if (path.includes("/drugs300") || path.includes("/study/drugs")) {
    return "drug-cards";
  }
  if (path.includes("/anatomy")) {
    return "anatomy";
  }
  return "other";
}
