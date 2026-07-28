import React from "react";
import Reveal from "./Reveal";

export default function QuoteSection({ personal }) {
    const quoteText = personal?.quote;
    const author = personal?.name;

    if (!quoteText) return null;

    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#FF3D00] overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 text-[220px] sm:text-[280px] font-['Syne'] font-extrabold leading-none text-[#0A0A0A]/5 pointer-events-none select-none">
                "
            </div>

            <Reveal className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
                <div className="mx-auto text-[#0A0A0A]/20 text-6xl leading-none font-['Syne']">
                    "
                </div>

                <h3 className="font-['Syne'] text-2xl sm:text-4xl lg:text-5xl font-extrabold italic text-[#0A0A0A] leading-tight max-w-4xl mx-auto drop-shadow-sm">
                    "{quoteText}"
                </h3>

                {author && (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-[2px] bg-[#0A0A0A]"></div>
                        <p className="font-mono text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">
                            {author}
                        </p>
                        <div className="w-8 h-[2px] bg-[#0A0A0A]"></div>
                    </div>
                )}
            </Reveal>
        </section>
    );
}
