import { useEffect } from "react";
import { gsap } from "../utils/gsapSetup";

export default function GsapMicroInteractions() {
    useEffect(() => {
        // Magnetic hover effect for nav links
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
            const handleMouseMove = (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(link, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.3,
                    ease: "power2.out",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                });
            };

            link.addEventListener("mousemove", handleMouseMove);
            link.addEventListener("mouseleave", handleMouseLeave);
        });

        // Scale effect for CTA buttons
        const ctaButtons = document.querySelectorAll(".cta-btn");
        ctaButtons.forEach((btn) => {
            const handleMouseEnter = () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)",
                });
            };

            btn.addEventListener("mouseenter", handleMouseEnter);
            btn.addEventListener("mouseleave", handleMouseLeave);
        });

        // Smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"], button[data-scroll-to]');
        anchorLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const targetId = link.getAttribute("href") || link.dataset.scrollTo;
                if (!targetId) return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();
                gsap.to(window, {
                    scrollTo: { y: target, offsetY: 80 },
                    duration: 1,
                    ease: "power3.inOut",
                });
            });
        });

        // Hover effect for project cards
        const projectCards = document.querySelectorAll(".project-card");
        projectCards.forEach((card) => {
            const handleMouseEnter = () => {
                gsap.to(card, {
                    y: -8,
                    duration: 0.4,
                    ease: "power2.out",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)",
                });
            };

            card.addEventListener("mouseenter", handleMouseEnter);
            card.addEventListener("mouseleave", handleMouseLeave);
        });

        // Hover effect for skill pills
        const pills = document.querySelectorAll(".skill-pill");
        pills.forEach((pill) => {
            const handleMouseEnter = () => {
                gsap.to(pill, {
                    scale: 1.08,
                    y: -2,
                    duration: 0.3,
                    ease: "back.out(2)",
                });
            };

            const handleMouseLeave = () => {
                gsap.to(pill, {
                    scale: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "elastic.out(1, 0.5)",
                });
            };

            pill.addEventListener("mouseenter", handleMouseEnter);
            pill.addEventListener("mouseleave", handleMouseLeave);
        });

        // Cleanup
        return () => {
            navLinks.forEach((link) => {
                link.removeEventListener("mousemove", () => {});
                link.removeEventListener("mouseleave", () => {});
            });
            ctaButtons.forEach((btn) => {
                btn.removeEventListener("mouseenter", () => {});
                btn.removeEventListener("mouseleave", () => {});
            });
        };
    }, []);

    return null;
}
