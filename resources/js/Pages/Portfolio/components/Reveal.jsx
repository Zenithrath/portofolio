import React, { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        const node = ref.current;
        if (!node || visible) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={[
                "transition-all duration-700 ease-out will-change-transform",
                visible
                    ? "reveal-pop translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
