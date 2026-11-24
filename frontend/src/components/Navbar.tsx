import React from 'react'
import { Shield, PhoneCall, Sparkles, BookOpen, CheckSquare, Users } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSOS: () => void
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { isElderMode, toggleElderMode } = useElderMode()

  const navItems = [
    { id: 'check', label: 'Kiểm tra', icon: Shield },
    { id: 'report', label: 'Báo cáo', icon: null },
    { id: 'education', label: 'Bài học 01p', icon: BookOpen },
    { id: 'quiz', label: 'Trắc nghiệm', icon: CheckSquare },
    { id: 'volunteer', label: 'Đội tình nguyện', icon: Users }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand identity */}
        <div
          onClick={() => setActiveTab('check')}
          className="flex cursor-pointer items-center gap-3 select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs transition-transform hover:scale-105">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                LÁ CHẮN SỐ
              </span>
              <Badge variant="secondary" className="font-bold text-[10px] tracking-wider uppercase bg-blue-50 text-blue-800 border-blue-200">
                ĐỒNG NAI
              </Badge>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Hệ thống phòng chống lừa đảo trực tuyến
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Elder Mode Toggle */}
          <Button
            type="button"
            variant={isElderMode ? 'secondary' : 'outline'}
            size="sm"
            onClick={toggleElderMode}
            className={`font-bold transition-all ${
              isElderMode
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-200'
                : 'text-slate-700'
            }`}
            title="Bật/Tắt giao diện chữ lớn cho người cao tuổi"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isElderMode ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Chữ to (65+)</span>
          </Button>

          {/* Emergency SOS Button */}
          <Button
            type="button"
            variant="danger-solid"
            size="sm"
            onClick={onOpenSOS}
            className="gap-2 font-bold shadow-xs active:scale-95"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Hỏi người thân</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex lg:hidden border-t border-slate-200/80 bg-slate-50/90 overflow-x-auto px-2 py-1.5 gap-1 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 py-1.5 rounded-lg px-2.5 text-center font-semibold whitespace-nowrap transition-colors ${
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
