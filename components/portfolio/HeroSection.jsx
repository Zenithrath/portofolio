import React, { useEffect, useRef } from "react";
import { gsap } from "./utils/gsapSetup";
import GibberishText from "./ui/GibberishText";

export default function HeroSection({
    personal,
    heroImage,
    stats,
    projectCount = 0,
    primarySection,
    hasContact,
    loaded,
}) {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);
    const actionsRef = useRef(null);
    const portraitRef = useRef(null);
    const mobilePortraitRef = useRef(null);
    const statsRef = useRef(null);

    const tagline =
        personal?.tagline ||
        personal?.title ||
        "Portofolio mahasiswa teknologi informasi";
    const words = tagline.trim().split(/\s+/);
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    const displayName = personal?.name || "Portofolio";
    const bio = personal?.bio || "Profil dan karya akan muncul dari data yang Anda kelola.";
    const bioTypography = bio.length > 260
        ? "text-[9px] leading-[1.55] sm:text-sm sm:leading-6 lg:text-base lg:leading-7"
        : bio.length > 150
            ? "text-[9px] leading-[1.55] sm:text-sm sm:leading-6 lg:text-base lg:leading-7"
            : "text-sm leading-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8";
    const profileMeta =
        [personal?.faculty, personal?.university].filter(Boolean).join(" / ") ||
        personal?.title ||
        "Profil sedang disiapkan";
    const primaryAction = primarySection
        ? {
              href: `#${primarySection}`,
              label: primarySection === "projects" ? "Lihat Karya" : "Lihat Keahlian",
          }
        : null;
    const statCards = stats || [];

    useEffect(() => {
        if (!loaded) return undefined;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        const ctx = gsap.context(() => {
            const headingLines =
                headingRef.current?.querySelectorAll("[data-hero-line]") || [];
            const portraits = [portraitRef.current, mobilePortraitRef.current]
                .filter(Boolean);
            const animatedElements = [
                ...headingLines,
                subtitleRef.current,
                actionsRef.current,
                ...portraits,
            ].filter(Boolean);

            if (reduceMotion) {
                gsap.set(animatedElements, { clearProps: "all" });
                return;
            }

            gsap.fromTo(
                headingLines,
                { y: 44, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.78,
                    stagger: 0.09,
                    ease: "power3.out",
                    delay: 0.08,
                },
            );
            gsap.fromTo(
                [subtitleRef.current, actionsRef.current].filter(Boolean),
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.62,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.34,
                },
            );
            gsap.fromTo(
                portraits,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.82,
                    ease: "power3.out",
                    delay: 0.24,
                },
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [loaded]);

    useEffect(() => {
        if (!statsRef.current) return undefined;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const ctx = gsap.context(() => {
            const cards = statsRef.current.querySelectorAll(".stat-card");
            if (reduceMotion) {
                gsap.set(cards, { clearProps: "all" });
                return;
            }

            gsap.fromTo(
                cards,
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.52,
                    stagger: 0.06,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 88%",
                        toggleActions: "play none none none",
                    },
                },
            );
        }, statsRef);

        return () => ctx.revert();
    }, [statCards.length]);

    return (
        <section id="hero" ref={sectionRef} className="overflow-visible bg-[#0B0D0C]">
            <div className="relative min-h-[535px] overflow-hidden rounded-b-[1.25rem] bg-[#F7F5F2] shadow-[0_38px_85px_-18px_rgba(0,0,0,0.42)] sm:min-h-[calc(100svh-6.5rem)] sm:rounded-b-[1.5rem] lg:h-[calc(100svh-8rem)] lg:min-h-0 lg:rounded-b-[2rem]">
                <div className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)] lg:bg-[size:48px_48px]" />
                </div>
                <div className="pointer-events-none absolute inset-0 z-[3] sm:hidden" aria-hidden="true">
                    <span className="absolute bottom-5 left-4 h-16 w-16 rounded-full border-2 border-[#FF3D00]/75" />
                    <span className="absolute right-5 top-[18%] font-mono text-xl font-bold leading-none text-[#FF3D00]/85">x</span>
                    <span className="absolute bottom-[31%] right-7 font-mono text-2xl font-bold leading-none text-[#FF3D00]/75">x</span>
                </div>
                <div className="relative z-10 mx-auto grid min-h-[535px] max-w-7xl grid-cols-1 px-5 pb-14 pt-12 sm:min-h-[calc(100svh-6.5rem)] sm:px-8 sm:pb-12 sm:pt-16 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)] lg:items-center lg:px-12 lg:pb-0 lg:pt-0 xl:px-16">
                    <div className="relative z-20 w-full min-w-0 max-w-4xl lg:translate-y-[6%] lg:pl-[8%] xl:pl-[12%]">
                        <h1
                            ref={headingRef}
                            className="relative z-20 max-w-[9.3ch] font-['Bebas_Neue'] text-[clamp(2.35rem,9vw,3rem)] leading-[0.9] tracking-[0.015em] text-[#121212] sm:max-w-[11ch] sm:text-[clamp(2.55rem,9.5vw,3.2rem)] lg:max-w-[17ch] lg:text-[clamp(3.6rem,5.6vw,5.5rem)]"
                        >
                            <span data-hero-line className="block">
                                <GibberishText text={line1} as="span" className="block" stagger={24} active={loaded} />
                            </span>
                            {line2 && (
                                <span data-hero-line className="block text-[#FF3D00]">
                                    <GibberishText text={line2} as="span" className="block" stagger={24} active={loaded} />
                                </span>
                            )}
                        </h1>

                        <div
                            ref={subtitleRef}
                            className="relative z-30 mt-5 w-[60%] max-w-[210px] border-l-2 border-[#FF3D00] pl-4 sm:mt-8 sm:w-auto sm:max-w-xl sm:pl-5"
                        >
                            <div
                                data-glitch={displayName}
                                className="hero-glitch max-w-full font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#FF3D00] sm:text-[11px] sm:tracking-[0.22em]"
                            >
                                {displayName}
                            </div>
                            <p className={`mt-2 max-w-full break-words pr-1 font-medium text-[#3C403C] ${bioTypography}`}>
                                {bio}
                            </p>
                        </div>

                        {(primaryAction || hasContact) && (
                            <div
                                ref={actionsRef}
                                className="relative z-20 mt-5 flex flex-wrap items-center gap-3 sm:mt-8 lg:gap-4"
                            >
                                {primaryAction && (
                                    <a
                                        href={primaryAction.href}
                                        className="inline-flex items-center rounded-xl bg-[#121212] px-5 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#FF3D00] sm:text-sm lg:px-6 lg:py-4"
                                    >
                                        {primaryAction.label}
                                        <span className="ml-2" aria-hidden="true">
                                            -&gt;
                                        </span>
                                    </a>
                                )}
                                {hasContact && (
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center rounded-xl border border-[#121212]/20 bg-white/55 px-5 py-3 text-xs font-bold text-[#121212] backdrop-blur-sm transition hover:border-[#FF3D00]/40 hover:text-[#FF3D00] sm:text-sm lg:px-6 lg:py-4"
                                    >
                                        Hubungi Saya
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="relative z-20 mt-5 flex w-[66%] max-w-[210px] flex-wrap items-center font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-[#4D514D] sm:mt-8 sm:w-auto sm:max-w-none sm:text-[10px] sm:tracking-[0.15em] lg:text-[#777]">
                            {profileMeta.split(/[\/|,]/).map((item, index, list) => (
                                <React.Fragment key={`${item}-${index}`}>
                                    <span>{item.trim()}</span>
                                    {index < list.length - 1 && (
                                        <span className="mx-3 text-[#FF3D00]">/</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    ref={mobilePortraitRef}
                    className="pointer-events-none absolute -right-8 bottom-0 z-[2] w-[338px] lg:hidden"
                >
                    <img
                        src={heroImage}
                        alt=""
                        className="block h-auto w-full max-w-none [filter:contrast(1.16)_drop-shadow(-22px_0_24px_rgba(0,0,0,0.42))]"
                    />
                </div>

                <div className="pointer-events-none absolute z-10 hidden items-end justify-end lg:bottom-0 lg:right-[max(2rem,calc((100vw-80rem)/2))] lg:flex lg:h-[90%] lg:w-[44%]">
                    <div className="absolute right-[7%] top-[2%] z-20 rounded-xl border border-white/15 bg-[#121212]/95 px-4 py-3 text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur">
                        <span className="block font-['Syne'] text-xl font-extrabold leading-none text-[#FF3D00] sm:text-2xl">
                            {String(projectCount).padStart(2, "0")}{projectCount > 0 ? "+" : ""}
                        </span>
                        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-white/60 sm:text-[9px]">
                            Karya dibuat
                        </span>
                    </div>
                    <img
                        ref={portraitRef}
                        src={heroImage}
                        alt={personal?.name || "Portrait"}
                        className="relative z-10 block h-full w-full object-contain object-bottom"
                    />
                </div>
            </div>

            <div
                ref={statsRef}
                className="relative border-t border-white/[0.08] bg-[#0B0D0C] px-4 pb-6 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8"
            >
                <div className="surface-grid pointer-events-none absolute inset-0 opacity-40" />
                <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {statCards.map((item) => (
                        <div
                            key={item.label}
                            className="stat-card rounded-[10px] border border-white/[0.12] bg-white/[0.035] px-3 py-3 text-[#F5F5F5] transition duration-300 hover:-translate-y-0.5 hover:border-[#FF3D00]/45 sm:px-5 sm:py-5"
                        >
                            <div className="font-['Syne'] text-[1.55rem] font-extrabold leading-none text-white sm:text-[2.2rem] lg:text-[2.4rem]">
                                {item.value}
                            </div>
                            <div className="mt-1.5 font-mono text-[8px] font-medium uppercase tracking-[0.15em] text-white/45 sm:mt-2 sm:text-[10px] sm:tracking-[0.18em]">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
