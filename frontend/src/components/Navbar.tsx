import React from 'react'
import { Shield, PhoneCall, Sparkles, BookOpen, CheckSquare, Users, Radio } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from './ui/button'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSOS: () => void
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { isElderMode, toggleElderMode } = useElderMode()

  const navItems = [
    { id: 'check', label: 'Bàn giám định', icon: Shield },
    { id: 'report', label: 'Tố giác lừa đảo', icon: null },
    { id: 'education', label: 'Hồ sơ 01 phút', icon: BookOpen },
    { id: 'quiz', label: 'Thực hành phản xạ', icon: CheckSquare },
    { id: 'volunteer', label: 'Trung tâm chỉ huy', icon: Users }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top micro-bar: Civic Intelligence Status */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1 text-[11px] font-medium hidden sm:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            KÊNH GIÁM ĐỊNH TRỰC TUYẾN 24/7
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Công an tỉnh & Tỉnh đoàn Đồng Nai</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
          <span>CẬP NHẬT: 120 VỤ BÁO CÁO / THÁNG</span>
          <span>ĐƯỜNG DẪN GIẢ MẠO: 35%</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand identity */}
        <div
          onClick={() => setActiveTab('check')}
          className="flex cursor-pointer items-center gap-3 select-none group"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md transition-transform group-hover:scale-105 border border-slate-700/50">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <Radio className="h-2 w-2 text-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-950 font-mono">
                LÁ CHẮN SỐ
              </span>
              <span className="rounded-md bg-blue-100 text-blue-900 border border-blue-300 font-extrabold text-[10px] px-1.5 py-0.2 tracking-wider">
                ĐỒNG NAI
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 tracking-tight hidden sm:block">
              Nền tảng kiểm định rủi ro & cứu trợ an toàn số
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/90 shadow-2xs">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Elder Mode Toggle */}
          <button
            type="button"
            onClick={toggleElderMode}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold transition-all border shadow-2xs ${
              isElderMode
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Bật/Tắt giao diện chữ lớn cho người cao tuổi"
          >
            <Sparkles className={`w-4 h-4 ${isElderMode ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>{isElderMode ? 'Chữ to 65+ (ĐANG BẬT)' : 'Chữ to 65+'}</span>
          </button>

          {/* Emergency SOS Button */}
          <Button
            type="button"
            variant="danger-solid"
            onClick={onOpenSOS}
            className="gap-2 font-black shadow-md radar-badge h-10 px-4 rounded-xl active:scale-95 transition-transform"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="tracking-tight">HỎI NGƯỜI THÂN</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex lg:hidden border-t border-slate-200 bg-slate-50 overflow-x-auto px-2 py-1.5 gap-1.5 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 py-2 rounded-xl px-3 text-center font-bold whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  )
}
