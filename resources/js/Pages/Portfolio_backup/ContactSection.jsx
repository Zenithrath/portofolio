import React from "react";
import Reveal from "./Reveal";

export default function ContactSection({ contacts }) {
    const list = contacts || [];

    const getIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case "email":
                return "EM";
            case "linkedin":
                return "IN";
            case "github":
                return "GH";
            case "whatsapp":
                return "WA";
            case "instagram":
                return "IG";
            default:
                return "GO";
        }
    };

    return (
        <section
            id="contact"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0A0A] border-t border-[#1C1C1C]"
        >
            <Reveal className="max-w-5xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                        Mari <span className="text-[#FF3D00]">Terhubung</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#FF3D00] mx-auto"></div>
                    <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
                        Silakan hubungi saya melalui platform di bawah ini. Saya
                        akan dengan senang hati merespons pesan Anda.
                    </p>
                </div>

                {/* Grid Links */}
                {list.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {list.map((contact) => (
                            <a
                                key={contact.id}
                                href={contact.value}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative bg-[#131313] border border-[#2A2A2A] hover:border-[#FF3D00]/50 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between shadow-sm hover:shadow-[0_0_20px_rgba(255,61,0,0.05)]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-[#1C1C1C] border border-[#2A2A2A] group-hover:border-transparent text-gray-400 group-hover:text-white group-hover:bg-[#FF3D00] rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-mono font-bold tracking-widest">
                                        {getIcon(contact.platform)}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 font-mono font-bold uppercase tracking-wider">
                                            {contact.platform}
                                        </p>
                                        <p className="text-sm font-bold text-white group-hover:text-[#FF3D00] transition-colors mt-0.5 max-w-[180px] truncate">
                                            {contact.label}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-gray-600 group-hover:text-white transition-colors text-lg font-bold">
                                    {"->"}
                                </span>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        Belum ada data kontak.
                    </p>
                )}
            </Reveal>
        </section>
    );
}
