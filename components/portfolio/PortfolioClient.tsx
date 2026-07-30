"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Certificate, PortfolioData, Project } from "@/types/portfolio";
import Navbar from "./ui/Navbar";
import GsapScrollAnimations from "./ui/GsapScrollAnimations";
import LoadingScreen from "./ui/LoadingScreen";
import PortfolioCursor from "./ui/PortfolioCursor";
import PortfolioModal from "./ui/PortfolioModal";
import HeroSection from "./HeroSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import CertificatesSection from "./CertificatesSection";
import ExperienceSection from "./ExperienceSection";
import QuoteSection from "./QuoteSection";
import ContactSection from "./ContactSection";
import FooterSection from "./FooterSection";
import PortfolioAssistant from "./PortfolioAssistant";

type Props = PortfolioData;

function formatCount(count: number) {
    return `${String(count).padStart(2, "0")}${count > 0 ? "+" : ""}`;
}

export default function PortfolioClient({
    personal,
    skills,
    projects,
    certificates,
    experiences,
    contacts,
}: Props) {
    const [loaded, setLoaded] = useState(false);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [activeCertificate, setActiveCertificate] =
        useState<Certificate | null>(null);
    const [activeMedia, setActiveMedia] = useState<string | null>(null);
    const techSkills = skills.tech ?? [];
    const hardSkills = skills.hard ?? [];
    const softSkills = skills.soft ?? [];
    const pathCount = experiences.length;
    const stats = [
        { label: "Projects", value: formatCount(projects.length) },
        {
            label: "Core skills",
            value: formatCount(
                techSkills.length + hardSkills.length + softSkills.length,
            ),
        },
        { label: "Certificates", value: formatCount(certificates.length) },
        { label: "Experience", value: formatCount(pathCount) },
    ];
    const heroImage = personal?.photo_url || "/dije.png";
    const hasQuote = Boolean(personal?.quote);
    const hasProjects = projects.length > 0;
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

    useEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        const clearSectionHash = () => {
            if (window.location.hash) {
                window.history.replaceState(
                    null,
                    "",
                    `${window.location.pathname}${window.location.search}`,
                );
            }
        };

        window.history.scrollRestoration = "manual";
        clearSectionHash();
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        const frame = window.requestAnimationFrame(() =>
            window.scrollTo({ top: 0, left: 0, behavior: "auto" }),
        );
        window.addEventListener("beforeunload", clearSectionHash);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("beforeunload", clearSectionHash);
            window.history.scrollRestoration = previousRestoration;
        };
    }, []);

    const activeProjectImages = useMemo(() => {
        if (!activeProject) return [];
        return Array.from(
            new Set(
                [activeProject.thumbnail_url].filter(
                    (source): source is string => Boolean(source),
                ),
            ),
        );
    }, [activeProject]);

    function openProject(project: Project) {
        setActiveCertificate(null);
        setActiveProject(project);
        setActiveMedia(project.thumbnail_url);
    }

    function openCertificate(certificate: Certificate) {
        setActiveProject(null);
        setActiveCertificate(certificate);
        setActiveMedia(certificate.image_url);
    }

    useEffect(() => {
        if (!loaded || !window.location.hash) return;
        const id = window.location.hash.slice(1);
        const timer = window.setTimeout(
            () =>
                document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "auto", block: "start" }),
            100,
        );
        return () => window.clearTimeout(timer);
    }, [loaded]);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0B0D0C] text-[#F1F3EF] selection:bg-[#FF3D00] selection:text-white">
            <LoadingScreen
                name={personal?.name || "Djibril Rangga Deja"}
                onComplete={() => setLoaded(true)}
            />
            <PortfolioCursor />
            <PortfolioAssistant />
            <Navbar personal={personal} visibleSections={visibleSections} />
            <GsapScrollAnimations />

            <main className="relative z-10 flex w-full flex-col pt-16">
                <HeroSection
                    personal={personal}
                    heroImage={heroImage}
                    stats={stats}
                    projectCount={projects.length}
                    primarySection={
                        hasProjects ? "projects" : hasSkills ? "skills" : null
                    }
                    hasContact={contacts.length > 0}
                    loaded={loaded}
                />
                <ProjectsSection
                    projects={projects}
                    onSelectProject={openProject}
                />
                <SkillsSection skills={skills} />
                <CertificatesSection
                    certificates={certificates}
                    onSelectCertificate={openCertificate}
                />
                <div className="relative border-b border-white/[0.12] bg-[#101211] px-4 sm:px-6 lg:px-8">
                    <div className="surface-grid pointer-events-none absolute inset-0 opacity-30" />
                    <div className="relative mx-auto grid w-full max-w-7xl items-stretch lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10">
                        <ExperienceSection experiences={experiences} />
                        <div className="grid min-w-0 content-start border-t border-white/[0.12] lg:border-l lg:border-t-0 lg:pl-10">
                            {hasQuote && <QuoteSection personal={personal} />}
                            <ContactSection
                                contacts={contacts}
                                status={personal?.status}
                            />
                        </div>
                    </div>
                </div>
                <FooterSection personal={personal} contacts={contacts} />
            </main>

            <PortfolioModal
                show={Boolean(activeProject)}
                onClose={() => {
                    setActiveProject(null);
                    setActiveMedia(null);
                }}
                title={activeProject?.title || "Project"}
                maxWidth="5xl"
            >
                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="min-w-0 space-y-3">
                        <div className="overflow-hidden rounded-[12px] border border-[#2A2A2A] bg-[#131313]">
                            {activeMedia ? (
                                <img
                                    src={activeMedia}
                                    alt={
                                        activeProject?.title || "Project image"
                                    }
                                    className="h-[320px] w-full object-cover sm:h-[420px]"
                                />
                            ) : (
                                <div className="flex h-[320px] w-full items-center justify-center text-sm text-[#888888] sm:h-[420px]">
                                    No project image is available yet.
                                </div>
                            )}
                        </div>
                        {activeProjectImages.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {activeProjectImages.map((source, index) => (
                                    <button
                                        type="button"
                                        key={`${source}-${index}`}
                                        onClick={() => setActiveMedia(source)}
                                        className={`h-16 w-24 shrink-0 overflow-hidden rounded-[12px] border bg-[#131313] transition ${source === activeMedia ? "border-[#FF3D00]/70" : "border-[#2A2A2A] hover:border-[#FF3D00]/40"}`}
                                    >
                                        <img
                                            src={source}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {(activeProject?.tags || []).map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded-full border border-[#2A2A2A] bg-[#1C1C1C] px-3 py-1 font-mono text-xs text-[#F5F5F5]"
                                >
                                    {tag.tag}
                                </span>
                            ))}
                        </div>
                        <div className="font-mono text-xs text-[#888888]">
                            {[
                                activeProject?.category,
                                activeProject?.year || "Now",
                            ]
                                .filter(Boolean)
                                .join(" / ")}
                        </div>
                        <p className="break-words text-sm leading-7 text-gray-300">
                            {activeProject?.description ||
                                "No description is available yet."}
                        </p>
                        {activeProject?.demo_url && (
                            <a
                                href={activeProject.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mr-2 inline-flex items-center gap-2 rounded-[12px] border border-[#FF3D00] px-4 py-2 text-sm font-semibold text-[#FF6B35] transition hover:bg-[#FF3D00] hover:text-white"
                            >
                                Open project{" "}
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                        {activeProject?.repo_url && (
                            <a
                                href={activeProject.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-[12px] border border-[#2A2A2A] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-[#FF3D00]/40 hover:text-white"
                            >
                                Repository <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>
            </PortfolioModal>

            <PortfolioModal
                show={Boolean(activeCertificate)}
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
                                No certificate image is available yet.
                            </div>
                        )}
                    </div>
                    {(activeCertificate?.issuer ||
                        activeCertificate?.credential_id) && (
                        <div className="rounded-[12px] border border-[#2A2A2A] bg-[#131313] p-4">
                            {activeCertificate.issuer && (
                                <div className="text-sm text-gray-200">
                                    <span className="font-mono text-xs text-[#888888]">
                                        Issuer
                                    </span>
                                    <div className="mt-1 break-words font-semibold">
                                        {activeCertificate.issuer}
                                    </div>
                                </div>
                            )}
                            {activeCertificate.credential_id && (
                                <div className="mt-3 text-sm text-gray-200">
                                    <span className="font-mono text-xs text-[#888888]">
                                        Credential
                                    </span>
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
                            Buka kredensial <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </PortfolioModal>
        </div>
    );
}
