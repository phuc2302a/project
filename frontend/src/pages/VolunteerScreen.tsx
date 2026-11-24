import React, { useState, useEffect } from 'react'
import { CheckCircle2, Activity, MapPin, Search, AlertTriangle } from 'lucide-react'
import { api } from '../services/api'
import type { VolunteerStats, ReportResponse } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'
import { Card, CardContent } from '../components/ui/card'

export const VolunteerScreen: React.FC = () => {
  const { isElderMode } = useElderMode()

  const [stats, setStats] = useState<VolunteerStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const statsData = await api.getVolunteerStats()
        setStats(statsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const reports: ReportResponse[] = stats?.recent_reports || []

  // Filtered reports
  const filteredReports = reports.filter((item) => {
    return (
      item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tactic_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>Trung Tâm Điều Phối Đội Hình Tình Nguyện Số — Tỉnh Đồng Nai</span>
        </div>
        <h1 className={`font-black tracking-tight text-slate-950 ${isElderMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
          Bảng Tin Giám Sát Cảnh Báo An Toàn Mạng
        </h1>
        <p className={`text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed ${isElderMode ? 'text-xl' : 'text-sm sm:text-base'}`}>
          Cung cấp dữ liệu thực tế cho Tổ công nghệ số cộng đồng và Đoàn thanh niên tuyên truyền trực tiếp tại các ấp, khu phố và trường học trên địa bàn tỉnh Đồng Nai.
        </p>
      </div>

      {loading || !stats ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-sm text-slate-600 font-bold">Đang đồng bộ dữ liệu an ninh mạng Đồng Nai...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  TỔNG TIN BÁO TRONG THÁNG
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-slate-950">{stats.total_reports_month}</span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    +18%
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-medium">Tiếp nhận từ 11 huyện & thành phố</p>
              </CardContent>
            </Card>

            {/* Metric 2: 35% fake links */}
            <Card className="border border-rose-200 bg-rose-50/50 shadow-xs rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                  ĐƯỜNG DẪN GIẢ MẠO (PHISHING)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-rose-700">{stats.fake_links_percentage}%</span>
                  <span className="text-xs font-bold text-rose-600">tỉ lệ cao</span>
                </div>
                <p className="mt-2 text-xs text-rose-800/80 font-medium">Chiếm hơn 1/3 tổng số vụ việc</p>
              </CardContent>
            </Card>

            {/* Metric 3 */}
            <Card className="border border-blue-200 bg-blue-50/50 shadow-xs rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                  CHUYỂN GIAO CÔNG AN TỈNH
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-blue-700">100%</span>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Đã cấp mã CA
                  </span>
                </div>
                <p className="mt-2 text-xs text-blue-800/80 font-medium">Hồ sơ xác thực tố giác tội phạm số</p>
              </CardContent>
            </Card>

            {/* Metric 4 */}
            <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  ĐỊA BÀN PHỦ SÓNG
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-black text-slate-900">11 / 11</span>
                  <span className="text-xs font-bold text-emerald-600">Đạt 100%</span>
                </div>
                <p className="mt-2 text-xs text-slate-500 font-medium">Biên Hòa, Long Thành, Nhơn Trạch...</p>
              </CardContent>
            </Card>
          </div>

          {/* Phân bổ theo địa bàn & Chiêu trò phổ biến */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phân bổ theo địa bàn trọng điểm */}
            <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Phân bổ tin báo theo địa bàn tỉnh Đồng Nai</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Tháng 11/2026</span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'TP. Biên Hòa (Khu đô thị & KCN)', percent: 42, color: 'bg-blue-600' },
                    { name: 'Huyện Long Thành (Khu vực Sân bay)', percent: 22, color: 'bg-indigo-600' },
                    { name: 'Huyện Nhơn Trạch (KCN tập trung)', percent: 18, color: 'bg-purple-600' },
                    { name: 'Huyện Trảng Bom', percent: 12, color: 'bg-amber-600' },
                    { name: 'Các huyện khác (Định Quán, Vĩnh Cửu...)', percent: 6, color: 'bg-slate-400' }
                  ].map((district, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{district.name}</span>
                        <span className="font-mono font-bold">{district.percent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${district.color} rounded-full`}
                          style={{ width: `${district.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chiêu trò phổ biến nhất */}
            <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Thủ đoạn lừa đảo phổ biến nhất</span>
                  </h3>
                  <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                    Cần chú ý tuyên truyền
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { tactic: 'Giả danh Cơ quan Công an / Viện kiểm sát', count: '45 vụ', target: 'Người cao tuổi' },
                    { tactic: 'Tuyển CTV làm việc tại nhà Shopee / Nạp tiền', count: '38 vụ', target: 'Học sinh, sinh viên' },
                    { tactic: 'SMS Brandname giả mạo hủy trừ tiền', count: '24 vụ', target: 'Người dùng e-banking' },
                    { tactic: 'Mạo danh Bệnh viện con đang cấp cứu mổ gấp', count: '13 vụ', target: 'Phụ huynh' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{item.tactic}</div>
                        <div className="text-xs text-slate-500">Đối tượng nhắm tới: {item.target}</div>
                      </div>
                      <span className="font-mono font-bold text-rose-700 bg-rose-100/60 px-2 py-1 rounded-md shrink-0">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danh sách phản ánh mới nhất của người dân */}
          <Card className="border border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Nhật Ký Phản Ánh Mới Nhất Trên Địa Bàn Đồng Nai
                </h3>
                <p className="text-xs text-slate-500">Dữ liệu đối soát trực tiếp từ cổng gửi tin của nhân dân</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm số điện thoại, link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Mục tiêu nghi vấn</th>
                    <th className="py-3 px-4">Hình thức chiêu trò</th>
                    <th className="py-3 px-4">Mã hồ sơ Công an</th>
                    <th className="py-3 px-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReports.slice(0, 10).map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-xs">
                        {new Date(rep.reported_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {rep.target}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {rep.tactic_type}
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-700 font-bold">
                        {rep.police_case_code || '---'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã tiếp nhận
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
