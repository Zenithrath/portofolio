import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Edit2, Trash2, CheckCircle2, ArrowUpDown } from 'lucide-react'

export default function SkillsPanel({ skills }) {
    const [activeCategory, setActiveCategory] = useState('tech')
    const [editingSkill, setEditingSkill] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Form hook for add/edit operations
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
        name: '',
        category: 'tech',
        icon: '',
        proficiency: '',
        sort_order: 0,
        is_visible: true,
    })

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat)
        setData('category', cat)
        if (!editingSkill) {
            resetFields(cat)
        }
    }

    const resetFields = (cat) => {
        setData({
            name: '',
            category: cat || activeCategory,
            icon: '',
            proficiency: '',
            sort_order: 0,
            is_visible: true,
        })
    }

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post(route('dashboard.skills.store'), {
            onSuccess: () => {
                setShowAddForm(false)
                resetFields()
                showToast('Skill berhasil ditambahkan!')
            },
        })
    }

    const handleEditClick = (skill) => {
        setEditingSkill(skill)
        setData({
            name: skill.name,
            category: skill.category,
            icon: skill.icon || '',
            proficiency: skill.proficiency !== null ? skill.proficiency : '',
            sort_order: skill.sort_order,
            is_visible: !!skill.is_visible,
        })
        setShowAddForm(false)
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        put(route('dashboard.skills.update', editingSkill.id), {
            onSuccess: () => {
                setEditingSkill(null)
                resetFields()
                showToast('Skill berhasil diperbarui!')
            },
        })
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus skill ini?')) {
            destroy(route('dashboard.skills.destroy', id), {
                onSuccess: () => showToast('Skill berhasil dihapus!'),
            })
        }
    }

    const filteredSkills = skills
        ? skills.filter((s) => s.category === activeCategory)
        : []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Keahlian</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola data keahlian Tech Stack, Hard Skills, dan Soft Skills.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingSkill(null)
                        resetFields()
                        setShowAddForm(!showAddForm)
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? 'Tutup Form' : 'Tambah Keahlian'}
                </button>
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Category tabs */}
            <div className="flex gap-2 border-b border-[#2A2A2A] pb-px">
                {['tech', 'hard', 'soft'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
                            activeCategory === cat
                                ? 'border-[#FF3D00] text-white'
                                : 'border-transparent text-gray-500 hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Form for Add/Edit */}
            {(showAddForm || editingSkill) && (
                <div className="bg-[#131313] border border-[#FF3D00]/25 rounded-2xl p-6 space-y-6">
                    <h3 className="font-['Syne'] text-lg font-bold text-white">
                        {editingSkill ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
                    </h3>

                    <form onSubmit={editingSkill ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Nama Skill</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1 font-mono">{errors.name}</p>}
                            </div>

                            {activeCategory === 'tech' && (
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Icon (Emoji atau SVG)</label>
                                    <input
                                        type="text"
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        placeholder="e.g. 💻 atau kode SVG"
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.icon && <p className="text-red-500 text-xs mt-1 font-mono">{errors.icon}</p>}
                                </div>
                            )}

                            {activeCategory === 'hard' && (
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Proficiency (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.proficiency}
                                        onChange={(e) => setData('proficiency', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                        required
                                    />
                                    {errors.proficiency && <p className="text-red-500 text-xs mt-1 font-mono">{errors.proficiency}</p>}
                                </div>
                            )}

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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_visible"
                                checked={data.is_visible}
                                onChange={(e) => setData('is_visible', e.target.checked)}
                                className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                            />
                            <label htmlFor="is_visible" className="text-sm text-gray-300 select-none">Tampilkan di Halaman Portofolio</label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingSkill(null)
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

            {/* List Skills */}
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                {filteredSkills.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#1C1C1C]/40 text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Nama</th>
                                    {activeCategory === 'tech' && <th className="px-6 py-4">Icon</th>}
                                    {activeCategory === 'hard' && <th className="px-6 py-4">Proficiency</th>}
                                    <th className="px-6 py-4">Visibilitas</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {filteredSkills.map((s) => (
                                    <tr key={s.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                                        <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                                        {activeCategory === 'tech' && (
                                            <td className="px-6 py-4 font-mono text-gray-400">{s.icon || '-'}</td>
                                        )}
                                        {activeCategory === 'hard' && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-gray-300">{s.proficiency}%</span>
                                                    <div className="w-20 bg-[#1C1C1C] h-1.5 rounded-full overflow-hidden border border-[#2A2A2A]">
                                                        <div className="bg-[#FF3D00] h-full" style={{ width: `${s.proficiency}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                s.is_visible
                                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-zinc-900 text-gray-500 border border-zinc-800'
                                            }`}>
                                                {s.is_visible ? 'Aktif' : 'Tersembunyi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">{s.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(s)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s.id)}
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
                        Tidak ada data keahlian untuk kategori ini.
                    </div>
                )}
            </div>
        </div>
    )
}
