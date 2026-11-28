import ServiceUnavailableClient from "./ServiceUnavailableClient";

export const metadata = {
  title: { absolute: "Temporarily unavailable — AnyExamEasy" },
  robots: { index: false, follow: false },
};

export default function ServiceUnavailablePage() {
  return <ServiceUnavailableClient />;
}
