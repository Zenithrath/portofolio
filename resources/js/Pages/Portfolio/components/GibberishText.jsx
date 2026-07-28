import { useEffect, useRef, useState } from "react";

function Letter({ letter, delay = 0, active }) {
    const [display, setDisplay] = useState(letter.toUpperCase());

    useEffect(() => {
        setDisplay(letter.toUpperCase());
        if (!active) return undefined;

        let interval;
        const timer = setTimeout(() => {
            let count = Math.floor(Math.random() * 8) + 4;
            interval = setInterval(() => {
                setDisplay(
                    String.fromCharCode(Math.floor(Math.random() * 26) + 65),
                );
                count--;
                if (count === 0) {
                    setDisplay(letter.toUpperCase());
                    clearInterval(interval);
                }
            }, 40);
        }, delay);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [active, delay, letter]);

    return <span>{display}</span>;
}

export default function GibberishText({
    text,
    className = "",
    as: Tag = "span",
    stagger = 50,
    active = true,
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !active) {
            setVisible(false);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [active]);

    return (
        <Tag ref={ref} className={className}>
            {text.split("").map((char, i) => {
                if (char === " ") return <span key={i}>&nbsp;</span>;
                return (
                    <Letter
                        key={i}
                        letter={char}
                        active={active && visible}
                        delay={i * stagger}
                    />
                );
            })}
        </Tag>
    );
}
