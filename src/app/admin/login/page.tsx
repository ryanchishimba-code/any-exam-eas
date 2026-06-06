import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Sign In — Any Exam Easy",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AdminLoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
