import { createBrowserClient } from "@supabase/ssr";

let browserClient;

function usableEnv(value) {
    return value && !String(value).includes("${") ? value : "";
}

/**
 * Browser client for optional Supabase-powered dashboard features.
 * Portfolio content remains server-rendered by Laravel/Eloquent.
 */
export function supabaseBrowser(config = {}) {
    if (browserClient) return browserClient;

    const url = usableEnv(config.url) || usableEnv(import.meta.env.VITE_SUPABASE_URL);
    const key =
        usableEnv(config.anonKey) ||
        usableEnv(config.publishableKey) ||
        usableEnv(import.meta.env.VITE_SUPABASE_ANON_KEY) ||
        usableEnv(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    if (!url || !key) return null;

    browserClient = createBrowserClient(url, key);
    return browserClient;
}
