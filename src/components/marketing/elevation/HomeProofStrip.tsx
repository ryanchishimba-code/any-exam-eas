import type { HomeProofFact } from "@/lib/marketing/home-proof";

/** One quiet line. No stars, pass rates, or user counts. */
export function HomeProofStrip({ facts }: { facts: HomeProofFact[] }) {
  if (facts.length === 0) return null;
  return (
    <ul className="home-proof">
      {facts.map((fact) => (
        <li key={fact.id} aria-label={fact.text}>
          {fact.text}
        </li>
      ))}
    </ul>
  );
}
