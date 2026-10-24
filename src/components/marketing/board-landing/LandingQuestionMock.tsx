import type { LandingQuestionMockModel } from "@/lib/marketing/landing-question-mock";

export function LandingQuestionMock({
  mock,
  anchorId = "sample-question",
}: {
  mock: LandingQuestionMockModel;
  anchorId?: string;
}) {
  return (
    <figure className="bl-qmock" id={anchorId} aria-label="Sample question preview">
      <div className="bl-qmock__chrome">
        <span className="bl-qmock__dot" aria-hidden />
        <span className="bl-qmock__dot" aria-hidden />
        <span className="bl-qmock__dot" aria-hidden />
      </div>
      <figcaption className="sr-only">Decorative preview of a practice question stem and answer choices.</figcaption>
      <p className="bl-qmock__stem">{mock.stem}</p>
      <ol className="bl-qmock__options">
        {mock.options.map((text) => {
          const selected = text === mock.correctText;
          return (
            <li key={text} className={selected ? "is-keyed" : undefined}>
              <span className="bl-qmock__radio" aria-hidden />
              <span className="bl-qmock__text">{text}</span>
              {selected ? <span className="sr-only"> keyed answer</span> : null}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
