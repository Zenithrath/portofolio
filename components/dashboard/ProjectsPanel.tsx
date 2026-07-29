"use client";

import { FormEvent, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Project } from "@/types/portfolio";
import {
    asNullable,
    asNumber,
    getSupabaseOrThrow,
    removePortfolioFile,
    requireAffectedRows,
    splitTags,
    throwIfError,
    uploadPortfolioFile,
    type MutationRunner,
} from "./admin-utils";
import {
    EmptyState,
    InputLabel,
    PanelFrame,
    PrimaryButton,
    SecondaryButton,
    Toggle,
    inputClass,
    selectClass,
    textareaClass,
} from "./PanelFrame";

type ProjectForm = {
    title: string;
    category: string;
    description: string;
    demo_url: string;
    repo_url: string;
    year: string;
    tags: string;
    is_featured: boolean;
    is_visible: boolean;
    sort_order: string;
};
const blank: ProjectForm = {
    title: "",
    category: "web",
    description: "",
    demo_url: "",
    repo_url: "",
    year: String(new Date().getFullYear()),
    tags: "",
    is_featured: false,
    is_visible: true,
    sort_order: "0",
};
const toForm = (item: Project): ProjectForm => ({
    title: item.title,
    category: item.category,
    description: item.description,
    demo_url: item.demo_url ?? "",
    repo_url: item.repo_url ?? "",
    year: item.year?.toString() ?? "",
    tags: item.tags.map((tag) => tag.tag).join(", "),
    is_featured: item.is_featured,
    is_visible: item.is_visible,
    sort_order: String(item.sort_order),
});

