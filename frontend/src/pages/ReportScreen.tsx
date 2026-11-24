import React, { useState } from 'react'
import { Send, AlertTriangle, Shield, Upload, Check } from 'lucide-react'
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-rose-900/40 mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-950/80 px-3 py-1 text-xs font-mono font-semibold text-rose-300 border border-rose-800 mb-4">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>CỔNG TIẾP NHẬN PHẢN ÁNH TỘI PHẠM LỪA ĐẢO TRỰC TUYẾN</span>
          </div>
          <h1 className={`font-black tracking-tight text-white ${isElderMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
            Tố giác hành vi lừa đảo
          </h1>
          <p className={`mt-2 text-slate-300 max-w-2xl leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Mỗi phản ánh của bạn sẽ ngay lập tức được cập nhật vào danh sách đen để bảo vệ cộng đồng và chuyển giao sang kênh tiếp nhận của Công an tỉnh Đồng Nai.
          </p>
        </div>
      </div>

      {submittedReport ? (
        /* ============= PHIẾU XÁC NHẬN HỒ SƠ ĐIỆN TỬ ============= */
        <Card className="border-2 border-emerald-400 bg-white shadow-xl overflow-hidden rounded-3xl">
          <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-md">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">TIẾP NHẬN BÁO CÁO THÀNH CÔNG</h2>
            <p className="text-emerald-100 text-sm max-w-md mx-auto">
              Hệ thống đã mã hóa và ghi nhận phản ánh của bạn vào cơ sở dữ liệu giám sát an ninh mạng địa phương.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {submittedReport.is_police_reported && submittedReport.police_case_code && (
              <div className="rounded-2xl bg-blue-50 border-2 border-blue-300 p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-mono font-black text-xs uppercase tracking-wider">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>KÊNH TIẾP NHẬN CÔNG AN TỈNH ĐỒNG NAI</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase block">MÃ SỐ TIẾP NHẬN ĐIỆN TỬ:</span>
                  <div className="text-3xl font-mono font-black text-blue-700 bg-white py-2 px-4 rounded-xl border border-blue-200 inline-block mt-1 shadow-inner">
                    {submittedReport.police_case_code}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mã này có giá trị xác thực hồ sơ tố giác tội phạm số. Bạn có thể sử dụng khi làm việc với cơ quan điều tra tại xã/phường hoặc Công an TP. Biên Hòa.
                </p>
              </div>
            )}

            {/* Summary Details */}
            <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 font-semibold">Đối tượng bị tố giác:</span>
                <span className="font-mono font-bold text-slate-900">{submittedReport.target}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 font-semibold">Thủ đoạn vi phạm:</span>
                <span className="font-bold text-slate-900">{submittedReport.tactic_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Thời điểm tiếp nhận:</span>
                <span className="font-mono text-slate-700">{new Date(submittedReport.reported_at).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Button onClick={resetForm} variant="default" className="font-bold px-8 py-3 h-auto rounded-xl">
                Gửi một báo cáo khác
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* ============= FORM NHẬP BÁO CÁO ============= */
        <Card className="border-slate-300 shadow-md bg-white rounded-3xl">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="rounded-2xl bg-rose-50 p-4 border border-rose-300 text-rose-800 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span className="font-semibold text-sm">{errorMsg}</span>
                </div>
              )}

              {/* Step 1 */}
              <div className="space-y-2">
                <label className={`block font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                  1. Lựa chọn thủ đoạn đối tượng đã sử dụng:
                </label>
                <select
                  value={tacticType}
                  onChange={(e) => setTacticType(e.target.value)}
                  className={`w-full rounded-2xl border-2 border-slate-300 bg-slate-50/50 p-4 font-semibold text-slate-900 focus:bg-white focus:border-slate-950 focus:outline-none transition-all ${
                    isElderMode ? 'text-xl' : 'text-sm sm:text-base'
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

              {/* Step 2 */}
              <div className="space-y-3">
                <label className={`block font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                  2. Thông tin đối tượng lừa đảo:
                </label>

                {/* Target Type Radios */}
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold text-xs sm:text-sm transition-all ${
                    targetType === 'phone'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'phone'}
                      onChange={() => setTargetType('phone')}
                      className="sr-only"
                    />
                    <span>📞 Số điện thoại</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold text-xs sm:text-sm transition-all ${
                    targetType === 'link'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'link'}
                      onChange={() => setTargetType('link')}
                      className="sr-only"
                    />
                    <span>🌐 Đường link web</span>
                  </label>

                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer font-bold text-xs sm:text-sm transition-all ${
                    targetType === 'bank_account'
                      ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'bank_account'}
                      onChange={() => setTargetType('bank_account')}
                      className="sr-only"
                    />
                    <span>💳 Số tài khoản</span>
                  </label>
                </div>

                <Input
                  type="text"
                  required
                  placeholder={
                    targetType === 'phone'
                      ? 'Nhập số điện thoại gọi đến (VD: 0981248991)'
                      : targetType === 'link'
                      ? 'Nhập đường link lừa đảo (VD: https://vietcombbank.top)'
                      : 'Nhập số tài khoản ngân hàng kẻ lừa đảo yêu cầu chuyển tiền'
                  }
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className={`font-mono border-2 border-slate-300 focus:border-slate-950 rounded-2xl ${
                    isElderMode ? 'text-2xl h-16' : 'text-base h-12'
                  }`}
                />
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <label className={`block font-black text-slate-900 ${isElderMode ? 'text-2xl' : 'text-base sm:text-lg'}`}>
                  3. Diễn biến chi tiết vụ việc:
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Kẻ lừa đảo đã nói gì, đe dọa ra sao, yêu cầu chuyển bao nhiêu tiền, vào thời gian nào..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`border-2 border-slate-300 focus:border-slate-950 rounded-2xl ${
                    isElderMode ? 'text-xl' : 'text-sm'
                  }`}
                />
              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  BẰNG CHỨNG HÌNH ẢNH (ẢNH CHỤP MÀN HÌNH / TIN NHẮN):
                </span>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    Bấm để tải ảnh chụp màn hình cuộc gọi / tin nhắn hoặc giấy tờ giả mạo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</p>
                </div>
              </div>

              {/* Police Integration Toggle */}
              <div className="rounded-2xl bg-blue-50/80 p-5 border-2 border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPoliceReported}
                    onChange={(e) => setIsPoliceReported(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded accent-blue-600"
                  />
                  <div>
                    <span className="font-black text-blue-950 text-sm sm:text-base block">
                      Gửi đồng thời đến kênh tiếp nhận tin báo Công an tỉnh Đồng Nai
                    </span>
                    <span className="text-xs text-blue-800 leading-relaxed block mt-1">
                      Hệ thống sẽ tự động chuyển giao thông tin sang cơ quan cảnh sát điều tra và cấp mã hồ sơ điện tử chính thức.
                    </span>
                  </div>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-black gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-md rounded-2xl ${
                  isElderMode ? 'h-16 text-2xl' : 'h-13 text-base'
                }`}
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'ĐANG ĐÓNG GÓI HỒ SƠ TỐ GIÁC...' : 'GỬI PHIẾU TỐ GIÁC LỪA ĐẢO NGAY'}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
