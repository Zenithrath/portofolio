import React from "react";
import Reveal from "./ui/Reveal";

export default function QuoteSection({ personal }) {
    if (!personal?.quote) return null;

    const quoteText = `"${personal.quote}"`;

    return (
        <section className="w-full max-w-full border-b border-white/[0.12] py-7 sm:py-8 lg:py-10">
            <Reveal className="flex w-full max-w-full flex-col justify-between gap-5">
                <div className="gsap-reveal w-full max-w-full space-y-3" style={{ overflowWrap: "anywhere" }}>
                    <p className="inline-flex border-l-2 border-[#FF3D00] pl-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/75">
                        Quote
                    </p>
                    <div className="font-['Syne'] text-4xl font-extrabold leading-none text-white/20">
                        &quot;
                    </div>
                    <h3 className="max-w-full font-['Syne'] text-sm font-extrabold italic leading-tight text-white sm:text-base md:text-lg lg:text-xl" style={{ overflowWrap: "anywhere" }}>
                        {quoteText}
                    </h3>
                </div>

                {personal.name && (
                    <div className="flex items-center gap-3">
                        <div className="h-px w-9 bg-[#FF3D00]/70" />
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                            {personal.name}
                        </p>
                    </div>
                )}
            </Reveal>
        </section>
    );
}
