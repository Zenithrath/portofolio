"use client";

import { Award, BriefcaseBusiness, Compass, FileText, FolderKanban, LogOut, Mail, Menu, Quote, UserRound, Wrench, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type DashboardTab = "personal" | "skills" | "journey" | "projects" | "certificates" | "experience" | "quote" | "contact" | "cv";

const items: { id: DashboardTab; label: string; icon: typeof UserRound }[] = [
  { id: "personal", label: "Info Personal", icon: UserRound },
  { id: "skills", label: "Keahlian", icon: Wrench },
  { id: "journey", label: "Perjalanan", icon: Compass },
  { id: "projects", label: "Proyek", icon: FolderKanban },
  { id: "certificates", label: "Sertifikasi", icon: Award },
  { id: "experience", label: "Pengalaman", icon: BriefcaseBusiness },
  { id: "quote", label: "Quote", icon: Quote },
  { id: "contact", label: "Kontak", icon: Mail },
  { id: "cv", label: "CV", icon: FileText },
];

type Props = { activeTab: DashboardTab; onChange: (tab: DashboardTab) => void; open: boolean; onClose: () => void; onOpen: () => void };

export default function Sidebar({ activeTab, onChange, open, onClose, onOpen }: Props) {
  async function signOut() {
    await createSupabaseBrowserClient()?.auth.signOut();
    window.location.assign("/auth/login");
  }

  const navigation = <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">{items.map((item) => {
    const Icon = item.icon;
    const active = activeTab === item.id;
    return <button key={item.id} type="button" onClick={() => { onChange(item.id); onClose(); }} className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-sm font-semibold transition ${active ? "border-[#FF3D00] bg-[#FF3D00]/10 text-white" : "border-transparent text-white/45 hover:bg-white/[0.04] hover:text-white"}`}><Icon className="h-4 w-4" />{item.label}</button>;
  })}</nav>;

  const content = <><div className="flex h-16 items-center justify-between border-b border-white/[0.1] px-5"><span className="font-['Syne'] text-lg font-extrabold text-white">Djibril<span className="text-[#FF3D00]">.</span></span><button type="button" onClick={onClose} className="p-1 text-white/50 hover:text-white lg:hidden"><X className="h-5 w-5" /></button></div>{navigation}<div className="border-t border-white/[0.1] p-3"><button type="button" onClick={signOut} className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-semibold text-white/55 transition hover:bg-white/[0.04] hover:text-white"><LogOut className="h-4 w-4 text-[#FF6B35]" />Keluar</button></div></>;

  return <>
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.1] bg-[#101211] lg:flex">{content}</aside>
    <button type="button" aria-label="Buka navigasi" onClick={onOpen} className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center border border-white/[0.15] bg-[#101211] text-white lg:hidden"><Menu className="h-5 w-5" /></button>
    {open && <div className="fixed inset-0 z-40 lg:hidden"><button aria-label="Tutup navigasi" type="button" onClick={onClose} className="absolute inset-0 bg-black/70" /><aside className="relative z-10 flex h-full w-[min(82vw,300px)] flex-col border-r border-white/[0.1] bg-[#101211]">{content}</aside></div>}
  </>;
}
