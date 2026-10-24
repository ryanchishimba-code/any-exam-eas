import type { StudentTrustBadge } from "@/lib/marketing/student-trust-count";

export function NclexStudentTrustBadge({ badge }: { badge: StudentTrustBadge }) {
  return (
    <div className="bl-student-trust-slot">
      <p className="bl-student-trust" role="status">
        <svg className="bl-student-trust__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z"
            fill="currentColor"
          />
        </svg>
        {badge.label}
      </p>
    </div>
  );
}
