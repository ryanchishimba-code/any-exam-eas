import {
  buildHubBoardDonutSegments,
  hubBoardDonutCenterTitle,
  hubBoardDonutHeading,
  hubBoardDonutSlicePath,
  type HubBoardDonutRenderInput,
} from "@/lib/marketing/board-landing/hub-board-donut";

const CX = 100;
const CY = 100;
const OUTER_R = 88;
const INNER_R = 54;

export function HubBoardDonutSection(props: HubBoardDonutRenderInput) {
  const segments = buildHubBoardDonutSegments(props);
  const sliceDeg = 360 / segments.length;
  const heading = hubBoardDonutHeading(props.examKey);
  const headingId = `hub-donut-${props.examKey.replace(/[^a-z0-9]/g, "-")}`;

  return (
    <section className="bl-ace-donut bl-section" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <div className="bl-ace-donut__layout">
        <figure
          className="bl-ace-donut__figure"
          aria-label={`${props.examKey} study tools included with Pro`}
        >
          <svg
            className="bl-ace-donut__svg"
            viewBox="0 0 200 200"
            width="220"
            height="220"
            role="img"
            aria-hidden
          >
            <circle cx={CX} cy={CY} r={OUTER_R} className="bl-ace-donut__ring-bg" />
            {segments.map((segment, index) => {
              const start = index * sliceDeg;
              const end = start + sliceDeg;
              const d = hubBoardDonutSlicePath(CX, CY, OUTER_R, INNER_R, start, end);
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
            <span className="bl-ace-donut__center-title">{hubBoardDonutCenterTitle(props.examKey)}</span>
          </figcaption>
        </figure>

        <ul className="bl-ace-donut__legend" aria-label="Study tools included with Pro">
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
