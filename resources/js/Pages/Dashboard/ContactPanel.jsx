import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Edit2, Trash2, CheckCircle2, Link } from 'lucide-react'

export default function ContactPanel({ contacts }) {
    const [editingContact, setEditingContact] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Form hook for Contact CRUD
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
        platform: 'email',
        label: '',
        value: '',
        icon: '',
        is_visible: true,
        sort_order: 0,
    })

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    const resetFields = () => {
        setData({
            platform: 'email',
            label: '',
            value: '',
            icon: '',
            is_visible: true,
            sort_order: 0,
        })
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post(route('dashboard.contacts.store'), {
            onSuccess: () => {
                setShowAddForm(false)
                resetFields()
                showToast('Kontak berhasil ditambahkan!')
            },
        })
    }

    const handleEditClick = (contact) => {
        setEditingContact(contact)
        setData({
            platform: contact.platform,
            label: contact.label,
            value: contact.value,
            icon: contact.icon || '',
            is_visible: !!contact.is_visible,
            sort_order: contact.sort_order,
        })
        setShowAddForm(false)
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        put(route('dashboard.contacts.update', editingContact.id), {
            onSuccess: () => {
                setEditingContact(null)
                resetFields()
                showToast('Kontak berhasil diperbarui!')
            },
        })
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            destroy(route('dashboard.contacts.destroy', id), {
                onSuccess: () => showToast('Kontak berhasil dihapus!'),
            })
        }
    }

    const items = contacts ? [...contacts].sort((a, b) => a.sort_order - b.sort_order) : []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Kontak</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola tautan sosial media dan platform komunikasi Anda.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingContact(null)
                        resetFields()
                        setShowAddForm(!showAddForm)
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? 'Tutup Form' : 'Tambah Kontak'}
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
            {(showAddForm || editingContact) && (
                <div className="bg-[#131313] border border-[#FF3D00]/25 rounded-2xl p-6 space-y-6">
                    <h3 className="font-['Syne'] text-lg font-bold text-white">
                        {editingContact ? 'Edit Detail Kontak' : 'Tambah Kontak Baru'}
                    </h3>

                    <form onSubmit={editingContact ? handleUpdateSubmit : handleAddSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Platform</label>
                                <select
                                    value={data.platform}
                                    onChange={(e) => setData('platform', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                >
                                    <option value="email">Email</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="github">GitHub</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.platform && <p className="text-red-500 text-xs mt-1 font-mono">{errors.platform}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Teks Tampilan (Label)</label>
                                <input
                                    type="text"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    placeholder="e.g. github.com/username atau Email Saya"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.label && <p className="text-red-500 text-xs mt-1 font-mono">{errors.label}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tautan URL / Href (Value)</label>
                                <input
                                    type="text"
                                    value={data.value}
                                    onChange={(e) => setData('value', e.target.value)}
                                    placeholder="mailto:email@address.com atau https://..."
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errors.value && <p className="text-red-500 text-xs mt-1 font-mono">{errors.value}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Icon Name (Opsional)</label>
                                <input
                                    type="text"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    placeholder="e.g. Github, Mail, Linkedin"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.icon && <p className="text-red-500 text-xs mt-1 font-mono">{errors.icon}</p>}
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="contact_is_visible"
                                checked={data.is_visible}
                                onChange={(e) => setData('is_visible', e.target.checked)}
                                className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                            />
                            <label htmlFor="contact_is_visible" className="text-sm text-gray-300 select-none">Tampilkan di Portofolio</label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false)
                                    setEditingContact(null)
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
                                    <th className="px-6 py-4">Platform</th>
                                    <th className="px-6 py-4">Label</th>
                                    <th className="px-6 py-4">Tautan</th>
                                    <th className="px-6 py-4">Visibilitas</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {items.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                                        <td className="px-6 py-4 font-mono font-bold uppercase tracking-wider text-[#FF3D00]">{contact.platform}</td>
                                        <td className="px-6 py-4 font-semibold text-white">{contact.label}</td>
                                        <td className="px-6 py-4">
                                            <a href={contact.value} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white flex items-center gap-1 text-xs">
                                                Uji Tautan <Link size={12} />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                contact.is_visible
                                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-zinc-900 text-gray-500 border border-zinc-800'
                                            }`}>
                                                {contact.is_visible ? 'Aktif' : 'Tersembunyi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">{contact.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(contact)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
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
                        Belum ada data kontak yang ditambahkan.
                    </div>
                )}
            </div>
        </div>
    )
}
