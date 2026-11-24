import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Clock, ArrowRight, X, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'
import type { ScenarioItem } from '../types'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

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
    const text = `Hồ sơ số ${item.id}: ${item.title}. Kịch bản thao túng: ${item.summary}. Dấu hiệu vạch trần: ${item.key_warning}. Hành động phản xạ tức thì: ${item.action_guide}`
    speak(text)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40 mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-mono font-semibold text-emerald-300 border border-emerald-800 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>CẨM NANG BÓC PHỐT CHIÊU TRÒ — KỸ NĂNG AN TOÀN SỐ</span>
          </div>
          <h1 className={`font-black tracking-tight text-white ${isElderMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
            10 Hồ sơ Lừa đảo Phổ biến
          </h1>
          <p className={`mt-2 text-slate-300 max-w-2xl leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Mỗi bài học chỉ mất đúng 60 giây để đọc hoặc nghe. Giúp rèn luyện phản xạ phát hiện bẫy thao túng tâm lý và cách từ chối dứt khoát.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2.5">
        <Button
          type="button"
          variant={filterAudience === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('all')}
          className="font-extrabold rounded-xl"
        >
          Tất cả 10 hồ sơ
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'elderly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('elderly')}
          className="font-extrabold rounded-xl gap-2"
        >
          <span>👴 Hồ sơ nhắm vào Người cao tuổi</span>
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'student' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('student')}
          className="font-extrabold rounded-xl gap-2"
        >
          <span>🎓 Hồ sơ nhắm vào Học sinh THPT</span>
        </Button>
      </div>

      {/* Case Grid */}
      {loading ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-r-transparent"></div>
          <p className="mt-3 text-sm text-slate-600 font-bold font-mono">ĐANG MỞ TÀI LIỆU HỒ SƠ VỤ VIỆC...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleReadScenario(item)}
              className="group hover:border-slate-900 hover:shadow-md transition-all cursor-pointer bg-white border-2 border-slate-200/90 rounded-2xl flex flex-col justify-between"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                        #HS-{item.id < 10 ? `0${item.id}` : item.id}
                      </span>
                      <Badge
                        variant={
                          item.target_audience === 'elderly'
                            ? 'warning'
                            : item.target_audience === 'student'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="font-bold text-[10px]"
                      >
                        {item.target_audience === 'elderly'
                          ? 'Người cao tuổi (65+)'
                          : item.target_audience === 'student'
                          ? 'Học sinh THPT'
                          : 'Cộng đồng'}
                      </Badge>
                    </div>

                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400 font-bold">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> 01 PHÚT
                    </span>
                  </div>

                  <h3 className={`font-black text-slate-950 group-hover:text-blue-700 transition-colors leading-snug ${
                    isElderMode ? 'text-2xl' : 'text-lg'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Mở hồ sơ & Nghe đọc <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Case Details Modal */}
      {selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border-2 border-slate-300 shadow-2xl rounded-3xl overflow-hidden bg-white">
            <div className="bg-slate-900 text-white p-6 flex items-start justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono font-bold text-xs bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                    HỒ SƠ THỰC NGHIỆM #{selectedScenario.id}
                  </span>
                  <span className="font-mono text-xs text-slate-400 font-bold">01 PHÚT ĐỌC / NGHE</span>
                </div>
                <h2 className={`font-black text-white ${isElderMode ? 'text-3xl' : 'text-xl sm:text-2xl'}`}>
                  {selectedScenario.title}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedScenario(null)
                  stopSpeaking()
                }}
                className="text-slate-400 hover:text-white h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Situation */}
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-1.5">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  1. KỊCH BẢN KẺ LỪA ĐẢO SỬ DỤNG:
                </span>
                <p className={`text-slate-800 leading-relaxed font-medium ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                  {selectedScenario.summary}
                </p>
              </div>

              {/* Warning */}
              <div className="rounded-2xl bg-rose-50 border-2 border-rose-300 p-5 space-y-1.5">
                <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  2. DẤU HIỆU LẬT TẨY CỐT LÕI:
                </span>
                <p className={`text-rose-950 font-black leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                  {selectedScenario.key_warning}
                </p>
              </div>

              {/* Action */}
              <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-5 space-y-1.5">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  3. PHẢN XẠ HÀNH ĐỘNG AN TOÀN:
                </span>
                <p className={`text-emerald-950 font-extrabold leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                  {selectedScenario.action_guide}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : () => handleReadScenario(selectedScenario)}
                  className={`gap-2 font-bold ${isSpeaking ? 'border-rose-400 text-rose-600 bg-rose-50' : 'text-slate-800'}`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Nghe đọc bài học'}</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setSelectedScenario(null)
                    stopSpeaking()
                  }}
                  className="font-bold px-6"
                >
                  Đã nắm rõ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
