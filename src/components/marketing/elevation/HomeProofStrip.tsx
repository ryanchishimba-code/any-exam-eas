import type { HomeProofFact } from "@/lib/marketing/home-proof";

/** One quiet line. No stars, pass rates, or user counts. */
export function HomeProofStrip({ facts }: { facts: HomeProofFact[] }) {
  if (facts.length === 0) return null;
  return (
    <p className="home-proof" aria-label="Proof">
      {facts.map((fact, index) => (
        <span key={fact.id}>
          {index > 0 ? <span aria-hidden> · </span> : null}
          {fact.text}
        </span>
      ))}
    </p>
  );
}