export default function ProjectsPanel({
    projects,
    mutate,
    pending,
}: {
    projects: Project[];
    mutate: MutationRunner;
    pending: boolean;
}) {
    const [form, setForm] = useState<ProjectForm>(blank);
    const [editing, setEditing] = useState<Project | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const reset = () => {
        setEditing(null);
        setThumbnail(null);
        setForm(blank);
    };
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await mutate(
            async () => {
                let thumbnailPath = editing?.thumbnail ?? null;
                if (thumbnail)
                    thumbnailPath = await uploadPortfolioFile(
                        thumbnail,
                        "projects",
                        editing?.thumbnail,
                        2 * 1024 * 1024,
                    );
                const payload = {
                    title: form.title.trim(),
                    category: form.category,
                    description: form.description.trim(),
                    thumbnail: thumbnailPath,
                    demo_url: asNullable(form.demo_url),
                    repo_url: asNullable(form.repo_url),
                    year: form.year === "" ? null : asNumber(form.year),
                    is_featured: form.is_featured,
                    is_visible: form.is_visible,
                    sort_order: asNumber(form.sort_order),
                };
                const supabase = getSupabaseOrThrow();
                let projectId = editing?.id;
                if (projectId) {
                    requireAffectedRows(
                        await supabase
                            .from("projects")
                            .update(payload)
                            .eq("id", projectId)
                            .select("id"),
                    );
                } else {
                    const created = await supabase
                        .from("projects")
                        .insert(payload)
                        .select("id")
                        .single();
                    throwIfError(created);
                    if (!created.data?.id)
                        throw new Error(
                            "Supabase tidak mengembalikan ID project baru.",
                        );
                    projectId = created.data.id;
                }
                if (!projectId) throw new Error("ID project tidak tersedia.");
                throwIfError(
                    await supabase
                        .from("project_tags")
                        .delete()
                        .eq("project_id", projectId),
                );
                const tags = splitTags(form.tags);
                if (tags.length)
                    throwIfError(
                        await supabase
                            .from("project_tags")
                            .insert(
                                tags.map((tag) => ({
                                    project_id: projectId,
                                    tag,
                                })),
                            ),
                    );
                reset();
            },
            editing
                ? "Project berhasil diperbarui."
                : "Project berhasil ditambahkan.",
        );
    }
    async function remove(item: Project) {
        if (!window.confirm(`Hapus project ${item.title}?`)) return;
        await mutate(async () => {
            requireAffectedRows(
                await getSupabaseOrThrow()
                    .from("projects")
                    .delete()
                    .eq("id", item.id)
                    .select("id"),
            );
            await removePortfolioFile(item.thumbnail).catch(() => undefined);
        }, "Project berhasil dihapus.");
    }
    return (
        <PanelFrame
            eyebrow="04 / selected work"
            title="Portfolio project"
            description="Kelola karya secara langsung, termasuk tag yang ditulis dengan koma. Thumbnail tersimpan di bucket portfolio."
        >
            <form
                onSubmit={submit}
                className="border border-white/[0.12] bg-white/[0.02] p-4 sm:p-5"
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-['Syne'] text-lg font-bold text-white">
                        {editing ? "Ubah project" : "Tambah project"}
                    </h2>
                    {editing && (
                        <SecondaryButton onClick={reset}>
                            <X className="h-4 w-4" />
                            Batal
                        </SecondaryButton>
                    )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <InputLabel label="Judul">
                        <input
                            required
                            maxLength={200}
                            value={form.title}
                            onChange={(event) =>
                                setForm({ ...form, title: event.target.value })
                            }
                            className={inputClass}
                        />
                    </InputLabel>
                    <InputLabel label="Kategori">
                        <select
                            value={form.category}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    category: event.target.value,
                                })
                            }
                            className={selectClass}
                        >
              <option value="automation">Automation</option>
              <option value="AI">AI</option>
              <option value="iot">IoT</option>
              <option value="web">Web</option>
              <option value="app">App</option>
                            <option value="other">Other</option>
                        </select>
                    </InputLabel>
                    <InputLabel label="Tahun">
                        <input
                            min="2000"
                            max="2099"
                            type="number"
                            value={form.year}
                            onChange={(event) =>
                                setForm({ ...form, year: event.target.value })
                            }
                            className={inputClass}
                        />
                    </InputLabel>
                    <InputLabel label="Demo URL">
                        <input
                            type="url"
                            value={form.demo_url}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    demo_url: event.target.value,
                                })
                            }
                            placeholder="https://"
                            className={inputClass}
                        />
                    </InputLabel>
                    <InputLabel label="Repository URL">
                        <input
                            type="url"
                            value={form.repo_url}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    repo_url: event.target.value,
                                })
                            }
                            placeholder="https://"
                            className={inputClass}
                        />
                    </InputLabel>
                    <InputLabel label="Urutan">
                        <input
                            type="number"
                            value={form.sort_order}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    sort_order: event.target.value,
                                })
                            }
                            className={inputClass}
                        />
                    </InputLabel>
                </div>
                <InputLabel label="Tag (pisahkan dengan koma)" className="mt-4">
                    <input
                        value={form.tags}
                        onChange={(event) =>
                            setForm({ ...form, tags: event.target.value })
                        }
                        placeholder="Next.js, Supabase, GSAP"
                        className={inputClass}
                    />
                </InputLabel>
                <InputLabel label="Deskripsi" className="mt-4">
                    <textarea
                        required
                        maxLength={1000}
                        value={form.description}
                        onChange={(event) =>
                            setForm({
                                ...form,
                                description: event.target.value,
                            })
                        }
                        className={textareaClass}
                    />
                </InputLabel>
                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <InputLabel label="Thumbnail">
                        <input
                            accept="image/jpeg,image/png,image/webp"
                            type="file"
                            onChange={(event) =>
                                setThumbnail(event.target.files?.[0] ?? null)
                            }
                            className="block w-full text-sm text-white/55 file:mr-4 file:border-0 file:bg-white/[0.08] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#FF3D00]"
                        />
                        {thumbnail && (
                            <p className="mt-2 text-xs text-[#FF8A65]">
                                Akan mengunggah {thumbnail.name}
                            </p>
                        )}
                    </InputLabel>
                    <div className="flex flex-wrap items-end gap-4 pb-2">
                        <Toggle
                            checked={form.is_featured}
                            onChange={(is_featured) =>
                                setForm({ ...form, is_featured })
                            }
                            label="Featured"
                        />
                        <Toggle
                            checked={form.is_visible}
                            onChange={(is_visible) =>
                                setForm({ ...form, is_visible })
                            }
                            label="Tampil publik"
                        />
                    </div>
                </div>
                <PrimaryButton pending={pending} className="mt-5">
                    {editing ? (
                        <Save className="h-4 w-4" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    {editing ? "Simpan perubahan" : "Tambah project"}
                </PrimaryButton>
            </form>
            <div className="grid gap-3 md:grid-cols-2">
                {projects.length ? (
                    projects.map((item) => (
                        <article
                            key={item.id}
                            className="flex gap-3 border border-white/[0.12] bg-[#121514] p-4"
                        >
                            {item.thumbnail_url && (
                                <img
                                    src={item.thumbnail_url}
                                    alt=""
                                    className="h-16 w-20 shrink-0 object-cover"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#FF6B35]">
                                    {item.category} / {item.year || "-"}
                                </p>
                                <h3 className="mt-2 truncate font-['Syne'] text-lg font-bold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-1 truncate text-xs text-white/45">
                                    {item.tags
                                        .map((tag) => tag.tag)
                                        .join(" / ") || "Tanpa tag"}
                                </p>
                            </div>
                            <div className="flex h-fit gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(item);
                                        setThumbnail(null);
                                        setForm(toForm(item));
                                    }}
                                    aria-label={`Ubah ${item.title}`}
                                    className="p-2 text-white/50 hover:text-white"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => remove(item)}
                                    aria-label={`Hapus ${item.title}`}
                                    className="p-2 text-white/50 hover:text-[#FF6B35]"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="md:col-span-2">
                        <EmptyState text="Belum ada project." />
                    </div>
                )}
            </div>
        </PanelFrame>
    );
}
