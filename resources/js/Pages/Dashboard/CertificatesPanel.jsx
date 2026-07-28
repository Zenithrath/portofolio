import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Plus, Edit2, Trash2, CheckCircle2, Image, ExternalLink } from 'lucide-react'

export default function CertificatesPanel({ certificates }) {
    const [editingCert, setEditingCert] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    // Main Certificate form hook
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
        title: '',
        issuer: '',
        credential_id: '',
        credential_url: '',
        year: new Date().getFullYear(),
        is_visible: true,
        sort_order: 0,
    })

    // Image upload form hook
    const {
        setData: setImageData,
        post: postImage,
        processing: processingImage,
        errors: errorsImage,
    } = useForm({
        image: null,
    })

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    const resetFields = () => {
        setData({
            title: '',
            issuer: '',
            credential_id: '',
            credential_url: '',
            year: new Date().getFullYear(),
            is_visible: true,
            sort_order: 0,
        })
    }

    const handleAddSubmit = (e) => {
        e.preventDefault()
        post(route('dashboard.certificates.store'), {
            onSuccess: () => {
                setShowAddForm(false)
                resetFields()
                showToast('Sertifikat berhasil ditambahkan!')
            },
        })
    }

    const handleEditClick = (cert) => {
        setEditingCert(cert)
        setData({
            title: cert.title,
            issuer: cert.issuer,
            credential_id: cert.credential_id || '',
            credential_url: cert.credential_url || '',
            year: cert.year || new Date().getFullYear(),
            is_visible: !!cert.is_visible,
            sort_order: cert.sort_order,
        })
        setShowAddForm(false)
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        put(route('dashboard.certificates.update', editingCert.id), {
            onSuccess: () => {
                setEditingCert(null)
                resetFields()
                showToast('Sertifikat berhasil diperbarui!')
            },
        })
    }

    const handleImageSubmit = (e) => {
        e.preventDefault()
        if (!editingCert) return

        postImage(route('dashboard.certificates.image', editingCert.id), {
            onSuccess: () => {
                showToast('Gambar sertifikat berhasil diperbarui!')
            },
        })
    }

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
            destroy(route('dashboard.certificates.destroy', id), {
                onSuccess: () => showToast('Sertifikat berhasil dihapus!'),
            })
        }
    }

    const items = certificates ? [...certificates].sort((a, b) => a.sort_order - b.sort_order) : []

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Sertifikasi</h2>
                    <p className="text-gray-400 text-sm mt-1">Kelola data lisensi, kredensial digital, dan bukti sertifikasi Anda.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingCert(null)
                        resetFields()
                        setShowAddForm(!showAddForm)
                    }}
                    className="flex items-center gap-2 bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
                >
                    <Plus size={16} />
                    {showAddForm ? 'Tutup Form' : 'Tambah Sertifikat'}
                </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Form for Add/Edit */}
            {(showAddForm || editingCert) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Main certificate fields form */}
                    <div className={`${editingCert ? 'lg:col-span-8' : 'lg:col-span-12'} bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6`}>
                        <h3 className="font-['Syne'] text-lg font-bold text-white mb-6">
                            {editingCert ? 'Edit Kredensial Sertifikat' : 'Tambah Sertifikat Baru'}
                        </h3>

                        <form onSubmit={editingCert ? handleUpdateSubmit : handleAddSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Nama Sertifikasi</label>
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
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Penerbit / Issuer</label>
                                    <input
                                        type="text"
                                        value={data.issuer}
                                        onChange={(e) => setData('issuer', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                        required
                                    />
                                    {errors.issuer && <p className="text-red-500 text-xs mt-1 font-mono">{errors.issuer}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tahun Penerbitan</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                        required
                                    />
                                    {errors.year && <p className="text-red-500 text-xs mt-1 font-mono">{errors.year}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Credential ID (Opsional)</label>
                                    <input
                                        type="text"
                                        value={data.credential_id}
                                        onChange={(e) => setData('credential_id', e.target.value)}
                                        className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    />
                                    {errors.credential_id && <p className="text-red-500 text-xs mt-1 font-mono">{errors.credential_id}</p>}
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

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Credential URL (Opsional)</label>
                                <input
                                    type="url"
                                    value={data.credential_url}
                                    onChange={(e) => setData('credential_url', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                />
                                {errors.credential_url && <p className="text-red-500 text-xs mt-1 font-mono">{errors.credential_url}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="cert_is_visible"
                                    checked={data.is_visible}
                                    onChange={(e) => setData('is_visible', e.target.checked)}
                                    className="rounded bg-[#1C1C1C] border-[#2A2A2A] text-[#FF3D00] focus:ring-0 focus:ring-offset-0"
                                />
                                <label htmlFor="cert_is_visible" className="text-sm text-gray-300 select-none">Tampilkan di Portofolio</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false)
                                        setEditingCert(null)
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

                    {/* Image Upload Form (only when editing) */}
                    {editingCert && (
                        <div className="lg:col-span-4 bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center text-center">
                            <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider mb-4">
                                Bukti Sertifikat
                            </h3>

                            <div className="w-full aspect-[4/3] bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] overflow-hidden mb-4 flex items-center justify-center">
                                {editingCert.image_url ? (
                                    <img
                                        src={editingCert.image_url}
                                        alt="Bukti sertifikat"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-xs flex flex-col items-center gap-1">
                                        <Image size={24} />
                                        Belum Ada Gambar
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleImageSubmit} className="w-full space-y-3">
                                <label className="flex items-center justify-center gap-2 w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all">
                                    <Image size={14} />
                                    Pilih Gambar
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setImageData('image', e.target.files[0])}
                                    />
                                </label>
                                {errorsImage.image && (
                                    <p className="text-red-500 text-xs font-mono text-left">{errorsImage.image}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={processingImage}
                                    className="w-full bg-[#FF3D00] hover:bg-[#FF6B35] text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-all"
                                >
                                    {processingImage ? 'Mengunggah...' : 'Perbarui Gambar'}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            )}

            {/* List Table */}
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                {items.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#2A2A2A] bg-[#1C1C1C]/40 text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">Sertifikat</th>
                                    <th className="px-6 py-4">Penerbit</th>
                                    <th className="px-6 py-4">Tahun</th>
                                    <th className="px-6 py-4">Kredensial</th>
                                    <th className="px-6 py-4">Urutan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A] text-sm">
                                {items.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-[#1C1C1C]/20 transition-all">
                                        <td className="px-6 py-4 font-bold text-white">{cert.title}</td>
                                        <td className="px-6 py-4 text-gray-300">{cert.issuer}</td>
                                        <td className="px-6 py-4 font-mono text-gray-300">{cert.year}</td>
                                        <td className="px-6 py-4">
                                            {cert.credential_url ? (
                                                <a href={cert.credential_url} target="_blank" rel="noreferrer" className="text-[#FF3D00] hover:text-[#FF6B35] flex items-center gap-1 text-xs">
                                                    Lihat <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">{cert.sort_order}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(cert)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-all"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cert.id)}
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
                        Belum ada data sertifikasi yang ditambahkan.
                    </div>
                )}
            </div>
        </div>
    )
}
