import { crosswordHubPath } from "@/lib/crossword/schedule";

/** Satori needs display:flex on every div that has more than one child. */
export function OgCard({
  kicker,
  title,
  footer,
  cells,
  square = false,
}: {
  kicker: string;
  title: string;
  footer: string;
  cells?: boolean[][];
  square?: boolean;
}) {
  return square ? (
    <SquareCard kicker={kicker} title={title} footer={footer} cells={cells} />
  ) : (
    <WideCard kicker={kicker} title={title} footer={footer} cells={cells} />
  );
}

function Logo() {
  return (
    <svg width="56" height="56" viewBox="0 0 40 40">
      <path d="M6 16.5 20 10l14 6.5-14 6.5L6 16.5Z" fill="#0f766e" />
      <path
        d="M32.5 17.2v7.2c0 2.6-5.4 4.6-12.5 4.6S7.5 27 7.5 24.4v-7.2"
        fill="none"
        stroke="#0f766e"
        strokeWidth="1.8"
      />
      <path
        d="M14.5 22.2 18.2 26l7.3-8.4"
        fill="none"
        stroke="#0f172a"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(13, 148, 136, 0.16)",
        }}
      >
        <Logo />
      </div>
      <div
        style={{
          display: "flex",
          marginLeft: 18,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -1.4,
          color: "#0f172a",
        }}
      >
        AnyExamEasy
      </div>
    </div>
  );
}

function Kicker({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        alignSelf: "flex-start",
        marginTop: 28,
        padding: "8px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(13, 148, 136, 0.22)",
        color: "#0f766e",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1.4,
      }}
    >
      {children}
    </div>
  );
}

function WideCard({
  kicker,
  title,
  footer,
  cells,
}: {
  kicker: string;
  title: string;
  footer: string;
  cells?: boolean[][];
}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(165deg, #e7fbf7 0%, #f8fafc 46%, #ffffff 100%)",
        color: "#0f172a",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexGrow: 1, flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: cells ? 760 : 1200,
            padding: "56px 40px 28px 72px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Wordmark />
            <Kicker>{kicker}</Kicker>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: title.length > 16 ? 46 : 58,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -1.8,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: "#475569" }}>{footer}</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 20, fontWeight: 600, color: "#0d9488" }}>
              {`anyexameasy.com${crosswordHubPath()}`}
            </div>
          </div>
        </div>
        {cells ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 440,
              paddingRight: 56,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: 22,
                borderRadius: 28,
                background: "#ffffff",
                border: "1px solid rgba(15, 23, 42, 0.06)",
              }}
            >
              <CellGrid cells={cells} max={280} />
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 64,
          paddingLeft: 72,
          borderTop: "1px solid rgba(15, 23, 42, 0.08)",
          background: "rgba(255,255,255,0.72)",
          color: "#475569",
          fontSize: 18,
          fontWeight: 500,
        }}
      >
        Practice, not a promise you&apos;ll pass
      </div>
    </div>
  );
}

function SquareCard({
  kicker,
  title,
  footer,
  cells,
}: {
  kicker: string;
  title: string;
  footer: string;
  cells?: boolean[][];
}) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #e7fbf7 0%, #f8fafc 38%, #ffffff 100%)",
        color: "#0f172a",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: "64px 72px 28px",
        }}
      >
        <Wordmark />
        <Kicker>{kicker}</Kicker>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: title.length > 16 ? 48 : 60,
            fontWeight: 800,
            letterSpacing: -1.8,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 10, fontSize: 24, fontWeight: 500, color: "#475569" }}>{footer}</div>
        {cells ? (
          <div style={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "center", marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                padding: 28,
                borderRadius: 32,
                background: "#ffffff",
                border: "1px solid rgba(15, 23, 42, 0.06)",
              }}
            >
              <CellGrid cells={cells} max={520} />
            </div>
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 76,
          padding: "0 72px",
          borderTop: "1px solid rgba(15, 23, 42, 0.08)",
          background: "rgba(255,255,255,0.78)",
          color: "#475569",
          fontSize: 20,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex" }}>Practice, not a promise you&apos;ll pass</div>
        <div style={{ display: "flex", color: "#0d9488", fontWeight: 600 }}>anyexameasy.com/crossword</div>
      </div>
    </div>
  );
}

function CellGrid({ cells, max }: { cells: boolean[][]; max: number }) {
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const cell = rows && cols ? Math.max(8, Math.min(22, Math.floor(max / Math.max(rows, cols)))) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {cells.map((row, r) => (
        <div key={`r-${r}`} style={{ display: "flex", flexDirection: "row", marginTop: r === 0 ? 0 : 3 }}>
          {row.map((block, c) => (
            <div
              key={`c-${r}-${c}`}
              style={{
                width: cell,
                height: cell,
                marginLeft: c === 0 ? 0 : 4,
                borderRadius: 4,
                background: block ? "#0f172a" : "#0d9488",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function maskFromGrid(grid: string[]): boolean[][] {
  return grid.map((row) => [...row].map((char) => char === "#"));
}
