import React, { useState } from 'react'
import { Send, CheckCircle2, AlertTriangle, Shield, Upload } from 'lucide-react'
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
      setErrorMsg('Không thể gửi báo cáo lúc này. Vui lòng kiểm tra kết nối mạng.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTarget('')
    setDescription('')
    setSubmittedReport(null)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white shadow-lg">
        <h1 className={`font-black tracking-tight ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          Báo cáo Trường hợp Lừa đảo
        </h1>
        <p className={`mt-2 text-red-100 ${isElderMode ? 'text-xl' : 'text-base'}`}>
          Phản ánh kịp thời giúp bảo vệ cộng đồng và ngăn chặn các đối tượng xấu tái diễn hành vi lừa đảo.
        </p>
      </div>

      {submittedReport ? (
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-8 text-center shadow-lg animate-fade-in">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900">Gửi phản ánh thành công!</h2>
          <p className="mt-2 text-gray-700 max-w-lg mx-auto">
            Hệ thống Lá Chắn Số đã tiếp nhận thông tin và cập nhật vào danh sách đen cảnh báo cho toàn bộ người dùng địa phương.
          </p>

          {submittedReport.is_police_reported && submittedReport.police_case_code && (
            <div className="mt-6 inline-block rounded-xl bg-white p-5 border-2 border-blue-400 shadow-md">
              <div className="flex items-center gap-2 justify-center text-blue-900 font-bold text-sm">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>KÊNH TIẾP NHẬN TIN BÁO CÔNG AN TỈNH ĐỒNG NAI</span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">Mã số tiếp nhận hồ sơ điện tử:</p>
              <div className="mt-1 text-2xl font-mono font-black text-blue-700 bg-blue-50 py-1 px-4 rounded-lg border border-blue-200">
                {submittedReport.police_case_code}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Bạn có thể dùng mã này khi làm việc hoặc đối chiếu với cơ quan điều tra tại địa phương.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={resetForm}
              className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 shadow"
            >
              Gửi một báo cáo khác
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bước 1: Chọn hình thức lừa đảo */}
          <div>
            <label className={`block font-bold text-gray-800 mb-2 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
              1. Nhóm thủ đoạn lừa đảo:
            </label>
            <select
              value={tacticType}
              onChange={(e) => setTacticType(e.target.value)}
              className={`w-full rounded-xl border-2 border-gray-300 p-3 bg-white focus:border-red-500 focus:outline-none ${
                isElderMode ? 'text-xl' : 'text-base'
              }`}
            >
              <option value="Giả danh cơ quan công an / viện kiểm sát">Giả danh cơ quan công an / viện kiểm sát</option>
              <option value="Tuyển CTV làm nhiệm vụ shopee / việc nhẹ lương cao">Tuyển CTV làm nhiệm vụ shopee / việc nhẹ lương cao</option>
              <option value="Đường link trúng thưởng / quà tri ân khách hàng">Đường link trúng thưởng / quà tri ân khách hàng</option>
              <option value="Người thân gặp tai nạn cần tiền viện phí gấp">Người thân gặp tai nạn cần tiền viện phí gấp</option>
              <option value="SMS Brandname ngân hàng giả mạo">SMS Brandname ngân hàng giả mạo</option>
              <option value="Nạp thẻ game lậu / mua bán nick giá rẻ">Nạp thẻ game lậu / mua bán nick giá rẻ</option>
              <option value="Mời gọi đầu tư tài chính / tiền ảo lãi khủng">Mời gọi đầu tư tài chính / tiền ảo lãi khủng</option>
              <option value="Khác">Khác...</option>
            </select>
          </div>

          {/* Bước 2: Thông tin đối tượng */}
          <div>
            <label className={`block font-bold text-gray-800 mb-2 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
              2. Thông tin đối tượng hoặc đường dẫn lừa đảo:
            </label>

            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="target_type"
                  checked={targetType === 'phone'}
                  onChange={() => setTargetType('phone')}
                  className="accent-red-600"
                />
                <span>Số điện thoại</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="target_type"
                  checked={targetType === 'link'}
                  onChange={() => setTargetType('link')}
                  className="accent-red-600"
                />
                <span>Đường link (Website)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="target_type"
                  checked={targetType === 'bank_account'}
                  onChange={() => setTargetType('bank_account')}
                  className="accent-red-600"
                />
                <span>Số tài khoản ngân hàng</span>
              </label>
            </div>

            <input
              type="text"
              required
              placeholder={
                targetType === 'phone'
                  ? 'Nhập số điện thoại gọi đến (VD: 0981248991)'
                  : targetType === 'link'
                  ? 'Nhập đường link lừa đảo (VD: https://vietcombbank-smartbanking.top)'
                  : 'Nhập số tài khoản và tên ngân hàng đối tượng yêu cầu chuyển tiền'
              }
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={`w-full rounded-xl border-2 border-gray-300 p-3 focus:border-red-500 focus:outline-none ${
                isElderMode ? 'text-xl' : 'text-base'
              }`}
            />
          </div>

          {/* Bước 3: Mô tả diễn biến vụ việc */}
          <div>
            <label className={`block font-bold text-gray-800 mb-2 ${isElderMode ? 'text-2xl' : 'text-lg'}`}>
              3. Mô tả ngắn diễn biến vụ việc:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Kẻ lừa đảo đã nói gì, yêu cầu chuyển bao nhiêu tiền, vào thời gian nào..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full rounded-xl border-2 border-gray-300 p-3 focus:border-red-500 focus:outline-none ${
                isElderMode ? 'text-xl' : 'text-base'
              }`}
            />
          </div>

          {/* Đính kèm ảnh bằng chứng (Demo mockup) */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Ảnh chụp màn hình bằng chứng (Tin nhắn / Giấy triệu tập giả):
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">Bấm để chọn ảnh từ máy điện thoại hoặc kéo thả vào đây</p>
            </div>
          </div>

          {/* Tùy chọn gửi Công an */}
          <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPoliceReported}
                onChange={(e) => setIsPoliceReported(e.target.checked)}
                className="mt-1 h-5 w-5 rounded accent-blue-600"
              />
              <div>
                <span className="font-bold text-blue-900 block">
                  Gửi đồng thời đến kênh tiếp nhận tin báo của Công an tỉnh Đồng Nai
                </span>
                <span className="text-xs text-blue-700">
                  Hệ thống sẽ tự động tạo hồ sơ tin báo điện tử và cấp mã số tiếp nhận để phục vụ công tác điều tra.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:bg-gray-400 shadow-md transition-all ${
              isElderMode ? 'py-4 text-2xl' : 'py-3.5 text-lg'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi báo cáo lừa đảo ngay'}</span>
          </button>
        </form>
      )}
    </div>
  )
}
