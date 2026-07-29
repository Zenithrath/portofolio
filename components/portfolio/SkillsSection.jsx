import React, { useEffect, useMemo, useRef, useState } from "react";
import { Code2, Gauge, UsersRound } from "lucide-react";
import { gsap } from "gsap";

const categories = [
    {
        id: "tech",
        label: "Tech",
        description: "Tools dan teknologi yang saya gunakan saat membangun produk.",
        icon: Code2,
    },
    {
        id: "hard",
        label: "Hard Skill",
        description: "Kemampuan teknis yang terus saya latih melalui proyek.",
        icon: Gauge,
    },
    {
        id: "soft",
        label: "Soft Skill",
        description: "Cara saya bekerja, berkomunikasi, dan menjaga kolaborasi.",
        icon: UsersRound,
    },
];

export default function SkillsSection({ skills }) {
    const groups = useMemo(() => ({
        tech: skills?.tech || [],
        hard: skills?.hard || [],
        soft: skills?.soft || [],
    }), [skills]);
    const [activeCategory, setActiveCategory] = useState("tech");
    const panelRef = useRef(null);
    const animationRef = useRef(null);
    const activeView = categories.find((category) => category.id === activeCategory)
        || categories[0];
    const activeSkills = groups[activeView.id] || [];

    useEffect(() => {
        if (groups.tech.length > 0) return;

        const firstAvailable = categories.find((category) => (
            groups[category.id]?.length > 0
        ));
        if (firstAvailable) setActiveCategory(firstAvailable.id);
    }, [groups]);

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return undefined;

        animationRef.current?.kill();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(panel, { clearProps: "all" });
            return undefined;
        }

        animationRef.current = gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );

        return () => animationRef.current?.kill();
    }, [activeCategory]);

    return (
        <section
            id="skills"
            className="relative overflow-hidden border-b border-white/[0.10] bg-[#101311] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16"
        >
            <div className="surface-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-5 border-b border-white/[0.12] pb-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(11rem,0.28fr)] lg:items-end lg:gap-10">
                    <div className="gsap-reveal max-w-2xl lg:pl-[12%]">
                        <h2 className="font-['Syne'] text-[1.7rem] font-extrabold leading-[1.08] text-[#F1F3EF] sm:text-4xl">
                            Hal yang saya bawa ke setiap project.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58 sm:text-base">
                            Keahlian dikelompokkan agar lebih mudah dibaca dalam konteks
                            teknis maupun kolaborasi.
                        </p>
                    </div>
                    <div className="gsap-reveal flex items-start gap-3 lg:flex-col lg:items-end lg:gap-5 lg:border-r lg:border-white/[0.14] lg:pr-8">
                        <div className="flex items-start gap-3 lg:flex-row-reverse">
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#FF3D00]" />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] lg:text-right">
                                02 / Skill set
                            </p>
                        </div>
                        <span
                            aria-hidden="true"
                            className="hidden font-['Bebas_Neue'] text-6xl leading-none tracking-[0.04em] text-white/[0.08] lg:block"
                        >
                            02
                        </span>
                    </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#0D0F0E] lg:mr-[12%]">
                    <div
                        className="m-2 grid grid-cols-3 overflow-hidden rounded-[8px] border border-white/[0.10] bg-[#151817]"
                        role="tablist"
                        aria-label="Kategori skill"
                    >
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const active = activeView.id === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-controls={`skill-panel-${category.id}`}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={[
                                        "flex min-h-10 items-center justify-center gap-1.5 border-r border-white/[0.10] px-2 text-[10px] font-semibold transition duration-200 last:border-r-0 sm:min-h-14 sm:gap-2 sm:text-sm",
                                        active
                                            ? "bg-[#FF3D00] text-white"
                                            : "text-white/55 hover:bg-white/[0.04] hover:text-white",
                                    ].join(" ")}
                                >
                                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="truncate">{category.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(11rem,0.29fr)_minmax(0,0.71fr)] lg:gap-8">
                        <div className="border-b border-white/[0.10] pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">
                                {activeView.label}
                            </p>
                            <h3 className="mt-2 font-['Syne'] text-lg font-bold text-white sm:mt-3 sm:text-xl">
                                {String(activeSkills.length).padStart(2, "0")} kemampuan
                            </h3>
                            <p className="mt-2 text-[13px] leading-5 text-white/55 sm:text-sm sm:leading-6">
                                {activeView.description}
                            </p>
                        </div>

                        <div
                            ref={panelRef}
                            id={`skill-panel-${activeView.id}`}
                            role="tabpanel"
                        >
                            {activeSkills.length > 0 ? (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:pb-0">
                                    {activeSkills.map((skill, index) => {
                                        const proficiency = skill.proficiency ?? skill.level;

                                        return (
                                            <div
                                                key={skill.id || `${activeView.id}-${index}`}
                                                className={[
                                                    "flex min-h-12 w-[68vw] shrink-0 snap-start items-center justify-between gap-3 rounded-[9px] border border-white/[0.12] bg-[#151817] px-3 transition duration-200 hover:border-[#FF3D00]/45 sm:min-h-14 sm:w-auto sm:px-4",
                                                    index % 2 === 1 ? "sm:translate-x-3" : "",
                                                ].join(" ")}
                                            >
                                                <span className="text-[13px] font-semibold text-white sm:text-sm">
                                                    {skill.name}
                                                </span>
                                                {proficiency !== null && proficiency !== undefined && (
                                                    <span className="font-mono text-[10px] text-white/45">
                                                        {proficiency}%
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="border-l-2 border-dashed border-[#FF3D00]/55 bg-white/[0.02] px-4 py-7 text-sm text-white/50">
                                    Belum ada skill pada kategori ini.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
