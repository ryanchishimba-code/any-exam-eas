import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";

export type A11yStatusVariant = "success" | "error" | "warning" | "info";

const CONFIG: Record<
  A11yStatusVariant,
  { label: string; Icon: LucideIcon; className: string }
> = {
  success: { label: "Success", Icon: CheckCircle2, className: "a11y-banner--success" },
  error: { label: "Error", Icon: AlertCircle, className: "a11y-banner--error" },
  warning: { label: "Warning", Icon: AlertTriangle, className: "a11y-banner--warning" },
  info: { label: "Info", Icon: Info, className: "a11y-banner--info" },
};

type StatusMessageProps = {
  variant: A11yStatusVariant;
  children: React.ReactNode;
  /** Override visible label (keeps icon + structure) */
  label?: string;
  className?: string;
  role?: "alert" | "status";
};

/** Accessible status with text label + icon — not color alone (WCAG 1.4.1). */
export function StatusMessage({
  variant,
  children,
  label,
  className = "",
  role = variant === "error" ? "alert" : "status",
}: StatusMessageProps) {
  const { label: defaultLabel, Icon, className: variantClass } = CONFIG[variant];
  const visibleLabel = label ?? defaultLabel;

  return (
    <p className={`a11y-banner ${variantClass} ${className}`.trim()} role={role}>
      <Icon aria-hidden />
      <span>
        <strong>{visibleLabel}:</strong> {children}
      </span>
    </p>
  );
}

/** Inline correct/incorrect label for quiz feedback (blue vs orange). */
export function AnswerFeedbackLabel({ correct }: { correct: boolean }) {
  return (
    <span className={correct ? "a11y-correct-text" : "a11y-incorrect-text"}>
      {correct ? "Correct" : "Incorrect"}
    </span>
  );
}

/** Compact error line with icon + "Error:" prefix (WCAG 1.4.1). */
export function InlineError({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StatusMessage variant="error" className={`text-sm ${className}`.trim()}>
      {children}
    </StatusMessage>
  );
}
