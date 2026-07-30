import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from "lucide-react";
import Reveal from "./ui/Reveal";

const views = {
    work: {
        label: "Work",
        title: "Work\nExperience",
        description:
            "Roles, responsibilities, and contributions that have shaped the way I work.",
    },
    education: {
        label: "Education",
        title: "Education\nBackground",
        description:
            "The education and learning experiences that built my foundation.",
    },
    organization: {
        label: "Leadership",
        title: "Leadership\nExperience",
        description:
            "Collaborative roles and responsibilities that strengthened how I contribute.",
    },
    achievement: {
        label: "Achievements",
        title: "Selected\nAchievements",
        description:
            "Milestones that reflect my learning, progress, and commitment.",
    },
};

function formatDate(value) {
    return value
        ? new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
          })
        : "";
}

function PathCard({ item, index, view }) {
    const date = [
        formatDate(item.start_date),
        item.is_current ? "Present" : formatDate(item.end_date),
    ]
        .filter(Boolean)
        .join(" - ");
    const detail = item.category === "work" ? item.type : view.label;

    return (
        <article className="card-grid-hover relative flex min-h-[224px] w-full flex-col overflow-hidden rounded-[10px] border border-white/[0.11] bg-[#121514] p-4 sm:min-h-[238px] sm:p-5">
            <div className="relative z-10 flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 border-l-2 border-[#FF3D00] pl-2 font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B35]">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {detail}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                    {String(index + 1).padStart(2, "0")}
                </span>
            </div>
            <h3 className="relative z-10 mt-5 font-['Syne'] text-lg font-bold leading-tight text-white sm:text-xl">
                {item.position || "Role not specified"}
            </h3>
            <p className="relative z-10 mt-1.5 text-sm font-semibold text-white/70">
                {item.company || "Organisation not specified"}
            </p>
            {(date || item.location) && (
                <div className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                    {date && (
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5 text-[#FF6B35]" />
                            {date}
                        </span>
                    )}
                    {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#FF6B35]" />
                            {item.location}
                        </span>
                    )}
                </div>
            )}
            {item.description && (
                <p className="relative z-10 mt-4 line-clamp-4 text-sm leading-6 text-white/58">
                    {item.description}
                </p>
            )}
        </article>
    );
}

