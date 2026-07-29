"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Skill, SkillCategory } from "@/types/portfolio";
import { asNumber, getSupabaseOrThrow, requireAffectedRows, type MutationRunner } from "./admin-utils";
import { EmptyState, InputLabel, PanelFrame, PrimaryButton, SecondaryButton, Toggle, inputClass, selectClass } from "./PanelFrame";

type SkillForm = { name: string; category: SkillCategory; icon: string; proficiency: string; sort_order: string; is_visible: boolean };
const blank: SkillForm = { name: "", category: "tech", icon: "", proficiency: "", sort_order: "0", is_visible: true };
const toForm = (skill: Skill): SkillForm => ({ name: skill.name, category: skill.category, icon: skill.icon ?? "", proficiency: skill.proficiency?.toString() ?? "", sort_order: skill.sort_order.toString(), is_visible: skill.is_visible });

export default function SkillsPanel({ skills, mutate, pending }: { skills: Skill[]; mutate: MutationRunner; pending: boolean }) {
  const [form, setForm] = useState<SkillForm>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const edit = (skill: Skill) => { setEditingId(skill.id); setForm(toForm(skill)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const reset = () => { setEditingId(null); setForm(blank); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(async () => {
      const payload = { name: form.name.trim(), category: form.category, icon: form.icon.trim() || null, proficiency: form.proficiency === "" ? null : asNumber(form.proficiency), sort_order: asNumber(form.sort_order), is_visible: form.is_visible };
      const query = editingId ? getSupabaseOrThrow().from("skills").update(payload).eq("id", editingId).select("id") : getSupabaseOrThrow().from("skills").insert(payload).select("id");
      requireAffectedRows(await query);
      reset();
    }, editingId ? "Skill berhasil diperbarui." : "Skill berhasil ditambahkan.");
  }

  async function remove(skill: Skill) {
    if (!window.confirm(`Hapus skill ${skill.name}?`)) return;
    await mutate(async () => requireAffectedRows(await getSupabaseOrThrow().from("skills").delete().eq("id", skill.id).select("id")), "Skill berhasil dihapus.");
  }

  return <PanelFrame eyebrow="02 / capabilities" title="Keahlian" description="Kelompokkan kemampuan sebagai tech, hard, atau soft skill. Urutan kecil tampil lebih dahulu.">
    <form onSubmit={submit} className="border border-white/[0.12] bg-white/[0.02] p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-4"><h2 className="font-['Syne'] text-lg font-bold text-white">{editingId ? "Ubah skill" : "Tambah skill"}</h2>{editingId && <SecondaryButton onClick={reset}><X className="h-4 w-4" />Batal</SecondaryButton>}</div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><InputLabel label="Nama"><input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></InputLabel><InputLabel label="Kategori"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as SkillCategory })} className={selectClass}><option value="tech">Tech</option><option value="hard">Hard</option><option value="soft">Soft</option></select></InputLabel><InputLabel label="Ikon opsional"><input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} placeholder="code-2" className={inputClass} /></InputLabel><InputLabel label="Proficiency 0-100"><input min="0" max="100" type="number" value={form.proficiency} onChange={(event) => setForm({ ...form, proficiency: event.target.value })} className={inputClass} /></InputLabel><InputLabel label="Urutan"><input type="number" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} className={inputClass} /></InputLabel><div className="flex items-end pb-2"><Toggle checked={form.is_visible} onChange={(is_visible) => setForm({ ...form, is_visible })} label="Tampil publik" /></div></div><PrimaryButton pending={pending} className="mt-5">{editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Simpan perubahan" : "Tambah skill"}</PrimaryButton></form>
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{skills.length ? skills.map((skill) => <article key={skill.id} className="flex min-w-0 items-start justify-between gap-3 border border-white/[0.12] bg-[#121514] p-4"><div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF6B35]">{skill.category} / {String(skill.sort_order).padStart(2, "0")}</p><h3 className="mt-2 truncate font-['Syne'] text-lg font-bold text-white">{skill.name}</h3><p className="mt-1 text-xs text-white/45">{skill.proficiency === null ? "Proficiency belum diatur" : `${skill.proficiency}%`} {!skill.is_visible && <span className="ml-2 text-[#FF8A65]">Tersembunyi</span>}</p></div><div className="flex gap-1"><button aria-label={`Ubah ${skill.name}`} type="button" onClick={() => edit(skill)} className="p-2 text-white/50 hover:text-white"><Pencil className="h-4 w-4" /></button><button aria-label={`Hapus ${skill.name}`} type="button" onClick={() => remove(skill)} className="p-2 text-white/50 hover:text-[#FF6B35]"><Trash2 className="h-4 w-4" /></button></div></article>) : <div className="md:col-span-2 xl:col-span-3"><EmptyState text="Belum ada skill. Tambahkan kemampuan pertama di atas." /></div>}</div>
  </PanelFrame>;
}
