import React from 'react'
import { Shield, PhoneCall, Sparkles, Search, AlertOctagon, BookOpen, Award, BarChart3, Phone } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSOS: () => void
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { isElderMode, toggleElderMode } = useElderMode()

  const navItems = [
    { id: 'check', label: 'Tra cứu nhanh', icon: Search },
    { id: 'report', label: 'Tố giác lừa đảo', icon: AlertOctagon },
    { id: 'education', label: 'Kỹ năng 01 phút', icon: BookOpen },
    { id: 'quiz', label: 'Thử thách nhận diện', icon: Award },
    { id: 'volunteer', label: 'Đội tình nguyện', icon: BarChart3 }
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Emergency helpline */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Đường dây nóng:
            </span>
            <span className="text-slate-300">
              Công an tỉnh Đồng Nai: <a href="tel:0693480113" className="font-bold text-amber-300 hover:underline">0693.480.113</a>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              Bảo vệ trẻ em: <a href="tel:111" className="font-bold text-emerald-400 hover:underline">111</a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Đồng bộ dữ liệu an ninh mạng 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('check')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white shadow-sm transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
                LÁ CHẮN SỐ
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Đồng Nai
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Nền tảng phòng ngừa & nhận diện lừa đảo trực tuyến
            </p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Elder Mode Toggle */}
          <button
            type="button"
            onClick={toggleElderMode}
            title="Bật/Tắt chế độ cỡ chữ lớn cho người cao tuổi"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              isElderMode
                ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs ring-2 ring-amber-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isElderMode ? 'text-amber-700' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Chế độ người cao tuổi</span>
            <span className="sm:hidden font-mono text-xs">{isElderMode ? 'Cỡ chữ: Lớn' : 'Chữ lớn'}</span>
          </button>

          {/* SOS Button: Reassuring and easy to locate */}
          <button
            type="button"
            onClick={onOpenSOS}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow active:scale-98 ring-2 ring-rose-200"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Hỏi người thân (SOS)</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="flex lg:hidden border-t border-slate-200/80 bg-slate-50/90 overflow-x-auto px-2 py-2 gap-1.5 text-xs no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs font-bold'
                  : 'text-slate-700 bg-white border border-slate-200/60 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
