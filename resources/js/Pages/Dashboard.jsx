import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import Sidebar from './Dashboard/Sidebar'
import PersonalPanel from './Dashboard/PersonalPanel'
import SkillsPanel from './Dashboard/SkillsPanel'
import JourneyPanel from './Dashboard/JourneyPanel'
import ProjectsPanel from './Dashboard/ProjectsPanel'
import CertificatesPanel from './Dashboard/CertificatesPanel'
import ExperiencePanel from './Dashboard/ExperiencePanel'
import QuotePanel from './Dashboard/QuotePanel'
import ContactPanel from './Dashboard/ContactPanel'
import CvPanel from './Dashboard/CvPanel'
import { Menu } from 'lucide-react'

export default function Dashboard({ personal, skills, journey, projects, certificates, experiences, contacts }) {
    const [activeTab, setActiveTab] = useState('personal')
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    const renderPanel = () => {
        switch (activeTab) {
            case 'personal':
                return <PersonalPanel data={personal} />
            case 'skills':
                return <SkillsPanel skills={skills} />
            case 'journey':
                return <JourneyPanel journey={journey} />
            case 'projects':
                return <ProjectsPanel projects={projects} />
            case 'certificates':
                return <CertificatesPanel certificates={certificates} />
            case 'experience':
                return <ExperiencePanel experiences={experiences} />
            case 'quote':
                return <QuotePanel data={personal} />
            case 'contact':
                return <ContactPanel contacts={contacts} />
            case 'cv':
                return <CvPanel data={personal} />
            default:
                return <PersonalPanel data={personal} />
        }
    }

    const getPanelTitle = () => {
        switch (activeTab) {
            case 'personal': return 'Informasi Personal'
            case 'skills': return 'Keahlian'
            case 'journey': return 'Perjalanan & Edukasi'
            case 'projects': return 'Portofolio Proyek'
            case 'certificates': return 'Sertifikasi & Lisensi'
            case 'experience': return 'Pengalaman Kerja'
            case 'quote': return 'Quote Kehidupan'
            case 'contact': return 'Saluran Kontak'
            case 'cv': return 'Curriculum Vitae'
            default: return 'Dashboard'
        }
    }

    return (
        <>
            <Head>
                <title>{`Admin Panel - ${getPanelTitle()}`}</title>
            </Head>

            <div className="bg-[#0A0A0A] text-[#F5F5F5] min-h-screen flex font-['DM_Sans']">
                
                {/* Fixed Sidebar navigation */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isMobileOpen={isMobileSidebarOpen}
                    setIsMobileOpen={setIsMobileSidebarOpen}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    
                    {/* Top navbar on mobile */}
                    <header className="h-16 border-b border-[#2A2A2A] bg-[#131313] flex items-center justify-between px-6 sticky top-0 z-30 md:hidden">
                        <span className="font-['Syne'] font-bold text-white text-base">
                            Admin<span className="text-[#FF3D00]">Panel</span>
                        </span>
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                    </header>

                    {/* Main Scrollable Content */}
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
                        {renderPanel()}
                    </main>

                </div>

            </div>
        </>
    )
}
