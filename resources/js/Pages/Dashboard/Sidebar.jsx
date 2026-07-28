import React from 'react'
import { Link } from '@inertiajs/react'
import {
    User,
    Award,
    Compass,
    Folder,
    Briefcase,
    Quote,
    Mail,
    FileText,
    LogOut,
    Menu,
    X,
} from 'lucide-react'

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) {
    const menuItems = [
        { id: 'personal', label: 'Info Personal', icon: <User size={18} /> },
        { id: 'skills', label: 'Keahlian', icon: <Award size={18} /> },
        { id: 'journey', label: 'Perjalanan', icon: <Compass size={18} /> },
        { id: 'projects', label: 'Proyek', icon: <Folder size={18} /> },
        { id: 'certificates', label: 'Sertifikasi', icon: <Award size={18} /> },
        { id: 'experience', label: 'Pengalaman', icon: <Briefcase size={18} /> },
        { id: 'quote', label: 'Quote', icon: <Quote size={18} /> },
        { id: 'contact', label: 'Kontak', icon: <Mail size={18} /> },
        { id: 'cv', label: 'CV', icon: <FileText size={18} /> },
    ]

    return (
        <>
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-[#131313] border-r border-[#2A2A2A] h-screen sticky top-0">
                {/* Brand */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[#2A2A2A]">
                    <span className="font-['Syne'] font-extrabold text-lg text-white">
                        AI<span className="text-[#FF3D00]">Systems</span>
                    </span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === item.id
                                    ? 'bg-[#FF3D00] text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1C1C1C]'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Footer/Logout */}
                <div className="p-4 border-t border-[#2A2A2A]">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:text-white hover:bg-red-950/20 transition-all text-left"
                    >
                        <LogOut size={18} />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    ></div>

                    {/* Content Drawer */}
                    <div className="relative flex flex-col w-64 max-w-xs bg-[#131313] h-full z-10 border-r border-[#2A2A2A]">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2A2A2A]">
                            <span className="font-['Syne'] font-extrabold text-lg text-white">
                                AI<span className="text-[#FF3D00]">Systems</span>
                            </span>
                            <button onClick={() => setIsMobileOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id)
                                        setIsMobileOpen(false)
                                    }}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === item.id
                                            ? 'bg-[#FF3D00] text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-[#1C1C1C]'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-[#2A2A2A]">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:text-white hover:bg-red-950/20 transition-all text-left"
                            >
                                <LogOut size={18} />
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
