import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Clock, ShieldAlert, ArrowRight, X, BookOpen } from 'lucide-react'
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
    const text = `Bài học 1 phút: ${item.title}. Tình huống: ${item.summary}. Dấu hiệu cảnh báo: ${item.key_warning}. Cách xử lý: ${item.action_guide}`
    speak(text)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 mb-3 border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>CẨM NANG PHÒNG VỆ SỐ 01 PHÚT</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          10 Tình huống Lừa đảo Phổ biến
        </h1>
        <p className={`mt-1.5 text-slate-600 ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Được tóm lược ngắn gọn, dễ nhớ, có hướng dẫn nhận diện dấu hiệu và cách xử lý an toàn ngay lập tức.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant={filterAudience === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('all')}
          className="font-bold rounded-lg"
        >
          Tất cả (10 tình huống)
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'elderly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('elderly')}
          className="font-bold rounded-lg gap-1.5"
        >
          <span>👴 Người cao tuổi</span>
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'student' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('student')}
          className="font-bold rounded-lg gap-1.5"
        >
          <span>🎓 Học sinh THPT</span>
        </Button>
      </div>

      {/* Grid Cards */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-500 font-medium">Đang tải danh sách bài học...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleReadScenario(item)}
              className="group hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <Badge
                      variant={
                        item.target_audience === 'elderly'
                          ? 'warning'
                          : item.target_audience === 'student'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="font-semibold"
                    >
                      {item.target_audience === 'elderly'
                        ? 'Người cao tuổi'
                        : item.target_audience === 'student'
                        ? 'Học sinh'
                        : 'Phổ thông'}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                      <Clock className="w-3 h-3" /> 01 phút đọc
                    </span>
                  </div>

                  <h3 className={`font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors ${
                    isElderMode ? 'text-xl' : 'text-base'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1 text-slate-900">
                    Xem & Nghe hướng dẫn <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="rounded-lg p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl border-slate-200 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold text-xs">
                      Tình huống #{selectedScenario.id}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">01 phút đọc</span>
                  </div>
                  <h2 className={`mt-2 font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
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
                  className="h-8 w-8 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-4 space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Diễn biến tình huống:
                  </span>
                  <p className={`text-slate-700 leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    {selectedScenario.summary}
                  </p>
                </div>

                <div className="rounded-xl bg-rose-50/70 p-4 border border-rose-200">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    Dấu hiệu cảnh báo then chốt:
                  </span>
                  <p className={`text-rose-950 font-semibold leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    {selectedScenario.key_warning}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50/70 p-4 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Cách xử lý an toàn:
                  </span>
                  <p className={`text-emerald-950 font-medium leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    {selectedScenario.action_guide}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeaking : () => handleReadScenario(selectedScenario)}
                  className={`gap-1.5 font-bold ${isSpeaking ? 'border-rose-300 text-rose-600' : ''}`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Nghe đọc bài học'}</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setSelectedScenario(null)
                    stopSpeaking()
                  }}
                  className="font-bold"
                >
                  Đã hiểu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
