import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const DEFAULT_GLOW_COLOR = "255, 61, 0";

const createParticleElement = (x, y, color) => {
    const el = document.createElement("div");
    el.style.cssText = `
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: rgba(${color}, 1);
        box-shadow: 0 0 8px rgba(${color}, 0.9), 0 0 20px rgba(${color}, 0.5), 0 0 40px rgba(${color}, 0.2);
        pointer-events: none;
        z-index: 100;
        left: ${x}px;
        top: ${y}px;
    `;
    return el;
};

export default function MagicBento({
    children,
    className = "",
    style,
    glowColor = DEFAULT_GLOW_COLOR,
    particleCount = 8,
    enableTilt = true,
    enableMagnetism = true,
    enableStars = true,
    clickEffect = true,
    disableAnimations = false,
}) {
    const cardRef = useRef(null);
    const particlesRef = useRef([]);
    const timeoutsRef = useRef([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef([]);
    const particlesInitialized = useRef(false);
    const magnetismRef = useRef(null);

    const initializeParticles = useCallback(() => {
        if (particlesInitialized.current || !cardRef.current) return;
        const { width, height } = cardRef.current.getBoundingClientRect();
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        );
        particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        magnetismRef.current?.kill();
        particlesRef.current.forEach((p) => {
            gsap.to(p, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.7)",
                onComplete: () => p.parentNode?.removeChild(p),
            });
        });
        particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
        if (!cardRef.current || !isHoveredRef.current) return;
        if (!particlesInitialized.current) initializeParticles();

        memoizedParticles.current.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
                if (!isHoveredRef.current || !cardRef.current) return;
                const clone = particle.cloneNode(true);
                cardRef.current.appendChild(clone);
                particlesRef.current.push(clone);

                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
                gsap.to(clone, {
                    x: (Math.random() - 0.5) * 80,
                    y: (Math.random() - 0.5) * 80,
                    rotation: Math.random() * 360,
                    duration: 2 + Math.random() * 2,
                    ease: "none",
                    repeat: -1,
                    yoyo: true,
                });
                gsap.to(clone, { opacity: 0.6, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
            }, index * 100);
            timeoutsRef.current.push(timeoutId);
        });
    }, [initializeParticles]);

    useEffect(() => {
        if (disableAnimations || !cardRef.current) return;
        const el = cardRef.current;

        const onEnter = () => {
            isHoveredRef.current = true;
            if (enableStars) animateParticles();
            if (enableTilt) gsap.to(el, { rotateX: 5, rotateY: 5, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
        };

        const onLeave = () => {
            isHoveredRef.current = false;
            clearAllParticles();
            glowEl.style.opacity = "0";
            if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
            if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
        };

        // Create border glow element
        const glowEl = document.createElement("div");
        glowEl.style.cssText = `
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            z-index: 2;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 1px;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
        `;
        el.appendChild(glowEl);

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            // Update border glow position
            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            glowEl.style.opacity = "1";
            glowEl.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(${glowColor}, 1) 0%, rgba(${glowColor}, 0.7) 20%, rgba(${glowColor}, 0.3) 40%, transparent 65%)`;

            if (enableTilt) {
                gsap.to(el, {
                    rotateX: ((y - cy) / cy) * -8,
                    rotateY: ((x - cx) / cx) * 8,
                    duration: 0.1,
                    ease: "power2.out",
                    transformPerspective: 1000,
                });
            }
            if (enableMagnetism) {
                magnetismRef.current = gsap.to(el, {
                    x: (x - cx) * 0.04,
                    y: (y - cy) * 0.04,
                    duration: 0.3,
                    ease: "power2.out",
                });
            }
        };

        const onClick = (e) => {
            if (!clickEffect) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const maxDist = Math.max(
                Math.hypot(x, y),
                Math.hypot(x - rect.width, y),
                Math.hypot(x, y - rect.height),
                Math.hypot(x - rect.width, y - rect.height)
            );

            const ripple = document.createElement("div");
            ripple.style.cssText = `
                position: absolute;
                width: ${maxDist * 2}px;
                height: ${maxDist * 2}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(${glowColor}, 0.6) 0%, rgba(${glowColor}, 0.3) 30%, transparent 70%);
                left: ${x - maxDist}px;
                top: ${y - maxDist}px;
                pointer-events: none;
                z-index: 1000;
            `;
            el.appendChild(ripple);
            gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("mousemove", onMove);
        el.addEventListener("click", onClick);

        return () => {
            isHoveredRef.current = false;
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("click", onClick);
            glowEl.remove();
            clearAllParticles();
        };
    }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, enableStars]);

    return (
        <div
            ref={cardRef}
            className={className}
            style={{ ...style, position: "relative", overflow: "hidden" }}
        >
            {children}
        </div>
    );
}
