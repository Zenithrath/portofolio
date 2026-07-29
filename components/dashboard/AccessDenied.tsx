"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AccessDenied({ detail, userId }: { detail?: string; userId?: string }) {
  async function signOut() {
    await createSupabaseBrowserClient()?.auth.signOut();
    window.location.assign("/auth/login");
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#0B0D0C] p-5 text-[#F1F3EF]"><section className="w-full max-w-lg border border-white/[0.14] bg-[#121514] p-7"><ShieldAlert className="h-8 w-8 text-[#FF6B35]" /><p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">Dashboard setup</p><h1 className="mt-2 font-['Syne'] text-3xl font-extrabold text-white">Dashboard belum dapat dihubungkan.</h1><p className="mt-4 text-sm leading-6 text-white/55">Dashboard cukup memakai akun Supabase yang sudah login. Periksa konfigurasi Supabase dan policy Auth-only proyek.</p>{userId && <code className="mt-4 block break-all border border-white/[0.12] bg-black/25 px-3 py-3 font-mono text-xs text-[#FFB29A]">{userId}</code>}{detail && <p className="mt-3 border-l-2 border-[#FF3D00] bg-[#FF3D00]/10 px-3 py-2 text-xs leading-5 text-[#FFB29A]">{detail}</p>}<div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={signOut} className="bg-[#FF3D00] px-4 py-3 text-sm font-bold text-white hover:bg-[#FF6B35]">Keluar</button><Link href="/" className="border border-white/[0.14] px-4 py-3 text-sm font-semibold text-white/70 hover:border-[#FF3D00]/60 hover:text-white">Kembali ke portfolio</Link></div></section></main>;
}
