import React from 'react'
import { Shield, PhoneCall, Sparkles } from 'lucide-react'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
  onOpenSOS: () => void
}

export const Navbar: React.FC<Props> = ({ activeTab, setActiveTab, onOpenSOS }) => {
  const { isElderMode, toggleElderMode } = useElderMode()

  const navItems = [
    { id: 'check', label: 'Tra cứu an toàn' },
    { id: 'report', label: 'Tố giác lừa đảo' },
    { id: 'education', label: 'Cẩm nang 01p' },
    { id: 'quiz', label: 'Thử thách nhận diện' },
    { id: 'volunteer', label: 'Đội tình nguyện' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#050507]/80 backdrop-blur-xl border-b border-neutral-900/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand like AgentVet.ai */}
        <div
          onClick={() => setActiveTab('check')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-white group-hover:border-neutral-700 transition-colors">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-neutral-200 transition-colors font-mono">
              LaChanSo<span className="text-neutral-500">.vn</span>
            </span>
            <span className="bg-neutral-900 text-neutral-400 text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-800">
              Đồng Nai
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-white bg-neutral-900/80 border border-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          {/* Elder Mode Toggle */}
          <button
            type="button"
            onClick={toggleElderMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isElderMode
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isElderMode ? 'Chữ lớn: BẬT' : 'Chế độ người già'}</span>
          </button>

          {/* SOS Button */}
          <button
            type="button"
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Hỏi người thân (SOS)</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-neutral-900 bg-[#050507] overflow-x-auto px-4 py-2 gap-1 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  )
}
