import { redirect } from "next/navigation";
import AccessDenied from "@/components/dashboard/AccessDenied";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getDashboardData } from "@/lib/portfolio-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <AccessDenied detail="Supabase belum dikonfigurasi." />;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    return <AccessDenied userId={user.id} detail="Akun ini bukan admin." />;
  }

  const data = await getDashboardData();
  return <DashboardClient data={data} email={user.email || "admin"} />;
}
