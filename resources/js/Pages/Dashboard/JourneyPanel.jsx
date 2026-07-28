import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";

export default function JourneyPanel({ journey }) {
    const [editingItem, setEditingItem] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        year: "",
        title: "",
        description: "",
        type: "education",
        institution: "",
        image: null,
        sort_order: 0,
        is_visible: true,
    });

    const showToast = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 4000);
    };

    const resetFields = () => {
        setData({
            year: "",
            title: "",
            description: "",
            type: "education",
            institution: "",
            image: null,
            sort_order: 0,
            is_visible: true,
        });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route("dashboard.journey.store"), {
            forceFormData: true,
            onSuccess: () => {
                setShowAddForm(false);
                resetFields();
                showToast("Riwayat berhasil ditambahkan!");
            },
        });
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setData({
            year: item.year,
            title: item.title,
            description: item.description,
            type: item.type,
            institution: item.institution || "",
            image: null,
            sort_order: item.sort_order,
            is_visible: !!item.is_visible,
        });
        setShowAddForm(false);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        put(route("dashboard.journey.update", editingItem.id), {
            forceFormData: true,
            onSuccess: () => {
                setEditingItem(null);
                resetFields();
                showToast("Riwayat berhasil diperbarui!");
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) {
            destroy(route("dashboard.journey.destroy", id), {
                onSuccess: () => showToast("Riwayat berhasil dihapus!"),
            });
        }
    };

    const items = journey
        ? [...journey].sort((a, b) => a.sort_order - b.sort_order)
        : [];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">
                        Kelola Perjalanan
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Kelola data riwayat pendidikan, karir, pencapaian, dan
                        organisasi.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingItem(null);
                        resetFields();
                        setShowAddForm(!showAddForm);
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? "Tutup Form" : "Tambah Riwayat"}
                </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Add / Edit Form */}
            {(showAddForm || editingItem) && (
                <div className="bg-[#131313] border border-[#FF3D00]/25 rounded-2xl p-6 space-y-6">
                    <h3 className="font-['Syne'] text-lg font-bold text-white">
                        {editingItem
                            ? "Edit Riwayat Perjalanan"
                            : "Tambah Riwayat Baru"}
                    </h3>

                    <form
                        onSubmit={
                            editingItem ? handleUpdateSubmit : handleAddSubmit
                        }
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                    Tahun / Periode
                                </label>
                                <input
                                    type="text"
                                    value={data.year}
                                    onChange={(e) =>
                                        setData("year", e.target.value)
                                    }
                                    placeholder="e.g. 2021-2024 atau 2023"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.year && (
                                    <p className="text-red-500 text-xs mt-1 font-mono">
                                        {errors.year}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                    Judul Event / Kegiatan
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="e.g. D3 Teknologi Informasi"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1 font-mono">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                    Tipe Kategori
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                >
                                    <option value="education">
                                        Pendidikan
                                    </option>
                                    <option value="work">Pekerjaan</option>
                                    <option value="achievement">
                                        Pencapaian
                                    </option>
                                    <option value="organization">
                                        Organisasi
                                    </option>
                                </select>
                                {errors.type && (
                                    <p className="text-red-500 text-xs mt-1 font-mono">
                                        {errors.type}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                    Nama Institusi / Penyelenggara (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={data.institution}
                                    onChange={(e) =>
                                        setData("institution", e.target.value)
                                    }
                                    placeholder="e.g. Universitas Brawijaya"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.institution && (
                                    <p className="text-red-500 text-xs mt-1 font-mono">
                                        {errors.institution}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData("sort_order", e.target.value)
                                    }
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.sort_order && (
                                    <p className="text-red-500 text-xs mt-1 font-mono">
                                        {errors.sort_order}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                Gambar Perjalanan (Opsional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        "image",
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="w-full rounded-xl border border-dashed border-[#2A2A2A] bg-[#1C1C1C] px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-[#FF3D00] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-white hover:file:bg-[#FF6B35]"
                            />
                            {editingItem?.image_url && !data.image && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Gambar saat ini tersedia dan akan tetap
                                    dipakai jika tidak diganti.
                                </p>
                            )}
                            {errors.image && (
                                <p className="text-red-500 text-xs mt-1 font-mono">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">
                                Deskripsi Detail
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                rows={3}
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all resize-none"
                                required
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1 font-mono">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="journey_is_visible"
                                checked={data.is_visible}
                                onChange={(e) =>
                                    setData("is_visible", e.target.checked)
                                }
                                className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                            />
                            <label
                                htmlFor="journey_is_visible"
                                className="text-sm text-gray-300 select-none"
                            >
                                Tampilkan di Halaman Portofolio
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingItem(null);
                                    resetFields();
                                }}
                                className="border border-[#2A2A2A] hover:bg-[#1C1C1C] text-gray-300 font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Table */}
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                {items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#1C1C1C]/40 text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Tahun</th>
                                    <th className="px-6 py-4">
                                        Judul & Institusi
                                    </th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Visibilitas</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-[#1C1C1C]/20 transition-all"
                                    >
                                        <td className="px-6 py-4 font-mono font-semibold text-[#FF3D00]">
                                            {item.year}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white">
                                                {item.title}
                                            </p>
                                            {item.institution && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {item.institution}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-[#1C1C1C] border border-[#2A2A2A] text-gray-300">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    item.is_visible
                                                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-zinc-900 text-gray-500 border border-zinc-800"
                                                }`}
                                            >
                                                {item.is_visible
                                                    ? "Aktif"
                                                    : "Tersembunyi"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">
                                            {item.sort_order}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(item)
                                                    }
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    className="p-2 text-red-500 hover:text-white hover:bg-red-950/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500 text-sm">
                        Belum ada data perjalanan yang ditambahkan.
                    </div>
                )}
            </div>
        </div>
    );
}
