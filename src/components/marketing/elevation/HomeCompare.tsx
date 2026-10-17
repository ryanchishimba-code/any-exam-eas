import { IconCheck } from "@/components/marketing/elevation/home-icons";
import { homeCompareRows } from "@/lib/marketing/home-compare";

export function HomeCompare({ ngnCaseStudies = false }: { ngnCaseStudies?: boolean }) {
  const rows = homeCompareRows(ngnCaseStudies);
  return (
    <section className="home-section home-rise" aria-labelledby="compare-heading">
      <h2 id="compare-heading">AnyExamEasy vs. typical prep sites</h2>
      <div className="home-compare-wrap">
        <table className="home-compare">
          <caption className="sr-only">AnyExamEasy compared with typical prep sites</caption>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">AnyExamEasy</th>
              <th scope="col">Typical prep sites</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  {row.feature}
                  {row.detail ? <span className="home-compare__detail">{row.detail}</span> : null}
                </th>
                <td data-label="AnyExamEasy">
                  <span className="sr-only">Included</span>
                  <IconCheck />
                </td>
                <td data-label="Typical prep sites">{row.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
