import React, { useState } from 'react'
import { Send, Shield, Copy, Phone } from 'lucide-react'
import { api } from '../services/api'
import type { TargetType, ReportResponse } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'

export const ReportScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [tacticType, setTacticType] = useState('Giả danh cơ quan công an / viện kiểm sát')
  const [targetType, setTargetType] = useState<TargetType>('phone')
  const [target, setTarget] = useState('')
  const [description, setDescription] = useState('')
  const [isPoliceReported, setIsPoliceReported] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedReport, setSubmittedReport] = useState<ReportResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target.trim() || !description.trim()) return

    setIsSubmitting(true)
    setErrorMsg('')
    try {
      const res = await api.submitReport({
        tactic_type: tacticType,
        target_type: targetType,
        target: target.trim(),
        description: description.trim(),
        is_police_reported: isPoliceReported
      })
      setSubmittedReport(res)
    } catch {
      setErrorMsg('Không thể gửi báo cáo lúc này. Vui lòng kiểm tra lại kết nối mạng.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTarget('')
    setDescription('')
    setSubmittedReport(null)
  }

  const copyCaseCode = () => {
    if (!submittedReport?.police_case_code) return
    navigator.clipboard.writeText(submittedReport.police_case_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:px-6">
      {/* Eyebrow Kicker */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          CỔNG TIẾP NHẬN PHẢN ÁNH TỘI PHẠM SỐ • TỈNH ĐỒNG NAI
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
          Tố giác hành vi{' '}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
            lừa đảo
          </span>{' '}
          trực tuyến.
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
          Mỗi thông tin phản ánh giúp cập nhật danh sách đen bảo vệ cộng đồng và được chuyển giao đồng bộ sang Công an tỉnh Đồng Nai.
        </p>
      </div>

      {submittedReport ? (
        /* Certificate card */
        <div className="max-w-2xl mx-auto bg-[#0d0d10] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
          <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-4">
            <span>Phiếu xác nhận tiếp nhận hồ sơ</span>
            <span className="font-mono text-emerald-400">HỆ THỐNG ĐÃ XÁC NHẬN</span>
          </div>

          <div className="space-y-4">
            {submittedReport.is_police_reported && submittedReport.police_case_code && (
              <div className="bg-[#141418] border border-blue-900/60 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase">
                  <Shield className="w-4 h-4" />
                  <span>MÃ SỐ TIẾP NHẬN CÔNG AN TỈNH ĐỒNG NAI:</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                    {submittedReport.police_case_code}
                  </span>
                  <button
                    type="button"
                    onClick={copyCaseCode}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                  Mã này xác nhận bạn đã gửi tin báo tội phạm số. Xuất trình mã khi làm việc với Công an phường/xã hoặc Công an TP. Biên Hòa.
                </p>
              </div>
            )}

            <div className="bg-[#141418] border border-neutral-800/80 rounded-2xl p-5 space-y-2 text-xs sm:text-sm">
              <span className="text-neutral-500 uppercase font-mono text-[11px] block">
                NỘI DUNG ĐÃ GHI NHẬN
              </span>
              <div className="grid grid-cols-2 gap-2 text-neutral-300">
                <div>
                  <span className="text-neutral-500 text-xs block">Đối tượng:</span>
                  <span className="font-mono font-bold text-white">{submittedReport.target}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-xs block">Hình thức:</span>
                  <span className="text-white">{submittedReport.tactic_type}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors"
            >
              Gửi thêm phản ánh khác
            </button>
            <a
              href="tel:0693480113"
              className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm font-semibold hover:border-neutral-700 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-rose-400" />
              <span>Gọi 0693.480.113</span>
            </a>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-[#0d0d10] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          {/* Tactic dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-neutral-500 block">
              1. Hình thức / thủ đoạn lừa đảo:
            </label>
            <select
              value={tacticType}
              onChange={(e) => setTacticType(e.target.value)}
              className="w-full bg-[#141418] border border-neutral-800 focus:border-neutral-600 focus:outline-none text-white rounded-xl p-3 text-sm"
            >
              <option value="Giả danh cơ quan công an / viện kiểm sát">Giả danh cơ quan công an / viện kiểm sát (Đe dọa rửa tiền, ma túy)</option>
              <option value="Giả mạo ngân hàng / SMS Brandname">Giả mạo ngân hàng / SMS Brandname (Trừ tiền, hủy giao dịch)</option>
              <option value="Lừa đảo việc nhẹ lương cao / Shopee">Lừa đảo việc nhẹ lương cao / Tuyển CTV nạp tiền</option>
              <option value="Mạo danh bệnh viện / Con đang cấp cứu">Mạo danh bệnh viện báo con đang cấp cứu chuyển tiền mổ</option>
              <option value="Bẫy tình cảm / Tặng quà từ nước ngoài">Bẫy tình cảm / Tặng quà từ nước ngoài đóng phí</option>
              <option value="Hình thức khác">Hình thức thao túng khác</option>
            </select>
          </div>

          {/* Target Type & Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-neutral-500 block">
              2. Thông tin kẻ lừa đảo:
            </label>
            <div className="flex gap-2">
              {[
                { id: 'phone', label: 'Số điện thoại' },
                { id: 'link', label: 'Website / Link lạ' },
                { id: 'bank_account', label: 'Số tài khoản nhận tiền' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTargetType(tab.id as TargetType)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    targetType === tab.id
                      ? 'bg-neutral-800 text-white border-neutral-600'
                      : 'bg-[#141418] text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={
                targetType === 'phone'
                  ? 'Nhập số điện thoại kẻ lừa đảo (VD: 0988...)'
                  : targetType === 'link'
                  ? 'Nhập đường link website giả mạo (VD: vcb-smart.top...)'
                  : 'Nhập số tài khoản ngân hàng kẻ lừa đảo yêu cầu nạp tiền'
              }
              required
              className="w-full bg-[#141418] border border-neutral-800 focus:border-neutral-600 focus:outline-none text-white rounded-xl p-3 text-sm mt-1"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-neutral-500 block">
              3. Diễn biến chi tiết vụ việc:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kẻ xấu đã nói những gì? Yêu cầu chuyển bao nhiêu tiền? Mô tả chi tiết để cơ quan chức năng dễ dàng thụ lý..."
              required
              className="w-full bg-[#141418] border border-neutral-800 focus:border-neutral-600 focus:outline-none text-white rounded-xl p-3 text-sm"
            />
          </div>

          {/* Police dispatch checkbox */}
          <div className="p-4 rounded-xl bg-[#141418] border border-neutral-800 flex items-start gap-3">
            <input
              type="checkbox"
              id="policeCheck"
              checked={isPoliceReported}
              onChange={(e) => setIsPoliceReported(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="policeCheck" className="text-xs text-neutral-300 cursor-pointer select-none">
              <span className="font-semibold text-white block">
                Chuyển giao tin báo sang Kênh tiếp nhận Công an tỉnh Đồng Nai
              </span>
              <span className="text-neutral-500">
                Hệ thống sẽ cấp ngay cho bạn một <strong>Mã số tiếp nhận điện tử</strong> để đối chiếu.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-900 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !target.trim() || !description.trim()}
            className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isSubmitting ? (
              <span>Đang mã hóa & gửi...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi phản ánh để bảo vệ cộng đồng</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
