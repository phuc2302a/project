import React, { useState } from 'react'
import { Search, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, PhoneCall, CheckCircle2, Shield } from 'lucide-react'
import { api } from '../services/api'
import type { LookupResponse, ScamAnalysisResult } from '../types'
import { TrafficLightBadge } from '../components/TrafficLightBadge'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'

interface Props {
  onOpenSOSWithInfo: (info: string) => void
}

export const CheckScreen: React.FC<Props> = ({ onOpenSOSWithInfo }) => {
  const { isElderMode } = useElderMode()
  const { speak, stopSpeaking, isSpeaking, startListening, isListening } = useSpeech()

  // State Tabs
  const [activeTab, setActiveTab] = useState<'quick' | 'ai'>('quick')

  // State Kiểm tra nhanh
  const [query, setQuery] = useState('')
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null)
  const [lookupError, setLookupError] = useState('')

  // State AI Phân tích tin nhắn
  const [message, setMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState('')

  // Xử lý Kiểm tra nhanh
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return
    setIsLookingUp(true)
    setLookupError('')
    setLookupResult(null)
    try {
      const res = await api.lookupTarget(query)
      setLookupResult(res)
    } catch {
      setLookupError('Không thể kết nối đến máy chủ kiểm tra. Vui lòng thử lại.')
    } finally {
      setIsLookingUp(false)
    }
  }

  // Xử lý AI Phân tích
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!message.trim()) return
    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisResult(null)
    try {
      const res = await api.analyzeMessage(message)
      setAnalysisResult(res)
    } catch {
      setAnalysisError('Không thể phân tích tin nhắn lúc này. Vui lòng thử lại.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Nhập liệu bằng giọng nói
  const handleVoiceInputQuick = () => {
    startListening((text) => setQuery(text))
  }

  const handleVoiceInputAI = () => {
    startListening((text) => setMessage((prev) => (prev ? `${prev} ${text}` : text)))
  }

  // Đọc to kết quả
  const readQuickResult = () => {
    if (!lookupResult) return
    const text = `Kết quả kiểm tra cho ${lookupResult.target}: Mức độ ${
      lookupResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm' : lookupResult.risk_level === 'SUSPICIOUS' ? 'Nghi ngờ' : 'An toàn'
    }. ${lookupResult.reason}. Lời khuyên: ${lookupResult.recommended_action}`
    speak(text)
  }

  const readAIResult = () => {
    if (!analysisResult) return
    const text = `Điểm rủi ro: ${analysisResult.risk_score} phần trăm. Mức độ: ${
      analysisResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm cao' : 'Nghi ngờ'
    }. Thủ đoạn: ${analysisResult.tactics.join(', ')}. ${analysisResult.reasoning}. Khuyến nghị: ${analysisResult.recommended_action}`
    speak(text)
  }

  // Highlight cụm từ nguy hiểm
  const renderHighlightedMessage = () => {
    if (!analysisResult || analysisResult.dangerous_phrases.length === 0) {
      return <p className="whitespace-pre-wrap">{message}</p>
    }

    let renderedText = message
    analysisResult.dangerous_phrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      renderedText = renderedText.replace(regex, '<mark class="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-1 rounded-sm">$1</mark>')
    })

    return <div dangerouslySetInnerHTML={{ __html: renderedText }} className="whitespace-pre-wrap leading-relaxed" />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Hero: Modern Civic Header */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-700 mb-3 border border-slate-200/60">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>TRUNG TÂM XÁC THỰC AN TOÀN SỐ TRỰC TUYẾN</span>
          </div>
          <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            Kiểm tra rủi ro trước khi chuyển tiền
          </h1>
          <p className={`mt-1.5 text-slate-600 max-w-2xl ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Tra cứu số điện thoại lạ, phát hiện tên miền ngân hàng giả mạo (Typosquatting) và phân tích tin nhắn thao túng tâm lý.
          </p>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="mb-6 flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/80">
        <button
          type="button"
          onClick={() => {
            setActiveTab('quick')
            stopSpeaking()
          }}
          className={`flex-1 rounded-lg py-2.5 text-center font-bold transition-all ${
            activeTab === 'quick'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          } ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}
        >
          🔍 1. Tra cứu nhanh (SĐT, Link, STK)
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('ai')
            stopSpeaking()
          }}
          className={`flex-1 rounded-lg py-2.5 text-center font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          } ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>2. AI Phân tích tin nhắn dán vào</span>
        </button>
      </div>

      {/* ================= TAB 1: KIỂM TRA NHANH ================= */}
      {activeTab === 'quick' && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleLookup} className="space-y-4">
              <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                Nhập Số điện thoại, Đường link hoặc Số tài khoản ngân hàng:
              </label>

              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={
                    isElderMode
                      ? 'VD: 0981248991 hoặc vietcombbank.top'
                      : 'Ví dụ: 0981248991, https://vietcombbank.top, 103876543210...'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white pr-24 pl-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/10 transition-all ${
                    isElderMode ? 'py-4 text-2xl' : 'py-3 text-base'
                  }`}
                />

                {/* Voice Input */}
                <button
                  type="button"
                  onClick={handleVoiceInputQuick}
                  className={`absolute right-12 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
                    isListening ? 'text-rose-600 animate-pulse' : ''
                  }`}
                  title="Nhập bằng giọng nói"
                >
                  {isListening ? <MicOff className="w-5 h-5 text-rose-600" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Search Button */}
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLookingUp || !query.trim()}
                  className="absolute right-1.5 h-8 w-8 rounded-lg"
                  title="Kiểm tra ngay"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold">Mẫu thử nhanh:</span>
                <button
                  type="button"
                  onClick={() => setQuery('https://vietcombbank-smartbanking.top')}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  Link giả Vietcombank
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('0981248991')}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium"
                >
                  SĐT mạo danh công an
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('https://vietcombank.com.vn')}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium"
                >
                  Tên miền chính thống
                </button>
              </div>
            </form>

            {/* Loading */}
            {isLookingUp && (
              <div className="mt-8 text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-r-transparent"></div>
                <p className="mt-2 text-sm text-slate-600 font-medium">Đang đối chiếu dữ liệu danh mục an toàn...</p>
              </div>
            )}

            {/* Error */}
            {lookupError && (
              <div className="mt-6 rounded-xl bg-rose-50 p-4 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{lookupError}</span>
              </div>
            )}

            {/* Result Card */}
            {lookupResult && (
              <div className={`mt-8 rounded-2xl border transition-all ${
                lookupResult.risk_level === 'DANGEROUS'
                  ? 'border-rose-300 bg-rose-50/40'
                  : lookupResult.risk_level === 'SUSPICIOUS'
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-emerald-300 bg-emerald-50/40'
              } p-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <TrafficLightBadge level={lookupResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopSpeaking : readQuickResult}
                    className={`gap-1.5 font-bold ${isSpeaking ? 'border-rose-300 text-rose-600' : ''}`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả'}</span>
                  </Button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className={`font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                      {lookupResult.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">Đối tượng: {lookupResult.target}</p>
                  </div>

                  <div className={`rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                    <p className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Chi tiết phân tích:</p>
                    <p className="text-slate-700 leading-relaxed">{lookupResult.reason}</p>
                  </div>

                  <div className={`rounded-xl bg-slate-900 text-white p-4 shadow-xs ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                    <p className="font-bold flex items-center gap-1.5 text-emerald-400 text-xs uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Khuyến nghị hành động tức thì:
                    </p>
                    <p className="font-medium text-slate-100 leading-relaxed">{lookupResult.recommended_action}</p>
                  </div>
                </div>

                {/* Hỏi người thân banner */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600 italic">
                    Chưa yên tâm? Hãy hỏi ý kiến con cháu trước khi thực hiện chuyển tiền:
                  </span>
                  <Button
                    type="button"
                    variant="danger-solid"
                    onClick={() => onOpenSOSWithInfo(lookupResult.target)}
                    className="w-full sm:w-auto font-bold gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Hỏi người thân ngay</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ================= TAB 2: AI PHÂN TÍCH TIN NHẮN ================= */}
      {activeTab === 'ai' && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                  Dán nội dung tin nhắn hoặc đoạn chat lạ vào đây:
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInputAI}
                  className={`text-xs gap-1 ${isListening ? 'border-rose-300 text-rose-600 animate-pulse' : ''}`}
                >
                  <Mic className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isListening ? 'Đang lắng nghe...' : 'Nói tin nhắn'}</span>
                </Button>
              </div>

              <Textarea
                rows={4}
                placeholder="Ví dụ: 'Cán bộ Công an tỉnh thông báo: Bạn đang có lệnh bắt tạm giam vì liên quan đường dây rửa tiền. Yêu cầu chuyển ngay 50.000.000đ vào tài khoản để phục vụ điều tra...'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={isElderMode ? 'text-xl' : 'text-sm sm:text-base'}
              />

              {/* Sample message chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold">Tin nhắn mẫu:</span>
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      'Bộ Công an thông báo: Bạn đang có lệnh bắt tạm giam. Yêu cầu chuyển ngay 50.000.000đ vào tài khoản 103876543210 để phục vụ điều tra, nếu không sẽ bị cưỡng chế trong 2 giờ!'
                    )
                  }
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Lệnh bắt tạm giam Công an
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      'Tuyển CTV online tại nhà chốt đơn Shopee, hoa hồng 20-30%, nhận tiền ngay sau 5 phút. Bấm vào link http://shopee-ctv-kiemtien.xyz để nhận nhiệm vụ'
                    )
                  }
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Việc nhẹ lương cao Shopee
                </button>
              </div>

              <Button
                type="submit"
                disabled={isAnalyzing || !message.trim()}
                className={`w-full font-bold gap-2 bg-slate-900 hover:bg-slate-800 ${
                  isElderMode ? 'h-14 text-xl' : 'h-11'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{isAnalyzing ? 'AI đang phân tích ngữ cảnh...' : 'Bấm để AI Phân tích rủi ro'}</span>
              </Button>
            </form>

            {/* Error */}
            {analysisError && (
              <div className="mt-6 rounded-xl bg-rose-50 p-4 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* AI Result Card */}
            {analysisResult && (
              <div className={`mt-8 rounded-2xl border transition-all ${
                analysisResult.risk_level === 'DANGEROUS'
                  ? 'border-rose-300 bg-rose-50/40'
                  : analysisResult.risk_level === 'SUSPICIOUS'
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-emerald-300 bg-emerald-50/40'
              } p-6`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <div className="flex items-center gap-3">
                    <TrafficLightBadge level={analysisResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                    <span className="font-mono font-bold text-sm text-slate-700">
                      Điểm rủi ro: <span className="text-rose-600 font-black text-xl">{analysisResult.risk_score}</span>/100
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopSpeaking : readAIResult}
                    className={`gap-1.5 font-bold ${isSpeaking ? 'border-rose-300 text-rose-600' : ''}`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Dừng đọc' : 'Đọc cảnh báo'}</span>
                  </Button>
                </div>

                {/* Tactics */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Thủ đoạn thao túng nhận diện được:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.tactics.map((tactic, idx) => (
                      <Badge key={idx} variant="destructive" className="font-semibold px-2.5 py-1">
                        ⚠️ {tactic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Highlighted text */}
                <div className="mt-4 rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Nội dung tin nhắn (Cụm từ nguy hiểm được đánh dấu):
                  </span>
                  <div className={`p-3 bg-slate-50/70 rounded-lg border border-slate-200/60 text-slate-800 ${
                    isElderMode ? 'text-xl' : 'text-sm'
                  }`}>
                    {renderHighlightedMessage()}
                  </div>
                </div>

                {/* Reasoning & Actions */}
                <div className="mt-4 space-y-3">
                  <div className={`rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Giải thích của AI:
                    </span>
                    <p className="text-slate-700 leading-relaxed">{analysisResult.reasoning}</p>
                  </div>

                  <div className={`rounded-xl bg-slate-900 text-white p-4 shadow-xs ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    <p className="font-bold flex items-center gap-1.5 text-purple-400 text-xs uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Lời khuyên xử lý ngay:
                    </p>
                    <p className="font-medium text-slate-100 leading-relaxed">{analysisResult.recommended_action}</p>
                  </div>
                </div>

                {/* SOS Share */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-xs sm:text-sm text-slate-600 italic">
                    Gửi ngay đoạn tin nhắn này cho người thân để xin ý kiến:
                  </span>
                  <Button
                    type="button"
                    variant="danger-solid"
                    onClick={() => onOpenSOSWithInfo(message.slice(0, 100))}
                    className="w-full sm:w-auto font-bold gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Hỏi người thân ngay</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
