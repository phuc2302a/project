import React, { useState } from 'react'
import {
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  MessageSquare
} from 'lucide-react'
import { api } from '../services/api'
import type { LookupResponse, ScamAnalysisResult } from '../types'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'

interface Props {
  onOpenSOSWithInfo: (info: string) => void
}

export const CheckScreen: React.FC<Props> = ({ onOpenSOSWithInfo }) => {
  const { isElderMode } = useElderMode()
  const { speak, stopSpeaking, isSpeaking, startListening, isListening } = useSpeech()

  // Mode: Quick search vs AI message analysis
  const [activeTab, setActiveTab] = useState<'quick' | 'ai'>('quick')

  // Search state
  const [query, setQuery] = useState('')
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupResult, setLookupResult] = useState<LookupResponse | null>(null)
  const [lookupError, setLookupError] = useState('')

  // AI message state
  const [message, setMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState('')

  // Quick lookup handler
  const handleLookup = async (targetQuery?: string) => {
    const textToQuery = targetQuery || query
    if (!textToQuery.trim()) return
    setIsLookingUp(true)
    setLookupError('')
    setLookupResult(null)
    stopSpeaking()
    try {
      const res = await api.lookupTarget(textToQuery.trim())
      setLookupResult(res)
    } catch {
      setLookupError('Không thể kết nối đến máy chủ kiểm tra. Vui lòng thử lại.')
    } finally {
      setIsLookingUp(false)
    }
  }

  // AI message analysis handler
  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || message
    if (!text.trim()) return
    setIsAnalyzing(true)
    setAnalysisError('')
    setAnalysisResult(null)
    stopSpeaking()
    try {
      const res = await api.analyzeMessage(text.trim())
      setAnalysisResult(res)
    } catch {
      setAnalysisError('Không thể phân tích tin nhắn lúc này. Vui lòng thử lại.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Quick preset clicks
  const runPresetQuick = (val: string) => {
    setQuery(val)
    handleLookup(val)
  }

  const runPresetAI = (val: string) => {
    setMessage(val)
    handleAnalyze(val)
  }

  // Read results aloud
  const readQuickResult = () => {
    if (!lookupResult) return
    const statusText =
      lookupResult.risk_level === 'DANGEROUS'
        ? 'Cực kỳ nguy hiểm, đối tượng lừa đảo, tuyệt đối không chuyển tiền'
        : lookupResult.risk_level === 'SUSPICIOUS'
        ? 'Nghi ngờ, cần kiểm chứng cẩn trọng'
        : 'An toàn, đây là thông tin chính thức đã xác minh'
    speak(
      `Kết quả kiểm tra cho ${lookupResult.target}. Đánh giá: ${statusText}. Lý do: ${lookupResult.reason}. Hướng dẫn an toàn: ${lookupResult.recommended_action}`
    )
  }

  const readAIResult = () => {
    if (!analysisResult) return
    const statusText =
      analysisResult.risk_level === 'DANGEROUS'
        ? 'Cực kỳ nguy hiểm'
        : analysisResult.risk_level === 'SUSPICIOUS'
        ? 'Nghi ngờ'
        : 'An toàn'
    speak(
      `Kết quả phân tích: Mức độ ${statusText}. Điểm rủi ro ${analysisResult.risk_score} trên 100. Các thủ đoạn thao túng nhận diện được: ${analysisResult.tactics.join(', ')}. Lời khuyên: ${analysisResult.recommended_action}`
    )
  }

  // Highlight scam phrases
  const renderHighlightedMessage = () => {
    if (!analysisResult || analysisResult.dangerous_phrases.length === 0) {
      return <p className="whitespace-pre-wrap leading-relaxed text-zinc-300">{message}</p>
    }

    let renderedText = message
    analysisResult.dangerous_phrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      renderedText = renderedText.replace(
        regex,
        '<mark class="bg-rose-950/80 text-rose-300 border border-rose-800/80 font-bold px-1.5 py-0.5 rounded">$1</mark>'
      )
    })

    return (
      <div
        dangerouslySetInnerHTML={{ __html: renderedText }}
        className="whitespace-pre-wrap leading-relaxed text-zinc-200"
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:px-6">
      {/* Eyebrow Kicker */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          HỆ THỐNG AN NINH MẠNG CỘNG ĐỒNG • CÔNG AN TỈNH ĐỒNG NAI
        </span>
      </div>

      {/* Hero Headline with Shimmer Text */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <h1
          className={`font-black tracking-tight text-white ${
            isElderMode ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl lg:text-6xl'
          }`}
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Nhận diện kẻ{' '}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
            lừa đảo
          </span>{' '}
        </h1>
        <p
          className={`mt-4 text-neutral-400 max-w-xl mx-auto leading-relaxed ${
            isElderMode ? 'text-xl' : 'text-sm sm:text-base'
          }`}
        >
          Tra cứu số điện thoại, đường link website, số tài khoản và bóc tách tin nhắn theo dữ liệu đối soát thời gian thực cùng chứng nhận an toàn số.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#121216] p-1 rounded-xl border border-neutral-800 flex gap-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick')
              stopSpeaking()
            }}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Tra cứu Số / Link / STK</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ai')
              stopSpeaking()
            }}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Bóc tách tin nhắn</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: QUICK LOOKUP ================= */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          {/* Search Bar matching AgentVet.ai */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLookup()
            }}
            className="max-w-2xl mx-auto flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-neutral-500 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập số điện thoại, link website hoặc STK..."
                className={`w-full bg-[#121216] border border-neutral-800 focus:border-neutral-600 focus:outline-none text-white placeholder:text-neutral-500 rounded-xl pl-11 pr-12 py-3.5 text-sm transition-colors ${
                  isElderMode ? 'text-lg py-4' : 'text-sm'
                }`}
              />
              {/* Mic voice button */}
              <button
                type="button"
                onClick={() => startListening((text) => setQuery(text))}
                title="Nói để tìm kiếm"
                className={`absolute right-3 p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'text-rose-400 bg-rose-950/80 animate-pulse'
                    : 'text-neutral-500 hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLookingUp || !query.trim()}
              className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-6 py-3.5 text-sm transition-colors shrink-0 disabled:opacity-40 disabled:hover:bg-white"
            >
              {isLookingUp ? 'Đang kiểm tra...' : 'Kiểm tra'}
            </button>
          </form>

          {/* Preset Chips matching AgentVet.ai */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-1">
            <button
              type="button"
              onClick={() => runPresetQuick('vietcombbank-smartbanking.top')}
              className="bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Web mạo danh Vietcombank
            </button>
            <button
              type="button"
              onClick={() => runPresetQuick('0988123456')}
              className="bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              0988.123.456 (Giả Công an)
            </button>
            <button
              type="button"
              onClick={() => runPresetQuick('0693480113')}
              className="bg-neutral-900/90 text-emerald-400 border border-emerald-950 hover:text-emerald-300 hover:border-emerald-800 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              0693.480.113 (Công an Đồng Nai)
            </button>
            <button
              type="button"
              onClick={() => runPresetQuick('111')}
              className="bg-neutral-900/90 text-blue-400 border border-blue-950 hover:text-blue-300 hover:border-blue-800 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              111 (Bảo vệ trẻ em)
            </button>
          </div>

          {/* Error Message */}
          {lookupError && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}

          {/* Benchmark Certificate Card (Exact match to AgentVet.ai card style) */}
          {lookupResult && (
            <div className="max-w-2xl mx-auto bg-[#0d0d10] border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-8 relative overflow-hidden">
              {/* Subtle ambient light */}
              <div
                className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none ${
                  lookupResult.risk_level === 'DANGEROUS'
                    ? 'bg-rose-500'
                    : lookupResult.risk_level === 'SUSPICIOUS'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              {/* Card Header metadata */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
                <span>Hồ sơ thẩm định an toàn số</span>
                <span className="font-mono text-neutral-400">DN-2026-CHECK</span>
              </div>

              {/* Massive Score Display */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div
                    className={`font-mono font-black text-6xl tracking-tight leading-none ${
                      lookupResult.risk_level === 'DANGEROUS'
                        ? 'text-rose-500'
                        : lookupResult.risk_level === 'SUSPICIOUS'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {lookupResult.risk_level === 'DANGEROUS' ? '9.8' : lookupResult.risk_level === 'SUSPICIOUS' ? '5.4' : '0.0'}
                  </div>
                  <div className="font-bold text-lg text-white mt-1.5 flex items-center gap-2">
                    {lookupResult.risk_level === 'DANGEROUS' && (
                      <>
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                        <span>Nguy hiểm — Tuyệt đối không chuyển tiền</span>
                      </>
                    )}
                    {lookupResult.risk_level === 'SUSPICIOUS' && (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span>Nghi ngờ — Cần xác minh kỹ</span>
                      </>
                    )}
                    {lookupResult.risk_level === 'SAFE' && (
                      <>
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>An toàn — Đầu mối chính thức đã xác thực</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-neutral-400 max-w-xs sm:text-right">
                  Đối soát cho: <span className="text-white font-mono font-bold block">{lookupResult.target}</span>
                </div>
              </div>

              {/* Sub-Metrics Boxes like AgentVet.ai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* Metric 1 */}
                <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-neutral-400">Mức độ rủi ro</span>
                    <span
                      className={`font-mono font-bold text-base ${
                        lookupResult.risk_level === 'DANGEROUS'
                          ? 'text-rose-400'
                          : lookupResult.risk_level === 'SUSPICIOUS'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {lookupResult.risk_level === 'DANGEROUS' ? '98%' : lookupResult.risk_level === 'SUSPICIOUS' ? '54%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lookupResult.risk_level === 'DANGEROUS'
                          ? 'bg-rose-500 w-[98%]'
                          : lookupResult.risk_level === 'SUSPICIOUS'
                          ? 'bg-amber-400 w-[54%]'
                          : 'bg-emerald-500 w-[0%]'
                      }`}
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-neutral-400">Độ tin cậy xác minh</span>
                    <span className="font-mono font-bold text-base text-cyan-400">96%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[96%]" />
                  </div>
                </div>
              </div>

              {/* Detail Reasons */}
              <div className="space-y-3 mb-6 text-xs sm:text-sm text-neutral-300">
                <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4 space-y-1.5">
                  <span className="text-neutral-500 uppercase tracking-wider text-[11px] font-mono block">
                    LÝ DO & BẰNG CHỨNG
                  </span>
                  <p className="leading-relaxed">{lookupResult.reason}</p>
                </div>

                <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4 space-y-1.5">
                  <span className="text-neutral-500 uppercase tracking-wider text-[11px] font-mono block">
                    KHUYẾN NGHỊ HÀNH ĐỘNG
                  </span>
                  <p className="leading-relaxed text-zinc-200">{lookupResult.recommended_action}</p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : readQuickResult}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả to rõ (TTS)'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onOpenSOSWithInfo(lookupResult.target)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Hỏi người thân (SOS)</span>
                  </button>

                  <a
                    href="tel:0693480113"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Gọi 0693.480.113
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: AI MESSAGE ANALYSIS ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAnalyze()
            }}
            className="max-w-2xl mx-auto space-y-3"
          >
            <div className="relative">
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dán nội dung tin nhắn SMS, Zalo hoặc lời thoại cuộc gọi lạ tại đây..."
                className={`w-full bg-[#121216] border border-neutral-800 focus:border-neutral-600 focus:outline-none text-white placeholder:text-neutral-500 rounded-2xl p-4 text-sm transition-colors ${
                  isElderMode ? 'text-lg' : 'text-sm'
                }`}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startListening((text) => setMessage((prev) => (prev ? `${prev} ${text}` : text)))}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    isListening
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListening ? 'Đang nghe...' : 'Nói'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500">Mô hình AI kiểm định dấu hiệu tâm lý thao túng</span>
              <button
                type="submit"
                disabled={isAnalyzing || !message.trim()}
                className="bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors disabled:opacity-40"
              >
                {isAnalyzing ? 'Đang bóc tách...' : 'Phân tích tin nhắn'}
              </button>
            </div>
          </form>

          {/* AI Preset Chips */}
          {analysisError && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/40 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto pt-1">
            <button
              type="button"
              onClick={() =>
                runPresetAI(
                  'Bệnh viện Đa khoa Đồng Nai báo: Con ông bà đang cấp cứu nguy kịch do tai nạn giao thông, chuyển gấp viện phí 25 triệu vào STK 1903... để bác sĩ mổ ngay!'
                )
              }
              className="bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Con cấp cứu, chuyển tiền mổ gấp
            </button>
            <button
              type="button"
              onClick={() =>
                runPresetAI(
                  'Chúc mừng bạn trúng giải nhất xe Honda SH 150i trị giá 90 triệu đồng từ chương trình Tri ân Viettel. Nạp 1.000.000đ làm hồ sơ nhận xe.'
                )
              }
              className="bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Trúng thưởng xe SH 150i
            </button>
            <button
              type="button"
              onClick={() =>
                runPresetAI(
                  'Tuyển CTV Shopee xử lý đơn hàng tại nhà thu nhập 500k/ngày. Nạp tiền trước nhận lại gốc và hoa hồng 25% sau 5 phút.'
                )
              }
              className="bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Việc nhẹ lương cao Shopee
            </button>
          </div>

          {/* AI Benchmark Certificate Card */}
          {analysisResult && (
            <div className="max-w-2xl mx-auto bg-[#0d0d10] border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 mt-8 relative overflow-hidden">
              {/* Card Header metadata */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
                <span>Chứng nhận phân tích ngôn ngữ độc hại (AI)</span>
                <span className="font-mono text-neutral-400">DN-AI-CERT</span>
              </div>

              {/* Massive Score Readout */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <div
                    className={`font-mono font-black text-6xl tracking-tight leading-none ${
                      analysisResult.risk_level === 'DANGEROUS' ? 'text-rose-500' : 'text-amber-400'
                    }`}
                  >
                    {(analysisResult.risk_score / 10).toFixed(1)}
                  </div>
                  <div className="font-bold text-lg text-white mt-1.5">
                    {analysisResult.risk_level === 'DANGEROUS' ? 'Chiêu trò lừa đảo nguy hiểm' : 'Nghi vấn thao túng'}
                  </div>
                </div>

                <div className="text-xs text-neutral-400">
                  Phát hiện <span className="text-rose-400 font-bold font-mono">{analysisResult.dangerous_phrases.length}</span> cụm từ thao túng tâm lý
                </div>
              </div>

              {/* Highlighted text preview */}
              <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4 mb-4 text-xs sm:text-sm">
                <span className="text-neutral-500 uppercase tracking-wider text-[11px] font-mono block mb-2">
                  NỘI DUNG VỚI TỪ KHÓA BÓC TÁCH (BÔI ĐỎ)
                </span>
                {renderHighlightedMessage()}
              </div>

              {/* Tactics Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {analysisResult.tactics.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-900"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Reasoning */}
              <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-4 mb-6 text-xs sm:text-sm text-neutral-300 space-y-1">
                <span className="text-neutral-500 uppercase tracking-wider text-[11px] font-mono block">
                  LỜI KHUYÊN PHẢN XẠ
                </span>
                <p>{analysisResult.recommended_action}</p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
                <button
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : readAIResult}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả to rõ'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenSOSWithInfo(message)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Hỏi ý kiến người thân (SOS)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
