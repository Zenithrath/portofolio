import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://djibril-rangga.vercel.app";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Djibril Rangga Deja | Portfolio",
        template: "%s | Djibril Rangga Deja",
    },
    description:
        "Djibril Rangga Deja is an Information Technology student at Universitas Brawijaya focused on AI engineering, workflow automation, and practical digital products.",
    applicationName: "Djibril Rangga Deja Portfolio",
    creator: "Djibril Rangga Deja",
    verification: {
        google: "GjrR4z1xGp9nSxeH0cZCnzHOfRIJGtHbG3x-BG5oKu8",
    },
    keywords: [
        "Djibril Rangga Deja",
        "AI engineer",
        "automation engineer",
        "n8n automation",
        "Information Technology student",
        "Universitas Brawijaya",
        "portfolio",
    ],
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: "Djibril Rangga Deja Portfolio",
        title: "Djibril Rangga Deja | AI Engineer and Automation Portfolio",
        description:
            "Explore Djibril's work across AI engineering, workflow automation, software projects, and technology.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Djibril Rangga Deja | AI Engineer and Automation Portfolio",
        description:
            "AI engineering, workflow automation, and practical digital products.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="flex min-h-full flex-col">{children}</body>
        </html>
    );
}
