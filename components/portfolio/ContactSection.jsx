import React from "react";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    Camera,
    Code2,
    Link,
    Mail,
    MessageCircle,
} from "lucide-react";
import Reveal from "./ui/Reveal";

function getIcon(platform) {
    switch ((platform || "").toLowerCase()) {
        case "email":
            return Mail;
        case "linkedin":
            return BriefcaseBusiness;
        case "github":
            return Code2;
        case "whatsapp":
            return MessageCircle;
        case "instagram":
            return Camera;
        default:
            return Link;
    }
}

export default function ContactSection({ contacts, status }) {
    const list = contacts || [];

    return (
        <section id="contact" className="h-full py-7 sm:py-8 lg:py-10">
            <Reveal className="space-y-6">
                <div className="gsap-reveal space-y-3">
                    <p className="inline-flex border-l-2 border-[#FF3D00] pl-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/75">
                        Contact
                    </p>
                    <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                        Let&apos;s{" "}
                        <span className="text-[#FF3D00]">connect</span>
                    </h2>
                    <p className="max-w-lg text-sm leading-6 text-gray-300">
                        Reach out through any of the channels below.
                    </p>
                    {status && (
                        <div className="inline-flex max-w-full items-center gap-2 border border-[#FF3D00]/30 bg-[#FF3D00]/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#FF8A65]">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF3D00]" />
                            <span className="truncate">{status}</span>
                        </div>
                    )}
                </div>

                {list.length > 0 ? (
                    <div className="gsap-stagger-group flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
                        {list.map((contact) => {
                            const Icon = getIcon(contact.platform);

                            return (
                                <a
                                    key={contact.id}
                                    href={contact.value}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="card-grid-hover gsap-stagger-item group flex w-[78vw] shrink-0 snap-start items-center justify-between rounded-[10px] border border-white/[0.10] bg-[#121514] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#FF3D00]/45 sm:w-auto"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.08] text-white/80 transition group-hover:border-[#FF3D00]/45 group-hover:bg-[#FF3D00] group-hover:text-white">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                                {contact.platform}
                                            </p>
                                            <p className="mt-0.5 truncate text-sm font-bold text-white">
                                                {contact.label}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="ml-3 h-4 w-4 shrink-0 text-white/40 transition group-hover:text-[#FF6B35]" />
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    <div className="border-l-2 border-dashed border-[#FF3D00]/55 bg-white/[0.02] px-4 py-6 text-left">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF6B35]">
                            Contact details
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            Contact details will be available soon.
                        </p>
                    </div>
                )}
            </Reveal>
        </section>
    );
}
