import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "[role='button']",
    "[data-cursor]",
].join(",");

export default function PortfolioCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        if (!cursorRef.current) {
            return undefined;
        }

        const cursor = cursorRef.current;
        let pulseTimer = null;
        let cursorActive = false;

        const activateCursor = () => {
            if (cursorActive) return;

            cursorActive = true;
            document.body.classList.add("portfolio-cursor-enabled");
        };

        const deactivateCursor = () => {
            cursorActive = false;
            cursor.style.opacity = "0";
            document.body.classList.remove("portfolio-cursor-enabled");
        };

        const updateInteractiveState = (target) => {
            const element = target instanceof Element ? target : null;
            cursor.dataset.interactive = element?.closest(INTERACTIVE_SELECTOR)
                ? "true"
                : "false";
        };

        const handleMove = (event) => {
            if (event.pointerType === "touch") {
                deactivateCursor();
                return;
            }

            activateCursor();
            cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
            cursor.style.opacity = "1";
            updateInteractiveState(event.target);
        };

        const handlePointerOver = (event) => {
            if (event.pointerType === "touch") return;
            updateInteractiveState(event.target);
        };
        const handlePointerDown = (event) => {
            if (event.pointerType === "touch") return;

            activateCursor();
            updateInteractiveState(event.target);
            cursor.dataset.pressed = "true";
            cursor.dataset.pulse = "false";
            window.requestAnimationFrame(() => {
                cursor.dataset.pulse = "true";
            });
            window.clearTimeout(pulseTimer);
            pulseTimer = window.setTimeout(() => {
                cursor.dataset.pulse = "false";
            }, 380);
        };
        const handlePointerUp = () => {
            cursor.dataset.pressed = "false";
        };
        const handleMouseOut = (event) => {
            if (!event.relatedTarget) {
                cursor.style.opacity = "0";
            }
        };

        window.addEventListener("pointermove", handleMove, { passive: true });
        document.addEventListener("pointerover", handlePointerOver, { passive: true });
        document.addEventListener("pointerdown", handlePointerDown, { passive: true });
        document.addEventListener("pointerup", handlePointerUp, { passive: true });
        document.addEventListener("mouseout", handleMouseOut, { passive: true });
        document.addEventListener("touchstart", deactivateCursor, { passive: true });
        window.addEventListener("blur", deactivateCursor);

        return () => {
            deactivateCursor();
            window.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerover", handlePointerOver);
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("mouseout", handleMouseOut);
            document.removeEventListener("touchstart", deactivateCursor);
            window.removeEventListener("blur", deactivateCursor);
            window.clearTimeout(pulseTimer);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            aria-hidden="true"
            className="portfolio-cursor"
            data-interactive="false"
            data-pressed="false"
            data-pulse="false"
        >
            <span className="portfolio-cursor__pulse" />
        </div>
    );
}
