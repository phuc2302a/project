import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Clock, ArrowRight, X, BookOpen, AlertTriangle, CheckCircle2, Shield } from 'lucide-react'
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
    const text = `Bài học: ${item.title}. Tình huống: ${item.summary}. Dấu hiệu nhận diện lừa đảo: ${item.key_warning}. Cách xử lý an toàn: ${item.action_guide}`
    speak(text)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kỹ Năng Số 01 Phút — Bóc Mẽ Chiêu Trò Lừa Đảo</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          10 Hồ Sơ Lừa Đảo Phổ Biến Tại Đồng Nai
        </h1>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Mỗi tình huống chỉ mất 60 giây để đọc hoặc nghe. Rèn luyện phản xạ phát hiện bẫy tâm lý và cách từ chối dứt khoát.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          variant={filterAudience === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('all')}
          className="font-bold rounded-xl"
        >
          Tất cả 10 tình huống
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'elderly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('elderly')}
          className="font-bold rounded-xl gap-1.5"
        >
          <span>👴 Người cao tuổi (65+)</span>
        </Button>
        <Button
          type="button"
          variant={filterAudience === 'student' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterAudience('student')}
          className="font-bold rounded-xl gap-1.5"
        >
          <span>🎓 Học sinh & Sinh viên</span>
        </Button>
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-r-transparent"></div>
          <p className="mt-3 text-sm text-slate-600 font-bold">Đang tải danh sách bài học...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <Card
              key={item.id}
              className="border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={item.target_audience === 'elderly' ? 'warning' : 'secondary'}
                    className="font-bold"
                  >
                    {item.target_audience === 'elderly' ? '👴 Người cao tuổi' : '🎓 Học sinh THPT'}
                  </Badge>

                  <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>01 phút đọc</span>
                  </div>
                </div>

                <div>
                  <h3 className={`font-black text-slate-900 leading-snug ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                {/* Key red flag banner */}
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Dấu hiệu bóc trần chiêu trò:</span>
                  </div>
                  <p className="font-medium">{item.key_warning}</p>
                </div>

                {/* Action Guide */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Phản xạ 3 KHÔNG tức thì:</span>
                  </div>
                  <p className="font-medium">{item.action_guide}</p>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleReadScenario(item)}
                    className="font-bold rounded-xl gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Nghe đọc bài học</span>
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSelectedScenario(item)}
                    className="font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white gap-1"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal chi tiết hồ sơ khi bấm vào */}
      {selectedScenario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className={`w-full max-w-xl border-slate-200 shadow-2xl bg-white rounded-3xl overflow-hidden max-h-[90vh] flex flex-col ${isElderMode ? 'text-xl' : 'text-base'}`}>
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-lg">Hồ Sơ Vụ Việc Chi Tiết</h2>
                  <p className="text-xs text-slate-500 font-medium">{selectedScenario.target_audience === 'elderly' ? 'Đối tượng: Người cao tuổi' : 'Đối tượng: Học sinh & Sinh viên'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setSelectedScenario(null)
                }}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-200 text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h3 className="text-xl font-black text-slate-950 mb-2">{selectedScenario.title}</h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedScenario.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Bẫy thao túng tâm lý:
                </span>
                <p className="text-sm sm:text-base text-rose-950 font-medium leading-relaxed">
                  {selectedScenario.key_warning}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Nguyên tắc xử lý 3 KHÔNG:
                </span>
                <p className="text-sm sm:text-base text-emerald-950 font-medium leading-relaxed">
                  {selectedScenario.action_guide}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={isSpeaking ? stopSpeaking : () => handleReadScenario(selectedScenario)}
                className="font-bold rounded-xl gap-2"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
                <span>{isSpeaking ? 'Dừng đọc' : 'Đọc bài học'}</span>
              </Button>

              <Button
                type="button"
                onClick={() => {
                  stopSpeaking()
                  setSelectedScenario(null)
                }}
                className="font-bold rounded-xl bg-slate-900 text-white"
              >
                Đã hiểu rõ
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
