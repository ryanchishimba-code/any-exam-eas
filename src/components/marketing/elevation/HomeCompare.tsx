import { IconCheck } from "@/components/marketing/elevation/home-icons";
import { HOME_COMPARE_OTHER, homeCompareItems } from "@/lib/marketing/home-compare";

export function HomeCompare({
  exams = [],
  ngnCaseStudies = false,
}: {
  exams?: readonly { slug: string; countLabel: string }[];
  ngnCaseStudies?: boolean;
}) {
  const items = homeCompareItems(exams, ngnCaseStudies);
  return (
    <section className="home-section home-rise" aria-labelledby="compare-heading">
      <h2 id="compare-heading">AnyExamEasy vs. typical prep sites</h2>
      <div className="home-compare">
        <div>
          <h3>AnyExamEasy</h3>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <IconCheck />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Typical prep sites</h3>
          <p className="home-compare__other">{HOME_COMPARE_OTHER}</p>
        </div>
      </div>
    </section>
  );
}
