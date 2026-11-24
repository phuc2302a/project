import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Clock, ArrowRight, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'
import type { ScenarioItem } from '../types'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'

export const EducationScreen: React.FC = () => {
  const { isElderMode } = useElderMode()
  const { speak, stopSpeaking, isSpeaking } = useSpeech()

  const [scenarios, setScenarios] = useState<ScenarioItem[]>([])
  const [filterAudience, setFilterAudience] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const data = await api.getScenarios(filterAudience)
        setScenarios(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filterAudience])

  const handleReadScenario = (item: ScenarioItem) => {
    setSelectedScenario(item)
    const text = `Bài học: ${item.title}. Kịch bản thao túng: ${item.summary}. Dấu hiệu vạch trần: ${item.key_warning}. Cách xử lý 3 không: ${item.action_guide}`
    speak(text)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:px-6">
      {/* Eyebrow Kicker */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          KỸ NĂNG AN TOÀN SỐ 01 PHÚT • PHẢN XẠ PHÒNG CHỐNG BẪY TÂM LÝ
        </span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1
          className={`font-black tracking-tight text-white ${
            isElderMode ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-5xl'
          }`}
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          10 Hồ sơ lừa đảo{' '}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
            phổ biến
          </span>{' '}
          tại Đồng Nai.
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
          Mỗi bài học chỉ mất đúng 60 giây để đọc hoặc nghe. Giúp rèn luyện phản xạ phát hiện bẫy thao túng tâm lý và cách từ chối dứt khoát.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        <button
          type="button"
          onClick={() => setFilterAudience('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filterAudience === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
          }`}
        >
          Tất cả 10 hồ sơ
        </button>
        <button
          type="button"
          onClick={() => setFilterAudience('elderly')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filterAudience === 'elderly'
              ? 'bg-white text-black border-white'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
          }`}
        >
          👴 Người cao tuổi (65+)
        </button>
        <button
          type="button"
          onClick={() => setFilterAudience('student')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filterAudience === 'student'
              ? 'bg-white text-black border-white'
              : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
          }`}
        >
          🎓 Học sinh & Giới trẻ
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-neutral-500 font-mono text-sm">
          Đang tải dữ liệu hồ sơ...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-6 hover:border-neutral-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-400 text-[11px] uppercase">
                    {item.target_audience === 'elderly' ? '👴 Người cao tuổi' : '🎓 Học sinh THPT'}
                  </span>
                  <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> 60 giây
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg leading-snug">{item.title}</h3>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="bg-[#141418] border border-neutral-800/80 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-rose-400 font-mono text-[10px] uppercase font-bold block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Dấu hiệu bóc trần bẫy:
                  </span>
                  <p className="text-neutral-300">{item.key_warning}</p>
                </div>

                <div className="bg-[#141418] border border-neutral-800/80 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Phản xạ 3 KHÔNG:
                  </span>
                  <p className="text-neutral-300">{item.action_guide}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleReadScenario(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nghe bài học</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedScenario(item)}
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors font-medium"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0e0e11] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 text-zinc-100">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-xs text-neutral-500 uppercase">Hồ sơ tình huống</span>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setSelectedScenario(null)
                }}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">{selectedScenario.title}</h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed bg-[#141418] p-4 rounded-xl border border-neutral-800">
                {selectedScenario.summary}
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold block">Bẫy thao túng tâm lý:</span>
                <p className="text-rose-200">{selectedScenario.key_warning}</p>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold block">Nguyên tắc xử lý:</span>
                <p className="text-emerald-200">{selectedScenario.action_guide}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                type="button"
                onClick={isSpeaking ? stopSpeaking : () => handleReadScenario(selectedScenario)}
                className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold hover:border-neutral-700 flex items-center gap-1.5"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                <span>{isSpeaking ? 'Dừng đọc' : 'Đọc bài học'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setSelectedScenario(null)
                }}
                className="px-5 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
