import React, { useState, useEffect } from 'react'
import { BarChart3, FileText, CheckCircle2, Users } from 'lucide-react'
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
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 mb-3 border border-blue-200">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>TUYÊN TRUYỀN CẤP XÃ / PHƯỜNG — ĐỒNG NAI 2026</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Dashboard Đội Thanh Niên Tình Nguyện
        </h1>
        <p className={`mt-1.5 text-slate-600 ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Thống kê các kiểu lừa đảo mới phát sinh tại địa phương nhằm phục vụ công tác tuyên truyền và phòng ngừa trực tiếp.
        </p>
      </div>

      {loading || !stats ? (
        <div className="text-center py-16">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-500 font-medium">Đang đồng bộ dữ liệu địa phương...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics: 120 reports, 35% fake links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Tổng lượt báo cáo trong tháng
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-slate-900">{stats.total_reports_month}</span>
                  <Badge variant="success" className="text-[10px]">
                    +18% tháng trước
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">Phản ánh từ người dân địa phương</p>
              </CardContent>
            </Card>

            <Card className="border-rose-200 bg-rose-50/20 shadow-xs">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                  Đường dẫn giả mạo (Phishing)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-rose-600">{stats.fake_links_percentage}%</span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">
                    {stats.summary_by_category.fake_link} vụ việc
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Tỷ lệ chiếm cao nhất hiện nay</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/20 shadow-xs">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Cuộc gọi mạo danh Công an
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-amber-600">{stats.phone_scams_percentage}%</span>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    {stats.summary_by_category.impersonation_police} vụ việc
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Nhắm chủ yếu vào người cao tuổi</p>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown Progress Bars */}
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Cơ cấu các thủ đoạn lừa đảo nổi cộm tại địa bàn</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-800">1. Đường dẫn website giả mạo (Ngân hàng, Dịch vụ công)</span>
                    <span className="text-rose-600 font-mono font-bold">{stats.fake_links_percentage}% (42 vụ)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stats.fake_links_percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-800">2. Cuộc gọi giả danh cơ quan Công an, Viện kiểm sát</span>
                    <span className="text-amber-600 font-mono font-bold">{stats.phone_scams_percentage}% (36 vụ)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.phone_scams_percentage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-800">3. Tuyển cộng tác viên đặt đơn 'việc nhẹ lương cao'</span>
                    <span className="text-blue-600 font-mono font-bold">20% (24 vụ)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-800">4. Tin nhắn báo người thân tai nạn cần chuyển tiền gấp</span>
                    <span className="text-purple-600 font-mono font-bold">15% (18 vụ)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports List */}
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Các vụ việc mới nhất chuyển giao xác minh</span>
                </h3>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Real-time feed
                </Badge>
              </div>

              <div className="space-y-3">
                {stats.recent_reports.map((report) => (
                  <div key={report.id} className="rounded-xl border border-slate-200/80 p-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {report.id}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{report.tactic_type}</span>
                      </div>

                      {report.police_case_code && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          {report.police_case_code}
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{report.description}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span className="font-mono text-rose-600 font-semibold">Đối tượng: {report.target}</span>
                      <span>Ngày báo cáo: {new Date(report.reported_at).toLocaleDateString('vi-VN')}</span>
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
