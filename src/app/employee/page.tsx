import { notFound } from "next/navigation";

/** No public employee index. Login stays at /employee/login. */
export default function EmployeeIndexPage() {
  notFound();
}
