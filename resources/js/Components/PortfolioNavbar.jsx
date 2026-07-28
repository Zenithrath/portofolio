import React from "react";

export default function PortfolioNavbar({ items, activeId, onSelect }) {
    return (
        <nav className="flex flex-wrap justify-center gap-2 rounded-full bg-black/70 border border-white/10 px-3 py-2 text-xs md:text-sm">
            {items.map((item) => {
                const isActive = item.id === activeId;

                return (
                    <a
                        key={item.id}
                        href={item.href}
                        onClick={() => onSelect(item.id)}
                        className={`px-4 py-2 rounded-full transition ${
                            isActive
                                ? "bg-white text-black"
                                : "text-gray-300 hover:text-white border border-white/10 hover:border-orange-500/60"
                        }`}
                    >
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
