import { useEffect } from "react";
import { gsap } from "../utils/gsapSetup";

export default function GsapScrollAnimations() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const ctx = gsap.context(() => {
            const revealElements = document.querySelectorAll(".gsap-reveal");

            revealElements.forEach((element) => {
                gsap.fromTo(
                    element,
                    { autoAlpha: 0, y: 16 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.72,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 90%",
                            once: true,
                            invalidateOnRefresh: true,
                        },
                    },
                );
            });

            const staggerGroups = document.querySelectorAll(
                ".gsap-stagger-group",
            );
            staggerGroups.forEach((group) => {
                const children = group.querySelectorAll(".gsap-stagger-item");
                if (!children.length) return;

                gsap.fromTo(
                    children,
                    { autoAlpha: 0, y: 12 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.58,
                        stagger: 0.05,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: group,
                            start: "top 90%",
                            once: true,
                            invalidateOnRefresh: true,
                        },
                    },
                );
            });
        });

        return () => ctx.revert();
    }, []);

    return null;
}
