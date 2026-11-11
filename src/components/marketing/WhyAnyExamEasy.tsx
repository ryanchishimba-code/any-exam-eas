import { LandingCta } from "@/components/landing/LandingCta";
import { HERO_TRIAL_CTA_LABEL } from "@/lib/marketing/home-cta";
import { CONSENTED_TESTIMONIAL_SEEDS } from "@/lib/testimonials/consented-seed";
import "@/styles/why-anyexameasy.css";

const FACTS = [
  {
    title: "Six boards on one plan",
    body: "Six boards: NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT. USMLE includes Step 1, Step 2 CK, and Step 3.",
  },
  {
    title: "An explanation with the answer",
    body: "Practice questions include a rationale for the answer.",
  },
  {
    title: "Adaptive exams",
    body: "Full-length adaptive exams are on the plan. The free trial includes one.",
  },
  {
    title: "NGN case studies",
    body: "NCLEX practice includes Next Generation case studies.",
  },
  {
    title: "A plan for the board you are taking",
    body: "Roadmap follows that board’s outline.",
  },
] as const;

function quotesForBoard(board?: string) {
  const rows = CONSENTED_TESTIMONIAL_SEEDS.filter((row) => row.quote.trim().length > 0);
  if (!board) return rows.filter((row) => row.showOnHome !== false).slice(0, 2);
  const needle = board.toLowerCase();
  const matched = rows.filter((row) => row.exam.toLowerCase().includes(needle) || (needle === "aanp-fnp" && row.exam.toLowerCase().includes("fnp")));
  return matched.slice(0, 2);
}

/** True product facts and consented quotes. No competitor names and no pass promise. */
export function WhyAnyExamEasy({
  board,
  trialHref,
  signedIn = false,
}: {
  board?: string;
  trialHref: string;
  signedIn?: boolean;
}) {
  const quotes = quotesForBoard(board);
  const facts = board === "naplex" ? FACTS.filter((fact) => fact.title !== "NGN case studies") : FACTS;

  return (
    <section className="why-aee" aria-labelledby="why-aee-heading">
      <div className="why-aee__inner">
        <p className="why-aee__kicker">Why AnyExamEasy</p>
        <h2 id="why-aee-heading">One study system for the board in front of you.</h2>
        <ul className="why-aee__facts">
          {facts.map((fact) => (
            <li key={fact.title}>
              <p className="why-aee__fact-title">{fact.title}</p>
              <p>{fact.body}</p>
            </li>
          ))}
        </ul>
        {quotes.length > 0 ? (
          <div className="why-aee__quotes">
            {quotes.map((quote) => (
              <figure key={quote.id}>
                <blockquote>
                  <p>{quote.quote}</p>
                </blockquote>
                <figcaption>
                  {quote.name} · {quote.exam}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
        <LandingCta
          href={signedIn ? "/dashboard" : trialHref}
          ctaName={signedIn ? "continue_studying" : "why_trial"}
          location={board ? `why_${board}` : "why_home"}
        >
          {signedIn ? "Continue studying" : HERO_TRIAL_CTA_LABEL}
        </LandingCta>
      </div>
    </section>
  );
}
