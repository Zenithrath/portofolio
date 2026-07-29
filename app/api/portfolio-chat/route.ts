import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio-data";

type ChatMessage = { role: "user" | "assistant"; content: string };

function portfolioContext(data: Awaited<ReturnType<typeof getPortfolioData>>) {
    const personal = data.personal;
    return JSON.stringify({
        profile: personal && {
            name: personal.name,
            title: personal.title,
            bio: personal.bio,
            university: personal.university,
            faculty: personal.faculty,
            location: personal.location,
            status: personal.status,
        },
        projects: data.projects.map(
            ({ title, category, description, year, tags }) => ({
                title,
                category,
                description,
                year,
                tags: tags.map((tag) => tag.tag),
            }),
        ),
        skills: Object.fromEntries(
            Object.entries(data.skills).map(([category, items]) => [
                category,
                items.map((skill) => skill.name),
            ]),
        ),
        experiences: data.experiences.map(
            ({ category, company, position, description, location }) => ({
                category,
                company,
                position,
                description,
                location,
            }),
        ),
        certificates: data.certificates.map(({ title, issuer, year }) => ({
            title,
            issuer,
            year,
        })),
        contacts: data.contacts.map(({ platform, label, value }) => ({
            platform,
            label,
            value,
        })),
    });
}

export async function POST(request: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey)
        return NextResponse.json(
            { error: "Asisten belum dikonfigurasi." },
            { status: 503 },
        );

    const body = (await request.json().catch(() => null)) as {
        messages?: ChatMessage[];
    } | null;
    const messages = (body?.messages ?? [])
        .filter(
            (message) =>
                message &&
                (message.role === "user" || message.role === "assistant") &&
                typeof message.content === "string" &&
                message.content.trim(),
        )
        .slice(-8);
    const lastUserMessage = messages.at(-1);
    if (
        !lastUserMessage ||
        lastUserMessage.role !== "user" ||
        lastUserMessage.content.length > 600
    ) {
        return NextResponse.json(
            { error: "Kirim satu pertanyaan singkat tentang portfolio ini." },
            { status: 400 },
        );
    }

    const data = await getPortfolioData();
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": new URL(request.url).origin,
                "X-Title": "Djibril Portfolio Q&A",
            },
            body: JSON.stringify({
                model: "openrouter/free",
                max_tokens: 480,
                temperature: 0.55,
                messages: [
                    {
                        role: "system",
                        content: `Kamu adalah teman digital Djibril Rangga Deja di halaman portfolio pribadinya. Bicara dalam Bahasa Indonesia yang hangat, santai, gaul secukupnya, dan terasa seperti teman yang membantu. Boleh diajak seru-seruan, bercanda ringan, atau ngobrol singkat, tetapi jangan berlebihan dan tetap sopan. Untuk pertanyaan tentang Djibril, jawab hanya berdasarkan konteks JSON. Jika infonya belum ada, bilang dengan santai bahwa datanya belum tersedia dan arahkan untuk menghubungi Djibril. Jangan mengarang pengalaman, tautan, kontak, atau klaim. Jawab maksimal tiga paragraf pendek. Gunakan plain text saja: jangan gunakan Markdown, bullet list, emoji, ikon, atau karakter dekoratif seperti *, #, @, $, atau backtick. Konteks: ${portfolioContext(data)}`,
                    },
                    ...messages,
                ],
            }),
        },
    );

    const payload = (await response.json().catch(() => null)) as {
        choices?: { message?: { content?: string } }[];
        error?: { message?: string };
    } | null;
    if (!response.ok)
        return NextResponse.json(
            {
                error:
                    payload?.error?.message || "Asisten sedang tidak tersedia.",
            },
            { status: response.status },
        );
    const answer = payload?.choices?.[0]?.message?.content?.trim().replace(/[\\*#@$`]/g, "");
    if (!answer)
        return NextResponse.json(
            { error: "Asisten belum memberi jawaban. Coba lagi." },
            { status: 502 },
        );
    return NextResponse.json({ answer });
}
