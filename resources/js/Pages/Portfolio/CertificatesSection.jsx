import React from "react";
import CertificateSwiper from "@/Components/CertificateSwiper";
import { Award } from "lucide-react";
import Reveal from "./components/Reveal";

export default function CertificatesSection({
    certificates,
    onSelectCertificate,
}) {
    const list = certificates || [];

    return (
        <section
            id="certificates"
            className="relative overflow-hidden border-b border-white/[0.12] bg-[#0D0D0D] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16"
        >
            <div className="surface-grid pointer-events-none absolute inset-0 opacity-35" />
            <Reveal className="relative mx-auto max-w-7xl space-y-6 sm:space-y-8">
                <div className="grid gap-5 border-b border-white/[0.12] pb-6 lg:grid-cols-[minmax(11rem,0.24fr)_minmax(0,0.76fr)] lg:items-end lg:gap-10">
                    <div className="gsap-reveal flex items-start gap-3 lg:flex-col lg:gap-5">
                        <div className="flex items-center gap-3">
                            <Award className="h-3.5 w-3.5 text-[#FF6B35]" />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B35]">
                                03 / Credentials
                            </p>
                        </div>
                        <span
                            aria-hidden="true"
                            className="hidden font-['Bebas_Neue'] text-6xl leading-none tracking-[0.04em] text-white/[0.08] lg:block"
                        >
                            03
                        </span>
                    </div>

                    <div className="gsap-reveal border-l border-white/[0.14] pl-5 sm:pl-6 lg:pb-1 lg:pl-8">
                        <h2 className="text-[1.7rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-4xl">
                            Sertifikasi
                            <br />
                            <span className="text-[#FF3D00]">& Lisensi</span>
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                            Rekam jejak belajar dari kelas, pelatihan, dan sertifikasi
                            yang memperluas cara saya melihat pekerjaan teknis.
                        </p>

                        {list.length > 0 && (
                            <div className="mt-4 grid max-w-2xl gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
                                {[
                                    {
                                        value: String(list.length || 0).padStart(2, "0"),
                                        label: "Total",
                                    },
                                    {
                                        value: String(
                                            new Set(list.map((c) => c.issuer).filter(Boolean)).size || 0,
                                        ).padStart(2, "0"),
                                        label: "Penerbit",
                                    },
                                    {
                                        value: String(
                                            list.filter((c) => c.credential_url).length || 0,
                                        ).padStart(2, "0"),
                                        label: "Verified",
                                    },
                                ].map(({ value, label }, index) => (
                                    <div
                                        key={label}
                                        className={[
                                            "cert-stat border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] sm:px-5 sm:py-4",
                                            index === 1 ? "sm:translate-y-3" : "",
                                        ].join(" ")}
                                    >
                                        <div className="mb-3 h-px w-10 bg-[#FF3D00]/70" />
                                        <p className="font-['Syne'] text-xl font-extrabold text-white sm:text-2xl">
                                            {value}
                                        </p>
                                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:ml-[16%]">
                    <CertificateSwiper
                        certificates={list}
                        onSelect={
                            list.length > 0
                                ? (item) => {
                                      const original = list.find((cert) => cert.id === item.id);
                                      if (original && onSelectCertificate) {
                                          onSelectCertificate(original);
                                      }
                                  }
                                : undefined
                        }
                    />
                </div>
            </Reveal>
        </section>
    );
}
