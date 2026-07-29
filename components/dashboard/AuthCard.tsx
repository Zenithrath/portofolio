"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase belum dikonfigurasi.");
      return;
    }

    setPending(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const target = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      router.replace(target.startsWith("/") ? target : "/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login gagal. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0D0C] px-5 py-10 text-[#F1F3EF]">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute left-[8%] top-[15%] h-16 w-16 rounded-full border-2 border-[#FF3D00]/60" />
      <span className="pointer-events-none absolute bottom-[16%] right-[10%] font-mono text-4xl font-bold text-[#FF3D00]/75">x</span>
      <section className="relative w-full max-w-md border border-white/[0.14] bg-[#121514] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.38)] sm:p-8">
        <Link href="/" className="inline-flex font-['Syne'] text-xl font-extrabold text-white transition hover:text-[#FF6B35]">Djibril<span className="text-[#FF3D00]">.</span></Link>
        <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">Admin access</p>
        <h1 className="mt-3 font-['Syne'] text-3xl font-extrabold text-white">Masuk ke dashboard.</h1>
        <p className="mt-3 text-sm leading-6 text-white/55">Kelola portofolio langsung dari Supabase.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">Email</span>
            <span className="flex items-center gap-3 border border-white/[0.14] bg-black/20 px-3 transition focus-within:border-[#FF3D00]/70">
              <Mail className="h-4 w-4 text-[#FF6B35]" />
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/25" placeholder="nama@email.com" />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">Password</span>
            <span className="flex items-center gap-3 border border-white/[0.14] bg-black/20 px-3 transition focus-within:border-[#FF3D00]/70">
              <KeyRound className="h-4 w-4 text-[#FF6B35]" />
              <input required minLength={6} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-white/25" placeholder="Minimal 6 karakter" />
            </span>
          </label>
          {error && <p role="alert" className="border-l-2 border-[#FF3D00] bg-[#FF3D00]/10 px-3 py-2 text-sm leading-5 text-[#FFB29A]">{error}</p>}
          <button disabled={pending} type="submit" className="inline-flex w-full items-center justify-center gap-2 bg-[#FF3D00] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#FF6B35] disabled:cursor-wait disabled:opacity-60">
            {pending ? "Memproses..." : "Masuk"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </section>
    </main>
  );
}
