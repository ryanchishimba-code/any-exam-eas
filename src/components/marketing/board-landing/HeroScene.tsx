import { LandingCta } from "@/components/landing/LandingCta";
import type { HeroCaseScene } from "@/lib/marketing/board-landing/hero-case";

type HeroSceneProps = {
  scene: HeroCaseScene;
  trialHref: string;
  trialLabel: string;
  questionCount: string | null;
  reviewers: { id: string; name: string }[];
};

function plain(text: string): string {
  return text.replace(/\*\*/g, "");
}

/** Server-rendered product scene. Chrome is decorative; the case text is HTML. */
export function HeroScene({ scene, trialHref, trialLabel, questionCount, reviewers }: HeroSceneProps) {
  return (
    <div className="bl-scene">
      <article className="bl-device" aria-labelledby="nclex-case-heading">
        <div className="bl-device-chrome" aria-hidden="true">
          <span className="bl-device-cam" />
          <span className="bl-device-speaker" />
        </div>
        <div className="bl-device-screen">
          <p id="nclex-case-heading" className="bl-device-kicker">
            Next Gen case
          </p>
          <p className="bl-device-setting">{scene.setting}</p>
          <nav className="bl-device-tabs" aria-label="Case chart">
            <a href="#nclex-nurses-notes">{scene.notesLabel}</a>
            <a href="#nclex-vitals">{scene.vitalsLabel}</a>
          </nav>
          <section id="nclex-nurses-notes" aria-labelledby="nclex-notes-heading">
            <h2 id="nclex-notes-heading">{scene.notesLabel}</h2>
            {scene.notes.map((note) => (
              <p key={note}>{plain(note)}</p>
            ))}
          </section>
          <section id="nclex-vitals" aria-labelledby="nclex-vitals-heading">
            <h2 id="nclex-vitals-heading" className="bl-vitals-title">
              {scene.vitalsLabel}
            </h2>
            <details id="nclex-vitals-details" className="bl-vitals-details">
              <summary className="bl-vitals-summary">Vital signs</summary>
              <div className="bl-vital-scroll">
                <table>
                  <thead>
                    <tr>
                      {scene.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scene.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {scene.columns.map((column, index) => (
                          <td key={column}>{row[index] ?? ""}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "(function(){var d=document.getElementById('nclex-vitals-details');if(!d)return;var m=window.matchMedia('(min-width: 640px)');function s(){if(m.matches)d.setAttribute('open','');else d.removeAttribute('open');}s();m.addEventListener('change',s);})();",
              }}
            />
          </section>
          <section className="bl-device-question" aria-labelledby="nclex-case-question">
            <h2 id="nclex-case-question">Case question</h2>
            <p>{plain(scene.stem)}</p>
            <ol>
              {scene.options.map((option) => (
                <li key={option}>{plain(option)}</li>
              ))}
            </ol>
            {scene.whyNot ? (
              <p className="bl-device-why">
                <span>Why not. </span>
                {plain(scene.whyNot)}
              </p>
            ) : null}
          </section>
        </div>
      </article>

      <ul className="bl-float">
        <li>
          <p className="bl-float-kicker">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M9.2 16.6 4.8 12.2l1.4-1.4 3 3 8-8 1.4 1.4-9.4 9.4Z"
                fill="currentColor"
              />
            </svg>
            Keyed answer
          </p>
          <p>{plain(scene.keyedAnswer)}</p>
        </li>
        {scene.whyNot ? (
          <li className="bl-float-desktop">
            <p className="bl-float-kicker">Why the other options are wrong</p>
            <p>{plain(scene.whyNot)}</p>
          </li>
        ) : null}
        {questionCount ? (
          <li className="bl-float-desktop">
            <p className="bl-float-kicker">Live bank</p>
            <p className="bl-float-score">{questionCount}</p>
            <p>scored questions</p>
          </li>
        ) : null}
        {reviewers.length > 0 ? (
          <li>
            <p className="bl-float-kicker">Content review</p>
            {reviewers.map((reviewer) => (
              <p key={reviewer.id}>{reviewer.name}</p>
            ))}
          </li>
        ) : null}
      </ul>

      <div className="bl-actions">
        <LandingCta href={trialHref} ctaName="nclex_hero_trial" location="nclex_hero">
          {trialLabel}
        </LandingCta>
        <a className="bl-button bl-button-secondary" href="#sample-question">
          Try a free question
        </a>
      </div>
    </div>
  );
}
