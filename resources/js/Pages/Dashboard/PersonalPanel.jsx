import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { Camera, FileText, CheckCircle2, AlertCircle } from 'lucide-react'

export default function PersonalPanel({ data }) {
    const [successMessage, setSuccessMessage] = useState('')

    // Form for personal text fields
    const {
        data: infoData,
        setData: setInfoData,
        put: putInfo,
        processing: processingInfo,
        errors: errorsInfo,
    } = useForm({
        name: data?.name || '',
        title: data?.title || '',
        university: data?.university || '',
        faculty: data?.faculty || '',
        bio: data?.bio || '',
        tagline: data?.tagline || '',
        location: data?.location || '',
        status: data?.status || '',
        quote: data?.quote || '',
    })

    // Form for photo upload
    const {
        setData: setPhotoData,
        post: postPhoto,
        processing: processingPhoto,
        errors: errorsPhoto,
    } = useForm({
        photo: null,
    })

    // Form for CV PDF upload
    const {
        setData: setCvData,
        post: postCv,
        processing: processingCv,
        errors: errorsCv,
    } = useForm({
        cv_file: null,
    })

    const handleInfoSubmit = (e) => {
        e.preventDefault()
        setSuccessMessage('')
        putInfo(route('dashboard.personal.update'), {
            onSuccess: () => showToast('Informasi personal berhasil disimpan!'),
        })
    }

    const handlePhotoSubmit = (e) => {
        e.preventDefault()
        setSuccessMessage('')
        postPhoto(route('dashboard.personal.photo'), {
            onSuccess: () => showToast('Foto profil berhasil diunggah!'),
        })
    }

    const handleCvSubmit = (e) => {
        e.preventDefault()
        setSuccessMessage('')
        postCv(route('dashboard.personal.cv'), {
            onSuccess: () => showToast('File CV berhasil diunggah!'),
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
                <h2 className="text-2xl font-bold font-['Syne'] text-white">Informasi Personal</h2>
                <p className="text-gray-400 text-sm mt-1">
                    Kelola data diri, status pekerjaan, foto profil, dan dokumen CV Anda.
                </p>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Uploaders */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Profile Photo Uploader */}
                    <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center text-center">
                        <h3 className="font-bold text-white text-sm font-['Syne'] uppercase tracking-wider mb-4">
                            Foto Profil
                        </h3>
                        
                        <div className="relative group w-36 h-36 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full overflow-hidden mb-4">
                            {data?.photo_url ? (
                                <img
                                    src={data.photo_url}
                                    alt="Foto profil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Photo
                                </div>
                            )}
                        </div>

                        <form onSubmit={handlePhotoSubmit} className="w-full space-y-3">
                            <label className="flex items-center justify-center gap-2 w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all">
                                <Camera size={14} />
                                Pilih Foto
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setPhotoData('photo', e.target.files[0])}
                                />
                            </label>
                            {errorsPhoto.photo && (
                                <p className="text-red-500 text-xs text-left font-mono">{errorsPhoto.photo}</p>
                            )}
                            <button
                                type="submit"
                                disabled={processingPhoto}
                                className="w-full bg-[#FF3D00] hover:bg-[#FF6B35] text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-all"
                            >
                                {processingPhoto ? 'Mengunggah...' : 'Perbarui Foto'}
                            </button>
                        </form>
                    </div>

                    {/* CV PDF Uploader */}
                    <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6">
                        <h3 className="font-bold text-white text-sm font-['Syne'] uppercase tracking-wider mb-4 text-center">
                            Dokumen CV
                        </h3>

                        <div className="flex items-center gap-3 p-4 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl mb-4">
                            <FileText className="text-[#FF3D00] flex-shrink-0" size={24} />
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-400 font-mono truncate">
                                    {data?.cv_file ? data.cv_file.split('/').pop() : 'Belum ada file CV'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleCvSubmit} className="space-y-3">
                            <label className="flex items-center justify-center gap-2 w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-gray-300 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all">
                                <FileText size={14} />
                                Pilih File PDF
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => setCvData('cv_file', e.target.files[0])}
                                />
                            </label>
                            {errorsCv.cv_file && (
                                <p className="text-red-500 text-xs font-mono">{errorsCv.cv_file}</p>
                            )}
                            <button
                                type="submit"
                                disabled={processingCv}
                                className="w-full bg-[#FF3D00] hover:bg-[#FF6B35] text-white text-xs font-bold py-2.5 px-4 rounded-xl disabled:opacity-50 transition-all"
                            >
                                {processingCv ? 'Mengunggah...' : 'Perbarui CV'}
                            </button>
                        </form>
                    </div>

                </div>

                {/* Right side: Information form */}
                <div className="lg:col-span-8 bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8">
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={infoData.name}
                                    onChange={(e) => setInfoData('name', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.name && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Gelar / Bidang</label>
                                <input
                                    type="text"
                                    value={infoData.title}
                                    onChange={(e) => setInfoData('title', e.target.value)}
                                    placeholder="e.g. D3 Teknologi Informasi"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.title && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.title}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Universitas</label>
                                <input
                                    type="text"
                                    value={infoData.university}
                                    onChange={(e) => setInfoData('university', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.university && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.university}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Fakultas</label>
                                <input
                                    type="text"
                                    value={infoData.faculty}
                                    onChange={(e) => setInfoData('faculty', e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.faculty && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.faculty}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Lokasi / Domisili</label>
                                <input
                                    type="text"
                                    value={infoData.location}
                                    onChange={(e) => setInfoData('location', e.target.value)}
                                    placeholder="e.g. Malang, Jawa Timur"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.location && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.location}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Status Pekerjaan</label>
                                <input
                                    type="text"
                                    value={infoData.status}
                                    onChange={(e) => setInfoData('status', e.target.value)}
                                    placeholder="e.g. Open to Work"
                                    className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                    required
                                />
                                {errorsInfo.status && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.status}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Tagline Singkat</label>
                            <input
                                type="text"
                                value={infoData.tagline}
                                onChange={(e) => setInfoData('tagline', e.target.value)}
                                placeholder="1 Kalimat Keren"
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                required
                            />
                            {errorsInfo.tagline && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.tagline}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Biografi Singkat</label>
                            <textarea
                                value={infoData.bio}
                                onChange={(e) => setInfoData('bio', e.target.value)}
                                rows={4}
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all resize-none"
                                required
                            />
                            {errorsInfo.bio && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.bio}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Quote Hidup</label>
                            <input
                                type="text"
                                value={infoData.quote}
                                onChange={(e) => setInfoData('quote', e.target.value)}
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all"
                                required
                            />
                            {errorsInfo.quote && <p className="text-red-500 text-xs mt-1 font-mono">{errorsInfo.quote}</p>}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[#2A2A2A]">
                            <button
                                type="submit"
                                disabled={processingInfo}
                                className="bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50 transition-all text-sm shadow-md"
                            >
                                {processingInfo ? 'Menyimpan...' : 'Simpan Informasi'}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    )
}
