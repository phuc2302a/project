import { useState } from 'react'
import { ElderModeProvider } from './contexts/ElderModeContext'
import { Navbar } from './components/Navbar'
import { SOSModal } from './components/SOSModal'
import { CheckScreen } from './pages/CheckScreen'
import { ReportScreen } from './pages/ReportScreen'
import { EducationScreen } from './pages/EducationScreen'
import { QuizScreen } from './pages/QuizScreen'
import { VolunteerScreen } from './pages/VolunteerScreen'
import { Phone, Shield, ExternalLink } from 'lucide-react'

export function AppContent() {
  const [activeTab, setActiveTab] = useState('check')
  const [isSOSOpen, setIsSOSOpen] = useState(false)
  const [suspectInfo, setSuspectInfo] = useState('')

  const handleOpenSOS = (info: string = '') => {
    setSuspectInfo(info)
    setIsSOSOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-zinc-100 font-sans selection:bg-neutral-700 selection:text-white">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => handleOpenSOS('')}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {activeTab === 'check' && (
          <CheckScreen onOpenSOSWithInfo={(info) => handleOpenSOS(info)} />
        )}
        {activeTab === 'report' && <ReportScreen />}
        {activeTab === 'education' && <EducationScreen />}
        {activeTab === 'quiz' && <QuizScreen />}
        {activeTab === 'volunteer' && <VolunteerScreen />}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-[#050507] py-10 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-neutral-400">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              <span>Đường dây nóng Công an Đồng Nai:</span>
              <a href="tel:0693480113" className="font-mono font-bold text-zinc-200 hover:text-white">0693.480.113</a>
            </span>
            <span className="text-neutral-700">•</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Tổng đài Quốc gia Bảo vệ Trẻ em:</span>
              <a href="tel:111" className="font-mono font-bold text-zinc-200 hover:text-white">111</a>
            </span>
            <span className="text-neutral-700">•</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cục An toàn thông tin (AIS)</span>
            </span>
          </div>

          <p className="text-neutral-500 font-medium">
            Lá Chắn Số — Hệ thống công nghệ phòng chống tội phạm lừa đảo trực tuyến • Hội thi Tin học Đồng Nai 2026
          </p>
        </div>
      </footer>

      {/* SOS Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        suspectInfo={suspectInfo}
      />
    </div>
  )
}

export default function App() {
  return (
    <ElderModeProvider>
      <AppContent />
    </ElderModeProvider>
  )
}
