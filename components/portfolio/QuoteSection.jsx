import React from "react";
import Reveal from "./ui/Reveal";

export default function QuoteSection({ personal }) {
    if (!personal?.quote) return null;

    return (
        <section className="border-b border-white/[0.12] py-7 sm:py-8 lg:py-10">
            <Reveal className="flex h-full flex-col justify-between gap-5">
                <div className="gsap-reveal space-y-3">
                    <p className="inline-flex border-l-2 border-[#FF3D00] pl-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/75">
                        Quote
                    </p>
                    <div className="font-['Syne'] text-4xl font-extrabold leading-none text-white/20">
                        &quot;
                    </div>
                    <h3 className="max-w-2xl break-words font-['Syne'] text-xl font-extrabold italic leading-tight text-white sm:text-2xl">
                        &quot;{personal.quote}&quot;
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
