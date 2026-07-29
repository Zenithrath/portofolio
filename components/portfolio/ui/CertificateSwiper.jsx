import React from "react";
import { Award, CalendarDays, ExternalLink, IdCard } from "lucide-react";

export default function CertificateSwiper({ certificates = [], onSelect }) {
    if (!certificates.length) {
        return (
            <div className="border-l-2 border-dashed border-[#FF3D00]/55 bg-white/[0.02] px-5 py-6 text-sm text-white/55">
                Certificates will appear here soon.
            </div>
        );
    }

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
            {certificates.map((certificate, index) => (
                <button
                    key={certificate.id || `${certificate.title}-${index}`}
                    type="button"
                    onClick={() => onSelect?.(certificate)}
                    className={[
                        "card-grid-hover group flex min-h-[168px] w-[78vw] shrink-0 snap-start flex-col rounded-[10px] border border-white/[0.12] bg-[#121514] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#FF3D00]/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] sm:min-h-[190px] sm:w-auto sm:p-5",
                        index % 3 === 1 ? "lg:translate-y-7" : "",
                        index % 3 === 2 ? "lg:translate-y-3" : "",
                    ].join(" ")}
                >
                    <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#FF3D00]/30 bg-[#FF3D00]/10 text-[#FF6B35]">
                            <Award className="h-4 w-4" />
                        </span>
                        {certificate.year && (
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                                {certificate.year}
                            </span>
                        )}
                    </div>

                    <h3 className="mt-4 line-clamp-2 font-['Syne'] text-[1.05rem] font-bold leading-tight text-white transition group-hover:text-[#FF8A65] sm:mt-5 sm:text-lg">
                        {certificate.title || "Untitled certificate"}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
                        {certificate.issuer || "Issuer not specified"}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/[0.10] pt-3 font-mono text-[10px] text-white/45 sm:pt-4">
                        {certificate.credential_id && (
                            <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
                                <IdCard className="h-3.5 w-3.5 shrink-0 text-[#FF6B35]" />
                                <span className="truncate">
                                    {certificate.credential_id}
                                </span>
                            </span>
                        )}
                        {!certificate.credential_id && certificate.year && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-[#FF6B35]" />
                                {certificate.year}
                            </span>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1.5 text-white/70">
                            View details
                            <ExternalLink className="h-3.5 w-3.5 text-[#FF6B35]" />
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}
