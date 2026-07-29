import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    ArrowUpRight,
    BarChart3,
    BriefcaseBusiness,
    Code2,
    Download,
    FileText,
    FolderKanban,
    GraduationCap,
    LayoutDashboard,
    Menu,
    X,
} from "lucide-react";

const navItems = [
    { id: "hero", label: "Profil", num: "01", icon: LayoutDashboard },
    { id: "projects", label: "Karya", num: "02", icon: FolderKanban },
    { id: "skills", label: "Keahlian", num: "03", icon: Code2 },
    { id: "certificates", label: "Sertifikat", num: "04", icon: FileText },
    { id: "experience", label: "Pengalaman", num: "05", icon: BarChart3 },
    { id: "contact", label: "Kontak", num: "06", icon: BriefcaseBusiness },
];

export default function Navbar({ personal, visibleSections }) {
    const [activeSection, setActiveSection] = useState("hero");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const firstName = personal?.name ? personal.name.split(" ")[0] : "Portofolio";
    const visibleNavItems = navItems.filter((item) => (
        !visibleSections || visibleSections.includes(item.id)
    ));
    const hasContact = visibleNavItems.some((item) => item.id === "contact");
    const primaryNavItem = visibleNavItems.find((item) => item.id !== "hero");
    const PrimaryIcon = primaryNavItem?.icon || FolderKanban;
    const cvAvailable = Boolean(personal?.cv_url);
    const availability = personal?.status?.trim() || "";
    const profileLabel = [personal?.faculty, personal?.university]
        .filter(Boolean)
        .join(" / ") || "Profil sedang disiapkan";

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(entry.target.id);
            }),
            { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
        );
        visibleNavItems.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });
        return () => observer.disconnect();
    }, [visibleNavItems]);

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileOpen]);

    const scrollToSection = (id) => {
        setIsMobileOpen(false);
        window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 260);
    };

    const NavRow = ({ item }) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return (
            <button
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition ${
                    active ? "bg-white/[0.07] text-white" : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`}
            >
                {active && <span className="absolute inset-y-2 left-0 w-px bg-[#FF3D00]" />}
                <Icon size={21} strokeWidth={1.8} className={active ? "text-white" : "text-white/40"} />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className={`font-mono text-[10px] ${active ? "text-[#FF6B35]" : "text-white/20"}`}>{item.num}</span>
            </button>
        );
    };

    return (
        <>
            <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#0A0A0A]/80 backdrop-blur-2xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <button type="button" onClick={() => scrollToSection("hero")} className="font-['Syne'] text-2xl font-extrabold tracking-tight text-white hover:text-[#FF6B35]">
                            {firstName}<span className="text-[#FF3D00]">.</span>
                        </button>
                        <div className="hidden items-center gap-1 lg:flex lg:gap-2">
                            {visibleNavItems.map((item) => (
                                <button key={item.id} type="button" onClick={() => scrollToSection(item.id)} className={`whitespace-nowrap px-2.5 py-2 text-xs font-medium transition xl:px-3 xl:text-sm ${activeSection === item.id ? "text-[#FF6B35]" : "text-white/45 hover:text-white"}`}>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
                            {availability && (
                                <span className="hidden max-w-[11rem] items-center gap-2 truncate rounded-xl border border-[#FF3D00]/30 bg-[#FF3D00]/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[#FF8A65] xl:inline-flex">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF3D00]" />
                                    <span className="truncate">{availability}</span>
                                </span>
                            )}
                            {cvAvailable ? (
                                <a href={personal.cv_url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/70 hover:border-[#FF3D00]/60 hover:text-white"><Download size={14} /> CV</a>
                            ) : (
                                <span title="CV belum tersedia" aria-disabled="true" className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/35"><Download size={14} /> CV</span>
                            )}
                            {hasContact && <button type="button" onClick={() => scrollToSection("contact")} className="rounded-xl bg-[#FF3D00] px-4 py-2 text-xs font-bold text-white hover:bg-[#FF6B35] xl:text-sm">Kontak</button>}
                        </div>
                        <button type="button" aria-label="Open menu" onClick={() => setIsMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white hover:border-[#FF3D00]/60 hover:text-[#FF6B35] lg:hidden"><Menu size={19} /></button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.button type="button" aria-label="Close menu" className="fixed inset-0 z-[998] bg-black/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} />
                        <motion.aside className="fixed left-0 top-0 z-[999] flex h-full w-[min(88vw,390px)] flex-col border-r border-white/[0.1] bg-[#090C10] lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 27, stiffness: 280 }}>
                            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-5">
                                <button type="button" onClick={() => scrollToSection("hero")} className="font-['Syne'] text-xl font-extrabold text-white">{firstName}<span className="text-[#FF3D00]">.</span></button>
                                <button type="button" aria-label="Close menu" onClick={() => setIsMobileOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 hover:bg-white/[0.06] hover:text-white"><X size={22} /></button>
                            </div>
                            <div className="border-b border-white/[0.08] px-5 py-6">
                                <div className="flex items-center gap-3">
                                    {personal?.photo_url ? (
                                        <img src={personal.photo_url} alt={personal?.name || "Profile"} className="h-11 w-11 rounded-xl border border-white/15 object-cover" />
                                    ) : (
                                        <img src="/dije.png" alt={personal?.name || "Profile"} className="h-11 w-11 rounded-xl border border-white/15 object-cover" />
                                    )}
                                    <div className="min-w-0"><p className="truncate text-base font-semibold text-white">{personal?.name || "Portofolio"}</p><p className="truncate text-xs text-white/45">{personal?.title || "Profil sedang disiapkan"}</p></div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/45"><span className="h-2 w-2 shrink-0 rounded-full bg-[#FF3D00]" /> <span className="truncate">{availability || "Status belum diatur"}</span></div>
                            </div>
                            {(primaryNavItem || hasContact) && (
                                <div className="flex gap-3 px-5 py-5">
                                    {primaryNavItem && (
                                        <button type="button" onClick={() => scrollToSection(primaryNavItem.id)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-white hover:border-[#FF3D00]/60"><PrimaryIcon size={16} /> {primaryNavItem.label}</button>
                                    )}
                                    {hasContact && <button type="button" onClick={() => scrollToSection("contact")} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold text-white hover:border-[#FF3D00]/60"><ArrowUpRight size={16} /> Kontak</button>}
                                </div>
                            )}
                            <div className="flex-1 overflow-y-auto px-4 py-1"><div className="space-y-1">{visibleNavItems.map((item) => <NavRow key={item.id} item={item} />)}</div></div>
                            <div className="border-t border-white/[0.08] p-5">
                                {cvAvailable ? (
                                    <a href={personal.cv_url} download target="_blank" rel="noreferrer" className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 hover:border-[#FF3D00]/60 hover:text-white"><Download size={17} /> Download CV</a>
                                ) : (
                                    <span title="CV belum tersedia" aria-disabled="true" className="mb-3 flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/35"><Download size={17} /> CV belum tersedia</span>
                                )}
                                <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">{profileLabel}</p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
