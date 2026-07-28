import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Edit2, Trash2, CheckCircle2, Calendar } from 'lucide-react'

export default function ExperiencePanel({ experiences }) {
    const [editingExp, setEditingExp] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Form hook for Experience CRUD
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
        company: '',
        position: '',
        type: 'internship',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        location: '',
        is_visible: true,
        sort_order: 0,
    })

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    const resetFields = () => {
        setData({
            company: '',
            position: '',
            type: 'internship',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            location: '',
            is_visible: true,
            sort_order: 0,
        })
    }

    // Helper to format date string to YYYY-MM-DD for HTML input
    const parseDate = (dStr) => {
        if (!dStr) return ''
        return dStr.split('T')[0]
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post(route('dashboard.experience.store'), {
            onSuccess: () => {
                setShowAddForm(false)
                resetFields()
                showToast('Pengalaman kerja berhasil ditambahkan!')
            },
        })
    }

    const handleEditClick = (exp) => {
        setEditingExp(exp)
        setData({
            company: exp.company,
            position: exp.position,
            type: exp.type,
            start_date: parseDate(exp.start_date),
            end_date: parseDate(exp.end_date) || '',
            is_current: !!exp.is_current,
            description: exp.description,
            location: exp.location || '',
            is_visible: !!exp.is_visible,
            sort_order: exp.sort_order,
        })
        setShowAddForm(false)
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        put(route('dashboard.experience.update', editingExp.id), {
            onSuccess: () => {
                setEditingExp(null)
                resetFields()
                showToast('Pengalaman kerja berhasil diperbarui!')
            },
        })
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengalaman kerja ini?')) {
            destroy(route('dashboard.experience.destroy', id), {
                onSuccess: () => showToast('Pengalaman kerja berhasil dihapus!'),
            })
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })
    }

    const items = experiences
        ? [...experiences].sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        : []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Pengalaman</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola data pengalaman kerja, magang, freelance, dan kepengurusan organisasi.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingExp(null)
                        resetFields()
                        setShowAddForm(!showAddForm)
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? 'Tutup Form' : 'Tambah Pengalaman'}
                </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Form Add / Edit */}
            {(showAddForm || editingExp) && (
                <div className="bg-[#131313] border border-[#FF3D00]/25 rounded-2xl p-6 space-y-6">
                    <h3 className="font-['Syne'] text-lg font-bold text-white">
                        {editingExp ? 'Edit Detail Pengalaman' : 'Tambah Pengalaman Baru'}
                    </h3>

                    <form onSubmit={editingExp ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Nama Perusahaan / Organisasi</label>
                                <input
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.company && <p className="text-red-500 text-xs mt-1 font-mono">{errors.company}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Posisi / Peran</label>
                                <input
                                    type="text"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.position && <p className="text-red-500 text-xs mt-1 font-mono">{errors.position}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tipe Pekerjaan</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                >
                                    <option value="fulltime">Full-time</option>
                                    <option value="parttime">Part-time</option>
                                    <option value="internship">Internship (Magang)</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="organization">Organisasi</option>
                                </select>
                                {errors.type && <p className="text-red-500 text-xs mt-1 font-mono">{errors.type}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.start_date && <p className="text-red-500 text-xs mt-1 font-mono">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    disabled={data.is_current}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all disabled:opacity-50"
                                />
                                {errors.end_date && <p className="text-red-500 text-xs mt-1 font-mono">{errors.end_date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Lokasi / Domisili Kerja</label>
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    placeholder="e.g. Malang / Jakarta (Remote)"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.location && <p className="text-red-500 text-xs mt-1 font-mono">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Sort Order</label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.sort_order && <p className="text-red-500 text-xs mt-1 font-mono">{errors.sort_order}</p>}
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_current"
                                    checked={data.is_current}
                                    onChange={(e) => {
                                        setData((prev) => ({
                                            ...prev,
                                            is_current: e.target.checked,
                                            end_date: e.target.checked ? '' : prev.end_date,
                                        }))
                                    }}
                                    className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                                />
                                <label htmlFor="is_current" className="text-sm text-gray-300 select-none font-semibold">Masih Bekerja di Sini</label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="exp_is_visible"
                                    checked={data.is_visible}
                                    onChange={(e) => setData('is_visible', e.target.checked)}
                                    className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                                />
                                <label htmlFor="exp_is_visible" className="text-sm text-gray-300 select-none font-semibold">Tampilkan di Halaman Portofolio</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Deskripsi Tanggung Jawab / Detail Pekerjaan</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                placeholder="Tuliskan tugas-tugas atau detail pencapaian Anda selama bekerja..."
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all resize-none"
                                required
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1 font-mono">{errors.description}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingExp(null)
                                    resetFields()
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
                                {processing ? 'Menyimpan...' : 'Simpan'}
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
                                    <th className="px-6 py-4">Perusahaan</th>
                                    <th className="px-6 py-4">Posisi</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {items.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white">{exp.company}</p>
                                            {exp.location && <p className="text-xs text-gray-400 mt-0.5">{exp.location}</p>}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-300">{exp.position}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-[#1C1C1C] border border-[#2A2A2A] text-gray-300">
                                                {exp.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                                                <Calendar size={12} />
                                                <span>
                                                    {formatDate(exp.start_date)} – {exp.is_current ? 'Sekarang' : formatDate(exp.end_date)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">{exp.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(exp)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
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
                        Belum ada data pengalaman kerja yang ditambahkan.
                    </div>
                )}
            </div>
        </div>
    )
}
