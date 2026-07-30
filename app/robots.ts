import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://djibril-rangga.vercel.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/dashboard", "/auth", "/api/"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
