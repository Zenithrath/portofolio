"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import type { Personal } from "@/types/portfolio";
import { getSupabaseOrThrow, requireAffectedRows, uploadPortfolioFile, type MutationRunner } from "./admin-utils";
import { InputLabel, PanelFrame, PrimaryButton, inputClass, textareaClass } from "./PanelFrame";

type PersonalForm = {
  name: string; title: string; university: string; faculty: string; bio: string; tagline: string; location: string; quote: string; status: string;
};

const emptyForm: PersonalForm = { name: "", title: "", university: "", faculty: "", bio: "", tagline: "", location: "", quote: "", status: "Open to Work" };

function toForm(personal: Personal | null): PersonalForm {
  if (!personal) return emptyForm;
  return { name: personal.name, title: personal.title, university: personal.university, faculty: personal.faculty, bio: personal.bio, tagline: personal.tagline, location: personal.location, quote: personal.quote, status: personal.status };
}

export default function PersonalPanel({ personal, mutate, pending }: { personal: Personal | null; mutate: MutationRunner; pending: boolean }) {
  const [form, setForm] = useState<PersonalForm>(() => toForm(personal));
  const [photo, setPhoto] = useState<File | null>(null);

  function update<K extends keyof PersonalForm>(key: K, value: PersonalForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(async () => {
      const supabase = getSupabaseOrThrow();
      let photoPath = personal?.photo ?? null;
      if (photo) photoPath = await uploadPortfolioFile(photo, "profile", personal?.photo, 2 * 1024 * 1024);
      const payload = { ...form, photo: photoPath };
      const result = personal ? await supabase.from("personals").update(payload).eq("id", personal.id).select("id") : await supabase.from("personals").insert(payload).select("id");
      requireAffectedRows(result);
      setPhoto(null);
    }, "Profil berhasil diperbarui.");
  }

  return <PanelFrame eyebrow="01 / identity" title="Informasi personal" description="Data ini mengisi hero, metadata, footer, dan status ketersediaan pada portfolio publik.">
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2"><InputLabel label="Nama"><input required value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} /></InputLabel><InputLabel label="Title"><input required value={form.title} onChange={(event) => update("title", event.target.value)} className={inputClass} /></InputLabel><InputLabel label="Universitas"><input required value={form.university} onChange={(event) => update("university", event.target.value)} className={inputClass} /></InputLabel><InputLabel label="Fakultas / Institusi"><input required value={form.faculty} onChange={(event) => update("faculty", event.target.value)} className={inputClass} /></InputLabel><InputLabel label="Domisili"><input required value={form.location} onChange={(event) => update("location", event.target.value)} className={inputClass} /></InputLabel><InputLabel label="Status kerja"><input required value={form.status} onChange={(event) => update("status", event.target.value)} placeholder="Open to Work" className={inputClass} /></InputLabel></div>
      <InputLabel label="Tagline hero"><input required value={form.tagline} onChange={(event) => update("tagline", event.target.value)} className={inputClass} /></InputLabel>
      <InputLabel label="Biografi"><textarea required value={form.bio} onChange={(event) => update("bio", event.target.value)} maxLength={1500} className={textareaClass} /></InputLabel>
      <InputLabel label="Quote"><textarea required value={form.quote} onChange={(event) => update("quote", event.target.value)} maxLength={500} className={textareaClass} /></InputLabel>
      <div className="grid gap-4 border-t border-white/[0.1] pt-5 md:grid-cols-[minmax(0,1fr)_auto]"><InputLabel label="Foto profil"><input accept="image/jpeg,image/png,image/webp" type="file" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="block w-full text-sm text-white/55 file:mr-4 file:border-0 file:bg-white/[0.08] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#FF3D00]" />{photo && <p className="mt-2 text-xs text-[#FF8A65]">Akan mengunggah {photo.name}</p>}</InputLabel>{personal?.photo_url && <img src={personal.photo_url} alt="Foto profil saat ini" className="h-24 w-24 border border-white/[0.14] object-cover" />}</div>
      <PrimaryButton pending={pending}><Save className="h-4 w-4" />Simpan profil</PrimaryButton>
    </form>
  </PanelFrame>;
}
