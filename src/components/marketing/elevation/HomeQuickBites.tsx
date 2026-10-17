import Link from "next/link";
import { homeQuickBiteTracks } from "@/lib/marketing/home-quick-bites";
import { ROUTES } from "@/lib/routes";

/**
 * Public posters and catalog counts. No player, no signed media URL.
 * The link is text, not a second primary button.
 */
export function HomeQuickBites() {
  const tracks = homeQuickBiteTracks();
  return (
    <section className="home-section home-section--mist home-rise" aria-labelledby="quick-bites-heading">
      <h2 id="quick-bites-heading">Quick Bites</h2>
      <p className="home-lead">Short animated lessons with quizzes. Premium.</p>
      <div className="home-bites">
        {tracks.map((track) => (
          <article key={track.id} aria-labelledby={`quick-bites-${track.id}`}>
            <h3 id={`quick-bites-${track.id}`}>
              {track.title}
              <span className="home-bites__board"> · {track.board}</span>
            </h3>
            <p className="home-bites__count">{track.countLabel}</p>
            <ul className="home-bites__posters">
              {track.posters.map((poster) => (
                <li key={poster.slug}>
                  <picture>
                    <source srcSet={poster.webp} type="image/webp" />
                    <img
                      src={poster.jpg}
                      alt={poster.title}
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="home-bites__cta">
        <Link className="home-bites__link" href={ROUTES.pricing}>
          See plans
        </Link>
      </p>
    </section>
  );
}
