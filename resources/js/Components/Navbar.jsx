import React, { useState, useEffect } from "react";

export default function Navbar({ personal }) {
    const [activeSection, setActiveSection] = useState("hero");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: "hero", label: "Home" },
        { id: "skills", label: "Services" },
        { id: "journey", label: "Journey" },
        { id: "projects", label: "Projects" },
        { id: "certificates", label: "Awards" },
        { id: "experience", label: "Work" },
        { id: "contact", label: "Contact" },
    ];

    useEffect(() => {
        const sections = [
            "hero",
            "skills",
            "journey",
            "projects",
            "certificates",
            "experience",
            "contact",
        ];
        const observerOptions = {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions,
        );

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        setIsMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (!el) return;

        const y = el.getBoundingClientRect().top + window.scrollY - 84; // offset for fixed navbar
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    const firstName = personal?.name ? personal.name.split(" ")[0] : "Djibril";

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-[#2A2A2A] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Brand logo */}
                    <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => scrollToSection("hero")}
                    >
                        <span className="font-['Syne'] font-extrabold text-2xl tracking-tight text-white hover:text-[#FF3D00] transition-colors">
                            {firstName}
                            <span className="text-[#FF3D00]">.</span>
                        </span>
                    </div>

                    {/* Middle: Links for desktop */}
                    <div className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`text-sm font-medium transition-colors duration-200 hover:text-[#FF3D00] ${
                                    activeSection === item.id
                                        ? "text-[#FF3D00]"
                                        : "text-gray-400"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Right: CTA Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        {personal?.cv_url && (
                            <a
                                href={personal.cv_url}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-[#FF3D00] px-4 py-2 rounded-lg text-sm transition-all"
                            >
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current px-1 text-[10px] font-mono">
                                    CV
                                </span>
                                CV
                            </a>
                        )}
                        <button
                            onClick={() => scrollToSection("contact")}
                            className="bg-[#FF3D00] text-white hover:bg-[#FF6B35] px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                            Kontak
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-gray-400 hover:text-white"
                        >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#2A2A2A] text-sm font-mono font-bold">
                                {isMobileMenuOpen ? "X" : "|||"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-[#0A0A0A]/95 z-40 border-t border-[#2A2A2A]">
                    <div className="px-4 pt-6 pb-6 space-y-4 flex flex-col justify-between h-[80vh]">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-left text-2xl font-bold py-2 ${
                                        activeSection === item.id
                                            ? "text-[#FF3D00]"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {personal?.cv_url && (
                                <a
                                    href={personal.cv_url}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 border border-[#2A2A2A] text-gray-300 w-full py-3 rounded-lg text-lg transition-all"
                                >
                                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-current px-1 text-[10px] font-mono">
                                        CV
                                    </span>
                                    Download CV
                                </a>
                            )}
                            <button
                                onClick={() => scrollToSection("contact")}
                                className="w-full bg-[#FF3D00] text-white py-3 rounded-lg text-lg font-bold text-center"
                            >
                                Hubungi Saya
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
