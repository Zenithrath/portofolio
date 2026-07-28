import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export default function ThreeDCarousel({
    items = [],
    autoRotate = true,
    rotateInterval = 4000,
    cardHeight = 460,
    isMobileSwipe = true,
    onItemClick,
}) {
    const [active, setActive] = useState(0);
    const carouselRef = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const minSwipeDistance = 50;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.2 },
        );
        if (carouselRef.current) observer.observe(carouselRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!items.length || !autoRotate || !isInView || isHovering) return;
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % items.length);
        }, rotateInterval);
        return () => clearInterval(interval);
    }, [items.length, autoRotate, isInView, isHovering, rotateInterval]);

    useEffect(() => {
        if (active >= items.length) setActive(0);
    }, [active, items.length]);

    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };
    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (touchStart === null || touchEnd === null) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance)
            setActive((p) => (p + 1) % items.length);
        else if (distance < -minSwipeDistance)
            setActive((p) => (p - 1 + items.length) % items.length);
    };

    const getCardStyle = (index) => {
        if (index === active) return "translate-x-0 scale-100 opacity-100 z-20";
        if (index === (active + 1) % items.length)
            return "translate-x-[42%] scale-[0.88] opacity-50 z-10";
        if (index === (active - 1 + items.length) % items.length)
            return "-translate-x-[42%] scale-[0.88] opacity-50 z-10";
        return "scale-75 opacity-0 pointer-events-none";
    };

    if (!items.length) return null;

    return (
        <div
            ref={carouselRef}
            className="relative overflow-hidden rounded-[15px]"
            style={{
                height: `${cardHeight + 80}px`,
                background: "rgba(16, 21, 61, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                borderRadius: "15px",
                boxShadow:
                    "0 0.5px 0 1px rgba(255,255,255,0.23) inset, 0 1px 0 0 rgba(255,255,255,0.6) inset, 0 4px 16px rgba(0,0,0,0.12)",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={isMobileSwipe ? onTouchStart : undefined}
            onTouchMove={isMobileSwipe ? onTouchMove : undefined}
            onTouchEnd={isMobileSwipe ? onTouchEnd : undefined}
        >
            {/* ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 55% 55% at 85% 100%, rgba(255,61,0,0.15) 0%, transparent 60%)",
                }}
            />

            {/* Cards */}
            <div className="absolute inset-0 flex items-center justify-center">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute top-[20px] w-full max-w-sm transform-gpu transition-all duration-500 ease-out ${getCardStyle(index)}`}
                    >
                        <div
                            className={`group flex h-full flex-col overflow-hidden rounded-[16px] ${onItemClick ? "cursor-pointer" : ""}`}
                            style={{
                                height: `${cardHeight}px`,
                                // solid gelap — tidak transparan, teks tidak tembus
                                background: "#131620",
                                border: "1px solid rgba(255, 61, 0, 0.35)",
                                boxShadow:
                                    // glow oranye di luar
                                    "0 0 0 1px rgba(255,61,0,0.12), 0 0 20px rgba(255,61,0,0.18), 0 0 48px rgba(255,61,0,0.08), " +
                                    // shadow dalam gelap
                                    "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.40), " +
                                    "0 24px 48px rgba(0,0,0,0.55)",
                            }}
                            role={onItemClick ? "button" : undefined}
                            tabIndex={onItemClick ? 0 : undefined}
                            onClick={() => onItemClick?.(item)}
                            onKeyDown={(e) => {
                                if (
                                    !onItemClick ||
                                    (e.key !== "Enter" && e.key !== " ")
                                )
                                    return;
                                e.preventDefault();
                                onItemClick(item);
                            }}
                        >
                            {/* Image area */}
                            <div
                                className="relative flex-none overflow-hidden"
                                style={{
                                    height: "190px",
                                    backgroundImage: item.imageUrl
                                        ? `url(${item.imageUrl})`
                                        : undefined,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundColor: item.imageUrl
                                        ? undefined
                                        : "#0d1017",
                                    borderBottom:
                                        "1px solid rgba(255,61,0,0.20)",
                                }}
                            >
                                {/* scrim solid — cegah image tembus ke teks */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(13,16,23,0.75) 100%)",
                                    }}
                                />
                                {/* issuer overlay */}
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <p className="mb-1 text-[9px] font-mono font-bold uppercase tracking-[0.35em] text-white/50">
                                        Diterbitkan oleh
                                    </p>
                                    <h3
                                        className="text-lg font-extrabold leading-tight text-white"
                                        style={{
                                            fontFamily: "'Syne', sans-serif",
                                            textShadow:
                                                "0 2px 10px rgba(0,0,0,0.8)",
                                        }}
                                    >
                                        {item.brand}
                                    </h3>
                                </div>
                                {/* year badge */}
                                {item.tags?.[0] && (
                                    <span
                                        className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-mono font-semibold text-white"
                                        style={{
                                            background: "#1C1C1C",
                                            border: "1px solid rgba(255,61,0,0.30)",
                                            boxShadow:
                                                "0 0 8px rgba(255,61,0,0.15)",
                                        }}
                                    >
                                        {item.tags[0]}
                                    </span>
                                )}
                            </div>

                            {/* Divider glow */}
                            <div
                                style={{
                                    height: "1px",
                                    background:
                                        "linear-gradient(90deg, transparent, rgba(255,61,0,0.40), transparent)",
                                    boxShadow: "0 0 6px rgba(255,61,0,0.25)",
                                }}
                            />

                            {/* Body */}
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <div>
                                    <h3
                                        className="text-base font-bold leading-snug text-white"
                                        style={{
                                            fontFamily: "'Syne', sans-serif",
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {item.description}
                                    </p>
                                </div>

                                {item.tags?.length > 1 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.tags.slice(1).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="rounded-full px-2.5 py-1 text-[10px] font-mono text-gray-300"
                                                style={{
                                                    background: "#1C1C1C",
                                                    border: "1px solid #2A2A2A",
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto">
                                    {item.link && !onItemClick && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
                                            style={{
                                                background:
                                                    "rgba(255,61,0,0.15)",
                                                border: "1px solid rgba(255,61,0,0.40)",
                                                boxShadow:
                                                    "0 0 12px rgba(255,61,0,0.15)",
                                            }}
                                        >
                                            Lihat Sertifikat
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    {onItemClick && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onItemClick(item);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
                                            style={{
                                                background:
                                                    "rgba(255,61,0,0.15)",
                                                border: "1px solid rgba(255,61,0,0.40)",
                                                boxShadow:
                                                    "0 0 12px rgba(255,61,0,0.15)",
                                            }}
                                        >
                                            Preview
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Nav prev/next */}
            {!isMobile && items.length > 1 && (
                <>
                    {[
                        {
                            side: "left",
                            icon: <ChevronLeft className="h-5 w-5" />,
                            onClick: () =>
                                setActive(
                                    (p) =>
                                        (p - 1 + items.length) % items.length,
                                ),
                            label: "Previous",
                        },
                        {
                            side: "right",
                            icon: <ChevronRight className="h-5 w-5" />,
                            onClick: () =>
                                setActive((p) => (p + 1) % items.length),
                            label: "Next",
                        },
                    ].map(({ side, icon, onClick, label }) => (
                        <button
                            key={side}
                            type="button"
                            aria-label={label}
                            onClick={onClick}
                            className={`absolute top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all ${side === "left" ? "left-4" : "right-4"}`}
                            style={{
                                background: "#1C1C1C",
                                border: "1px solid rgba(255,61,0,0.30)",
                                boxShadow: "0 0 12px rgba(255,61,0,0.15)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#FF3D00";
                                e.currentTarget.style.borderColor = "#FF3D00";
                                e.currentTarget.style.boxShadow =
                                    "0 0 20px rgba(255,61,0,0.45)";
                                e.currentTarget.style.transform =
                                    "translateY(-50%) scale(0.96)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#1C1C1C";
                                e.currentTarget.style.borderColor =
                                    "rgba(255,61,0,0.30)";
                                e.currentTarget.style.boxShadow =
                                    "0 0 12px rgba(255,61,0,0.15)";
                                e.currentTarget.style.transform =
                                    "translateY(-50%) scale(1)";
                            }}
                        >
                            {icon}
                        </button>
                    ))}
                </>
            )}

            {/* Dots */}
            {items.length > 1 && (
                <div className="absolute bottom-5 left-0 right-0 z-30 flex items-center justify-center gap-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            aria-label={`Go to ${idx + 1}`}
                            onClick={() => setActive(idx)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: active === idx ? "18px" : "10px",
                                height: "10px",
                                background:
                                    active === idx
                                        ? "#FF3D00"
                                        : "rgba(255,255,255,0.25)",
                                boxShadow:
                                    active === idx
                                        ? "0 0 10px rgba(255,61,0,0.55)"
                                        : "none",
                                transition: "all 0.3s ease-in-out",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
