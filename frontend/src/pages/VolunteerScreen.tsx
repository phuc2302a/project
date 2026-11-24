import React, { useState, useEffect } from 'react'
import { CheckCircle2, MapPin, Search, AlertTriangle } from 'lucide-react'
import { api } from '../services/api'
import type { VolunteerStats, ReportResponse } from '../types'
import { useElderMode } from '../contexts/ElderModeContext'

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

  const filteredReports = reports.filter((item) => {
    return (
      item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tactic_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-20 pb-12 sm:px-6">
      {/* Eyebrow Kicker */}
      <div className="text-center mb-4">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          TRUNG TÂM ĐIỀU PHỐI ĐỘI HÌNH TÌNH NGUYỆN SỐ • TỈNH ĐỒNG NAI
        </span>
      </div>

      {/* Hero Headline */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1
          className={`font-black tracking-tight text-white ${
            isElderMode ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-5xl'
          }`}
          style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          Giám sát & điều phối{' '}
          <span className="bg-gradient-to-r from-violet-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
            an toàn mạng
          </span>{' '}
          cộng đồng.
        </h1>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
          Cung cấp dữ liệu thực tế cho Tổ công nghệ số cộng đồng và Đoàn thanh niên tuyên truyền trực tiếp tại 11 huyện, thành phố trên toàn tỉnh Đồng Nai.
        </p>
      </div>

      {loading || !stats ? (
        <div className="text-center py-20 text-neutral-500 font-mono text-sm">
          Đang kết nối trung tâm điều phối...
        </div>
      ) : (
        <div className="space-y-6">
          {/* 4 Metric KPI Cards matching AgentVet sub-boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                TIN BÁO THÁNG NÀY
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-mono font-black text-white">{stats.total_reports_month}</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">+18%</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">Tiếp nhận từ 11 huyện/TP</p>
            </div>

            {/* Metric 2 */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                LINK ĐỘC HẠI (PHISHING)
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-mono font-black text-rose-500">{stats.fake_links_percentage}%</span>
                <span className="text-xs font-mono text-rose-400">rủi ro cao</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">Hơn 1/3 tổng số vụ việc</p>
            </div>

            {/* Metric 3 */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                CHUYỂN CÔNG AN TỈNH
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-mono font-black text-cyan-400">100%</span>
                <span className="text-xs font-mono text-cyan-300 font-semibold">Cấp mã CA</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">Hồ sơ đã được mã hóa</p>
            </div>

            {/* Metric 4 */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                ĐỊA BÀN PHỦ SÓNG
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-mono font-black text-white">11 / 11</span>
                <span className="text-xs font-mono text-emerald-400">Đạt 100%</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">Biên Hòa, Long Thành, Nhơn Trạch...</p>
            </div>
          </div>

          {/* 2 Detail Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Phân bổ địa bàn */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Phân bổ tin báo theo địa bàn tỉnh Đồng Nai</span>
                </span>
                <span className="font-mono text-neutral-400">11/2026</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'TP. Biên Hòa (Khu đô thị & KCN)', percent: 42, color: 'bg-white' },
                  { name: 'Huyện Long Thành (Khu vực Sân bay)', percent: 22, color: 'bg-neutral-300' },
                  { name: 'Huyện Nhơn Trạch (KCN tập trung)', percent: 18, color: 'bg-neutral-400' },
                  { name: 'Huyện Trảng Bom', percent: 12, color: 'bg-neutral-500' },
                  { name: 'Các huyện khác (Định Quán, Vĩnh Cửu...)', percent: 6, color: 'bg-neutral-700' }
                ].map((d, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>{d.name}</span>
                      <span className="font-mono font-bold text-white">{d.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chiêu trò phổ biến */}
            <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Chiêu trò lừa đảo ghi nhận nhiều nhất</span>
                </span>
                <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                  Cần chú ý
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { tactic: 'Giả danh Cơ quan Công an / Viện kiểm sát', count: '45 vụ', target: 'Người cao tuổi' },
                  { tactic: 'Tuyển CTV làm việc tại nhà Shopee', count: '38 vụ', target: 'Học sinh, sinh viên' },
                  { tactic: 'SMS Brandname giả mạo hủy trừ tiền', count: '24 vụ', target: 'Người dùng e-banking' },
                  { tactic: 'Mạo danh Bệnh viện con đang cấp cứu mổ gấp', count: '13 vụ', target: 'Phụ huynh' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#141418] rounded-xl border border-neutral-800/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{item.tactic}</div>
                      <div className="text-neutral-500 text-[11px]">Đối tượng nhắm tới: {item.target}</div>
                    </div>
                    <span className="font-mono font-bold text-rose-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Reports Table */}
          <div className="bg-[#0d0d10] border border-neutral-800/80 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Nhật Ký Phản Ánh Mới Nhất Trên Địa Bàn Đồng Nai
                </h3>
                <p className="text-xs text-neutral-500">Cập nhật trực tiếp từ cổng gửi tin của nhân dân</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm số, link..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#141418] border border-neutral-800 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-[#121216] text-neutral-500 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Mục tiêu nghi vấn</th>
                    <th className="py-3 px-4">Hình thức chiêu trò</th>
                    <th className="py-3 px-4">Mã hồ sơ Công an</th>
                    <th className="py-3 px-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300">
                  {filteredReports.slice(0, 10).map((rep) => (
                    <tr key={rep.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-500 font-mono">
                        {new Date(rep.reported_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {rep.target}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {rep.tactic_type}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-400">
                        {rep.police_case_code || '---'}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-900">
                          <CheckCircle2 className="w-3 h-3" /> Đã tiếp nhận
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
