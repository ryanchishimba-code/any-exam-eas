import type { BoardFeatureIconId } from "@/lib/marketing/board-landing/board-features";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BoardFeatureIcon({ id }: { id: BoardFeatureIconId }) {
  switch (id) {
    case "ngn":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2.5" {...stroke} />
          <path d="M7 9h6M7 13h10M7 17h4" {...stroke} />
        </svg>
      );
    case "adaptive":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <path d="M4 18V6M4 18h16M20 6v12" {...stroke} />
          <path d="M8 14l3-4 3 2 4-6" {...stroke} />
        </svg>
      );
    case "readiness":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
        </svg>
      );
    case "explained":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <path d="M5 6.5h14v11H5z" {...stroke} />
          <path d="M9 10h6M9 13.5h4" {...stroke} />
          <path d="M16.5 17.5l2 2 3.5-4" {...stroke} />
        </svg>
      );
    case "quick-bites":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <rect x="3" y="5" width="14" height="14" rx="2" {...stroke} />
          <path d="M17 9l4-2v10l-4-2" {...stroke} />
        </svg>
      );
    case "qotd":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <rect x="4" y="5" width="16" height="16" rx="2" {...stroke} />
          <path d="M8 3v4M16 3v4M4 10h16" {...stroke} />
          <circle cx="12" cy="15" r="1.25" fill="currentColor" stroke="none" />
        </svg>
      );
    case "review":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <path d="M6 6h12v12H6z" {...stroke} />
          <path d="M9 10h6M9 14h4" {...stroke} />
          <path d="M14 4l6 3v14l-6 3" {...stroke} opacity={0.45} />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
          <rect x="7" y="3" width="10" height="18" rx="2.5" {...stroke} />
          <path d="M10 18h4" {...stroke} />
        </svg>
      );
    default:
      return null;
  }
}
