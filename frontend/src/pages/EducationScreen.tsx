import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Clock, ShieldAlert, ArrowRight, X } from 'lucide-react'
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
    const text = `Bài học 1 phút: ${item.title}. Tình huống: ${item.summary}. Dấu hiệu cảnh báo: ${item.key_warning}. Cách xử lý: ${item.action_guide}`
    speak(text)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-lg">
        <h1 className={`font-black tracking-tight ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          Bài học Nhận diện 01 phút theo tình huống
        </h1>
        <p className={`mt-2 text-emerald-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
          10 kịch bản lừa đảo phổ biến nhất được biên soạn ngắn gọn, dễ nhớ, có hướng dẫn hành động tức thì.
        </p>
      </div>

      {/* Bộ lọc đối tượng */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterAudience('all')}
          className={`rounded-xl px-4 py-2 font-bold transition-all ${
            filterAudience === 'all'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          } ${isElderMode ? 'text-lg' : 'text-sm'}`}
        >
          Tất cả tình huống (10)
        </button>
        <button
          onClick={() => setFilterAudience('elderly')}
          className={`rounded-xl px-4 py-2 font-bold transition-all flex items-center gap-1.5 ${
            filterAudience === 'elderly'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          } ${isElderMode ? 'text-lg' : 'text-sm'}`}
        >
          👴 Dành cho Người cao tuổi
        </button>
        <button
          onClick={() => setFilterAudience('student')}
          className={`rounded-xl px-4 py-2 font-bold transition-all flex items-center gap-1.5 ${
            filterAudience === 'student'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          } ${isElderMode ? 'text-lg' : 'text-sm'}`}
        >
          🎓 Dành cho Học sinh THPT
        </button>
      </div>

      {/* Danh sách thẻ bài học */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Đang tải danh sách bài học...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <div
              key={item.id}
              onClick={() => handleReadScenario(item)}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.target_audience === 'elderly'
                      ? 'bg-amber-100 text-amber-800'
                      : item.target_audience === 'student'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.target_audience === 'elderly' ? 'Người cao tuổi' : item.target_audience === 'student' ? 'Học sinh' : 'Phổ thông'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> 01 phút đọc
                  </span>
                </div>

                <h3 className={`font-bold text-gray-900 leading-snug ${isElderMode ? 'text-xl' : 'text-lg'}`}>
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-2 text-sm">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  Xem & Nghe hướng dẫn <ArrowRight className="w-4 h-4" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReadScenario(item)
                  }}
                  className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"
                  title="Nghe đọc bài học"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal chi tiết bài học */}
      {selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    Bài học 01 phút #{selectedScenario.id}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">01 phút đọc</span>
                </div>
                <h2 className={`mt-2 font-black text-gray-900 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                  {selectedScenario.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedScenario(null)
                  stopSpeaking()
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl bg-gray-50 p-4 border">
                <h4 className="font-bold text-gray-800 mb-1">Diễn biến tình huống:</h4>
                <p className={`text-gray-700 ${isElderMode ? 'text-xl' : 'text-base'}`}>{selectedScenario.summary}</p>
              </div>

              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <h4 className="font-bold text-red-900 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Dấu hiệu nhận biết then chốt:
                </h4>
                <p className={`text-red-800 font-semibold ${isElderMode ? 'text-xl' : 'text-base'}`}>{selectedScenario.key_warning}</p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">Cách xử lý an toàn:</h4>
                <p className={`text-emerald-800 font-medium ${isElderMode ? 'text-xl' : 'text-base'}`}>{selectedScenario.action_guide}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <button
                onClick={isSpeaking ? stopSpeaking : () => handleReadScenario(selectedScenario)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-bold shadow-sm ${
                  isSpeaking ? 'text-red-600 border-red-300 bg-red-50' : 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span>{isSpeaking ? 'Dừng đọc' : 'Nghe đọc bài học'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedScenario(null)
                  stopSpeaking()
                }}
                className="rounded-xl bg-gray-800 px-5 py-2 font-bold text-white hover:bg-gray-900"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
