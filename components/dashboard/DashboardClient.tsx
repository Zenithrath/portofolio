"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { DashboardData } from "@/types/portfolio";
import { refreshPublicPortfolio, requireDashboardSession, type MutationRunner } from "./admin-utils";
import Sidebar, { type DashboardTab } from "./Sidebar";
import PersonalPanel from "./PersonalPanel";
import SkillsPanel from "./SkillsPanel";
import JourneyPanel from "./JourneyPanel";
import ProjectsPanel from "./ProjectsPanel";
import CertificatesPanel from "./CertificatesPanel";
import ExperiencePanel from "./ExperiencePanel";
import QuotePanel from "./QuotePanel";
import ContactPanel from "./ContactPanel";
import CvPanel from "./CvPanel";

type Notice = { type: "success" | "error" | "warning"; message: string } | null;

function formatMutationError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : "Perubahan tidak dapat disimpan.";
  if (/row-level security|permission denied|42501/i.test(message)) {
    return "Supabase menolak perubahan. Pastikan kamu masih login dan jalankan policy Auth-only di supabase/next-portfolio-security.sql.";
  }
  return message;
}

export default function DashboardClient({ data, email }: { data: DashboardData; email: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("personal");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const mutate = useCallback<MutationRunner>(async (task, successMessage) => {
    setPending(true);
    setNotice(null);
    try {
      await requireDashboardSession();
      await task();
      let refreshed = true;
      try {
        await refreshPublicPortfolio();
      } catch {
        refreshed = false;
      }
      router.refresh();
      setNotice({ type: refreshed ? "success" : "warning", message: refreshed ? successMessage : `${successMessage} Cache publik akan terbarui dalam waktu singkat.` });
    } catch (cause) {
      setNotice({ type: "error", message: formatMutationError(cause) });
    } finally {
      setPending(false);
    }
  }, [router]);

  let panel;
  switch (activeTab) {
    case "skills": panel = <SkillsPanel skills={data.skills} mutate={mutate} pending={pending} />; break;
    case "journey": panel = <JourneyPanel journey={data.journey} mutate={mutate} pending={pending} />; break;
    case "projects": panel = <ProjectsPanel projects={data.projects} mutate={mutate} pending={pending} />; break;
    case "certificates": panel = <CertificatesPanel certificates={data.certificates} mutate={mutate} pending={pending} />; break;
    case "experience": panel = <ExperiencePanel experiences={data.experiences} mutate={mutate} pending={pending} />; break;
    case "quote": panel = <QuotePanel key={`quote-${data.personal?.id ?? "new"}-${data.personal?.updated_at ?? ""}`} personal={data.personal} mutate={mutate} pending={pending} />; break;
    case "contact": panel = <ContactPanel contacts={data.contacts} mutate={mutate} pending={pending} />; break;
    case "cv": panel = <CvPanel personal={data.personal} mutate={mutate} pending={pending} />; break;
    default: panel = <PersonalPanel key={`personal-${data.personal?.id ?? "new"}-${data.personal?.updated_at ?? ""}`} personal={data.personal} mutate={mutate} pending={pending} />;
  }

  return <div className="min-h-dvh bg-[#0B0D0C] text-[#F1F3EF] lg:flex lg:h-dvh lg:overflow-hidden"><Sidebar activeTab={activeTab} onChange={setActiveTab} open={sidebarOpen} onOpen={() => setSidebarOpen(true)} onClose={() => setSidebarOpen(false)} /><main className="min-w-0 flex-1 px-5 pb-12 pt-20 sm:px-8 lg:h-dvh lg:overflow-y-auto lg:px-10 lg:py-8"><div className="mx-auto max-w-6xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.1] pb-4"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Signed in / {email}</p><Link href="/" className="text-sm font-semibold text-[#FF6B35] transition hover:text-white">Lihat portfolio</Link></div>{notice && <div role={notice.type === "error" ? "alert" : "status"} className={`mb-6 flex items-start gap-3 border-l-2 px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-400 bg-emerald-400/10 text-emerald-100" : notice.type === "warning" ? "border-amber-400 bg-amber-400/10 text-amber-50" : "border-[#FF3D00] bg-[#FF3D00]/10 text-[#FFB29A]"}`}>{notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}<span className="flex-1">{notice.message}</span><button type="button" aria-label="Tutup notifikasi" onClick={() => setNotice(null)}><X className="h-4 w-4" /></button></div>}{panel}</div></main></div>;
}
