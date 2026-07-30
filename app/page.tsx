import type { Metadata } from "next";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { getPortfolioData } from "@/lib/portfolio-data";

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://djibril-rangga.vercel.app";

// Public portfolio reads Supabase on every request so dashboard edits are visible immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
    const { personal } = await getPortfolioData();
    const title = personal?.name ? `${personal.name} | Portfolio` : "Portfolio";
    const description =
        personal?.bio ||
        "A portfolio featuring profile, selected work, skills, and experience.";

    return {
        title,
        description,
        alternates: { canonical: "/" },
        robots: { index: true, follow: true },
        openGraph: {
            title,
            description,
            type: "website",
            url: siteUrl,
            siteName: "Djibril Rangga Deja Portfolio",
            images: personal?.photo_url ? [personal.photo_url] : [],
        },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function Home() {
    const data = await getPortfolioData();
    const person = data.personal;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: person?.name || "Djibril Rangga Deja",
        url: siteUrl,
        jobTitle: person?.title || "AI Engineer and Automation Engineer",
        description: person?.bio,
        image: person?.photo_url ? [person.photo_url] : undefined,
        affiliation: person?.university
            ? { "@type": "CollegeOrUniversity", name: person.university }
            : undefined,
        address: person?.location
            ? { "@type": "PostalAddress", addressLocality: person.location }
            : undefined,
        sameAs: data.contacts
            .filter((contact) => /^https?:\/\//i.test(contact.value))
            .map((contact) => contact.value),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <PortfolioClient {...data} />
        </>
    );
}
