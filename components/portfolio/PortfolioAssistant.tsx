"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { MessageCircle, Send, Sparkles, Trash2, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
const starter: Message = {
    role: "assistant",
    content:
        "Hi, I am Djibril. Ask me about my work, skills, education, or experience.",
};
const memoryKey = "djibril-portfolio-conversation-v3";
const maxRememberedMessages = 16;

function linkifyMessage(content: string): ReactNode {
    const parts = content.split(
        /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+|mailto:[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g,
    );

    return parts.map((part, index) => {
        const markdownLink = part.match(
            /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/,
        );
        if (markdownLink) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={markdownLink[2]}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-[#FF8A65] underline decoration-[#FF3D00]/70 underline-offset-2 transition hover:text-white"
                >
                    {markdownLink[1]}
                </a>
            );
        }
        if (/^mailto:/i.test(part)) {
            const email = part.replace(/^mailto:/i, "");
            return (
                <a
                    key={`${part}-${index}`}
                    href={`mailto:${email}`}
                    className="break-all text-[#FF8A65] underline decoration-[#FF3D00]/70 underline-offset-2 transition hover:text-white"
                >
                    {email}
                </a>
            );
        }
        if (/^https?:\/\//i.test(part)) {
            const href = part.replace(/[.,!?;:]+$/, "");
            return (
                <a
                    key={`${part}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-[#FF8A65] underline decoration-[#FF3D00]/70 underline-offset-2 transition hover:text-white"
                >
                    {part}
                </a>
            );
        }
        if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={`mailto:${part}`}
                    className="break-all text-[#FF8A65] underline decoration-[#FF3D00]/70 underline-offset-2 transition hover:text-white"
                >
                    {part}
                </a>
            );
        }
        return <span key={`${part}-${index}`}>{part}</span>;
    });
}

export default function PortfolioAssistant() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([starter]);
    const [pending, setPending] = useState(false);
    const [memoryReady, setMemoryReady] = useState(false);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(memoryKey) || "[]");
            if (Array.isArray(saved) && saved.length) {
                const valid = saved.filter(
                    (message): message is Message =>
                        message &&
                        (message.role === "user" ||
                            message.role === "assistant") &&
                        typeof message.content === "string" &&
                        message.content.trim(),
                );
                if (valid.length)
                    setMessages(valid.slice(-maxRememberedMessages));
            }
        } catch {
            localStorage.removeItem(memoryKey);
        } finally {
            setMemoryReady(true);
        }
    }, []);

    useEffect(() => {
        if (!memoryReady) return;
        localStorage.setItem(
            memoryKey,
            JSON.stringify(messages.slice(-maxRememberedMessages)),
        );
    }, [memoryReady, messages]);

    function clearMemory() {
        localStorage.removeItem(memoryKey);
        setMessages([starter]);
    }
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const question = input.trim();
        if (!question || pending) return;
        const next = [
            ...messages,
            { role: "user" as const, content: question },
        ];
        setMessages(next);
        setInput("");
        setPending(true);
        try {
            const response = await fetch("/api/portfolio-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: next }),
            });
            const payload = (await response.json()) as {
                answer?: string;
                error?: string;
            };
            if (!response.ok || !payload.answer)
                throw new Error(
                    payload.error ||
                        "I am unavailable right now. Please try again.",
                );
            setMessages((current) => [
                ...current,
                { role: "assistant", content: payload.answer! },
            ]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content:
                        error instanceof Error
                            ? error.message
                            : "I am unavailable right now. Please try again.",
                },
            ]);
        } finally {
            setPending(false);
        }
    }
    return (
        <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
            {open && (
                <section className="mb-3 flex h-[min(31rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[12px] border border-[#FF3D00]/55 bg-[#0D0F0E] shadow-[0_20px_60px_rgba(0,0,0,0.52)]">
                    <header className="flex items-center justify-between border-b border-white/[0.12] bg-[#121514] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#FF6B35]" />
                            <div>
                                <p className="font-['Syne'] text-sm font-bold text-white">
                                    Ask DJ
                                </p>
                                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
                                    Portfolio assistant
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={clearMemory}
                                aria-label="Clear saved conversation"
                                title="Clear saved conversation"
                                className="p-1.5 text-white/55 transition hover:text-[#FF6B35]"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close assistant"
                                className="p-1.5 text-white/55 transition hover:text-[#FF6B35]"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={`${message.role}-${index}`}
                                className={`min-w-0 max-w-[88%] break-words [overflow-wrap:anywhere] border px-3 py-2.5 text-sm leading-6 ${message.role === "user" ? "ml-auto border-[#FF3D00]/50 bg-[#FF3D00] text-white" : "border-white/[0.12] bg-white/[0.04] text-white/75"}`}
                            >
                                {linkifyMessage(message.content)}
                            </div>
                        ))}
                        {pending && (
                            <div className="w-fit border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                                Thinking...
                            </div>
                        )}
                    </div>
                    <form
                        onSubmit={submit}
                        className="flex gap-2 border-t border-white/[0.12] p-3"
                    >
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            maxLength={600}
                            placeholder="Ask about my work..."
                            className="h-10 min-w-0 flex-1 border border-white/[0.14] bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#FF3D00]"
                        />
                        <button
                            type="submit"
                            disabled={pending || !input.trim()}
                            aria-label="Send question"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-[#FF3D00] text-white transition hover:bg-[#FF6B35] disabled:opacity-40"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </section>
            )}
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label="Open portfolio assistant"
                className="inline-flex h-12 items-center gap-2 rounded-[10px] border border-[#FF6B35]/70 bg-[#121514] px-4 text-sm font-bold text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[#FF3D00]"
            >
                <MessageCircle className="h-4 w-4" />
                Ask DJ
            </button>
        </div>
    );
}
