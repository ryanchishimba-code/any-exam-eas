import Link from "next/link";
import { HomeSamplePlayer } from "@/components/marketing/elevation/HomeSamplePlayer";
import { homeQuickBiteSamples } from "@/lib/marketing/home-quick-bites";
import { ROUTES } from "@/lib/routes";

/**
 * Two public samples. The video file loads after a click.
 * The link is text, not a second primary button.
 */
export function HomeQuickBites() {
  const samples = homeQuickBiteSamples();
  return (
    <section className="home-section home-section--mist home-rise" aria-labelledby="quick-bites-heading">
      <h2 id="quick-bites-heading">Quick Bites</h2>
      <p className="home-lead">Watch a sample.</p>
      <div className="home-bites">
        {samples.map((sample) => (
          <article key={sample.id} aria-labelledby={`quick-bites-${sample.id}`}>
            <h3 id={`quick-bites-${sample.id}`}>
              {sample.title}
              <span className="home-bites__board">{` · ${sample.board}`}</span>
            </h3>
            <p className="home-bites__episode">
              {sample.episodeTitle}
              <span className="home-bites__duration">{` · ${sample.duration}`}</span>
            </p>
            <HomeSamplePlayer
              title={sample.episodeTitle}
              webp={sample.webp}
              jpg={sample.jpg}
              mediaUrl={sample.mediaUrl}
              captions={sample.captions}
            />
          </article>
        ))}
      </div>
      <p className="home-bites__cta">
        <Link className="home-bites__link" href={ROUTES.pricing}>
          Get full access
        </Link>
      </p>
    </section>
  );
}
