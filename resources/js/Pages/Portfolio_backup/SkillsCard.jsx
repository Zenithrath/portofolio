import React from "react";

const ToolIcon = ({ name }) => (
    <div className="flex flex-col items-center gap-2 group">
        <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-orange-500/30 transition-colors duration-300 text-xl">
            {getToolIcon(name)}
        </div>
        <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
            {name}
        </span>
    </div>
);

const getToolIcon = (name) => {
    const icons = {
        React: "⚛️",
        Laravel: "🔴",
        Tailwind: "🎨",
        JavaScript: "✨",
        PHP: "🐘",
        MySQL: "🗄️",
        Git: "📦",
    };
    return icons[name] || "💻";
};

const LanguageProgress = ({ lang, proficiency }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400">{lang}</span>
            <span className="text-neutral-500 text-xs">{proficiency}%</span>
        </div>
        <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
                className="h-full bg-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${proficiency}%` }}
            ></div>
        </div>
    </div>
);

export default function SkillsCard() {
    const tools = [
        "React",
        "Laravel",
        "Tailwind",
        "JavaScript",
        "PHP",
        "MySQL",
        "Git",
    ];
    const languages = [
        { lang: "Indonesian", proficiency: 100 },
        { lang: "English", proficiency: 85 },
        { lang: "JavaScript/PHP", proficiency: 80 },
    ];

    return (
        <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-8 backdrop-blur-xl space-y-10 shadow-xl">
            {/* Bagian Tools */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-200 tracking-tight mb-6">
                    Tech Stack
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-6 justify-items-center">
                    {tools.map((tool) => (
                        <ToolIcon key={tool} name={tool} />
                    ))}
                </div>
            </div>

            {/* Bagian Proficiency */}
            <div className="space-y-6 border-t border-white/5 pt-8">
                <h3 className="text-lg font-semibold text-neutral-200 tracking-tight">
                    Proficiency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {languages.map((item) => (
                        <LanguageProgress key={item.lang} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
