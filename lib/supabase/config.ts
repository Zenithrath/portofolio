const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseConfig() {
  if (!url || !key || url.includes("your-project") || key.includes("your-anon")) {
    return null;
  }

  return { url, key };
}

export const supabaseConfigured = Boolean(getSupabaseConfig());
