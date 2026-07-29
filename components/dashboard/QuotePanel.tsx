"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import type { Personal } from "@/types/portfolio";
import { getSupabaseOrThrow, requireAffectedRows, type MutationRunner } from "./admin-utils";
import { EmptyState, InputLabel, PanelFrame, PrimaryButton, textareaClass } from "./PanelFrame";

export default function QuotePanel({ personal, mutate, pending }: { personal: Personal | null; mutate: MutationRunner; pending: boolean }) {
  const [quote, setQuote] = useState(personal?.quote ?? "");
  if (!personal) return <PanelFrame eyebrow="07 / quote" title="Quote" description="Kalimat pendek yang tampil berdampingan dengan bagian pengalaman."><EmptyState text="Simpan informasi personal terlebih dahulu sebelum membuat quote." /></PanelFrame>;
  const currentPersonal = personal;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await mutate(async () => {
      const result = await getSupabaseOrThrow().from("personals").update({ quote }).eq("id", currentPersonal.id).select("id");
      requireAffectedRows(result);
    }, "Quote berhasil diperbarui.");
  }

  return <PanelFrame eyebrow="07 / quote" title="Quote" description="Kalimat pendek yang tampil berdampingan dengan bagian pengalaman."><form onSubmit={submit} className="max-w-2xl space-y-5"><InputLabel label="Quote"><textarea required maxLength={500} value={quote} onChange={(event) => setQuote(event.target.value)} className={textareaClass} /></InputLabel><PrimaryButton pending={pending}><Save className="h-4 w-4" />Simpan quote</PrimaryButton></form></PanelFrame>;
}
