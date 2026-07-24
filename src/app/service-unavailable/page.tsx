import ServiceUnavailableClient from "./ServiceUnavailableClient";

export const metadata = {
  title: "Temporarily unavailable — Any Exam Easy",
  robots: { index: false, follow: false },
};

export default function ServiceUnavailablePage() {
  return <ServiceUnavailableClient />;
}
