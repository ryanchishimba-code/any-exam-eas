import {
  EndActivityControl,
  type EndActivityControlProps,
} from "./EndActivityControl";
import type { ActivitySessionSummary } from "@/lib/client/exam-session-summary";

type EndExamControlProps = Omit<EndActivityControlProps, "kind" | "onConfirm"> & {
  onConfirm: () => Promise<ActivitySessionSummary>;
};

/** Exam sessions — alias for {@link EndActivityControl} with `kind="exam"`. */
export function EndExamControl(props: EndExamControlProps) {
  return <EndActivityControl kind="exam" {...props} />;
}
