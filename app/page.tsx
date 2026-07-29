import type { Metadata } from "next";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { getPortfolioData } from "@/lib/portfolio-data";

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
        openGraph: {
            title,
            description,
            type: "website",
            images: personal?.photo_url ? [personal.photo_url] : [],
        },
    };
}

export default async function Home() {
    const data = await getPortfolioData();
    return <PortfolioClient {...data} />;
}
