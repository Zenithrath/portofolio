import { gsap, ScrollTrigger, SplitText } from "./gsapSetup";

// Reveal element on scroll with fade up
export function scrollReveal(el, options = {}) {
    const {
        y = 60,
        duration = 1,
        delay = 0,
        ease = "power3.out",
        start = "top 85%",
        stagger = 0,
    } = options;

    gsap.set(el, { y, opacity: 0 });

    return gsap.to(el, {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease,
        stagger,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });
}

// Reveal children with stagger
export function staggerReveal(parent, childrenSelector, options = {}) {
    const {
        y = 50,
        duration = 0.8,
        stagger = 0.12,
        ease = "power3.out",
        start = "top 80%",
    } = options;

    const children = parent.querySelectorAll(childrenSelector);
    if (!children.length) return null;

    gsap.set(children, { y, opacity: 0 });

    return gsap.to(children, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
            trigger: parent,
            start,
            toggleActions: "play none none none",
        },
    });
}

// Split text animation - letters reveal
export function splitTextReveal(el, options = {}) {
    const {
        duration = 0.6,
        stagger = 0.03,
        ease = "power3.out",
        start = "top 85%",
        y = 40,
    } = options;

    const split = new SplitText(el, { type: "chars,words" });
    gsap.set(split.chars, { y, opacity: 0 });

    gsap.to(split.chars, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });

    return split;
}

// Split text - lines reveal
export function splitLinesReveal(el, options = {}) {
    const {
        duration = 0.9,
        stagger = 0.15,
        ease = "power3.out",
        start = "top 85%",
        y = 50,
    } = options;

    const split = new SplitText(el, { type: "lines" });
    gsap.set(split.lines, { y, opacity: 0 });

    gsap.to(split.lines, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });

    return split;
}

// Horizontal parallax on scroll
export function scrollParallax(el, options = {}) {
    const {
        speed = 0.3,
        direction = "y",
        start = "top bottom",
        end = "bottom top",
    } = options;

    const distance = speed * 100;

    return gsap.to(el, {
        [direction]: direction === "y" ? -distance : distance,
        ease: "none",
        scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 1.5,
        },
    });
}

// Scale in on scroll
export function scaleReveal(el, options = {}) {
    const {
        scale = 0.85,
        duration = 1,
        ease = "power3.out",
        start = "top 85%",
    } = options;

    gsap.set(el, { scale, opacity: 0 });

    return gsap.to(el, {
        scale: 1,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });
}

// Horizontal slide in from side
export function slideIn(el, options = {}) {
    const {
        x = -80,
        duration = 1,
        ease = "power3.out",
        start = "top 85%",
    } = options;

    gsap.set(el, { x, opacity: 0 });

    return gsap.to(el, {
        x: 0,
        opacity: 1,
        duration,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });
}

// Draw line animation (for decorative lines)
export function drawLine(el, options = {}) {
    const {
        duration = 1.2,
        ease = "power2.inOut",
        start = "top 90%",
    } = options;

    gsap.set(el, { scaleX: 0, transformOrigin: "left center" });

    return gsap.to(el, {
        scaleX: 1,
        duration,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
    });
}

// Counter animation (numbers)
export function animateCounter(el, options = {}) {
    const {
        end = 0,
        duration = 2,
        ease = "power2.out",
        start = "top 85%",
    } = options;

    const obj = { val: 0 };

    return gsap.to(obj, {
        val: end,
        duration,
        ease,
        scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
        },
        onUpdate: () => {
            el.textContent = String(Math.round(obj.val)).padStart(2, "0") + "+";
        },
    });
}

// Pin section while scrolling
export function pinSection(el, options = {}) {
    const {
        end = "+=200",
        pin = true,
    } = options;

    return ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end,
        pin,
    });
}
