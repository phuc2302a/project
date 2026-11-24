import React from 'react'
import { Shield, PhoneCall, Sparkles, BookOpen, CheckSquare, Users } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSOS: () => void
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { isElderMode, toggleElderMode } = useElderMode()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('check')}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-blue-900 sm:text-2xl">
                LÁ CHẮN SỐ
              </span>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                ĐỒNG NAI
              </span>
            </div>
            <p className="text-xs text-gray-500 hidden sm:block">An toàn thông tin & Phòng chống lừa đảo</p>
          </div>
        </div>

        {/* Menu Điều hướng */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-gray-700">
          <button
            onClick={() => setActiveTab('check')}
            className={`rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'check' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-100'
            }`}
          >
            Kiểm tra nhanh
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'report' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-100'
            }`}
          >
            Báo cáo lừa đảo
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'education' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Bài học 01 phút
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'quiz' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Trắc nghiệm
          </button>
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'volunteer' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Đội tình nguyện
          </button>
        </nav>

        {/* Nút Người cao tuổi & Nút Hỏi người thân */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút gạt Chế độ Người cao tuổi */}
          <button
            onClick={toggleElderMode}
            className={`flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all shadow-sm ${
              isElderMode
                ? 'border-amber-500 bg-amber-100 text-amber-900 ring-2 ring-amber-300'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            title="Bật/Tắt giao diện chữ to cho người cao tuổi"
          >
            <Sparkles className={`w-4 h-4 ${isElderMode ? 'text-amber-600' : 'text-gray-500'}`} />
            <span className="hidden sm:inline">Chữ to (65+)</span>
            <span className="sm:hidden">65+</span>
          </button>

          {/* Nút khẩn cấp "Hỏi người thân" */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-white font-bold shadow-md hover:bg-red-700 active:scale-95 transition-all animate-pulse"
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-sm sm:text-base">Hỏi người thân</span>
          </button>
        </div>
      </div>

      {/* Thanh điều hướng Mobile (dưới màn hình hẹp) */}
      <div className="flex md:hidden border-t overflow-x-auto px-2 py-1.5 gap-1 bg-gray-50 text-xs">
        <button
          onClick={() => setActiveTab('check')}
          className={`flex-1 py-1.5 rounded px-2 text-center whitespace-nowrap ${
            activeTab === 'check' ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'
          }`}
        >
          Kiểm tra
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-1.5 rounded px-2 text-center whitespace-nowrap ${
            activeTab === 'report' ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'
          }`}
        >
          Báo cáo
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 py-1.5 rounded px-2 text-center whitespace-nowrap ${
            activeTab === 'education' ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'
          }`}
        >
          Bài học
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-1.5 rounded px-2 text-center whitespace-nowrap ${
            activeTab === 'quiz' ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'
          }`}
        >
          Trắc nghiệm
        </button>
        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex-1 py-1.5 rounded px-2 text-center whitespace-nowrap ${
            activeTab === 'volunteer' ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'
          }`}
        >
          Tình nguyện
        </button>
      </div>
    </header>
  )
}
