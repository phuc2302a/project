import React, { useState } from 'react'
import { Send, CheckCircle2, AlertTriangle, Shield, Upload } from 'lucide-react'
import { api } from '../services/api'
import type { TargetType, ReportResponse } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <Badge variant="destructive" className="mb-2 font-bold">
          TIẾP NHẬN PHẢN ÁNH CỘNG ĐỒNG
        </Badge>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl' : 'text-2xl sm:text-3xl'}`}>
          Báo cáo Trường hợp Lừa đảo
        </h1>
        <p className={`mt-1.5 text-slate-600 ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Thông tin phản ánh sẽ được xác thực và cập nhật ngay vào cơ sở dữ liệu cảnh báo tại tỉnh Đồng Nai.
        </p>
      </div>

      {submittedReport ? (
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-emerald-950">Tiếp nhận báo cáo thành công!</h2>
            <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
              Thông tin về đối tượng <span className="font-mono font-bold text-slate-900">{submittedReport.target}</span> đã được ghi nhận vào danh sách đen cảnh báo cho người dân.
            </p>

            {submittedReport.is_police_reported && submittedReport.police_case_code && (
              <div className="mt-6 inline-block rounded-2xl bg-white p-5 border border-blue-200 shadow-xs max-w-md text-left">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Kênh tiếp nhận Công an tỉnh Đồng Nai</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Mã tiếp nhận hồ sơ điện tử:</div>
                <div className="mt-1 text-2xl font-mono font-black text-blue-700 bg-blue-50/80 py-1.5 px-3 rounded-lg border border-blue-200 text-center">
                  {submittedReport.police_case_code}
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Lưu lại mã này để xuất trình khi làm việc trực tiếp với cơ quan điều tra tại địa phương.
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button onClick={resetForm} variant="default" className="font-bold">
                Gửi một báo cáo khác
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-rose-800 flex items-center gap-2.5 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Chọn thủ đoạn */}
              <div className="space-y-2">
                <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-base'}`}>
                  1. Nhóm thủ đoạn lừa đảo:
                </label>
                <select
                  value={tacticType}
                  onChange={(e) => setTacticType(e.target.value)}
                  className={`w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950/10 ${
                    isElderMode ? 'text-xl' : 'text-sm'
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

              {/* Step 2: Đối tượng */}
              <div className="space-y-3">
                <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-base'}`}>
                  2. Thông tin đối tượng lừa đảo:
                </label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'phone'}
                      onChange={() => setTargetType('phone')}
                      className="accent-slate-900"
                    />
                    <span>Số điện thoại</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'link'}
                      onChange={() => setTargetType('link')}
                      className="accent-slate-900"
                    />
                    <span>Đường link (Website)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="target_type"
                      checked={targetType === 'bank_account'}
                      onChange={() => setTargetType('bank_account')}
                      className="accent-slate-900"
                    />
                    <span>Số tài khoản</span>
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
                      : 'Nhập số tài khoản và tên ngân hàng nhận tiền'
                  }
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className={isElderMode ? 'text-xl h-14' : 'text-sm'}
                />
              </div>

              {/* Step 3: Diễn biến */}
              <div className="space-y-2">
                <label className={`block font-bold text-slate-800 ${isElderMode ? 'text-2xl' : 'text-base'}`}>
                  3. Mô tả ngắn diễn biến:
                </label>
                <Textarea
                  required
                  rows={3}
                  placeholder="Kẻ lừa đảo đã nói gì, yêu cầu chuyển bao nhiêu tiền, vào thời gian nào..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={isElderMode ? 'text-xl' : 'text-sm'}
                />
              </div>

              {/* Upload evidence mockup */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Bằng chứng đính kèm (Ảnh chụp màn hình):
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-7 w-7 text-slate-400" />
                  <p className="mt-1.5 text-xs text-slate-500 font-medium">Bấm để chọn file ảnh hoặc kéo thả vào đây</p>
                </div>
              </div>

              {/* Police Connection Toggle */}
              <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPoliceReported}
                    onChange={(e) => setIsPoliceReported(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-blue-600"
                  />
                  <div>
                    <span className="font-bold text-blue-950 text-sm block">
                      Gửi đồng thời đến kênh tiếp nhận tin báo Công an tỉnh Đồng Nai
                    </span>
                    <span className="text-xs text-blue-800/80 leading-relaxed block mt-0.5">
                      Hệ thống sẽ cấp mã số hồ sơ điện tử chính thức để cơ quan Công an tiến hành xác minh, điều tra.
                    </span>
                  </div>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold gap-2 bg-slate-900 hover:bg-slate-800 shadow-xs ${
                  isElderMode ? 'h-14 text-xl' : 'h-11'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi báo cáo lừa đảo ngay'}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
