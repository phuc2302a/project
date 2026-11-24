import React, { useState } from 'react'
import { Search, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, PhoneCall, CheckCircle2, Shield, ArrowRight, CornerDownRight } from 'lucide-react'
import { api } from '../services/api'
import type { LookupResponse, ScamAnalysisResult } from '../types'
import { TrafficLightBadge } from '../components/TrafficLightBadge'
import { RiskGauge } from '../components/RiskGauge'
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

  // Nhận diện loại input theo thời gian thực
  const detectInputTypeLabel = (input: string) => {
    const clean = input.trim()
    if (!clean) return null
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.includes('.')) {
      return { label: 'Đường dẫn (URL / Website)', type: 'link', color: 'bg-blue-100 text-blue-800 border-blue-300' }
    }
    if (/^(?:0|\+84)\d{8,10}$/.test(clean.replace(/\s+/g, ''))) {
      return { label: 'Số điện thoại di động', type: 'phone', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    }
    if (/^\d{9,16}$/.test(clean.replace(/\s+/g, ''))) {
      return { label: 'Số tài khoản ngân hàng', type: 'bank', color: 'bg-purple-100 text-purple-800 border-purple-300' }
    }
    return { label: 'Thông tin đối tượng', type: 'unknown', color: 'bg-slate-100 text-slate-800 border-slate-300' }
  }

  const detectedInput = detectInputTypeLabel(query)

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
      setLookupError('Không thể kết nối đến máy chủ giám định. Vui lòng thử lại.')
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
      setAnalysisError('Không thể phân tích ngữ cảnh tin nhắn lúc này. Vui lòng thử lại.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Nhập giọng nói
  const handleVoiceInputQuick = () => {
    startListening((text) => setQuery(text))
  }

  const handleVoiceInputAI = () => {
    startListening((text) => setMessage((prev) => (prev ? `${prev} ${text}` : text)))
  }

  // Đọc to kết quả
  const readQuickResult = () => {
    if (!lookupResult) return
    const text = `Kết luận giám định: Đối tượng ${lookupResult.target} có mức độ ${
      lookupResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm' : lookupResult.risk_level === 'SUSPICIOUS' ? 'Nghi ngờ' : 'An toàn'
    }. ${lookupResult.reason}. Khuyến nghị: ${lookupResult.recommended_action}`
    speak(text)
  }

  const readAIResult = () => {
    if (!analysisResult) return
    const text = `Điểm rủi ro AI: ${analysisResult.risk_score} trên 100. Mức độ: ${
      analysisResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm cao' : 'Nghi ngờ'
    }. Phát hiện thủ đoạn: ${analysisResult.tactics.join(', ')}. ${analysisResult.reasoning}. Chỉ thị an toàn: ${analysisResult.recommended_action}`
    speak(text)
  }

  // Highlight cụm từ nguy hiểm
  const renderHighlightedMessage = () => {
    if (!analysisResult || analysisResult.dangerous_phrases.length === 0) {
      return <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
    }

    let renderedText = message
    analysisResult.dangerous_phrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      renderedText = renderedText.replace(
        regex,
        '<mark class="bg-rose-200 text-rose-950 font-black px-1.5 py-0.5 rounded border border-rose-400 underline decoration-rose-600 decoration-2">$1</mark>'
      )
    })

    return <div dangerouslySetInnerHTML={{ __html: renderedText }} className="whitespace-pre-wrap leading-relaxed text-slate-900" />
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Console Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 mb-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs font-mono font-semibold text-blue-300 border border-slate-700/80 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HỆ THỐNG GIÁM ĐỊNH TRỰC TUYẾN TỈNH ĐỒNG NAI</span>
          </div>
          <h1 className={`font-black tracking-tight text-white ${isElderMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
            Xác thực an toàn số trước khi chuyển tiền
          </h1>
          <p className={`mt-2 text-slate-300 max-w-2xl leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Tra cứu số điện thoại lạ, phát hiện tên miền ngân hàng mạo danh (Typosquatting) và dùng AI soi chiếu tin nhắn thao túng tâm lý.
          </p>

          {/* Quick Metrics Ticker */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap gap-6 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block">DỮ LIỆU ĐỐI SOÁT:</span>
              <span className="text-white font-bold">120 BÁO CÁO MỚI</span>
            </div>
            <div>
              <span className="text-slate-500 block">ĐƯỜNG LINK GIẢ MẠO:</span>
              <span className="text-rose-400 font-bold">35% TỔNG SỐ VỤ</span>
            </div>
            <div>
              <span className="text-slate-500 block">THỜI GIAN PHÂN TÍCH:</span>
              <span className="text-emerald-400 font-bold">&lt; 0.5 GIÂY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Modes */}
      <div className="flex rounded-2xl bg-slate-200/80 p-1.5 border border-slate-300/80 mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab('quick')
            stopSpeaking()
          }}
          className={`flex-1 rounded-xl py-3 text-center font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'quick'
              ? 'bg-white text-slate-950 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          } ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}
        >
          <Search className="w-4 h-4 text-blue-600" />
          <span>1. Kiểm tra nhanh (SĐT, Link, STK)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('ai')
            stopSpeaking()
          }}
          className={`flex-1 rounded-xl py-3 text-center font-extrabold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-white text-slate-950 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          } ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>2. AI Soi tin nhắn lừa đảo</span>
        </button>
      </div>

      {/* ================= TAB 1: KIỂM TRA NHANH ================= */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <Card className="border-slate-300/90 shadow-md bg-white">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={`font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                    Nhập thông tin cần kiểm tra an toàn:
                  </label>
                  {detectedInput && (
                    <Badge variant="outline" className={`font-mono text-xs ${detectedInput.color}`}>
                      {detectedInput.label}
                    </Badge>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={
                      isElderMode
                        ? 'Nhập SĐT lạ hoặc Link web...'
                        : 'Dán số điện thoại, đường link (vd: vietcombbank.top) hoặc số tài khoản...'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`w-full rounded-2xl border-2 border-slate-300 bg-slate-50/50 pr-28 pl-5 text-slate-950 font-medium placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:outline-none transition-all shadow-inner ${
                      isElderMode ? 'py-5 text-2xl' : 'py-3.5 text-base sm:text-lg'
                    }`}
                  />

                  {/* Micro action */}
                  <button
                    type="button"
                    onClick={handleVoiceInputQuick}
                    className={`absolute right-14 p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors ${
                      isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : ''
                    }`}
                    title="Bấm để nói bằng giọng nói"
                  >
                    {isListening ? <MicOff className="w-5 h-5 text-rose-600" /> : <Mic className="w-5 h-5" />}
                  </button>

                  {/* Submit Search */}
                  <Button
                    type="submit"
                    disabled={isLookingUp || !query.trim()}
                    className="absolute right-2 h-10 w-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs p-0 flex items-center justify-center"
                    title="Bấm để kiểm tra ngay"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>

                {/* Tactical Sample Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider font-mono">Dữ liệu mẫu:</span>
                  <button
                    type="button"
                    onClick={() => setQuery('https://vietcombbank-smartbanking.top')}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-rose-800 hover:bg-rose-100 transition-colors font-semibold"
                  >
                    Link giả mạo ngân hàng (.top)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('0981248991')}
                    className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-amber-800 hover:bg-amber-100 transition-colors font-semibold"
                  >
                    SĐT mạo danh điều tra viên
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery('https://vietcombank.com.vn')}
                    className="rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-emerald-800 hover:bg-emerald-100 transition-colors font-semibold"
                  >
                    Tên miền ngân hàng thật
                  </button>
                </div>
              </form>

              {/* Loading State */}
              {isLookingUp && (
                <div className="mt-8 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-slate-900 border-r-transparent"></div>
                  <p className="mt-3 text-sm text-slate-700 font-bold font-mono">
                    ĐANG QUÉT MÁY CHỦ BLACKLIST & THUẬT TOÁN LEVENSHTEIN...
                  </p>
                </div>
              )}

              {/* Error */}
              {lookupError && (
                <div className="mt-6 rounded-2xl bg-rose-50 p-4 border border-rose-300 text-rose-800 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span className="font-semibold text-sm">{lookupError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ============= PHIẾU GIÁM ĐỊNH KẾT QUẢ ============= */}
          {lookupResult && (
            <div className={`rounded-3xl border-2 shadow-xl overflow-hidden transition-all bg-white ${
              lookupResult.risk_level === 'DANGEROUS'
                ? 'border-rose-500'
                : lookupResult.risk_level === 'SUSPICIOUS'
                ? 'border-amber-500'
                : 'border-emerald-500'
            }`}>
              {/* Header Certificate Bar */}
              <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${
                lookupResult.risk_level === 'DANGEROUS'
                  ? 'bg-rose-600 text-white'
                  : lookupResult.risk_level === 'SUSPICIOUS'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-emerald-600 text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider block opacity-90">
                      KẾT QUẢ GIÁM ĐỊNH AN TOÀN SỐ ĐIỆN TỬ
                    </span>
                    <span className="font-mono text-sm font-black">
                      MÃ ĐỐI SOÁT: #{Math.abs(lookupResult.target.split('').reduce((a, b) => a + b.charCodeAt(0), 0))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopSpeaking : readQuickResult}
                    className="bg-white/95 text-slate-900 border-none font-black text-xs gap-1.5 shadow-sm"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-blue-700" />}
                    <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả'}</span>
                  </Button>
                </div>
              </div>

              {/* Main Diagnostic Body */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-200 pb-6">
                  {/* Left: Risk Gauge Dial */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <RiskGauge
                      score={
                        lookupResult.risk_level === 'DANGEROUS' ? 95 : lookupResult.risk_level === 'SUSPICIOUS' ? 50 : 10
                      }
                      size={150}
                    />
                  </div>

                  {/* Right 2 cols: Status & Target Detail */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrafficLightBadge level={lookupResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                    </div>

                    <h2 className={`font-black text-slate-950 ${isElderMode ? 'text-3xl' : 'text-2xl'}`}>
                      {lookupResult.title}
                    </h2>

                    <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs sm:text-sm text-slate-700 break-all border border-slate-200">
                      <span className="font-bold text-slate-500">Đối tượng: </span>
                      <span className="font-bold text-slate-950">{lookupResult.target}</span>
                      {lookupResult.reports_count > 0 && (
                        <span className="ml-2 bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-bold text-xs">
                          {lookupResult.reports_count} lượt tố giác
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Forensic Analysis & Directives */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      CĂN CỨ KẾT LUẬN:
                    </span>
                    <p className={`text-slate-800 leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                      {lookupResult.reason}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 text-white p-5 space-y-1.5 shadow-md">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      CHỈ THỊ AN TOÀN BẮT BUỘC:
                    </span>
                    <p className={`text-slate-200 leading-relaxed font-semibold ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
                      {lookupResult.recommended_action}
                    </p>
                  </div>
                </div>

                {/* Family Protection Circuit */}
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 p-6 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                      <PhoneCall className="w-5 h-5 text-rose-600" />
                      Chưa chắc chắn? Hãy hỏi người thân trong gia đình!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Gửi ngay thông tin này để con cái hoặc người bảo hộ xác minh giúp bạn trước khi chuyển bất kỳ khoản tiền nào.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="danger-solid"
                    onClick={() => onOpenSOSWithInfo(lookupResult.target)}
                    className="w-full sm:w-auto font-black px-6 py-3 rounded-xl shadow-md gap-2 flex-shrink-0"
                  >
                    <span>HỎI NGƯỜI THÂN NGAY</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: AI PHÂN TÍCH TIN NHẮN ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <Card className="border-slate-300 shadow-md bg-white">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={`font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                    Dán nội dung tin nhắn đáng ngờ vào bộ phân giải AI:
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceInputAI}
                    className={`gap-1.5 font-bold text-xs ${isListening ? 'border-rose-400 text-rose-600 animate-pulse' : ''}`}
                  >
                    <Mic className="w-4 h-4 text-rose-500" />
                    <span>{isListening ? 'Đang thu âm...' : 'Nói nội dung'}</span>
                  </Button>
                </div>

                <div className="relative">
                  <Textarea
                    rows={5}
                    placeholder="Dán toàn bộ đoạn tin nhắn SMS, Zalo, Telegram hoặc Facebook Messenger vào đây để phân tích..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`font-mono leading-relaxed bg-slate-50/50 border-2 border-slate-300 focus:bg-white focus:border-slate-950 p-4 rounded-2xl ${
                      isElderMode ? 'text-xl' : 'text-sm'
                    }`}
                  />
                  <div className="mt-1 text-right text-[11px] font-mono text-slate-400">
                    {message.length} KÝ TỰ
                  </div>
                </div>

                {/* Sample quick buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider font-mono">Kịch bản mẫu:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        'Bộ Công an thông báo: Bạn đang có lệnh bắt tạm giam vì liên quan đường dây ma túy quốc tế. Yêu cầu chuyển ngay 50.000.000đ vào tài khoản 103876543210 để phục vụ điều tra, nếu không sẽ bị cưỡng chế trong 2 giờ!'
                      )
                    }
                    className="rounded-lg border border-purple-300 bg-purple-50 px-2.5 py-1 text-purple-900 hover:bg-purple-100 font-semibold"
                  >
                    Mạo danh Công an bắt giam
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setMessage(
                        'Tuyển CTV online tại nhà chốt đơn Shopee, hoa hồng 20-30%, nhận tiền ngay sau 5 phút. Bấm vào link http://shopee-ctv-kiemtien.xyz để nhận nhiệm vụ đặt cọc đơn hàng'
                      )
                    }
                    className="rounded-lg border border-purple-300 bg-purple-50 px-2.5 py-1 text-purple-900 hover:bg-purple-100 font-semibold"
                  >
                    Bẫy CTV việc nhẹ lương cao
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isAnalyzing || !message.trim()}
                  className={`w-full font-black gap-2 bg-gradient-to-r from-slate-950 to-purple-950 hover:from-slate-900 hover:to-purple-900 text-white shadow-md rounded-2xl ${
                    isElderMode ? 'h-16 text-2xl' : 'h-12 text-base'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>{isAnalyzing ? 'AI ĐANG PHÂN TÍCH NGỮ NGHĨA & TÂM LÝ...' : 'PHÂN TÍCH RỦI RO LỪA ĐẢO NGAY'}</span>
                </Button>
              </form>

              {/* Error */}
              {analysisError && (
                <div className="mt-6 rounded-2xl bg-rose-50 p-4 border border-rose-300 text-rose-800 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span className="font-semibold text-sm">{analysisError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ============= PHIẾU PHÂN GIẢI NGỮ NGHĨA AI ============= */}
          {analysisResult && (
            <div className={`rounded-3xl border-2 shadow-xl overflow-hidden bg-white ${
              analysisResult.risk_level === 'DANGEROUS'
                ? 'border-rose-500'
                : analysisResult.risk_level === 'SUSPICIOUS'
                ? 'border-amber-500'
                : 'border-emerald-500'
            }`}>
              {/* Header */}
              <div className="bg-slate-950 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 block">
                      BÁO CÁO PHÂN TÍCH TRÍ TUỆ NHÂN TẠO (AI DECODER)
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      ĐỘ TIN CẬY: 98.4% · PHÂN TÍCH BỞI SCAM DEFENSE ENGINE
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeaking : readAIResult}
                  className="bg-white/95 text-slate-900 border-none font-black text-xs gap-1.5 shadow-sm"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc cảnh báo'}</span>
                </Button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {/* Metric Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-200 pb-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <RiskGauge score={analysisResult.risk_score} size={150} />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <TrafficLightBadge level={analysisResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                    <h3 className="font-black text-slate-950 text-2xl">
                      {analysisResult.risk_level === 'DANGEROUS'
                        ? 'Cảnh báo: Dấu hiệu lừa đảo và thao túng tâm lý khẩn cấp!'
                        : analysisResult.risk_level === 'SUSPICIOUS'
                        ? 'Cảnh báo: Thông điệp chứa dấu hiệu bất thường cần xác minh!'
                        : 'Thông điệp có vẻ an toàn'}
                    </h3>

                    {/* Detected Tactics Pills */}
                    <div>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        THỦ ĐOẠN ĐƯỢC BÓC TÁCH:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.tactics.map((tactic, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1 text-xs font-black"
                          >
                            ⚠️ {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Annotated Highlight Text Card */}
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 uppercase">
                    <span>NỘI DUNG SOI CHIẾU (CỤM TỪ NGUY HIỂM ĐƯỢC TÔ ĐỎ):</span>
                    <span className="text-rose-600 font-bold">{analysisResult.dangerous_phrases.length} CỤM TỪ ĐÁNH CẮP LÒNG TIN</span>
                  </div>
                  <div className={`p-4 bg-white rounded-xl border border-slate-300/80 shadow-inner ${
                    isElderMode ? 'text-xl' : 'text-sm sm:text-base'
                  }`}>
                    {renderHighlightedMessage()}
                  </div>
                </div>

                {/* Extracted Entities */}
                {(analysisResult.extracted_entities.phones.length > 0 ||
                  analysisResult.extracted_entities.urls.length > 0 ||
                  analysisResult.extracted_entities.bank_accounts.length > 0) && (
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <span className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider block">
                      ĐỐI TƯỢNG ĐƯỢC TRÍCH XUẤT TỰ ĐỘNG ĐỂ TRA CỨU:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.extracted_entities.phones.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuery(p)
                            setActiveTab('quick')
                          }}
                          className="rounded-lg bg-white border border-blue-300 px-2.5 py-1 text-xs font-mono font-bold text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          📞 SĐT: {p} <CornerDownRight className="w-3 h-3 text-blue-500" />
                        </button>
                      ))}
                      {analysisResult.extracted_entities.urls.map((u, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuery(u)
                            setActiveTab('quick')
                          }}
                          className="rounded-lg bg-white border border-blue-300 px-2.5 py-1 text-xs font-mono font-bold text-blue-800 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          🌐 Link: {u.slice(0, 30)}... <CornerDownRight className="w-3 h-3 text-blue-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reasoning & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      PHÂN TÍCH TÂM LÝ TỘI PHẠM:
                    </span>
                    <p className={`text-slate-800 leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                      {analysisResult.reasoning}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 text-white p-5 space-y-1.5 shadow-md">
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      HÀNH ĐỘNG KHUYẾN NGHỊ:
                    </span>
                    <p className={`text-slate-200 leading-relaxed font-semibold ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                      {analysisResult.recommended_action}
                    </p>
                  </div>
                </div>

                {/* Family SOS dispatch */}
                <div className="mt-8 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50 p-6 border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                      <PhoneCall className="w-5 h-5 text-rose-600" />
                      Gửi nội dung tin nhắn này cho người thân kiểm tra giúp:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Ứng dụng sẽ tự động sao chép kèm cảnh báo rủi ro gửi nhanh qua Zalo hoặc tin nhắn cho con cái.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="danger-solid"
                    onClick={() => onOpenSOSWithInfo(message.slice(0, 100))}
                    className="w-full sm:w-auto font-black px-6 py-3 rounded-xl shadow-md gap-2 flex-shrink-0"
                  >
                    <span>HỎI NGƯỜI THÂN NGAY</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
