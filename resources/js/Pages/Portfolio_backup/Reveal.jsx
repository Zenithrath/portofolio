import React, { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "", delayMs = 0 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delayMs}ms` }}
            className={[
                "transition-all duration-700 ease-out will-change-transform",
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10",
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
