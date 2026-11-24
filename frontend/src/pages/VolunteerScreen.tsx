import React, { useState, useEffect } from 'react'
import { BarChart3, FileText, CheckCircle2, Activity } from 'lucide-react'
import { api } from '../services/api'
import type { VolunteerStats } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export const VolunteerScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [stats, setStats] = useState<VolunteerStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const data = await api.getVolunteerStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800 mb-8">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 px-3 py-1 text-xs font-mono font-semibold text-blue-300 border border-blue-800 mb-4">
            <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>TRUNG TÂM CHỈ HUY TUYÊN TRUYỀN CẤP XÃ / PHƯỜNG</span>
          </div>
          <h1 className={`font-black tracking-tight text-white ${isElderMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
            Bảng tin Đội Thanh Niên Tình Nguyện
          </h1>
          <p className={`mt-2 text-slate-300 max-w-2xl leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
            Dữ liệu tổng hợp từ các tin báo của người dân trên địa bàn tỉnh Đồng Nai nhằm phục vụ công tác phổ biến kiến thức phòng chống lừa đảo trực tiếp tại từng tổ dân phố, ấp và trường học.
          </p>
        </div>
      </div>

      {loading || !stats ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-sm text-slate-600 font-bold font-mono">ĐANG ĐỒNG BỘ DỮ LIỆU ĐỊA BÀN ĐỒNG NAI...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Command Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <Card className="border-2 border-slate-300 bg-white shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  TỔNG LƯỢT BÁO CÁO TRONG THÁNG
                </span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-5xl font-mono font-black text-slate-950">{stats.total_reports_month}</span>
                  <span className="text-xs font-bold font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    +18% THÁNG TRƯỚC
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-medium">Tiếp nhận từ 11 huyện, thành phố</p>
              </CardContent>
            </Card>

            {/* Metric 2: 35% fake links */}
            <Card className="border-2 border-rose-300 bg-rose-50/40 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-wider block">
                  ĐƯỜNG DẪN GIẢ MẠO (PHISHING)
                </span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-5xl font-mono font-black text-rose-600">{stats.fake_links_percentage}%</span>
                  <span className="text-xs font-bold font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                    {stats.summary_by_category.fake_link} VỤ VIỆC
                  </span>
                </div>
                <p className="mt-2 text-xs text-rose-700/80 font-medium">Thủ đoạn phổ biến nhất hiện nay</p>
              </CardContent>
            </Card>

            {/* Metric 3 */}
            <Card className="border-2 border-amber-300 bg-amber-50/40 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider block">
                  MẠO DANH CƠ QUAN CÔNG AN
                </span>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-5xl font-mono font-black text-amber-600">{stats.phone_scams_percentage}%</span>
                  <span className="text-xs font-bold font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    {stats.summary_by_category.impersonation_police} VỤ VIỆC
                  </span>
                </div>
                <p className="mt-2 text-xs text-amber-700/80 font-medium">Nhắm chủ yếu vào người 65 tuổi</p>
              </CardContent>
            </Card>
          </div>

          {/* Allocation Breakdown Chart */}
          <Card className="border-2 border-slate-300 bg-white shadow-md rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <h3 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Cơ cấu các kiểu lừa đảo nổi cộm tại địa bàn</span>
                </h3>

                <Badge variant="secondary" className="font-mono text-xs">
                  CẬP NHẬT: THÁNG 11/2026
                </Badge>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="text-slate-800">1. Đường dẫn website giả mạo (Dịch vụ công, Ngân hàng)</span>
                    <span className="text-rose-600 font-mono font-black text-sm">{stats.fake_links_percentage}% (42 vụ)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `${stats.fake_links_percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="text-slate-800">2. Cuộc gọi giả danh cơ quan Công an, Viện kiểm sát</span>
                    <span className="text-amber-600 font-mono font-black text-sm">{stats.phone_scams_percentage}% (36 vụ)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${stats.phone_scams_percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="text-slate-800">3. Tuyển cộng tác viên đặt đơn Shopee / TikTok ("việc nhẹ lương cao")</span>
                    <span className="text-blue-600 font-mono font-black text-sm">20% (24 vụ)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                    <span className="text-slate-800">4. Tin nhắn báo người thân gặp tai nạn cần tiền viện phí gấp</span>
                    <span className="text-purple-600 font-mono font-black text-sm">15% (18 vụ)</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className="h-full bg-purple-600 rounded-full transition-all duration-700" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Case Log */}
          <Card className="border-2 border-slate-300 bg-white shadow-md rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
                <h3 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Các vụ việc mới nhất đã chuyển giao xác minh</span>
                </h3>

                <span className="font-mono text-xs font-bold text-slate-500">
                  HIỂN THỊ {stats.recent_reports.length} BẢN GHI MỚI NHẤT
                </span>
              </div>

              <div className="space-y-3">
                {stats.recent_reports.map((report) => (
                  <div key={report.id} className="rounded-2xl border-2 border-slate-200 p-5 hover:border-slate-400 hover:bg-slate-50/50 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                          {report.id}
                        </span>
                        <span className="font-black text-slate-950 text-sm sm:text-base">{report.tactic_type}</span>
                      </div>

                      {report.police_case_code && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          {report.police_case_code}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {report.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
                      <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Đối tượng: {report.target}
                      </span>
                      <span className="font-mono">
                        Thời gian: {new Date(report.reported_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
