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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navbar điều hướng */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => handleOpenSOS('')}
      />

      {/* Nội dung trang tương ứng */}
      <main className="flex-1 pb-16">
        {activeTab === 'check' && (
          <CheckScreen onOpenSOSWithInfo={(info) => handleOpenSOS(info)} />
        )}
        {activeTab === 'report' && <ReportScreen />}
        {activeTab === 'education' && <EducationScreen />}
        {activeTab === 'quiz' && <QuizScreen />}
        {activeTab === 'volunteer' && <VolunteerScreen />}
      </main>

      {/* Footer & Đường dây nóng khẩn cấp */}
      <footer className="border-t bg-white py-8 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-gray-700 mb-4">
            <span className="flex items-center gap-1.5 text-red-600 font-bold">
              <Phone className="w-4 h-4" /> Tổng đài Quốc gia Bảo vệ Trẻ em: 111
            </span>
            <span className="flex items-center gap-1.5 text-blue-700 font-bold">
              <Shield className="w-4 h-4" /> Trực ban Công an tỉnh Đồng Nai: 0693.480.113
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ExternalLink className="w-4 h-4" /> Cục An toàn thông tin (AIS)
            </span>
          </div>

          <p className="font-bold text-gray-800">
            Dự án LÁ CHẮN SỐ — Hội thi Tin học / Hackathon Đồng Nai 2026
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ứng dụng hỗ trợ kiểm tra an toàn số, nâng cao kỹ năng phòng chống lừa đảo trực tuyến cho cộng đồng.
          </p>
        </div>
      </footer>

      {/* Modal khẩn cấp Hỏi người thân */}
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
