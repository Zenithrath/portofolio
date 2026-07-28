import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { ExternalLink } from "lucide-react";
import Navbar from "./Portfolio/components/Navbar";
import GsapScrollAnimations from "./Portfolio/components/GsapScrollAnimations";
import LoadingScreen from "./Portfolio/components/LoadingScreen";
import PortfolioCursor from "./Portfolio/components/PortfolioCursor";
import HeroSection from "./Portfolio/HeroSection";
import ProjectsSection from "./Portfolio/ProjectsSection";
import SkillsSection from "./Portfolio/SkillsSection";
import CertificatesSection from "./Portfolio/CertificatesSection";
import ExperienceSection from "./Portfolio/ExperienceSection";
import QuoteSection from "./Portfolio/QuoteSection";
import ContactSection from "./Portfolio/ContactSection";
import FooterSection from "./Portfolio/FooterSection";
import PortfolioModal from "../Components/PortfolioModal";
import heroPortrait from "../../dije.png";

export default function Portfolio({
    personal,
    skills,
    journey,
    projects,
    certificates,
    experiences,
    contacts,
}) {
    const metaDescription =
        personal?.bio ||
        "Website portofolio modern dengan gaya dark editorial, menampilkan profil, project, sertifikat, dan pengalaman.";
    const pageTitle = personal?.name
        ? `${personal.name} | Portofolio`
        : "Portofolio";

    const techSkills = skills?.tech || [];
    const hardSkills = skills?.hard || [];
    const softSkills = skills?.soft || [];
    const pathCount = (experiences?.length ?? 0) + (journey?.length ?? 0);
    const formatCount = (count) => `${String(count).padStart(2, "0")}${count > 0 ? "+" : ""}`;

    const stats = [
        {
            label: "Project Selesai",
            value: formatCount(projects?.length ?? 0),
        },
        {
            label: "Skill Inti",
            value: formatCount(techSkills.length + hardSkills.length + softSkills.length),
        },
        {
            label: "Sertifikat",
            value: formatCount(certificates?.length ?? 0),
        },
        {
            label: "Perjalanan",
            value: formatCount(pathCount),
        },
    ];

    const heroImage = personal?.photo_url || heroPortrait;
    const hasQuote = Boolean(personal?.quote);
    const hasProjects = (projects?.length || 0) > 0;
    const hasSkills = [techSkills, hardSkills, softSkills].some(
        (group) => group.length > 0,
    );
    const visibleSections = [
        "hero",
        "projects",
        "skills",
        "certificates",
        "experience",
        "contact",
    ];

    const [loaded, setLoaded] = useState(false);
    const [activeProject, setActiveProject] = useState(null);
    const [activeCertificate, setActiveCertificate] = useState(null);
    const [activeMedia, setActiveMedia] = useState(null);

    useLayoutEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        const clearSectionHash = () => {
            if (!window.location.hash) return;

            window.history.replaceState(
                null,
                "",
                `${window.location.pathname}${window.location.search}`,
            );
        };

        window.history.scrollRestoration = "manual";
        clearSectionHash();

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        const frame = window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
        window.addEventListener("beforeunload", clearSectionHash);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("beforeunload", clearSectionHash);
            window.history.scrollRestoration = previousRestoration;
        };
    }, []);

    const activeProjectImages = useMemo(() => {
        if (!activeProject) return [];
        const gallery = Array.isArray(activeProject.gallery_urls)
            ? activeProject.gallery_urls
            : [];
        const docs = Array.isArray(activeProject.documentation_urls)
            ? activeProject.documentation_urls
            : [];
        const images = [
            activeProject.thumbnail_url,
            ...gallery,
            ...docs,
        ].filter(Boolean);
        return Array.from(new Set(images));
    }, [activeProject]);

    useEffect(() => {
        if (activeProjectImages.length > 0) {
            setActiveMedia(activeProjectImages[0]);
        } else if (activeCertificate?.image_url) {
            setActiveMedia(activeCertificate.image_url);
        } else {
            setActiveMedia(null);
        }
    }, [activeProjectImages, activeCertificate]);

    useEffect(() => {
        if (!loaded || !window.location.hash) return;

        const targetId = window.location.hash.slice(1);
        const timer = window.setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({
                behavior: "auto",
                block: "start",
            });
        }, 100);

        return () => window.clearTimeout(timer);
    }, [loaded]);

    useEffect(() => {
        if (loaded && !window.location.hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
    }, [loaded]);

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                {personal?.photo_url && (
                    <meta property="og:image" content={personal.photo_url} />
                )}
            </Head>

            <div className="min-h-screen overflow-x-hidden bg-[#0B0D0C] text-[#F1F3EF] selection:bg-[#FF3D00] selection:text-white">
                <LoadingScreen
                    name={personal?.name || "Djibril Rangga Deja"}
                    onComplete={() => setLoaded(true)}
                />
                <PortfolioCursor />
                <Navbar personal={personal} visibleSections={visibleSections} />
                <GsapScrollAnimations />

                <main className="relative z-10 flex w-full flex-col pt-16">
                    <HeroSection
                        personal={personal}
                        heroImage={heroImage}
                        stats={stats}
                        projectCount={projects?.length ?? 0}
                        primarySection={hasProjects ? "projects" : hasSkills ? "skills" : null}
                        hasContact
                        loaded={loaded}
                    />

                    <ProjectsSection
                        projects={projects}
                        onSelectProject={setActiveProject}
                    />
                    <SkillsSection skills={skills} />
                    <CertificatesSection
                        certificates={certificates}
                        onSelectCertificate={setActiveCertificate}
                    />
                    <div className="relative overflow-hidden border-b border-white/[0.12] bg-[#101211] px-4 sm:px-6 lg:px-8">
                        <div className="surface-grid pointer-events-none absolute inset-0 opacity-30" />
                        <div className="relative mx-auto grid max-w-7xl items-stretch lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10">
                            <ExperienceSection experiences={experiences} journey={journey} />
                            <div className="grid min-w-0 content-start border-t border-white/[0.12] lg:border-l lg:border-t-0 lg:pl-10">
                                {hasQuote && <QuoteSection personal={personal} />}
                                <ContactSection contacts={contacts} status={personal?.status} />
                            </div>
                        </div>
                    </div>
                    <FooterSection personal={personal} contacts={contacts} />
                </main>


                <PortfolioModal
                    show={!!activeProject}
                    onClose={() => {
                        setActiveProject(null);
                        setActiveMedia(null);
                    }}
                    title={activeProject?.title || "Project"}
                    maxWidth="5xl"
                >
                    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                        <div className="space-y-3 min-w-0">
                            <div className="overflow-hidden rounded-[12px] border border-[#2A2A2A] bg-[#131313]">
                                {activeMedia ? (
                                    <img
                                        src={activeMedia}
                                        alt={activeProject?.title || "Project image"}
                                        className="h-[320px] w-full object-cover sm:h-[420px]"
                                    />
                                ) : (
                                    <div className="flex h-[320px] w-full items-center justify-center text-sm text-[#888888] sm:h-[420px]">
                                        Belum ada gambar dokumentasi.
                                    </div>
                                )}
                            </div>

                            {activeProjectImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {activeProjectImages.map((src, idx) => {
                                        const active = src === activeMedia;
                                        return (
                                            <button
                                                type="button"
                                                key={`${src}-${idx}`}
                                                onClick={() => setActiveMedia(src)}
                                                className={[
                                                    "shrink-0 h-16 w-24 overflow-hidden rounded-[12px] border bg-[#131313] transition",
                                                    active
                                                        ? "border-[#FF3D00]/70"
                                                        : "border-[#2A2A2A] hover:border-[#FF3D00]/40",
                                                ].join(" ")}
                                            >
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 min-w-0">
                            <div className="flex flex-wrap gap-2">
                                {(activeProject?.tags || []).map((tag, idx) => (
                                    <span
                                        key={tag.id || idx}
                                        className="rounded-full border border-[#2A2A2A] bg-[#1C1C1C] px-3 py-1 font-mono text-xs text-[#F5F5F5]"
                                    >
                                        {tag.tag}
                                    </span>
                                ))}
                            </div>

                            <div className="font-mono text-xs text-[#888888]">
                                {[activeProject?.category, activeProject?.year || "Now"]
                                    .filter(Boolean)
                                    .join(" / ")}
                            </div>

                            <p className="break-words text-sm leading-7 text-gray-300">
                                {activeProject?.long_description ||
                                    activeProject?.description ||
                                    "Belum ada deskripsi."}
                            </p>

                            {(activeProject?.demo_url || activeProject?.url) && (
                                <a
                                    href={activeProject.demo_url || activeProject.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-[12px] border border-[#FF3D00] px-4 py-2 text-sm font-semibold text-[#FF6B35] transition hover:bg-[#FF3D00] hover:text-white"
                                >
                                    Buka Project
                                </a>
                            )}

                            {activeProject?.repo_url && (
                                <a
                                    href={activeProject.repo_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-[12px] border border-[#2A2A2A] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-[#FF3D00]/40 hover:text-white"
                                >
                                    Lihat Repository
                                </a>
                            )}
                        </div>
                    </div>
                </PortfolioModal>

                <PortfolioModal
                    show={!!activeCertificate}
                    onClose={() => {
                        setActiveCertificate(null);
                        setActiveMedia(null);
                    }}
                    title={activeCertificate?.title || "Certificate"}
                    maxWidth="4xl"
                >
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-[12px] border border-[#2A2A2A] bg-[#131313]">
                            {activeCertificate?.image_url ? (
                                <img
                                    src={activeCertificate.image_url}
                                    alt={activeCertificate.title}
                                    className="max-h-[70vh] w-full bg-black object-contain"
                                />
                            ) : (
                                <div className="flex h-[320px] w-full items-center justify-center text-sm text-[#888888]">
                                    Sertifikat belum punya gambar.
                                </div>
                            )}
                        </div>

                        {(activeCertificate?.issuer || activeCertificate?.credential_id) && (
                            <div className="rounded-[12px] border border-[#2A2A2A] bg-[#131313] p-4">
                                {activeCertificate?.issuer && (
                                    <div className="text-sm text-gray-200">
                                        <span className="font-mono text-xs text-[#888888]">Issuer</span>
                                        <div className="mt-1 break-words font-semibold">
                                            {activeCertificate.issuer}
                                        </div>
                                    </div>
                                )}
                                {activeCertificate?.credential_id && (
                                    <div className="mt-3 text-sm text-gray-200">
                                        <span className="font-mono text-xs text-[#888888]">Credential</span>
                                        <div className="mt-1 break-words font-mono">
                                            {activeCertificate.credential_id}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeCertificate?.credential_url && (
                            <a
                                href={activeCertificate.credential_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-[12px] border border-[#FF3D00] px-4 py-2 text-sm font-semibold text-[#FF6B35] transition hover:bg-[#FF3D00] hover:text-white"
                            >
                                Buka kredensial
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </PortfolioModal>
            </div>
        </>
    );
}
