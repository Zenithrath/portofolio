import React, { useEffect, useRef } from "react";

export default function JourneySection({ journey }) {
    const listRef = useRef([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove(
                        "opacity-0",
                        "translate-y-12",
                    );
                    entry.target.classList.add("opacity-100", "translate-y-0");
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        listRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [journey]);

    const sortedJourney = journey
        ? [...journey].sort((a, b) => a.sort_order - b.sort_order)
        : [];

    return (
        <section
            id="journey"
            className="relative overflow-hidden bg-[#090909] px-4 py-24 sm:px-6 lg:px-8"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#FF3D00]/10 blur-3xl" />
                <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-[#7A0000]/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />
            </div>

            <div className="mx-auto max-w-7xl space-y-12">
                <div className="relative max-w-3xl space-y-4 text-left">
                    <span className="inline-flex rounded-full border border-[#FF3D00]/20 bg-[#FF3D00]/10 px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[#FF3D00]">
                        Journey Path
                    </span>
                    <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
                        Perjalanan &{" "}
                        <span className="text-[#FF3D00]">Edukasi</span>
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                        Alur dibuat seperti peta perjalanan: garis tengah,
                        cabang lengkung, dan panel yang berganti sisi supaya
                        tiap fase terasa punya arah.
                    </p>
                </div>

                <div className="space-y-8">
                    {sortedJourney.length > 0 ? (
                        sortedJourney.map((item, index) => {
                            const isReverse = index % 2 === 1;
                            const textCard = (
                                <div className="relative flex h-[clamp(280px,34vh,460px)] w-full flex-col justify-center overflow-hidden rounded-[12px] border border-white/[0.08] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15]"
                                    style={{ background: 'linear-gradient(165deg, rgba(30,30,30,0.65) 0%, rgba(18,18,18,0.82) 100%)', backdropFilter: 'blur(16px) saturate(1.2)', WebkitBackdropFilter: 'blur(16px) saturate(1.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.24)' }}>
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_35%)]" />
                                    <div
                                        className={`relative ${isReverse ? "md:text-right" : ""}`}
                                    >
                                        <div
                                            className={`flex flex-wrap items-center gap-2 ${isReverse ? "md:justify-end" : ""}`}
                                        >
                                            <span className="inline-flex rounded-full border border-[#FF3D00]/30 bg-[#FF3D00]/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-[#FF3D00]">
                                                {item.type || "journey"}
                                            </span>
                                            <span className="rounded-full border border-white/[0.06] px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-gray-400" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)' }}>
                                                {item.year}
                                            </span>
                                        </div>
                                        <h4 className="mt-4 text-2xl font-bold text-white font-['Syne']">
                                            {item.title}
                                        </h4>
                                        {item.institution && (
                                            <p className="mt-2 text-sm font-semibold text-gray-400">
                                                {item.institution}
                                            </p>
                                        )}
                                        <p className="mt-4 text-sm leading-7 text-gray-300">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );

                            const imageCard = (
                                <div className="relative h-[clamp(280px,34vh,460px)] w-full overflow-hidden rounded-[12px] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15]"
                                    style={{ background: 'linear-gradient(165deg, rgba(22,22,22,0.65) 0%, rgba(12,12,12,0.82) 100%)', backdropFilter: 'blur(16px) saturate(1.2)', WebkitBackdropFilter: 'blur(16px) saturate(1.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px rgba(0,0,0,0.24)' }}>
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)]" />
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="relative flex h-full flex-col items-center justify-center bg-[linear-gradient(135deg,rgba(23,23,23,0.98),rgba(10,10,10,0.98))] px-6 text-center">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-gray-500">
                                                Visual Missing
                                            </span>
                                            <p className="mt-3 max-w-xs text-sm leading-7 text-gray-400">
                                                Tambahkan gambar untuk
                                                memperkuat cerita fase ini.
                                            </p>
                                        </div>
                                    )}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.88))]" />
                                    <div className="absolute bottom-4 left-4 rounded-full border border-white/[0.08] bg-black/45 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.28em] text-gray-300 backdrop-blur-sm">
                                        Phase{" "}
                                        {String(index + 1).padStart(2, "0")}
                                    </div>
                                </div>
                            );

                            return (
                                <div
                                    key={item.id}
                                    ref={(el) => (listRef.current[index] = el)}
                                    className="relative grid gap-4 opacity-0 translate-y-12 transition-all duration-700 ease-out md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] md:items-stretch md:gap-0"
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 100 280"
                                        preserveAspectRatio="none"
                                        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                                    >
                                        <path
                                            d={
                                                isReverse
                                                    ? "M 100 128 C 82 128, 72 92, 50 140"
                                                    : "M 0 128 C 18 128, 28 92, 50 140"
                                            }
                                            fill="none"
                                            stroke="rgba(165, 0, 0, 0.9)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block">
                                        <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/[0.08]" />
                                        <span className="absolute left-1/2 top-[128px] z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-[#090909] shadow-[0_0_0_10px_rgba(255,255,255,0.12)]" />
                                    </div>

                                    <div
                                        className={
                                            isReverse
                                                ? "md:col-start-1"
                                                : "md:col-start-1"
                                        }
                                    >
                                        {isReverse ? imageCard : textCard}
                                    </div>

                                    <div className="hidden md:block md:col-start-2" />

                                    <div
                                        className={
                                            isReverse
                                                ? "md:col-start-3"
                                                : "md:col-start-3"
                                        }
                                    >
                                        {isReverse ? textCard : imageCard}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">
                            Belum ada data perjalanan.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
