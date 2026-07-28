import React from "react";

const EducationItem = ({ school, degree, year }) => (
    <div className="border-l-2 border-orange-500/30 pl-5 relative">
        {/* Bulatan pada timeline */}
        <div className="absolute top-1 left-[-7px] w-3 h-3 bg-neutral-950 border-2 border-orange-400 rounded-full"></div>

        <h4 className="text-base font-semibold text-neutral-200">{school}</h4>
        <p className="text-sm text-orange-400 font-medium">{degree}</p>
        <span className="text-xs text-neutral-600 mt-1 block">{year}</span>
    </div>
);

export default function EducationCard() {
    const educationData = [
        {
            school: "Universitas Brawijaya",
            degree: "Vokasi Teknologi Informasi",
            year: "2022 - 2025",
        },
        {
            school: "Brawijaya Development Community",
            degree: "Web Development Bootcamp",
            year: "2023",
        },
        {
            school: "Laravel Indonesia",
            degree: "Laravel Professional Certification",
            year: "2024",
        },
    ];

    return (
        <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-xl space-y-8">
            <h3 className="text-lg font-semibold text-neutral-200 tracking-tight">
                Education & Certificates
            </h3>
            <div className="space-y-8">
                {educationData.map((item, index) => (
                    <EducationItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
}
