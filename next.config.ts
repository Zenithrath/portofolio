import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: supabaseHost
    ? {
        remotePatterns: [
          { protocol: "https", hostname: supabaseHost },
          { protocol: "https", hostname: "*.supabase.co" },
        ],
      }
    : undefined,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
