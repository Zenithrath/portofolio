import { useState } from "react";

const navItems = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Proj" },
    { id: "skills", label: "Skill" },
    { id: "certificates", label: "Cert" },
    { id: "experience", label: "Exp" },
    { id: "contact", label: "Msg" },
];

export default function FloatingFlowerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const itemCount = navItems.length;
    const togglerSize = 48;
    const itemSize = 40;
    const radius = 85;
    const animDuration = 400;

    const scrollToSection = (id) => {
        setIsOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] md:hidden">
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu items in a circle */}
            <ul className="relative list-none p-0" style={{ width: 1, height: 1 }}>
                {navItems.map((item, index) => {
                    const angle = (360 / itemCount) * index - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x = Math.cos(rad) * radius;
                    const y = Math.sin(rad) * radius;

                    return (
                        <li
                            key={item.id}
                            className="absolute transition-all"
                            style={{
                                width: itemSize,
                                height: itemSize,
                                left: -itemSize / 2,
                                top: -itemSize / 2,
                                transform: isOpen
                                    ? `translate(${x}px, ${y}px) scale(1)`
                                    : "translate(0, 0) scale(0)",
                                opacity: isOpen ? 1 : 0,
                                transitionDuration: `${animDuration}ms`,
                                transitionDelay: isOpen ? `${index * 40}ms` : `${(itemCount - index) * 30}ms`,
                                transitionTimingFunction: isOpen ? "cubic-bezier(0.34, 1.56, 0.64, 1)" : "ease-in",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => scrollToSection(item.id)}
                                className="flex h-full w-full items-center justify-center rounded-full border border-white/[0.15] bg-[#FF3D00] font-mono text-[9px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FF3D00]/30 transition-all duration-200 hover:scale-110 hover:bg-[#FF6B35] active:scale-95"
                            >
                                {item.label}
                            </button>
                        </li>
                    );
                })}
            </ul>

            {/* Toggler button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center rounded-full border border-white/[0.15] bg-[#FF3D00] text-white shadow-xl shadow-[#FF3D00]/40 transition-all duration-300 hover:bg-[#FF6B35] active:scale-95"
                style={{ width: togglerSize, height: togglerSize }}
            >
                <span className="relative flex flex-col items-center justify-center" style={{ width: 20, height: 20 }}>
                    <span
                        className="absolute bg-current transition-all duration-300"
                        style={{
                            width: 16,
                            height: 2,
                            top: isOpen ? "50%" : "25%",
                            left: "50%",
                            transform: isOpen
                                ? "translate(-50%, -50%) rotate(45deg)"
                                : "translate(-50%, -50%) rotate(0deg)",
                        }}
                    />
                    <span
                        className="absolute bg-current transition-all duration-300"
                        style={{
                            width: 16,
                            height: 2,
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            opacity: isOpen ? 0 : 1,
                        }}
                    />
                    <span
                        className="absolute bg-current transition-all duration-300"
                        style={{
                            width: 16,
                            height: 2,
                            top: isOpen ? "50%" : "75%",
                            left: "50%",
                            transform: isOpen
                                ? "translate(-50%, -50%) rotate(-45deg)"
                                : "translate(-50%, -50%) rotate(0deg)",
                        }}
                    />
                </span>
            </button>
        </div>
    );
}
