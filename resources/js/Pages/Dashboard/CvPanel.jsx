import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { CheckCircle2, FileText, Upload, AlertCircle } from 'lucide-react'

export default function CvPanel({ data }) {
    const [successMessage, setSuccessMessage] = useState('')

    const {
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        cv_file: null,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccessMessage('')

        if (data?.cv_file) {
            if (!confirm('Apakah Anda yakin ingin mengganti file CV yang sudah ada? File lama akan dihapus permanen.')) {
                return
            }
        }

        post(route('dashboard.cv.update'), {
            onSuccess: () => {
                showToast('File CV baru berhasil diunggah!')
                reset()
            },
        })
    }

    const showToast = (msg) => {
        setSuccessMessage(msg)
        setTimeout(() => setSuccessMessage(''), 4000)
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Curriculum Vitae (CV)</h2>
                <p className="text-gray-400 text-sm mt-1">
                    Unggah dan ganti file dokumen Curriculum Vitae (CV) Anda dalam format PDF.
                </p>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl">
                
                {/* Active CV Info */}
                <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
                    <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider">
                        CV Aktif Saat Ini
                    </h3>

                    {data?.cv_file ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl">
                                <div className="p-3 bg-[#FF3D00]/10 text-[#FF3D00] rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {data.cv_file.split('/').pop()}
                                    </p>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                                        Format: PDF Dokument
                                    </p>
                                </div>
                            </div>
                            
                            <a
                                href={data.cv_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-300 font-semibold py-2.5 rounded-xl text-sm transition-all"
                            >
                                Lihat File CV Aktif
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-[#1B1B1B]/30 border border-dashed border-[#2A2A2A] rounded-2xl text-gray-500">
                            <AlertCircle size={32} className="mb-2 text-gray-600" />
                            <p className="text-xs font-mono">Belum ada file CV yang diunggah.</p>
                        </div>
                    )}
                </div>

                {/* Upload Form */}
                <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6">
                    <h3 className="font-['Syne'] text-sm font-bold text-white uppercase tracking-wider mb-6">
                        Unggah / Ganti CV
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase">
                                File CV (PDF, Max 10MB)
                            </label>
                            
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center gap-2 w-full h-32 bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-dashed border-[#2A2A2A] hover:border-[#FF3D00]/50 rounded-2xl cursor-pointer transition-all">
                                    <Upload className="text-gray-400 group-hover:text-[#FF3D00] transition-colors" size={24} />
                                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                                        Klik untuk memilih file
                                    </span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => setData('cv_file', e.target.files[0])}
                                        required
                                    />
                                </label>
                            </div>
                            {errors.cv_file && (
                                <p className="text-red-500 text-xs font-mono mt-1">{errors.cv_file}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center justify-center gap-2 w-full bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all text-sm shadow-md"
                        >
                            {processing ? 'Mengunggah...' : 'Unggah Dokumen CV'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}
