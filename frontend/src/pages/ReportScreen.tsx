import React, { useState } from 'react'
import { Send, Shield, Check, Copy, AlertOctagon, Phone } from 'lucide-react'
import { api } from '../services/api'
import type { TargetType, ReportResponse } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'

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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Civic Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-3 shadow-2xs">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>Kênh Tiếp Nhận Phản Ánh Tội Phạm Số — Tỉnh Đồng Nai</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Tố Giác Hành Vi Lừa Đảo Trực Tuyến
        </h1>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Mỗi thông tin của bạn giúp cập nhật danh sách đen cảnh báo cho toàn bộ người dân Đồng Nai và được chuyển giao đồng bộ sang Công an tỉnh.
        </p>
      </div>

      {submittedReport ? (
        /* ============= PHIẾU XÁC NHẬN HỒ SƠ ĐIỆN TỬ ============= */
        <Card className="border border-emerald-200 bg-white shadow-xl overflow-hidden rounded-3xl animate-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white p-6 sm:p-8 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-md">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">TIẾP NHẬN BÁO CÁO THÀNH CÔNG</h2>
            <p className="text-emerald-100 text-sm max-w-md mx-auto">
              Thông tin đã được mã hóa bảo mật và đưa vào hệ thống giám sát an toàn thông tin toàn tỉnh Đồng Nai.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {submittedReport.is_police_reported && submittedReport.police_case_code && (
              <div className="rounded-2xl bg-blue-50 border-2 border-blue-200 p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wider">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>KÊNH TIẾP NHẬN CÔNG AN TỈNH ĐỒNG NAI</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase block">
                    MÃ SỐ HỒ SƠ ĐIỆN TỬ:
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <div className="text-2xl sm:text-3xl font-mono font-black text-blue-800 bg-white py-2 px-4 rounded-xl border border-blue-300 shadow-xs">
                      {submittedReport.police_case_code}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyCaseCode}
                      className="font-bold rounded-xl gap-1.5 border-blue-300 text-blue-800 hover:bg-blue-100"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? 'Đã chép mã!' : 'Sao chép mã hồ sơ'}</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Mã hồ sơ này có giá trị xác nhận bạn đã tố giác tội phạm số. Bạn có thể xuất trình mã khi làm việc trực tiếp tại Công an xã, phường hoặc Công an TP. Biên Hòa.
                </p>
              </div>
            )}

            <div className="space-y-3 rounded-2xl bg-slate-50 p-5 border border-slate-200 text-sm">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                Tóm tắt nội dung phản ánh:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-xs">Loại đối tượng:</span>
                  <span className="font-bold uppercase text-slate-900">{submittedReport.target_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Đối tượng nghi vấn:</span>
                  <span className="font-mono font-bold text-slate-900">{submittedReport.target}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Thủ đoạn nhận diện:</span>
                  <span className="font-semibold text-slate-900">{submittedReport.tactic_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Thời điểm tiếp nhận:</span>
                  <span className="font-semibold text-slate-900">{new Date(submittedReport.reported_at).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                onClick={resetForm}
                className="flex-1 font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Gửi thêm một phản ánh khác
              </Button>
              <a
                href="tel:0693480113"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Liên hệ Trực ban Công an: 0693.480.113</span>
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ============= FORM NHẬP THÔNG TIN ============= */
        <Card className="border border-slate-200 shadow-md bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bước 1: Thủ đoạn */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  1. Chọn hình thức / thủ đoạn lừa đảo:
                </label>
                <select
                  value={tacticType}
                  onChange={(e) => setTacticType(e.target.value)}
                  className={`w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all ${
                    isElderMode ? 'text-xl' : 'text-sm'
                  }`}
                >
                  <option value="Giả danh cơ quan công an / viện kiểm sát">Giả danh cơ quan công an / viện kiểm sát (Đe dọa rửa tiền, ma túy)</option>
                  <option value="Giả mạo ngân hàng / SMS Brandname">Giả mạo ngân hàng / SMS Brandname (Trừ tiền, hủy giao dịch)</option>
                  <option value="Lừa đảo việc nhẹ lương cao / Shopee">Lừa đảo việc nhẹ lương cao / Tuyển cộng tác viên nạp tiền</option>
                  <option value="Mạo danh bệnh viện / Con đang cấp cứu">Mạo danh bệnh viện báo con đang cấp cứu chuyển tiền mổ</option>
                  <option value="Bẫy tình cảm / Tặng quà từ nước ngoài">Bẫy tình cảm / Tặng quà từ nước ngoài đóng phí thông quan</option>
                  <option value="Lừa đảo đầu tư tài chính / Tiền ảo">Lừa đảo đầu tư tài chính / Sàn tiền ảo cam kết lãi khủng</option>
                  <option value="Hình thức khác">Hình thức thao túng khác</option>
                </select>
              </div>

              {/* Bước 2: Loại đối tượng */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
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
                      className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        targetType === tab.id
                          ? 'bg-blue-50 text-blue-700 border-blue-400 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={
                    targetType === 'phone'
                      ? 'Nhập số điện thoại kẻ lừa đảo (VD: 0988...)'
                      : targetType === 'link'
                      ? 'Nhập đường link website giả mạo (VD: vcb-smart.top...)'
                      : 'Nhập số tài khoản ngân hàng kẻ lừa đảo yêu cầu chuyển tiền'
                  }
                  required
                  className={`mt-2 ${isElderMode ? 'text-xl' : 'text-base'}`}
                />
              </div>

              {/* Bước 3: Diễn biến vụ việc */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  3. Diễn biến chi tiết vụ việc:
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Kẻ xấu đã nói những gì? Yêu cầu chuyển bao nhiêu tiền? Qua số tài khoản nào? Hãy mô tả chi tiết để cơ quan điều tra dễ dàng thụ lý..."
                  required
                  className={isElderMode ? 'text-xl' : 'text-base'}
                />
              </div>

              {/* Tích chọn chuyển Công an */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="policeCheck"
                  checked={isPoliceReported}
                  onChange={(e) => setIsPoliceReported(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="policeCheck" className="text-xs sm:text-sm text-slate-800 cursor-pointer select-none">
                  <span className="font-bold text-blue-900 block">
                    Đồng ý chuyển tiếp thông tin này sang Kênh tiếp nhận Công an tỉnh Đồng Nai
                  </span>
                  <span>
                    Hệ thống sẽ cấp ngay cho bạn một <strong>Mã số tiếp nhận hồ sơ điện tử</strong> để theo dõi tiến độ xử lý.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 text-sm font-semibold border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !target.trim() || !description.trim()}
                className="w-full font-bold py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                    Đang mã hóa & gửi báo cáo...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>Gửi phản ánh ngay để bảo vệ cộng đồng</span>
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
