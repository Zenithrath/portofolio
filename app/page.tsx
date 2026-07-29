import type { Metadata } from "next";
import PortfolioClient from "@/components/portfolio/PortfolioClient";
import { getPortfolioData } from "@/lib/portfolio-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { personal } = await getPortfolioData();
  const title = personal?.name ? `${personal.name} | Portfolio` : "Portfolio";
  const description = personal?.bio || "Portfolio modern yang memuat profil, karya, kemampuan, dan pengalaman.";

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
