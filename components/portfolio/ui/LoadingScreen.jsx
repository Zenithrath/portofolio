import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const INTRO_DURATION = 850;
const REVEAL_DURATION = 2150;
const DESKTOP_GRID = { columns: 58, rows: 34 };
const MOBILE_GRID = { columns: 36, rows: 50 };

export default function LoadingScreen({ onComplete, name = "Djibril Rangga Deja" }) {
    const [phase, setPhase] = useState("intro");
    const [isMobile, setIsMobile] = useState(false);
    const onCompleteRef = useRef(onComplete);
    const completedRef = useRef(false);
    const grid = isMobile ? MOBILE_GRID : DESKTOP_GRID;
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    const tiles = useMemo(() => {
        const longestPath = grid.columns + grid.rows - 2;

        return Array.from(
            { length: grid.columns * grid.rows },
            (_, index) => {
                const row = Math.floor(index / grid.columns);
                const column = index % grid.columns;
                const diagonalDistance = grid.columns - 1 - column + row;
                const ripple = ((row * 7 + column * 11) % 5) * 0.008;

                return {
                    id: index,
                    delay: `${(
                        (diagonalDistance / longestPath) * 1.28 + ripple
                    ).toFixed(3)}s`,
                };
            },
        );
    }, [grid.columns, grid.rows]);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 640px)");
        const syncViewport = () => setIsMobile(query.matches);

        syncViewport();
        query.addEventListener("change", syncViewport);
        return () => query.removeEventListener("change", syncViewport);
    }, []);

    useEffect(() => {
        const revealTimer = window.setTimeout(() => {
            setPhase("reveal");

            if (!completedRef.current) {
                completedRef.current = true;
                onCompleteRef.current?.();
            }
        }, INTRO_DURATION);
        const doneTimer = window.setTimeout(
            () => setPhase("done"),
            INTRO_DURATION + REVEAL_DURATION,
        );

        return () => {
            window.clearTimeout(revealTimer);
            window.clearTimeout(doneTimer);
        };
    }, []);

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="pixel-intro-screen fixed inset-0 z-[9999] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    style={{
                        backgroundColor: phase === "intro" ? "#0A0A0A" : "transparent",
                    }}
                >
                    <div
                        className="pixel-intro-grid absolute inset-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
                        }}
                    >
                        {tiles.map((tile) => (
                            <span
                                key={tile.id}
                                aria-hidden="true"
                                className={[
                                    "pixel-intro-tile",
                                    phase === "reveal" && "pixel-intro-tile--reveal",
                                ].filter(Boolean).join(" ")}
                                style={{ "--pixel-delay": tile.delay }}
                            />
                        ))}
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(90vw,58rem)] -translate-x-1/2 -translate-y-1/2">
                        <motion.p
                            data-intro={name}
                            aria-label={name}
                            className="intro-name text-center font-mono text-[clamp(1rem,3vw,1.85rem)] font-bold uppercase leading-none tracking-[0.16em]"
                            initial={{ opacity: 0, y: 10, scale: 0.985 }}
                            animate={phase === "intro"
                                ? { opacity: 1, y: 0, scale: 1 }
                                : { opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {nameParts.map((part, index) => (
                                <span
                                    key={`${part}-${index}`}
                                    className={index % 2 === 1 ? "text-[#FF3D00]" : "text-white"}
                                >
                                    {index > 0 && " "}
                                    {part}
                                </span>
                            ))}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
