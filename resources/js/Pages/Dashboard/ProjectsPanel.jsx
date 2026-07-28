import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Edit2, Trash2, CheckCircle2, Image, ExternalLink, Code } from 'lucide-react'

export default function ProjectsPanel({ projects }) {
    const [editingProject, setEditingProject] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Main Project form hook
    const {
        data,
        setData,
        post,
        put,
        transform,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        title: '',
        category: 'web',
        description: '',
        demo_url: '',
        repo_url: '',
        year: new Date().getFullYear(),
        is_featured: false,
        is_visible: true,
        sort_order: 0,
        tags: [],
    })
    const [tagsInput, setTagsInput] = useState('')

    // Thumbnail upload form hook
    const {
        setData: setThumbnailData,
        post: postThumbnail,
        processing: processingThumbnail,
        errors: errorsThumbnail,
    } = useForm({
        thumbnail: null,
    })

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    const resetFields = () => {
        setData({
            title: '',
            category: 'web',
            description: '',
            demo_url: '',
            repo_url: '',
            year: new Date().getFullYear(),
            is_featured: false,
            is_visible: true,
            sort_order: 0,
            tags: [],
        })
        setTagsInput('')
    }

    const parseTags = (value) => Array.from(
        new Set(
            value
                .split(/[\n,]/)
                .map((tag) => tag.trim())
                .filter(Boolean),
        ),
    )

    const handleAddSubmit = (e) => {
        e.preventDefault()
        transform((values) => ({
            ...values,
            tags: parseTags(tagsInput),
        }))

        post(route('dashboard.projects.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddForm(false)
                resetFields()
                showToast('Proyek berhasil ditambahkan!')
            },
        })
    }

    const handleEditClick = (project) => {
        setEditingProject(project)
        const tagsString = project.tags ? project.tags.map((t) => t.tag).join(', ') : ''
        setTagsInput(tagsString)
        setData({
            title: project.title,
            category: project.category,
            description: project.description,
            demo_url: project.demo_url || '',
            repo_url: project.repo_url || '',
            year: project.year || new Date().getFullYear(),
            is_featured: !!project.is_featured,
            is_visible: !!project.is_visible,
            sort_order: project.sort_order,
            tags: project.tags?.map((tag) => tag.tag) || [],
        })
        setShowAddForm(false)
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        transform((values) => ({
            ...values,
            tags: parseTags(tagsInput),
        }))

        put(route('dashboard.projects.update', editingProject.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingProject(null)
                resetFields()
                showToast('Proyek berhasil diperbarui!')
            },
        })
    }

    const handleThumbnailSubmit = (e) => {
        e.preventDefault()
        if (!editingProject) return

        postThumbnail(route('dashboard.projects.thumbnail', editingProject.id), {
            onSuccess: () => {
                showToast('Thumbnail proyek berhasil diperbarui!')
            },
        })
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            destroy(route('dashboard.projects.destroy', id), {
                onSuccess: () => showToast('Proyek berhasil dihapus!'),
            })
        }
    }

    const items = projects ? [...projects].sort((a, b) => a.sort_order - b.sort_order) : []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Proyek</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola data portofolio proyek, deskripsi, tautan demo, dan kode.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingProject(null)
                        resetFields()
                        setShowAddForm(!showAddForm)
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? 'Tutup Form' : 'Tambah Proyek'}
                </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Main Form for Add/Edit */}
            {(showAddForm || editingProject) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Project info form */}
                    <div className={`${editingProject ? 'lg:col-span-8' : 'lg:col-span-12'} bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6`}>
                        <h3 className="font-['Syne'] text-lg font-bold text-white mb-6">
                            {editingProject ? 'Edit Informasi Proyek' : 'Tambah Proyek Baru'}
                        </h3>

                        <form onSubmit={editingProject ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Nama / Judul Proyek</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1 font-mono">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Kategori Proyek</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                        required
                                    >
                                        <option value="web">Web App</option>
                                        <option value="app">Mobile App</option>
                                        <option value="iot">Internet of Things (IoT)</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1 font-mono">{errors.category}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tahun Pembuatan</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.year && <p className="text-red-500 text-xs mt-1 font-mono">{errors.year}</p>}
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

                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tags / Tech Stack (Koma)</label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        placeholder="e.g. Laravel, React, Tailwind"
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.tags && <p className="text-red-500 text-xs mt-1 font-mono">{errors.tags}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Live Demo URL</label>
                                    <input
                                        type="url"
                                        value={data.demo_url}
                                        onChange={(e) => setData('demo_url', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.demo_url && <p className="text-red-500 text-xs mt-1 font-mono">{errors.demo_url}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Repository URL</label>
                                    <input
                                        type="url"
                                        value={data.repo_url}
                                        onChange={(e) => setData('repo_url', e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.repo_url && <p className="text-red-500 text-xs mt-1 font-mono">{errors.repo_url}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Deskripsi Proyek</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all resize-none"
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1 font-mono">{errors.description}</p>}
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                                    />
                                    <label htmlFor="is_featured" className="text-sm text-gray-300 select-none font-semibold">Tampilkan Sebagai Unggulan (Featured)</label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="project_is_visible"
                                        checked={data.is_visible}
                                        onChange={(e) => setData('is_visible', e.target.checked)}
                                        className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                                    />
                                    <label htmlFor="project_is_visible" className="text-sm text-gray-300 select-none font-semibold">Tampilkan di Portofolio</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false)
                                        setEditingProject(null)
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

                    {/* Thumbnail Upload form (only when editing) */}
                    {editingProject && (
                        <div className="lg:col-span-4 bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center text-center">
                            <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Thumbnail Proyek
                            </h3>

                            <div className="w-full aspect-video bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] overflow-hidden mb-4 flex items-center justify-center">
                                {editingProject.thumbnail_url ? (
                                    <img
                                        src={editingProject.thumbnail_url}
                                        alt="Thumbnail proyek"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-xs flex flex-col items-center gap-1">
                                        <Image size={24} />
                                        Belum Ada Gambar
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleThumbnailSubmit} className="w-full space-y-3">
                                <label className="flex items-center justify-center gap-2 w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all">
                                    <Image size={14} />
                                    Pilih Gambar
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setThumbnailData('thumbnail', e.target.files[0])}
                                    />
                                </label>
                                {errorsThumbnail.thumbnail && (
                                    <p className="text-red-500 text-xs font-mono text-left">{errorsThumbnail.thumbnail}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processingThumbnail}
                                    className="w-full bg-[#FF3D00] hover:bg-[#FF6B35] text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-all"
                                >
                                    {processingThumbnail ? 'Mengunggah...' : 'Perbarui Thumbnail'}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            )}

            {/* List Projects */}
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                {items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#1C1C1C]/40 text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Proyek</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Tahun</th>
                                    <th className="px-6 py-4">Tautan</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {items.map((project) => (
                                    <tr key={project.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-white">{project.title}</p>
                                            {project.is_featured && (
                                                <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#FF3D00]/10 border border-[#FF3D00]/25 text-[#FF3D00]">
                                                    ★ Featured
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#1C1C1C] text-gray-300 border border-[#2A2A2A] uppercase">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-300">{project.year || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {project.demo_url && (
                                                    <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-[#FF3D00] hover:text-[#FF6B35]">
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                                {project.repo_url && (
                                                    <a href={project.repo_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                                                        <Code size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">{project.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(project)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
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
                        Belum ada proyek yang ditambahkan.
                    </div>
                )}
            </div>
        </div>
    )
}
