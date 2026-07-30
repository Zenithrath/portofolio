import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "./utils/gsapSetup";

function ProjectPreview({ project, number }) {
    const title = project.title || "Untitled project";
    const category = project.category || "Project";

    if (project.thumbnail_url) {
        return (
            <div className="relative h-[160px] w-full shrink-0 overflow-hidden bg-[#151817] sm:h-[200px] md:h-[240px]">
                <img
                    src={project.thumbnail_url}
                    alt={title}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/15" />
                <span className="absolute left-4 top-4 rounded-lg border border-white/20 bg-black/65 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-white">
                    {number}
                </span>
            </div>
        );
    }

    return (
        <div className="surface-grid relative h-[160px] w-full shrink-0 overflow-hidden bg-[#151817] p-3 sm:h-[200px] sm:p-4 md:h-[240px]">
            <div className="absolute inset-0 bg-[#151817]/55" />
            <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="w-fit rounded-lg border border-white/[0.14] bg-black/20 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-white/70">
                    {number}
                </span>
                <p className="border-l-2 border-[#FF3D00] pl-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF8A65]">
                    {category}
                </p>
            </div>
        </div>
    );
}

export default function ProjectsSection({ projects, onSelectProject }) {
    const [activeFilter, setActiveFilter] = useState("All");
    const gridRef = useRef(null);
    const animationRef = useRef(null);
    const list = projects || [];
    const categories = Array.from(
        new Set(list.map((project) => project.category).filter(Boolean)),
    );
    const filters = ["All", ...categories];
    const filteredProjects = list.filter(
        (project) =>
            activeFilter === "All" || project.category === activeFilter,
    );

    const moveCarousel = (direction) => {
        const track = gridRef.current;
        if (!track) return;
        track.scrollBy({
            left: direction * Math.max(track.clientWidth * 0.72, 280),
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return undefined;

        animationRef.current?.kill();
        const cards = grid.querySelectorAll(".project-card");
        if (!cards.length) return undefined;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(cards, { clearProps: "all" });
            return undefined;
        }

        gsap.set(cards, { opacity: 0, y: 14 });
        animationRef.current = gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.06,
            ease: "power3.out",
        });

        return () => animationRef.current?.kill();
    }, [activeFilter, filteredProjects.length]);

    return (
        <section
            id="projects"
            className="relative overflow-hidden border-y border-white/[0.10] bg-[#0D0F0E] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16"
        >
            <div className="surface-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-5 border-b border-white/[0.12] pb-6 lg:grid-cols-[minmax(11rem,0.24fr)_minmax(0,0.76fr)] lg:items-end lg:gap-10">
                    <div className="gsap-reveal flex items-start gap-3 lg:flex-col lg:gap-5">
                        <div className="flex items-start gap-3">
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#FF3D00]" />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">
                                01 / Selected work
                            </p>
                        </div>
                        <span
                            aria-hidden="true"
                            className="hidden font-['Bebas_Neue'] text-6xl leading-none tracking-[0.04em] text-white/[0.08] lg:block"
                        >
                            01
                        </span>
                    </div>
                    <div className="gsap-reveal border-l border-white/[0.14] pl-5 sm:pl-6 lg:pb-1 lg:pl-8">
                        <h2 className="font-['Syne'] text-[1.7rem] font-extrabold leading-[1.08] text-[#F1F3EF] sm:text-4xl">
                            Selected work.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58 sm:text-base">
                            Proyek dari proses belajar, kerja tim, dan
                            eksplorasi produk digital yang saya kerjakan dengan
                            serius.
                        </p>
                    </div>
                </div>

                {filters.length > 1 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 lg:ml-[24%]">
                        <div
                            className="flex flex-1 flex-wrap gap-2"
                            role="tablist"
                            aria-label="Kategori project"
                        >
                            {filters.map((filter) => {
                                const active = activeFilter === filter;

                                return (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        aria-pressed={active}
                                        className={[
                                            "min-h-9 rounded-lg border px-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition duration-200",
                                            active
                                                ? "border-[#FF3D00] bg-[#FF3D00] text-white"
                                                : "border-white/[0.14] bg-[#121514] text-white/65 hover:border-white/[0.32] hover:text-white",
                                        ].join(" ")}
                                    >
                                        {filter}
                                    </button>
                                );
                            })}
                        </div>
                        {filteredProjects.length > 1 && (
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => moveCarousel(-1)}
                                    title="Project sebelumnya"
                                    aria-label="Project sebelumnya"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.14] text-white transition hover:border-[#FF3D00]/70 hover:bg-[#FF3D00]"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveCarousel(1)}
                                    title="Project berikutnya"
                                    aria-label="Project berikutnya"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.14] text-white transition hover:border-[#FF3D00]/70 hover:bg-[#FF3D00]"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {filteredProjects.length > 0 ? (
                    <div
                        ref={gridRef}
                        className="mt-5 flex gap-3 overflow-x-auto pb-2 pr-4 scrollbar-hide snap-x snap-mandatory sm:gap-4 lg:ml-[12%] lg:gap-5"
                    >
                        {filteredProjects.map((project, index) => {
                            const tags = Array.isArray(project.tags)
                                ? project.tags
                                : [];

                            return (
                                <div
                                    key={
                                        project.id ||
                                        `${project.title}-${index}`
                                    }
                                    className="project-card-slot w-[82vw] shrink-0 snap-start sm:w-[34rem] lg:w-[42rem]"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectProject?.(project)
                                        }
                                        className="project-card card-grid-hover group flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-white/[0.14] bg-[#121514] text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#FF3D00]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
                                    >
                                        <ProjectPreview
                                            project={project}
                                            number={String(index + 1).padStart(
                                                2,
                                                "0",
                                            )}
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-5">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                                                <span>
                                                    {project.category ||
                                                        "Project"}
                                                </span>
                                                <span className="h-1 w-1 rounded-full bg-[#FF3D00]" />
                                                <span>
                                                    {project.year || "Ongoing"}
                                                </span>
                                            </div>
                                            <h3 className="mt-2 line-clamp-2 font-['Syne'] text-[0.98rem] font-bold leading-tight text-white transition group-hover:text-[#FF8A65] sm:text-xl">
                                                {project.title ||
                                                    "Untitled project"}
                                            </h3>
                                            {project.description && (
                                                <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/60">
                                                    {project.description}
                                                </p>
                                            )}

                                            {tags.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {tags
                                                        .slice(0, 2)
                                                        .map(
                                                            (tag, tagIndex) => (
                                                                <span
                                                                    key={
                                                                        tag.id ||
                                                                        `${tag.tag}-${tagIndex}`
                                                                    }
                                                                    className="rounded-lg border border-white/[0.12] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-white/70"
                                                                >
                                                                    {tag.tag}
                                                                </span>
                                                            ),
                                                        )}
                                                </div>
                                            )}

                                            <span className="mt-3 inline-flex items-center gap-2 border-t border-white/[0.10] pt-3 text-sm font-semibold text-white">
                                                View details
                                                <ArrowUpRight className="h-4 w-4 text-[#FF6B35]" />
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mt-6 border-l-2 border-dashed border-[#FF3D00]/55 bg-white/[0.02] px-5 py-6 text-sm text-white/55 lg:ml-[24%]">
                        No projects in this category yet.
                    </div>
                )}
            </div>
        </section>
    );
}
