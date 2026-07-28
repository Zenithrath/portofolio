import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { CheckCircle2, Quote } from 'lucide-react'

export default function QuotePanel({ data }) {
    const [successMessage, setSuccessMessage] = useState('')

    const {
        data: formData,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        quote: data?.quote || '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccessMessage('')
        put(route('dashboard.quote.update'), {
            onSuccess: () => {
                setSuccessMessage('Quote berhasil diperbarui!')
                setTimeout(() => setSuccessMessage(''), 4000)
            },
        })
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold font-['Syne'] text-white">Kelola Quote</h2>
                <p className="text-gray-400 text-sm mt-1">Perbarui quote kehidupan yang ditampilkan pada halaman portofolio Anda.</p>
            </div>

            {/* Success message */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-2xl animate-fade-in font-medium text-sm">
                    <CheckCircle2 size={18} />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#1C1C1C] border border-[#2A2A2A] text-[#FF3D00] rounded-xl flex items-center justify-center">
                            <Quote size={24} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold font-mono text-gray-400 uppercase mb-2">Quote Halaman Portofolio</label>
                            <textarea
                                value={formData.quote}
                                onChange={(e) => setData('quote', e.target.value)}
                                rows={5}
                                maxLength={500}
                                className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] outline-none transition-all resize-none"
                                placeholder="Tuliskan quote hidup Anda di sini..."
                                required
                            />
                            <div className="flex justify-between items-center mt-2">
                                {errors.quote ? (
                                    <p className="text-red-500 text-xs font-mono">{errors.quote}</p>
                                ) : (
                                    <span />
                                )}
                                <span className="text-[10px] font-mono text-gray-500">
                                    {formData.quote.length} / 500 Karakter
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-[#2A2A2A]">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#FF3D00] hover:bg-[#FF6B35] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50 transition-all text-sm shadow-md"
                        >
                            {processing ? 'Menyimpan...' : 'Perbarui Quote'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
