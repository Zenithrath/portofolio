import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileNav({ personal }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    const navItems = [
        { id: "hero", label: "Home", num: "01" },
        { id: "projects", label: "Projects", num: "02" },
        { id: "skills", label: "Skills", num: "03" },
        { id: "certificates", label: "Certificates", num: "04" },
        { id: "experience", label: "Experience", num: "05" },
        { id: "contact", label: "Contact", num: "06" },
    ];

    useEffect(() => {
        const sections = navItems.map((i) => i.id);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 },
        );
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const scrollToSection = (id) => {
        setIsOpen(false);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
    };

    return (
        <>
            {/* Trigger — bottom-right */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-[998] flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.1] bg-[#FF3D00] text-white shadow-xl shadow-[#FF3D00]/30 transition-all duration-200 hover:scale-105 active:scale-95 md:hidden"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {/* Sheet overlay + content */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet — slides from right */}
                        <motion.div
                            className="fixed right-0 top-0 z-[1000] flex h-full w-[75vw] max-w-[300px] flex-col border-l border-white/[0.08] md:hidden"
                            style={{
                                background: "rgba(8,8,8,0.98)",
                                backdropFilter: "blur(40px) saturate(1.4)",
                                WebkitBackdropFilter: "blur(40px) saturate(1.4)",
                            }}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                                <span className="font-['Syne'] text-lg font-extrabold text-white">
                                    {personal?.name ? personal.name.split(" ")[0] : "Djibril"}
                                    <span className="text-[#FF3D00]">.</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/60 transition-colors hover:text-white"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M18 6L6 18" />
                                        <path d="M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Nav items */}
                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                <div className="space-y-1">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${
                                                activeSection === item.id
                                                    ? "bg-[#FF3D00]/15 text-white"
                                                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                                            }`}
                                        >
                                            <span className="font-mono text-[10px] tracking-wider text-white/25">
                                                {item.num}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                            {activeSection === item.id && (
                                                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF3D00]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/[0.06] p-4">
                                {personal?.cv_url && (
                                    <a
                                        href={personal.cv_url}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mb-2 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-gray-300 transition hover:border-[#FF3D00]/40 hover:bg-[#FF3D00]/10"
                                    >
                                        <span className="inline-flex min-w-5 items-center justify-center rounded-md border border-current px-1 font-mono text-[9px]">CV</span>
                                        Download CV
                                    </a>
                                )}
                                <button
                                    onClick={() => scrollToSection("contact")}
                                    className="w-full rounded-xl bg-[#FF3D00] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF3D00]/20"
                                >
                                    Hubungi Saya
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
