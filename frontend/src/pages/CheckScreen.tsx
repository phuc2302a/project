import React, { useState } from 'react'
import {
  Search,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneCall,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  MessageSquare
} from 'lucide-react'
import { api } from '../services/api'
import type { LookupResponse, ScamAnalysisResult } from '../types'
import { TrafficLightBadge } from '../components/TrafficLightBadge'
import { RiskGauge } from '../components/RiskGauge'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

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
      setLookupError('Không thể kết nối đến máy chủ kiểm tra. Vui lòng kiểm tra lại kết nối.')
    } finally {
      setIsLookingUp(false)
    }
  }

  // Xử lý AI Phân tích
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

  // Quick Sample Clicks
  const runSampleQuick = (sampleText: string) => {
    setQuery(sampleText)
    handleLookup(sampleText)
  }

  const runSampleAI = (sampleText: string) => {
    setMessage(sampleText)
    handleAnalyze(sampleText)
  }

  // Đọc to kết quả
  const readQuickResult = () => {
    if (!lookupResult) return
    const statusText =
      lookupResult.risk_level === 'DANGEROUS'
        ? 'Cực kỳ nguy hiểm, tuyệt đối không chuyển tiền'
        : lookupResult.risk_level === 'SUSPICIOUS'
        ? 'Nghi ngờ lừa đảo, cần kiểm tra kỹ lưỡng'
        : 'An toàn, đây là đầu mối liên hệ chính thức'
    const text = `Kết quả kiểm tra cho ${lookupResult.target}. Đánh giá: ${statusText}. Lý do: ${lookupResult.reason}. Hướng dẫn an toàn: ${lookupResult.recommended_action}`
    speak(text)
  }

  const readAIResult = () => {
    if (!analysisResult) return
    const statusText =
      analysisResult.risk_level === 'DANGEROUS'
        ? 'Nguy hiểm cao'
        : analysisResult.risk_level === 'SUSPICIOUS'
        ? 'Nghi ngờ'
        : 'An toàn'
    const text = `Kết quả phân tích tin nhắn: Mức độ ${statusText}. Điểm rủi ro ${analysisResult.risk_score} trên 100. Nhận diện các chiêu trò: ${analysisResult.tactics.join(', ')}. Lời khuyên: ${analysisResult.recommended_action}`
    speak(text)
  }

  // Highlight cụm từ nguy hiểm trong tin nhắn
  const renderHighlightedMessage = () => {
    if (!analysisResult || analysisResult.dangerous_phrases.length === 0) {
      return <p className="whitespace-pre-wrap leading-relaxed">{message}</p>
    }

    let renderedText = message
    analysisResult.dangerous_phrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      renderedText = renderedText.replace(
        regex,
        '<mark class="bg-rose-100 text-rose-900 font-bold px-1.5 py-0.5 rounded-md border border-rose-300">$1</mark>'
      )
    })

    return (
      <div
        dangerouslySetInnerHTML={{ __html: renderedText }}
        className="whitespace-pre-wrap leading-relaxed text-slate-900"
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Hero Intro Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Hệ thống Bảo vệ Công dân số tỉnh Đồng Nai</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Kiểm Tra An Toàn Trước Khi Chuyển Tiền
        </h1>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Nhận diện nhanh số điện thoại lừa đảo, website giả mạo ngân hàng, số tài khoản đen hoặc phân tích dấu hiệu thao túng trong tin nhắn lạ.
        </p>
      </div>

      {/* Modern Segmented Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-200/70 p-1 rounded-2xl flex max-w-md w-full border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick')
              stopSpeaking()
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'quick'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Tra cứu Số / Link / STK</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ai')
              stopSpeaking()
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ai'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Phân tích tin nhắn</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: KIỂM TRA NHANH SỐ / LINK / STK ================= */}
      {activeTab === 'quick' && (
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleLookup()
                }}
                className="space-y-4"
              >
                <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                  Nhập số điện thoại, đường link website hoặc số tài khoản ngân hàng:
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ví dụ: 0988123456 hoặc vietcombank-smartbanking.top..."
                    className={`w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium ${
                      isElderMode ? 'text-xl' : 'text-base'
                    }`}
                  />
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={() => startListening((text) => setQuery(text))}
                      title="Nói để nhập số điện thoại hoặc link"
                      className={`p-2 rounded-xl transition-all ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'text-slate-500 hover:bg-slate-200/80 hover:text-slate-800'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('')
                          setLookupResult(null)
                        }}
                        className="p-1.5 text-xs text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Dữ liệu đối soát trực tiếp từ Cục An toàn thông tin và Công an tỉnh Đồng Nai.
                  </p>

                  <Button
                    type="submit"
                    disabled={isLookingUp || !query.trim()}
                    className="w-full sm:w-auto font-bold px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    {isLookingUp ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                        Đang đối soát...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Kiểm tra an toàn <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Quick Sample Test Chips */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Thử nhanh các tình huống thực tế tại Đồng Nai:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => runSampleQuick('vietcombbank-smartbanking.top')}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                  >
                    🚨 vietcombbank-smartbanking.top (Giả mạo VCB)
                  </button>
                  <button
                    type="button"
                    onClick={() => runSampleQuick('0988123456')}
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                  >
                    🚨 0988.123.456 (Giả danh Công an Đồng Nai)
                  </button>
                  <button
                    type="button"
                    onClick={() => runSampleQuick('0693480113')}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    ✅ 0693.480.113 (Trực ban Công an Đồng Nai)
                  </button>
                  <button
                    type="button"
                    onClick={() => runSampleQuick('111')}
                    className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    ✅ 111 (Tổng đài Bảo vệ Trẻ em)
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Notice */}
          {lookupError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}

          {/* Result Card */}
          {lookupResult && (
            <Card className="border border-slate-200/80 shadow-md bg-white overflow-hidden rounded-2xl animate-in fade-in duration-300">
              <div
                className={`p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  lookupResult.risk_level === 'DANGEROUS'
                    ? 'bg-rose-50/70 border-rose-200'
                    : lookupResult.risk_level === 'SUSPICIOUS'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    KẾT QUẢ ĐỐI SOÁT CHO: <span className="text-slate-900 font-mono">{lookupResult.target}</span>
                  </span>
                  <TrafficLightBadge level={lookupResult.risk_level} size="large" />
                </div>

                {/* Elder Voice Readout Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : readQuickResult}
                  className={`font-bold rounded-xl border-slate-300 shadow-2xs gap-2 ${
                    isSpeaking ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5 text-amber-700" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả to rõ'}</span>
                </Button>
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cột trái: Đánh giá chi tiết */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Lý do & Dấu hiệu phát hiện
                    </h3>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed">
                      {lookupResult.reason}
                    </div>

                    {lookupResult.risk_level === 'DANGEROUS' && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-medium space-y-1.5">
                        <p className="font-bold flex items-center gap-1.5 text-rose-700">
                          <AlertTriangle className="w-4 h-4" /> Cảnh báo đặc biệt:
                        </p>
                        <p>
                          Đối tượng này đã có trong danh sách đen của các cơ quan chức năng. Tuyệt đối không làm theo hướng dẫn hoặc cung cấp mã OTP.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cột phải: Hướng dẫn xử lý ngay */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                      Hành động cần làm ngay
                    </h3>
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-900 text-sm sm:text-base leading-relaxed">
                      <p className="font-bold text-blue-900 mb-2">Quy tắc ứng phó khẩn cấp:</p>
                      <p>{lookupResult.recommended_action}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <Button
                        type="button"
                        onClick={() => onOpenSOSWithInfo(lookupResult.target)}
                        className="font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-2 flex-1"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Hỏi ý kiến người thân</span>
                      </Button>

                      <a
                        href="tel:0693480113"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs transition-colors"
                      >
                        <span>Gọi Công an Đồng Nai</span>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ================= TAB 2: AI PHÂN TÍCH TIN NHẮN ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAnalyze()
                }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-xl' : 'text-sm'}`}>
                    Dán nội dung tin nhắn SMS, Zalo, Messenger nghi vấn tại đây:
                  </label>
                  <button
                    type="button"
                    onClick={() => startListening((text) => setMessage((prev) => (prev ? `${prev} ${text}` : text)))}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListening ? 'Đang lắng nghe...' : 'Nói để dán chữ'}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ví dụ: 'Cục CSGT thông báo bạn có biên phạt nguội vi phạm tốc độ số tiền 5 triệu đồng. Truy cập ngay link để nộp phạt nếu không sẽ bị cưỡng chế phong tỏa tài khoản...'"
                    className={`w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-medium ${
                      isElderMode ? 'text-xl' : 'text-base'
                    }`}
                  />
                  {message && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessage('')
                        setAnalysisResult(null)
                      }}
                      className="absolute bottom-3 right-3 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 bg-white rounded-md border border-slate-200"
                    >
                      Xóa trắng
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-slate-500">
                    Mô hình AI kiểm tra các thủ thuật thao túng tâm lý: gây hoảng sợ, hối thúc chuyển tiền, mạo danh công quyền.
                  </p>

                  <Button
                    type="submit"
                    disabled={isAnalyzing || !message.trim()}
                    className="w-full sm:w-auto font-bold px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                        Đang bóc tách chiêu trò...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Bóc tách chiêu trò bằng AI
                      </span>
                    )}
                  </Button>
                </div>
              </form>

              {/* Sample Messages */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Thử nhanh các mẫu tin nhắn lừa đảo phổ biến:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      runSampleAI(
                        'Thông báo từ Bệnh viện Đa khoa Đồng Nai: Con ông bà đang cấp cứu nguy kịch do tai nạn giao thông. Đề nghị chuyển gấp viện phí 25 triệu vào STK 1903... để bác sĩ mổ gấp!'
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors text-left"
                  >
                    🚨 Con cấp cứu, chuyển tiền mổ gấp
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runSampleAI(
                        'Chúc mừng bạn đã trúng thưởng giải nhất xe Honda SH 150i trị giá 90 triệu đồng từ chương trình Tri ân Viettel Đồng Nai. Vui lòng nạp 1.000.000đ phí làm hồ sơ nhận xe.'
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors text-left"
                  >
                    ⚠️ Trúng thưởng xe máy SH 150i
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      runSampleAI(
                        'Chào em, chị tuyển cộng tác viên xử lý đơn hàng Shopee tại nhà, thu nhập 300k - 800k/ngày. Chỉ cần thanh toán đơn hàng trước rồi nhận lại gốc và hoa hồng 25% sau 5 phút.'
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
                  >
                    🎓 Việc nhẹ lương cao Shopee (Học sinh)
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Notice */}
          {analysisError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* AI Analysis Result */}
          {analysisResult && (
            <Card className="border border-slate-200/80 shadow-md bg-white overflow-hidden rounded-2xl animate-in fade-in duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <RiskGauge score={analysisResult.risk_score} size={110} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      ĐÁNH GIÁ MỨC ĐỘ RỦI RO
                    </span>
                    <TrafficLightBadge level={analysisResult.risk_level} size="large" />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={isSpeaking ? stopSpeaking : readAIResult}
                  className={`font-bold rounded-xl border-slate-300 shadow-2xs gap-2 ${
                    isSpeaking ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5 text-amber-700" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả to rõ'}</span>
                </Button>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Highlighted text preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bóc tách các từ ngữ thao túng (được bôi đỏ):
                    </h3>
                    <span className="text-xs text-rose-600 font-bold">
                      {analysisResult.dangerous_phrases.length} cụm từ nguy hiểm
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base">
                    {renderHighlightedMessage()}
                  </div>
                </div>

                {/* Tactics detected */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Chiêu trò thao túng tâm lý được nhận diện:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.tactics.map((tactic, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-rose-50 text-rose-800 border border-rose-200"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        {tactic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analysis reasoning and advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Phân tích chi tiết</p>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed">{analysisResult.reasoning}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Lời khuyên xử lý an toàn</p>
                    <p className="text-sm sm:text-base text-slate-900 leading-relaxed">{analysisResult.recommended_action}</p>
                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => onOpenSOSWithInfo(message)}
                        className="w-full font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Hỏi ý kiến con cháu / Người thân</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
