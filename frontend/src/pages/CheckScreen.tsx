import React, { useState } from 'react'
import { Search, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, PhoneCall, CheckCircle2 } from 'lucide-react'
import { api } from '../services/api'
import type { LookupResponse, ScamAnalysisResult } from '../types'
import { TrafficLightBadge } from '../components/TrafficLightBadge'
import { useSpeech } from '../hooks/useSpeech'
import { useElderMode } from '../contexts/ElderModeContext'

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

  // Nhập liệu bằng giọng nói cho ô tìm kiếm
  const handleVoiceInputQuick = () => {
    startListening((text) => {
      setQuery(text)
    })
  }

  // Nhập liệu giọng nói cho AI
  const handleVoiceInputAI = () => {
    startListening((text) => {
      setMessage((prev) => (prev ? `${prev} ${text}` : text))
    })
  }

  // Đọc to kết quả kiểm tra nhanh
  const readQuickResult = () => {
    if (!lookupResult) return
    const text = `Kết quả kiểm tra cho ${lookupResult.target}: Mức độ ${lookupResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm' : lookupResult.risk_level === 'SUSPICIOUS' ? 'Nghi ngờ' : 'An toàn'}. ${lookupResult.reason}. Lời khuyên: ${lookupResult.recommended_action}`
    speak(text)
  }

  // Đọc to kết quả AI
  const readAIResult = () => {
    if (!analysisResult) return
    const text = `Điểm rủi ro: ${analysisResult.risk_score} phần trăm. Mức độ: ${analysisResult.risk_level === 'DANGEROUS' ? 'Nguy hiểm cao' : 'Nghi ngờ'}. Thủ đoạn: ${analysisResult.tactics.join(', ')}. ${analysisResult.reasoning}. Khuyến nghị: ${analysisResult.recommended_action}`
    speak(text)
  }

  // Highlight cụm từ nguy hiểm trong tin nhắn
  const renderHighlightedMessage = () => {
    if (!analysisResult || analysisResult.dangerous_phrases.length === 0) {
      return <p className="whitespace-pre-wrap">{message}</p>
    }

    let renderedText = message
    // Thay thế an toàn
    analysisResult.dangerous_phrases.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      renderedText = renderedText.replace(regex, '<mark class="bg-red-200 text-red-900 font-bold px-1 rounded">$1</mark>')
    })

    return <div dangerouslySetInnerHTML={{ __html: renderedText }} className="whitespace-pre-wrap" />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Banner Giới thiệu / Cảnh báo */}
      <div className={`mb-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white shadow-lg ${isElderMode ? 'p-8' : ''}`}>
        <h1 className={`font-black tracking-tight ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Kiểm tra An toàn số trước khi chuyển tiền
        </h1>
        <p className={`mt-2 text-blue-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
          Nhận diện nhanh số điện thoại lạ, đường link giả mạo và phân tích tin nhắn lừa đảo bằng công nghệ AI.
        </p>
      </div>

      {/* Tabs Chuyển đổi */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1 border">
        <button
          onClick={() => {
            setActiveTab('quick')
            stopSpeaking()
          }}
          className={`flex-1 rounded-lg py-3 text-center font-bold transition-all ${
            activeTab === 'quick'
              ? 'bg-white text-blue-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          } ${isElderMode ? 'text-xl' : 'text-base'}`}
        >
          🔍 1. Kiểm tra nhanh (SĐT, Link, STK)
        </button>
        <button
          onClick={() => {
            setActiveTab('ai')
            stopSpeaking()
          }}
          className={`flex-1 rounded-lg py-3 text-center font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          } ${isElderMode ? 'text-xl' : 'text-base'}`}
        >
          <Sparkles className="w-5 h-5 text-purple-600" />
          2. AI Phân tích tin nhắn dán vào
        </button>
      </div>

      {/* ================= TAB 1: KIỂM TRA NHANH ================= */}
      {activeTab === 'quick' && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleLookup} className="space-y-4">
            <label className={`block font-bold text-gray-800 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
              Nhập Số điện thoại, Đường link hoặc Số tài khoản ngân hàng:
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={isElderMode ? 'VD: 0981248991 hoặc vietcombbank.top' : 'Ví dụ: 0981248991, vietcombank.com.vn, 103876543210...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`w-full rounded-xl border-2 border-gray-300 pr-24 pl-4 focus:border-blue-600 focus:outline-none transition-colors ${
                  isElderMode ? 'py-4 text-2xl' : 'py-3 text-lg'
                }`}
              />

              {/* Nút Micro thu âm */}
              <button
                type="button"
                onClick={handleVoiceInputQuick}
                className={`absolute right-14 p-2 text-gray-500 hover:text-blue-600 ${
                  isListening ? 'text-red-600 animate-pulse' : ''
                }`}
                title="Bấm để nói bằng giọng nói"
              >
                {isListening ? <MicOff className="w-6 h-6 text-red-600" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Nút Tìm kiếm */}
              <button
                type="submit"
                disabled={isLookingUp || !query.trim()}
                className={`absolute right-2 rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors`}
                title="Bấm để kiểm tra"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Gợi ý mẫu để test nhanh */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-gray-600">
              <span className="font-semibold">Thử nhanh mẫu:</span>
              <button
                type="button"
                onClick={() => setQuery('https://vietcombbank-smartbanking.top')}
                className="rounded-full bg-gray-100 px-3 py-1 hover:bg-blue-50 text-blue-700 text-xs font-medium"
              >
                Link giả mạo Vietcombank
              </button>
              <button
                type="button"
                onClick={() => setQuery('0981248991')}
                className="rounded-full bg-gray-100 px-3 py-1 hover:bg-blue-50 text-blue-700 text-xs font-medium"
              >
                SĐT giả danh công an
              </button>
              <button
                type="button"
                onClick={() => setQuery('vietcombank.com.vn')}
                className="rounded-full bg-gray-100 px-3 py-1 hover:bg-emerald-50 text-emerald-700 text-xs font-medium"
              >
                Tên miền ngân hàng thật
              </button>
            </div>
          </form>

          {/* Trạng thái Loading */}
          {isLookingUp && (
            <div className="mt-8 text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600 font-semibold">Đang tra cứu dữ liệu an toàn số...</p>
            </div>
          )}

          {/* Lỗi */}
          {lookupError && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}

          {/* KHUNG KẾT QUẢ ĐÈN GIAO THÔNG */}
          {lookupResult && (
            <div className={`mt-8 rounded-2xl border-2 p-6 transition-all ${
              lookupResult.risk_level === 'DANGEROUS'
                ? 'border-red-400 bg-red-50/50'
                : lookupResult.risk_level === 'SUSPICIOUS'
                ? 'border-amber-400 bg-amber-50/50'
                : 'border-emerald-400 bg-emerald-50/50'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <TrafficLightBadge level={lookupResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                
                {/* Nút Loa đọc to kết quả */}
                <button
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : readQuickResult}
                  className={`flex items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 font-bold shadow-sm transition-all ${
                    isSpeaking ? 'text-red-600 border-red-300' : 'text-blue-700 border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc kết quả'}</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <h3 className={`font-black text-gray-900 ${isElderMode ? 'text-2xl' : 'text-xl'}`}>
                    {lookupResult.title}
                  </h3>
                  <p className="text-gray-500 font-mono text-sm mt-0.5">Đối tượng: {lookupResult.target}</p>
                </div>

                <div className={`rounded-xl bg-white p-4 border shadow-xs ${isElderMode ? 'text-xl' : 'text-base'}`}>
                  <p className="font-semibold text-gray-800">Lý do giải thích:</p>
                  <p className="text-gray-700 mt-1">{lookupResult.reason}</p>
                </div>

                <div className={`rounded-xl bg-blue-50 p-4 border border-blue-200 text-blue-900 ${isElderMode ? 'text-xl' : 'text-base'}`}>
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    Khuyến nghị hành động:
                  </p>
                  <p className="mt-1 font-medium">{lookupResult.recommended_action}</p>
                </div>
              </div>

              {/* Nút Hỏi người thân đặt ngay dưới kết quả cảnh báo */}
              <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="text-sm text-gray-600 italic">
                  Vẫn chưa chắc chắn? Hãy tham khảo ý kiến người thân trong gia đình!
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSOSWithInfo(lookupResult.target)}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 active:scale-95 transition-all w-full sm:w-auto ${
                    isElderMode ? 'px-6 py-4 text-xl' : 'px-4 py-2.5 text-base'
                  }`}
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Hỏi người thân ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: AI PHÂN TÍCH TIN NHẮN ================= */}
      {activeTab === 'ai' && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={`block font-bold text-gray-800 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
                Dán toàn bộ nội dung tin nhắn đáng ngờ vào đây:
              </label>
              <button
                type="button"
                onClick={handleVoiceInputAI}
                className={`flex items-center gap-1 text-sm font-semibold rounded-lg px-2.5 py-1 border ${
                  isListening ? 'bg-red-50 text-red-600 border-red-300 animate-pulse' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mic className="w-4 h-4 text-red-500" />
                <span>{isListening ? 'Đang nghe...' : 'Nói tin nhắn'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="Ví dụ: 'Toi la can bo cong an tinh Dong Nai, thong bao ban co lenh bat tam giam vi lien quan duong day rua tien. Yeu cau chuyen 50 trieu vao tai khoan de giam dinh...'"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full rounded-xl border-2 border-gray-300 p-4 focus:border-purple-600 focus:outline-none transition-colors ${
                isElderMode ? 'text-xl' : 'text-base'
              }`}
            />

            {/* Mẫu thử tin nhắn nhanh */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">Tin nhắn mẫu:</span>
              <button
                type="button"
                onClick={() => setMessage('Bộ Công an thông báo: Bạn đang có lệnh bắt tạm giam. Yêu cầu chuyển ngay 50.000.000đ vào tài khoản 103876543210 để phục vụ điều tra, nếu không sẽ bị cưỡng chế trong 2 giờ!')}
                className="rounded-full bg-purple-50 px-3 py-1 hover:bg-purple-100 text-purple-700 text-xs font-medium"
              >
                Giả danh Công an bắt giam
              </button>
              <button
                type="button"
                onClick={() => setMessage('Tuyển CTV online tại nhà chốt đơn Shopee, hoa hồng 20-30%, nhận tiền ngay sau 5 phút. Bấm vào link http://shopee-ctv-kiemtien.xyz để nhận nhiệm vụ')}
                className="rounded-full bg-purple-50 px-3 py-1 hover:bg-purple-100 text-purple-700 text-xs font-medium"
              >
                Việc nhẹ lương cao Shopee
              </button>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !message.trim()}
              className={`flex items-center justify-center gap-2 w-full rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 disabled:bg-gray-300 transition-colors shadow-md ${
                isElderMode ? 'py-4 text-2xl' : 'py-3 text-lg'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>{isAnalyzing ? 'AI đang phân tích ngữ cảnh...' : 'Bấm để AI Phân tích rủi ro'}</span>
            </button>
          </form>

          {/* Lỗi */}
          {analysisError && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* KẾT QUẢ PHÂN TÍCH AI */}
          {analysisResult && (
            <div className={`mt-8 rounded-2xl border-2 p-6 transition-all ${
              analysisResult.risk_level === 'DANGEROUS'
                ? 'border-red-400 bg-red-50/50'
                : analysisResult.risk_level === 'SUSPICIOUS'
                ? 'border-amber-400 bg-amber-50/50'
                : 'border-emerald-400 bg-emerald-50/50'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <TrafficLightBadge level={analysisResult.risk_level} size={isElderMode ? 'large' : 'normal'} />
                  <span className="font-extrabold text-lg text-gray-800">
                    Điểm rủi ro: <span className="text-red-600 text-2xl">{analysisResult.risk_score}/100</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={isSpeaking ? stopSpeaking : readAIResult}
                  className={`flex items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 font-bold shadow-sm transition-all ${
                    isSpeaking ? 'text-red-600 border-red-300' : 'text-purple-700 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc cảnh báo'}</span>
                </button>
              </div>

              {/* Thủ đoạn nhận diện */}
              <div className="mt-4">
                <p className="font-bold text-gray-700 text-sm">Thủ đoạn thao túng nhận diện được:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysisResult.tactics.map((tactic, idx) => (
                    <span key={idx} className="rounded-lg bg-red-100 text-red-800 px-3 py-1 text-sm font-bold border border-red-300">
                      ⚠️ {tactic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soi cụm từ nguy hiểm đã được tô đỏ */}
              <div className="mt-4 rounded-xl bg-white p-4 border shadow-xs">
                <p className="font-bold text-gray-800 mb-2">Đoạn tin nhắn (Các cụm từ nguy hiểm được tô màu):</p>
                <div className={`p-3 bg-gray-50 rounded-lg border text-gray-800 ${isElderMode ? 'text-xl' : 'text-base'}`}>
                  {renderHighlightedMessage()}
                </div>
              </div>

              {/* Lý giải & Hành động */}
              <div className="mt-4 space-y-3">
                <div className={`rounded-xl bg-white p-4 border shadow-xs ${isElderMode ? 'text-xl' : 'text-base'}`}>
                  <p className="font-semibold text-gray-800">Giải thích của AI:</p>
                  <p className="text-gray-700 mt-1">{analysisResult.reasoning}</p>
                </div>

                <div className={`rounded-xl bg-purple-50 p-4 border border-purple-200 text-purple-900 ${isElderMode ? 'text-xl' : 'text-base'}`}>
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    Khuyến nghị tức thì:
                  </p>
                  <p className="mt-1 font-semibold">{analysisResult.recommended_action}</p>
                </div>
              </div>

              {/* Nút Hỏi người thân */}
              <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-between">
                <span className="text-sm text-gray-600 italic">
                  Gửi ngay đoạn tin nhắn này cho người thân để kiểm tra chéo:
                </span>
                <button
                  type="button"
                  onClick={() => onOpenSOSWithInfo(message.slice(0, 100))}
                  className={`flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 active:scale-95 transition-all w-full sm:w-auto ${
                    isElderMode ? 'px-6 py-4 text-xl' : 'px-4 py-2.5 text-base'
                  }`}
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Hỏi người thân ngay</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
