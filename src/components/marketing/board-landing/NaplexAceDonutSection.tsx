import {
  buildNaplexAceDonutSegments,
  naplexAceDonutSlicePath,
} from "@/lib/marketing/board-landing/naplex-ace-donut";
import type { NaplexDonutRenderInput } from "@/lib/marketing/board-landing/render-payload";

const CX = 100;
const CY = 100;
const OUTER_R = 88;
const INNER_R = 54;

/** Segments are built here so RSC does not duplicate donut copy in the page model. */
export function NaplexAceDonutSection(props: NaplexDonutRenderInput) {
  const segments = buildNaplexAceDonutSegments(props);
  const sliceDeg = 360 / segments.length;

  return (
    <section className="bl-ace-donut bl-section" aria-labelledby="naplex-ace-heading">
      <h2 id="naplex-ace-heading">Built to help you ace the NAPLEX</h2>
      <p className="bl-section-lede bl-ace-donut__lede">
        Question bank, calculations, Top 500 drugs, mocks, and study guide—one plan.
      </p>

      <div className="bl-ace-donut__layout">
        <figure className="bl-ace-donut__figure" aria-label="NAPLEX study tools included with Pro">
          <svg
            className="bl-ace-donut__svg"
            viewBox="0 0 200 200"
            width="220"
            height="220"
            role="img"
            aria-hidden="true"
          >
            <circle cx={CX} cy={CY} r={OUTER_R} className="bl-ace-donut__ring-bg" />
            {segments.map((segment, index) => {
              const start = index * sliceDeg;
              const end = start + sliceDeg;
              const d = naplexAceDonutSlicePath(CX, CY, OUTER_R, INNER_R, start, end);
              return (
                <path
                  key={segment.id}
                  className="bl-ace-donut__slice"
                  data-segment={segment.id}
                  d={d}
                  fill={segment.color}
                />
              );
            })}
            <circle cx={CX} cy={CY} r={INNER_R - 2} className="bl-ace-donut__hole" />
          </svg>
          <figcaption className="bl-ace-donut__center">
            <span className="bl-ace-donut__center-kicker">Included</span>
            <span className="bl-ace-donut__center-title">NAPLEX toolkit</span>
          </figcaption>
        </figure>

        <ul className="bl-ace-donut__legend" aria-label="NAPLEX study tools">
          {segments.map((segment) => (
            <li key={segment.id}>
              <button type="button" className="bl-ace-donut__legend-btn" data-segment={segment.id}>
                <span className="bl-ace-donut__swatch" style={{ backgroundColor: segment.color }} aria-hidden />
                <span className="bl-ace-donut__legend-text">
                  <span className="bl-ace-donut__legend-label">{segment.label}</span>
                  <span className="bl-ace-donut__legend-detail">{segment.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
