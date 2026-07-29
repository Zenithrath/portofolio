"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type MutationRunner = (task: () => Promise<void>, successMessage: string) => Promise<void>;

export function getSupabaseOrThrow(): SupabaseClient {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Periksa environment variable aplikasi.");
  }
  return supabase;
}

export function throwIfError(result: { error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
}

export function asNullable(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function asNumber(value: string | number | null | undefined, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function splitTags(value: string) {
  return Array.from(new Set(value.split(/[,\n]/).map((tag) => tag.trim()).filter(Boolean))).slice(0, 20);
}

function storagePath(value: string | null | undefined) {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return value.replace(/^\/+/, "");
  const marker = "/storage/v1/object/public/portfolio/";
  const index = value.indexOf(marker);
  return index >= 0 ? decodeURIComponent(value.slice(index + marker.length)) : null;
}

function safeFilename(file: File) {
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48) || "file";
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `${base}-${crypto.randomUUID()}.${extension}`;
}

export async function uploadPortfolioFile(file: File, folder: string, previousValue?: string | null, maximumSize = 10 * 1024 * 1024) {
  if (file.size > maximumSize) throw new Error(`Ukuran file maksimal ${Math.round(maximumSize / 1024 / 1024)} MB.`);
  const supabase = getSupabaseOrThrow();
  const path = `${folder}/${safeFilename(file)}`;
  const upload = await supabase.storage.from("portfolio").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: false,
  });
  throwIfError(upload);

  const previousPath = storagePath(previousValue);
  if (previousPath && previousPath !== path) {
    await supabase.storage.from("portfolio").remove([previousPath]);
  }

  return path;
}

export async function removePortfolioFile(value: string | null | undefined) {
  const path = storagePath(value);
  if (!path) return;
  const result = await getSupabaseOrThrow().storage.from("portfolio").remove([path]);
  throwIfError(result);
}

export async function refreshPublicPortfolio() {
  const response = await fetch("/api/portfolio/revalidate", { method: "POST", credentials: "same-origin" });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || "Data tersimpan, tetapi cache portofolio belum dapat diperbarui.");
  }
}
