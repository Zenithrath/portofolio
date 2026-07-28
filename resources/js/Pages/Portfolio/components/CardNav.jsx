import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./CardNav.css";

const ArrowIcon = () => (
    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17L17 7" />
        <path d="M7 7h10v10" />
    </svg>
);

export default function CardNav({
    links = [],
    ease = "power3.out",
    onNavigate,
}) {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        const cardCount = links.length;
        const cardH = 36;
        const gap = 5;
        const collapsedH = 44;
        const expandedH = collapsedH + gap + cardCount * (cardH + gap);

        gsap.set(navEl, { height: collapsedH, overflow: "hidden" });
        gsap.set(cardsRef.current, { x: -12, opacity: 0, scale: 0.9 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, { height: expandedH, duration: 0.35, ease });
        tl.to(cardsRef.current, { x: 0, opacity: 1, scale: 1, duration: 0.28, ease, stagger: 0.04 }, "-=0.1");

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;
        return () => {
            tl?.kill();
            tlRef.current = null;
        };
    }, [ease, links]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const handleLinkClick = (id) => {
        onNavigate?.(id);
        if (isExpanded) toggleMenu();
    };

    const setCardRef = (i) => (el) => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <nav
            ref={navRef}
            className={`card-nav-side ${isExpanded ? "open" : ""}`}
        >
            {/* Hamburger */}
            <div
                className={`card-nav-side-hamburger ${isHamburgerOpen ? "open" : ""}`}
                onClick={toggleMenu}
                role="button"
                aria-label={isExpanded ? "Close menu" : "Open menu"}
                tabIndex={0}
            >
                <div className="card-nav-side-line" />
                <div className="card-nav-side-line" />
            </div>

            {/* Cards — vertical */}
            <div className="card-nav-side-cards" aria-hidden={!isExpanded}>
                {links.map((link, idx) => (
                    <button
                        key={link.id}
                        ref={setCardRef(idx)}
                        className="card-nav-side-item"
                        onClick={() => handleLinkClick(link.id)}
                        style={{
                            backgroundColor: link.bgColor || "rgba(255,255,255,0.06)",
                            color: link.textColor || "#fff",
                        }}
                    >
                        <span className="card-nav-side-label">{link.label}</span>
                        <ArrowIcon />
                    </button>
                ))}
            </div>
        </nav>
    );
}