export default function ExperienceSection({ experiences }) {
    const [activeView, setActiveView] = useState("work");
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);
    const view = views[activeView] || views.work;
    const items = useMemo(
        () =>
            [...(experiences || [])]
                .filter((item) => (item.category || "work") === activeView)
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
        [activeView, experiences],
    );
    const activeItem = items[activeIndex];
    const hasMultipleItems = items.length > 1;

    useEffect(() => {
        setActiveIndex(0);
        setSlideDirection(1);
    }, [activeView]);
    useEffect(() => {
        if (activeIndex >= items.length) setActiveIndex(0);
    }, [activeIndex, items.length]);
    const moveSlide = (direction) => {
        if (!hasMultipleItems) return;
        setSlideDirection(direction);
        setActiveIndex(
            (current) => (current + direction + items.length) % items.length,
        );
    };

    return (
        <section
            id="experience"
            className="relative min-w-0 overflow-hidden py-8 sm:py-10 lg:py-16"
        >
            <Reveal className="mx-auto max-w-none space-y-6 lg:space-y-9">
                <div className="grid gap-5 border-b border-white/[0.12] pb-5 lg:grid-cols-[minmax(9rem,0.24fr)_minmax(0,0.76fr)] lg:items-end lg:gap-8">
                    <div className="gsap-reveal flex items-start gap-3 lg:flex-col lg:gap-4">
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#FF3D00]" />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">
                                04 / Path
                            </p>
                        </div>
                        <span
                            aria-hidden="true"
                            className="hidden font-['Bebas_Neue'] text-5xl leading-none tracking-[0.04em] text-white/[0.08] lg:block"
                        >
                            04
                        </span>
                    </div>
                    <div className="gsap-reveal grid min-w-0 gap-4 border-l border-white/[0.14] pl-5 sm:pl-6 lg:grid-cols-[minmax(0,1fr)_10.5rem] lg:items-end lg:gap-5 lg:pb-1 lg:pl-8">
                        <div className="min-w-0">
                            <h2 className="whitespace-pre-line text-[1.7rem] font-extrabold leading-[0.98] tracking-tight text-white sm:text-4xl">
                                {view.title.split("\n")[0]}
                                {"\n"}
                                <span className="text-[#FF3D00]">
                                    {view.title.split("\n")[1]}
                                </span>
                            </h2>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
                                {view.description}
                            </p>
                        </div>
                        <label className="relative block w-full max-w-[11rem] sm:w-[10.5rem] lg:justify-self-end">
                            <span className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                                View
                            </span>
                            <select
                                value={activeView}
                                onChange={(event) =>
                                    setActiveView(event.target.value)
                                }
                                className="w-full appearance-none rounded-[9px] border border-white/[0.14] bg-[#121514] px-3 py-2.5 pr-9 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white outline-none transition hover:border-[#FF6B35]/70 focus:border-[#FF3D00] focus:bg-[#171A18] focus:ring-1 focus:ring-[#FF3D00]/35"
                            >
                                <option value="work">Work</option>
                                <option value="education">Education</option>
                                <option value="organization">Leadership</option>
                                <option value="achievement">
                                    Achievements
                                </option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-[#FF6B35]" />
                        </label>
                    </div>
                </div>
                <div className="grid gap-5 lg:grid-cols-[minmax(9rem,0.24fr)_minmax(0,0.76fr)] lg:gap-8">
                    <aside className="border-l border-white/[0.14] pl-4 sm:pl-5 lg:pt-2">
                        <div className="flex items-end justify-between gap-4 lg:block">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                                {view.label}
                            </p>
                            <p className="font-['Syne'] text-3xl font-extrabold text-white lg:mt-2">
                                {String(items.length).padStart(2, "0")}
                            </p>
                        </div>
                    </aside>
                    {activeItem ? (
                        <div className="min-w-0">
                            <div className="mb-3 flex flex-wrap items-center gap-3 border-b border-white/[0.10] pb-3">
                                <span
                                    aria-live="polite"
                                    className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/45"
                                >
                                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                                    {String(items.length).padStart(2, "0")}
                                </span>
                                <div className="flex items-center gap-2 border-l border-white/[0.12] pl-3">
                                    <button
                                        type="button"
                                        title="Previous card"
                                        aria-label="Previous card"
                                        onClick={() => moveSlide(-1)}
                                        disabled={!hasMultipleItems}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.14] text-white transition hover:border-[#FF3D00]/70 hover:bg-[#FF3D00] disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        title="Next card"
                                        aria-label="Next card"
                                        onClick={() => moveSlide(1)}
                                        disabled={!hasMultipleItems}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.14] text-white transition hover:border-[#FF3D00]/70 hover:bg-[#FF3D00] disabled:cursor-not-allowed disabled:opacity-35"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="relative min-h-[224px] sm:min-h-[238px]">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={`${activeView}-${activeItem.id ?? activeIndex}`}
                                        initial={{
                                            opacity: 0,
                                            x: slideDirection * 18,
                                            y: 6,
                                        }}
                                        animate={{ opacity: 1, x: 0, y: 0 }}
                                        exit={{
                                            opacity: 0,
                                            x: slideDirection * -18,
                                            y: -4,
                                        }}
                                        transition={{
                                            duration: 0.34,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <PathCard
                                            item={activeItem}
                                            index={activeIndex}
                                            view={view}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="border-l-2 border-dashed border-[#FF3D00]/55 bg-white/[0.02] px-4 py-6 text-sm leading-6 text-white/55">
                            No {view.label.toLowerCase()} entries are available
                            yet.
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}
