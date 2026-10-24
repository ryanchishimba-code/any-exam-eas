import {
  buildNclexToolkitDonutSegments,
  nclexToolkitSlicePath,
} from "@/lib/marketing/board-landing/nclex-toolkit-donut";
import type { NclexDonutRenderInput } from "@/lib/marketing/board-landing/render-payload";

const CX = 100;
const CY = 100;
const OUTER_R = 88;
const INNER_R = 54;

export function NclexToolkitDonutSection(props: NclexDonutRenderInput) {
  const segments = buildNclexToolkitDonutSegments(props);
  const sliceDeg = 360 / segments.length;

  return (
    <section className="bl-ace-donut bl-section" aria-labelledby="nclex-toolkit-heading">
      <h2 id="nclex-toolkit-heading">Built to help you ace the NCLEX</h2>

      <div className="bl-ace-donut__layout">
        <figure className="bl-ace-donut__figure" aria-label="NCLEX study tools included with Pro">
          <svg className="bl-ace-donut__svg" viewBox="0 0 200 200" width="220" height="220" role="img" aria-hidden>
            <circle cx={CX} cy={CY} r={OUTER_R} className="bl-ace-donut__ring-bg" />
            {segments.map((segment, index) => {
              const start = index * sliceDeg;
              const end = start + sliceDeg;
              const d = nclexToolkitSlicePath(CX, CY, OUTER_R, INNER_R, start, end);
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
            <span className="bl-ace-donut__center-title">NCLEX toolkit</span>
          </figcaption>
        </figure>

        <ul className="bl-ace-donut__legend" aria-label="NCLEX study tools">
          {segments.map((segment) => (
            <li key={segment.id}>
              <span className="bl-ace-donut__legend-btn bl-ace-donut__legend-btn--static">
                <span className="bl-ace-donut__swatch" style={{ backgroundColor: segment.color }} aria-hidden />
                <span className="bl-ace-donut__legend-text">
                  <span className="bl-ace-donut__legend-label">{segment.label}</span>
                  <span className="sr-only">{segment.detail}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
