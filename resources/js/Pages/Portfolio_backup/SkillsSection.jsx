import React from "react";
import Reveal from "./Reveal";

export default function SkillsSection({ skills }) {
    const tech = skills?.tech || [];
    const hard = skills?.hard || [];
    const soft = skills?.soft || [];

    return (
        <section
            id="skills"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F] border-t border-[#1C1C1C]"
        >
            <Reveal className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="text-left space-y-4">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                        Keahlian &{" "}
                        <span className="text-[#FF3D00]">Kompetensi</span>
                    </h2>
                    <div className="w-20 h-1 bg-[#FF3D00]"></div>
                </div>

                {/* Grid layout for skills sub-sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Tech Skills Grid: 4-8 columns */}
                    <div className="lg:col-span-12 space-y-6">
                        <h3 className="font-['Syne'] text-xl font-bold text-gray-300 uppercase tracking-widest border-b border-[#2A2A2A] pb-3">
                            🛠️ Tech Stack & Tools
                        </h3>
                        {tech.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                                {tech.map((skill, index) => (
                                    <div
                                        key={skill.id || index}
                                        className="group flex flex-col items-center justify-center p-4 bg-[#131313] border border-[#2A2A2A] rounded-2xl hover:border-[#FF3D00]/50 hover:shadow-[0_0_15px_rgba(255,61,0,0.05)] transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="w-12 h-12 mb-3 bg-[#1C1C1C] group-hover:bg-[#FF3D00] text-gray-300 group-hover:text-white rounded-xl flex items-center justify-center font-bold text-sm font-mono border border-[#2A2A2A] group-hover:border-transparent transition-all duration-300">
                                            {skill.icon ? (
                                                <span className="text-xl">
                                                    {skill.icon}
                                                </span>
                                            ) : (
                                                skill.name
                                                    .substring(0, 2)
                                                    .toUpperCase()
                                            )}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 group-hover:text-white text-center transition-colors">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Tidak ada tech skill yang ditambahkan.
                            </p>
                        )}
                    </div>

                    {/* Hard Skills Section (Progress bars) */}
                    <div className="lg:col-span-7 space-y-6">
                        <h3 className="font-['Syne'] text-xl font-bold text-gray-300 uppercase tracking-widest border-b border-[#2A2A2A] pb-3">
                            📈 Bidang Keahlian
                        </h3>
                        {hard.length > 0 ? (
                            <div className="space-y-5">
                                {hard.map((skill, index) => (
                                    <div
                                        key={skill.id || index}
                                        className="space-y-2"
                                    >
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-gray-300">
                                                {skill.name}
                                            </span>
                                            <span className="font-mono text-[#FF3D00]">
                                                {skill.proficiency}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-[#1C1C1C] rounded-full h-2.5 overflow-hidden border border-[#2A2A2A]">
                                            <div
                                                className="bg-gradient-to-r from-[#FF3D00] to-[#FF6B35] h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${skill.proficiency}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Tidak ada hard skill yang ditambahkan.
                            </p>
                        )}
                    </div>

                    {/* Soft Skills Section (Badges) */}
                    <div className="lg:col-span-5 space-y-6">
                        <h3 className="font-['Syne'] text-xl font-bold text-gray-300 uppercase tracking-widest border-b border-[#2A2A2A] pb-3">
                            💡 Soft Skills
                        </h3>
                        {soft.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {soft.map((skill, index) => (
                                    <span
                                        key={skill.id || index}
                                        className="bg-[#131313] border border-[#2A2A2A] text-gray-300 hover:border-[#FF3D00]/50 hover:text-white px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 cursor-default"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Tidak ada soft skill yang ditambahkan.
                            </p>
                        )}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
