import React from "react";

export default function FooterSection({ personal }) {
    const year = new Date().getFullYear();

    const navItems = [
        { id: "skills", label: "Skills" },
        { id: "journey", label: "Journey" },
        { id: "projects", label: "Projects" },
        { id: "certificates", label: "Certificates" },
        { id: "experience", label: "Experience" },
        { id: "contact", label: "Contact" },
    ];

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="bg-[#0A0A0A] border-t border-[#1C1C1C] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Column 1: Identity & Copyright */}
                <div className="md:col-span-5 flex flex-col items-start space-y-4">
                    <h3 className="font-['Syne'] font-extrabold text-xl text-white">
                        {personal?.name}
                        <span className="text-[#FF3D00]">.</span>
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        {personal?.title} • {personal?.faculty}
                    </p>
                    {personal?.name && (
                        <p className="text-xs text-gray-500 font-mono">
                            &copy; {year} {personal.name}. All rights reserved.
                        </p>
                    )}
                </div>

                {/* Column 2: Quick Links */}
                <div className="md:col-span-3 flex flex-col items-start space-y-3">
                    <h4 className="font-['Syne'] text-xs font-extrabold uppercase tracking-widest text-[#FF3D00]">
                        Navigasi Cepat
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="text-left text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Column 3: Location / University */}
                <div className="md:col-span-4 flex flex-col items-start space-y-3">
                    <h4 className="font-['Syne'] text-xs font-extrabold uppercase tracking-widest text-[#FF3D00]">
                        Institusi & Domisili
                    </h4>
                    {personal?.university && (
                        <p className="text-sm text-gray-400 font-semibold leading-loose">
                            🏢 {personal.university}
                        </p>
                    )}
                    {personal?.location && (
                        <p className="text-sm text-gray-400 font-semibold">
                            📍 {personal.location}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}
