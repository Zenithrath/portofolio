"use client";

import { FormEvent, useState } from "react";
import { Download, FileUp } from "lucide-react";
import type { Personal } from "@/types/portfolio";
import { getSupabaseOrThrow, requireAffectedRows, uploadPortfolioFile, type MutationRunner } from "./admin-utils";
import { EmptyState, InputLabel, PanelFrame, PrimaryButton } from "./PanelFrame";

export default function CvPanel({ personal, mutate, pending }: { personal: Personal | null; mutate: MutationRunner; pending: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  if (!personal) return <PanelFrame eyebrow="09 / document" title="Curriculum vitae" description="Unggah CV PDF yang dapat diunduh pengunjung dari navigasi portfolio."><EmptyState text="Simpan informasi personal terlebih dahulu sebelum mengunggah CV." /></PanelFrame>;
  const currentPersonal = personal;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    await mutate(async () => {
      const path = await uploadPortfolioFile(file, "cv", currentPersonal.cv_file, 10 * 1024 * 1024);
      const result = await getSupabaseOrThrow().from("personals").update({ cv_file: path }).eq("id", currentPersonal.id).select("id");
      requireAffectedRows(result);
      setFile(null);
    }, "CV berhasil diunggah.");
  }

  return <PanelFrame eyebrow="09 / document" title="Curriculum vitae" description="Unggah CV PDF yang dapat diunduh pengunjung dari navigasi portfolio."><form onSubmit={submit} className="max-w-2xl space-y-5"><InputLabel label="File PDF"><input required accept="application/pdf,.pdf" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="block w-full text-sm text-white/55 file:mr-4 file:border-0 file:bg-white/[0.08] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#FF3D00]" />{file && <p className="mt-2 text-xs text-[#FF8A65]">Siap unggah: {file.name}</p>}</InputLabel><div className="flex flex-wrap gap-3"><PrimaryButton pending={pending}><FileUp className="h-4 w-4" />Unggah CV</PrimaryButton>{personal.cv_url && <a href={personal.cv_url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-white/[0.14] px-4 text-sm font-semibold text-white/70 transition hover:border-[#FF3D00]/60 hover:text-white"><Download className="h-4 w-4" />Lihat CV</a>}</div></form></PanelFrame>;
}
