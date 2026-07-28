import React from "react";
import { Mail, LinkIcon, Phone, MapPin, Download } from "lucide-react";

export default function HeroCard() {
    const contactInfo = [
        {
            icon: Mail,
            text: "djibril@example.com",
            href: "mailto:djibril@example.com",
        },
        { icon: LinkIcon, text: "linkedin.com/in/djibril", href: "#" },
        { icon: Phone, text: "+62 812-3456-7890", href: "tel:+628123456789" },
        { icon: MapPin, text: "Malang, Indonesia" },
    ];

    return (
        <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl h-full flex flex-col justify-between">
            {/* Mobile: background profile photo dimmed behind text */}
            <div
                className="absolute inset-0 bg-cover bg-center block sm:hidden z-0"
                style={{
                    backgroundImage:
                        "url('/storage/profile/bdqPc8lZ1K3l7D2N3hLNKrjd9FmJEjlmTli6S5Gd.png')",
                }}
            />
            <div className="absolute inset-0 bg-black/40 block sm:hidden z-10" />

            {/* Foto Profile dengan Gradient (hidden on small screens) */}
            <div className="absolute top-0 right-0 h-full w-[40%] bg-gradient-to-r from-orange-500 to-orange-600 opacity-40 group-hover:opacity-50 transition-opacity duration-500 hidden sm:block"></div>

            {/* Overlay Gradasi pada Foto (hidden on small screens) */}
            <div className="absolute top-0 right-0 h-full w-[40%] bg-gradient-to-l from-neutral-900/90 via-orange-950/70 to-transparent hidden sm:block"></div>

            {/* Tombol Download CV */}
            <button className="self-end bg-orange-400 text-neutral-950 px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 relative z-20 hover:bg-orange-300 transition-colors">
                <Download size={18} />
                Download CV
            </button>

            {/* Info Teks */}
            <div className="relative z-20 space-y-4 pt-16">
                <span className="text-orange-400 text-sm font-medium tracking-wide">
                    Full Stack Developer
                </span>
                <h1 className="text-5xl font-bold text-white tracking-tighter leading-tight">
                    Djibril
                    <br />
                    Rangga
                    <br />
                    Deja
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-6">
                    {contactInfo.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 text-neutral-400 group-hover:text-neutral-200 transition-colors"
                        >
                            <item.icon size={18} className="text-neutral-500" />
                            {item.href ? (
                                <a
                                    href={item.href}
                                    className="text-sm hover:text-orange-400 transition-colors"
                                >
                                    {item.text}
                                </a>
                            ) : (
                                <span className="text-sm">{item.text}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
