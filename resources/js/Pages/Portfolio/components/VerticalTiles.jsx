import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function VerticalTiles({
    tileClassName = "bg-white",
    minTileWidth = 32,
    animationDuration = 0.5,
    animationDelay = 1,
    stagger = 0.05,
    active = true,
    onComplete,
}) {
    const [tiles, setTiles] = useState([]);
    const [hidden, setHidden] = useState(false);
    const containerRef = useRef(null);

    const calculateTiles = useCallback(() => {
        if (containerRef.current) {
            const { offsetWidth: width } = containerRef.current;
            const tileCount = Math.max(3, Math.floor(width / minTileWidth));
            const tileWidth = width / tileCount + 1;

            const newTiles = Array.from(
                { length: tileCount },
                (_, index) => ({
                    id: index,
                    width: tileWidth,
                    order: Math.abs(index - Math.floor((tileCount - 1) / 2)),
                }),
            );

            setTiles(newTiles);
        }
    }, [minTileWidth]);

    useEffect(() => {
        calculateTiles();
        const resizeObserver = new ResizeObserver(calculateTiles);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [calculateTiles]);

    // Hide container AFTER all tiles are fully below viewport
    useEffect(() => {
        if (!active || tiles.length === 0) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduceMotion) {
            setHidden(true);
            onComplete?.();
            return;
        }

        const maxOrder = Math.max(...tiles.map((t) => t.order));
        // Wait until last tile is 100% below container, then hide instantly
        const totalMs = (animationDelay + maxOrder * stagger + animationDuration) * 1000 + 50;

        const timer = setTimeout(() => {
            setHidden(true);
            onComplete?.();
        }, totalMs);

        return () => clearTimeout(timer);
    }, [active, tiles, animationDelay, stagger, animationDuration, onComplete]);

    if (hidden) return null;

    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
        >
            {tiles.map((tile) => (
                <motion.div
                    key={tile.id}
                    className={tileClassName}
                    style={{
                        width: tile.width,
                        position: "absolute",
                        left: `${(tile.id * 100) / tiles.length}%`,
                        top: 0,
                        height: "100%",
                    }}
                    initial={{ y: 0 }}
                    animate={active ? { y: "100%" } : { y: 0 }}
                    transition={{
                        duration: animationDuration,
                        delay: animationDelay + tile.order * stagger,
                        ease: [0.45, 0, 0.55, 1],
                    }}
                />
            ))}
        </div>
    );
}
