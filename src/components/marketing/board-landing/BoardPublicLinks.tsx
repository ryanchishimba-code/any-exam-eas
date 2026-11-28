import Link from "next/link";
import { publicStudyGuide, type PublicStudyGuideId } from "@/lib/study-guides/public-catalog";

/** Text links added to a board page. Same type, no new layout. */
export function BoardPublicLinks({ exam }: { exam: PublicStudyGuideId }) {
  const guide = publicStudyGuide(exam);
  const links = [
    { href: guide.path, label: "Study guide" },
    { href: guide.resourcePath, label: guide.resourceLabel },
    { href: "/toolkit", label: "Toolkit" },
    { href: "/compare", label: "Compare" },
  ];
  return (
    <nav className="bl-band" aria-label={`${guide.boardLabel} guides`}>
      <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 px-5 py-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
